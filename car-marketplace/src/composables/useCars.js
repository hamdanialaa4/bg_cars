import { ref } from 'vue'
import { db, storage } from '../firebase/config.ts'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'

export const useCars = () => {
  const isLoading = ref(false)
  const error = ref(null)
  const cars = ref([])

  // إضافة سيارة جديدة
  const addCar = async (carData, images = []) => {
    isLoading.value = true
    error.value = null

    try {
      // رفع الصور أولاً
      const imageUrls = []
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const imageUrl = await uploadCarImage(images[i], carData.make + '_' + carData.model + '_' + i)
          imageUrls.push(imageUrl)
        }
      }

      // إضافة السيارة إلى Firestore
      const carDoc = {
        ...carData,
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        views: 0,
        likes: 0,
        sellerId: carData.sellerId,
        isActive: true
      }

      const docRef = await addDoc(collection(db, 'cars'), carDoc)
      return { id: docRef.id, ...carDoc }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // تحديث سيارة
  const updateCar = async (carId, carData, newImages = []) => {
    isLoading.value = true
    error.value = null

    try {
      // رفع الصور الجديدة
      const newImageUrls = []
      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          const imageUrl = await uploadCarImage(newImages[i], carData.make + '_' + carData.model + '_new_' + i)
          newImageUrls.push(imageUrl)
        }
      }

      // تحديث السيارة في Firestore
      const updateData = {
        ...carData,
        updatedAt: new Date()
      }

      if (newImageUrls.length > 0) {
        // إضافة الصور الجديدة إلى الصور الموجودة
        const existingCar = await getCarById(carId)
        updateData.images = [...(existingCar.images || []), ...newImageUrls]
      }

      await updateDoc(doc(db, 'cars', carId), updateData)
      return { id: carId, ...updateData }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // حذف سيارة
  const deleteCar = async (carId) => {
    isLoading.value = true
    error.value = null

    try {
      // جلب السيارة أولاً لحذف الصور
      const car = await getCarById(carId)

      // حذف الصور من Storage
      if (car.images && car.images.length > 0) {
        for (const imageUrl of car.images) {
          await deleteCarImage(imageUrl)
        }
      }

      // حذف السيارة من Firestore
      await deleteDoc(doc(db, 'cars', carId))
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // جلب سيارة واحدة بالمعرف
  const getCarById = async (carId) => {
    try {
      const docSnap = await getDoc(doc(db, 'cars', carId))
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Car not found')
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // جلب سيارات البائع
  const getCarsBySeller = async (sellerId) => {
    isLoading.value = true
    try {
      const q = query(
        collection(db, 'cars'),
        where('sellerId', '==', sellerId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const sellerCars = []
      querySnapshot.forEach((doc) => {
        sellerCars.push({ id: doc.id, ...doc.data() })
      })
      return sellerCars
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // البحث في السيارات
  const searchCars = async (filters = {}) => {
    isLoading.value = true
    try {
      let q = collection(db, 'cars')

      // تطبيق الفلاتر
      const conditions = []

      if (filters.make) conditions.push(where('make', '==', filters.make))
      if (filters.model) conditions.push(where('model', '==', filters.model))
      if (filters.fuelType) conditions.push(where('fuelType', '==', filters.fuelType))
      if (filters.transmission) conditions.push(where('transmission', '==', filters.transmission))
      if (filters.minPrice) conditions.push(where('price', '>=', filters.minPrice))
      if (filters.maxPrice) conditions.push(where('price', '<=', filters.maxPrice))
      if (filters.minYear) conditions.push(where('year', '>=', filters.minYear))
      if (filters.maxYear) conditions.push(where('year', '<=', filters.maxYear))

      // السيارات النشطة فقط
      conditions.push(where('isActive', '==', true))

      if (conditions.length > 0) {
        q = query(q, ...conditions, orderBy('createdAt', 'desc'))
      } else {
        q = query(q, orderBy('createdAt', 'desc'))
      }

      const querySnapshot = await getDocs(q)
      const results = []
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() })
      })

      return results
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // جلب جميع السيارات (للصفحة الرئيسية)
  const getAllCars = async (limitCount = 20) => {
    isLoading.value = true
    try {
      const q = query(
        collection(db, 'cars'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      const querySnapshot = await getDocs(q)
      const allCars = []
      querySnapshot.forEach((doc) => {
        allCars.push({ id: doc.id, ...doc.data() })
      })
      return allCars
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // تحديث عدد المشاهدات
  const incrementViews = async (carId) => {
    try {
      const carRef = doc(db, 'cars', carId)
      const carSnap = await getDoc(carRef)
      if (carSnap.exists()) {
        const currentViews = carSnap.data().views || 0
        await updateDoc(carRef, {
          views: currentViews + 1,
          updatedAt: new Date()
        })
      }
    } catch (err) {
      console.error('Error incrementing views:', err)
    }
  }

  // تحديث الإعجابات
  const toggleLike = async (carId, userId) => {
    try {
      const carRef = doc(db, 'cars', carId)
      const carSnap = await getDoc(carRef)
      if (carSnap.exists()) {
        const carData = carSnap.data()
        const currentLikes = carData.likes || 0
        // في تطبيق حقيقي، يجب حفظ الإعجابات في مجموعة منفصلة
        await updateDoc(carRef, {
          likes: currentLikes + 1,
          updatedAt: new Date()
        })
      }
    } catch (err) {
      console.error('Error toggling like:', err)
    }
  }

  // رفع صورة السيارة
  const uploadCarImage = async (file, fileName) => {
    try {
      const imageRef = storageRef(storage, `cars/${fileName}_${Date.now()}`)
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  // حذف صورة السيارة
  const deleteCarImage = async (imageUrl) => {
    try {
      const imageRef = storageRef(storage, imageUrl)
      await deleteObject(imageRef)
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  }

  // مراقبة التغييرات في الوقت الفعلي
  const subscribeToCars = (callback) => {
    const q = query(
      collection(db, 'cars'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const carsList = []
      querySnapshot.forEach((doc) => {
        carsList.push({ id: doc.id, ...doc.data() })
      })
      callback(carsList)
    })
  }

  return {
    isLoading,
    error,
    cars,
    addCar,
    updateCar,
    deleteCar,
    getCarById,
    getCarsBySeller,
    searchCars,
    getAllCars,
    incrementViews,
    toggleLike,
    uploadCarImage,
    deleteCarImage,
    subscribeToCars
  }
}
