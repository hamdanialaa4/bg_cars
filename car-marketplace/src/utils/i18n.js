import { ref } from 'vue';

// Translation data
const translations = {
  en: {
    // Navigation
    home: "Home",
    search: "Search",
    cars: "Cars",
    parts: "Auto Parts",
    sell: "Sell Your Car",
    login: "Login",
    signup: "Sign Up",
    sellerDashboard: "Seller Dashboard",
    welcome: "Welcome to Bulgarian Car Marketplace",

    // Search
    advancedSearch: "Advanced AI Search",
    searchDescription: "Find your perfect car with our smart assistant",
    allMakes: "All Makes",
    allModels: "All Models",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    fuelType: "Fuel Type",
    transmission: "Transmission",
    yearFrom: "Year From",
    yearTo: "Year To",
    smartSearch: "Smart Search",
    searching: "Searching...",
    reset: "Reset",

    // Car details
    make: "Make",
    model: "Model",
    year: "Year",
    price: "Price",
    mileage: "Mileage",
    fuel: "Fuel",
    transmission: "Transmission",
    location: "Location",
    viewDetails: "View Details",

    // Seller dashboard
    sellerDashboardTitle: "Seller Dashboard",
    addNewCar: "Add New Car",
    totalCars: "Total Cars",
    totalViews: "Total Views",
    totalLikes: "Total Likes",
    totalMessages: "Total Messages",
    myCars: "My Cars",
    analytics: "Analytics & Reports",
    dailyViews: "Daily Views Average",
    conversionRate: "Conversion Rate",
    mostViewedCar: "Most Viewed Car",

    // Authentication
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    email: "Email",
    enterEmail: "Enter email",
    password: "Password",
    enterPassword: "Enter password",
    confirmPassword: "Confirm Password",
    passwordMismatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",
    loggingIn: "Logging in...",
    or: "or",
    dontHaveAccount: "Don't have an account?",
    userType: "Account Type",
    buyer: "Buyer",
    seller: "Seller",
    agreeTo: "I agree to the",
    termsAndConditions: "Terms and Conditions",
    mustAgreeToTerms: "You must agree to the terms",
    creatingAccount: "Creating account...",
    haveAccount: "Already have an account?",
    loginWithGoogle: "Login with Google",
    signupWithGoogle: "Sign up with Google",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset Password",
    enterEmailForReset: "Enter your email to reset password",
    sendResetLink: "Send Reset Link",
    resetLinkSent: "Reset link sent to your email",
    sending: "Sending...",
    accountCreated: "Account created successfully",
    termsText: "By using our platform, you agree to our terms and conditions. We are committed to providing a safe and secure environment for buying and selling cars.",

    // AI Features
    aiPriceEvaluator: "AI Price Evaluator",
    getRealTimeValuation: "Get a real-time market valuation for your car to sell it faster",
    analyzingMarket: "Analyzing Market...",
    suggestPrice: "Suggest a Price",
    fillMakeYearFirst: "Please fill in Make and Year first",
    suggestedPrice: "Suggested Price",
    confidence: "Confidence",
    fairRange: "Fair Range",
    similarListings: "Similar Listings",
    demandLevel: "Demand Level",
    applyThisPrice: "Apply this Price",
    fillRequiredFields: "Please fill in required fields",
    priceEvaluationFailed: "Price evaluation failed",

    // Image Analysis
    aiImageAnalyzer: "AI Image Analyzer",
    smartImageAnalysis: "Smart image analysis for better listings",
    dragDropImages: "Drag & drop images here",
    orClickToBrowse: "or click to browse",
    chooseFiles: "Choose Files",
    analysisFailed: "Analysis failed",
    brightness: "Brightness",
    clarity: "Clarity",
    analysisSummary: "Analysis Summary",
    totalImages: "Total Images",
    averageQuality: "Average Quality",
    excellentImages: "Excellent Images"
  },
  bg: {
    // Navigation
    home: "Начало",
    search: "Търсене",
    cars: "Коли",
    parts: "Резервни части",
    sell: "Продайте колата си",
    login: "Вход",
    signup: "Регистрация",
    sellerDashboard: "Табло на продавача",
    welcome: "Добре дошли в българската платформа за автомобили",

    // Search
    advancedSearch: "Разширено AI търсене",
    searchDescription: "Намерете идеалната кола с нашия интелигентен асистент",
    allMakes: "Всички марки",
    allModels: "Всички модели",
    minPrice: "Минимална цена",
    maxPrice: "Максимална цена",
    fuelType: "Тип гориво",
    transmission: "Трансмисия",
    yearFrom: "Година от",
    yearTo: "Година до",
    smartSearch: "Интелигентно търсене",
    searching: "Търсене...",
    reset: "Нулиране",

    // Car details
    make: "Марка",
    model: "Модел",
    year: "Година",
    price: "Цена",
    mileage: "Пробег",
    fuel: "Гориво",
    location: "Местоположение",
    viewDetails: "Виж детайли",

    // Seller dashboard
    sellerDashboardTitle: "Табло на продавача",
    addNewCar: "Добави нова кола",
    totalCars: "Общо коли",
    totalViews: "Общо преглеждания",
    totalLikes: "Общо харесвания",
    totalMessages: "Общо съобщения",
    myCars: "Моите коли",
    analytics: "Анализи и отчети",
    dailyViews: "Средно дневни преглеждания",
    conversionRate: "Коефициент на конверсия",
    mostViewedCar: "Най-глеждана кола",

    // Common
    loading: "Зареждане...",
    error: "Грешка",
    success: "Успех",
    cancel: "Отказ",
    confirm: "Потвърди",

    // Authentication
    welcomeBack: "Добре дошли отново",
    createAccount: "Създайте своя акаунт",
    email: "Имейл",
    enterEmail: "Въведете имейл",
    password: "Парола",
    enterPassword: "Въведете парола",
    firstName: "Име",
    lastName: "Фамилия",
    enterFirstName: "Въведете име",
    enterLastName: "Въведете фамилия",
    phone: "Телефон",
    enterPhone: "Въведете телефон",
    confirmPassword: "Потвърдете парола",
    passwordMismatch: "Паролите не съвпадат",
    passwordTooShort: "Паролата трябва да е поне 6 символа",
    loggingIn: "Влизане...",
    or: "или",
    dontHaveAccount: "Нямате акаунт?",
    userType: "Тип акаунт",
    buyer: "Купувач",
    seller: "Продавач",
    agreeTo: "Съгласявам се с",
    termsAndConditions: "Общите условия",
    mustAgreeToTerms: "Трябва да се съгласите с условията",
    creatingAccount: "Създаване на акаунт...",
    haveAccount: "Вече имате акаунт?",
    loginWithGoogle: "Вход с Google",
    signupWithGoogle: "Регистрация с Google",
    rememberMe: "Запомни ме",
    forgotPassword: "Забравена парола?",
    resetPassword: "Нулиране на парола",
    enterEmailForReset: "Въведете имейла си за нулиране на парола",
    sendResetLink: "Изпрати линк за нулиране",
    resetLinkSent: "Линкът за нулиране е изпратен на вашия имейл",
    sending: "Изпращане...",
    accountCreated: "Акаунтът е създаден успешно",
    termsText: "С използването на нашата платформа, вие се съгласявате с нашите общи условия. Ние сме ангажирани да осигурим безопасна и сигурна среда за купуване и продаване на автомобили.",

    // AI Features
    aiPriceEvaluator: "AI Оценител на цени",
    getRealTimeValuation: "Получете оценка на реалната пазарна стойност на вашата кола за по-бърза продажба",
    analyzingMarket: "Анализиране на пазара...",
    suggestPrice: "Предложи цена",
    fillMakeYearFirst: "Моля попълнете марка и година първо",
    suggestedPrice: "Предложена цена",
    confidence: "Доверие",
    fairRange: "Справедлив диапазон",
    similarListings: "Подобни обяви",
    demandLevel: "Ниво на търсене",
    applyThisPrice: "Приложи тази цена",
    fillRequiredFields: "Моля попълнете задължителните полета",
    priceEvaluationFailed: "Оценката на цената се провали",

    // Image Analysis
    aiImageAnalyzer: "AI Анализатор на изображения",
    smartImageAnalysis: "Интелигентен анализ на изображения за по-добри обяви",
    dragDropImages: "Плъзнете и пуснете изображения тук",
    orClickToBrowse: "или кликнете за разглеждане",
    chooseFiles: "Изберете файлове",
    analysisFailed: "Анализът се провали",
    brightness: "Яркост",
    clarity: "Яснота",
    analysisSummary: "Резюме на анализа",
    totalImages: "Общо изображения",
    averageQuality: "Средно качество",
    excellentImages: "Отлични изображения"
  }
};

// i18n composable
export const useI18n = () => {
  const currentLocale = ref('en'); // Default to English

  const t = (key) => {
    return translations[currentLocale.value]?.[key] || key;
  };

  const setLocale = (locale) => {
    if (translations[locale]) {
      currentLocale.value = locale;
      localStorage.setItem('locale', locale);
    }
  };

  const getAvailableLocales = () => {
    return Object.keys(translations);
  };

  const getCurrentLocaleName = () => {
    const names = {
      en: 'English',
      bg: 'Български'
    };
    return names[currentLocale.value] || currentLocale.value;
  };

  // Load saved locale on initialization
  const initLocale = () => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && translations[savedLocale]) {
      currentLocale.value = savedLocale;
    }
  };

  return {
    currentLocale,
    t,
    setLocale,
    getAvailableLocales,
    getCurrentLocaleName,
    initLocale
  };
};
