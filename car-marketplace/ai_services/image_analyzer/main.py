# File: ai_services/image_analyzer/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from PIL import Image
import io
import uvicorn

app = FastAPI(title="AI Image Analyzer", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageAnalysis(BaseModel):
    filename: str
    is_blurry: bool
    is_dark: bool
    brightness_score: float
    clarity_score: float
    suggestions: list[str]
    category: str
    quality_score: float

def analyze_image_clarity(image_bytes: bytes) -> tuple[bool, float]:
    """Checks if an image is blurry and returns clarity score."""
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return True, 0.0

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        fm = cv2.Laplacian(gray, cv2.CV_64F).var()
        is_blurry = fm < 100.0
        clarity_score = min(100.0, fm / 2.0)  # Normalize to 0-100
        return is_blurry, clarity_score
    except Exception as e:
        print(f"Error analyzing clarity: {e}")
        return True, 0.0

def analyze_image_brightness(image_bytes: bytes) -> tuple[bool, float]:
    """Checks if an image is too dark and returns brightness score."""
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return True, 0.0

        brightness = np.mean(img)
        is_dark = brightness < 70
        brightness_score = brightness
        return is_dark, brightness_score
    except Exception as e:
        print(f"Error analyzing brightness: {e}")
        return True, 0.0

def categorize_image(image_bytes: bytes) -> str:
    """Categorizes the image based on content analysis."""
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return "unknown"

        # Simple categorization based on image dimensions and colors
        height, width = img.shape[:2]

        # Check for interior vs exterior (simple heuristic)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges > 0) / (height * width)

        if edge_density > 0.05:  # High edges might indicate interior details
            return "interior"
        else:
            return "exterior"

    except Exception as e:
        print(f"Error categorizing image: {e}")
        return "unknown"

@app.post("/analyze-image", response_model=ImageAnalysis)
async def analyze_image(file: UploadFile = File(...)):
    """Analyzes an uploaded car image for quality issues."""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()

    # Analyze image properties
    is_blurry, clarity_score = analyze_image_clarity(contents)
    is_dark, brightness_score = analyze_image_brightness(contents)
    category = categorize_image(contents)

    # Generate suggestions
    suggestions = []
    quality_score = (clarity_score + brightness_score) / 2

    if is_blurry:
        suggestions.append("Image appears blurry. Try taking a sharper photo with better lighting.")
    if is_dark:
        suggestions.append("Image is too dark. Consider shooting in daylight or using flash.")
    if clarity_score < 50:
        suggestions.append("Image clarity is low. Ensure camera focus is on the vehicle.")
    if brightness_score < 80:
        suggestions.append("Image brightness could be improved for better visibility.")

    if not suggestions:
        suggestions.append("Image quality looks excellent! This will attract more buyers.")

    return ImageAnalysis(
        filename=file.filename,
        is_blurry=is_blurry,
        is_dark=is_dark,
        brightness_score=round(brightness_score, 2),
        clarity_score=round(clarity_score, 2),
        suggestions=suggestions,
        category=category,
        quality_score=round(quality_score, 2)
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "image_analyzer"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
