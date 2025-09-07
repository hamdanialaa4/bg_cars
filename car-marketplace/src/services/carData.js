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

export const useCarData = () => {
  const isLoading = ref(false)
  const error = ref(null)

  // إضافة سيارة جديدة
  const addCar = async (carData, images = []) => {
    isLoading.value = true
    error.value = null

    try {
      // رفع الصور أولاً
      const imageUrls = []
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const imageUrl = await uploadCarImage(images[i], carData.make + '_' + Date.now() + '_' + i)
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
      error.value = 'فشل في إضافة السيارة'
      console.error('Error adding car:', err)
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
          const imageUrl = await uploadCarImage(newImages[i], carData.make + '_update_' + Date.now() + '_' + i)
          newImageUrls.push(imageUrl)
        }
      }

      // تحديث السيارة في Firestore
      const updateData = {
        ...carData,
        updatedAt: new Date()
      }

      if (newImageUrls.length > 0) {
        updateData.images = [...(carData.images || []), ...newImageUrls]
      }

      await updateDoc(doc(db, 'cars', carId), updateData)
      return { id: carId, ...updateData }

    } catch (err) {
      error.value = 'فشل في تحديث السيارة'
      console.error('Error updating car:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // حذف سيارة
  const deleteCar = async (carId, imageUrls = []) => {
    isLoading.value = true
    error.value = null

    try {
      // حذف الصور من Storage
      for (const imageUrl of imageUrls) {
        await deleteCarImage(imageUrl)
      }

      // حذف السيارة من Firestore
      await deleteDoc(doc(db, 'cars', carId))
      return true

    } catch (err) {
      error.value = 'فشل في حذف السيارة'
      console.error('Error deleting car:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // جلب سيارة واحدة
  const getCar = async (carId) => {
    try {
      const docSnap = await getDoc(doc(db, 'cars', carId))
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('السيارة غير موجودة')
      }
    } catch (err) {
      error.value = 'فشل في جلب بيانات السيارة'
      console.error('Error getting car:', err)
      throw err
    }
  }

  // جلب سيارات البائع
  const getCarsBySeller = async (sellerId) => {
    isLoading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'cars'),
        where('sellerId', '==', sellerId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const cars = []
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() })
      })

      return cars

    } catch (err) {
      error.value = 'فشل في جلب سيارات البائع'
      console.error('Error getting seller cars:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // البحث في السيارات
  const searchCars = async (filters = {}) => {
    isLoading.value = true
    error.value = null

    try {
      let q = collection(db, 'cars')

      // تطبيق الفلاتر
      const conditions = []

      if (filters.make) conditions.push(where('make', '==', filters.make))
      if (filters.model) conditions.push(where('model', '==', filters.model))
      if (filters.fuelType) conditions.push(where('fuelType', '==', filters.fuelType))
      if (filters.transmission) conditions.push(where('transmission', '==', filters.transmission))
      if (filters.minYear) conditions.push(where('year', '>=', filters.minYear))
      if (filters.maxYear) conditions.push(where('year', '<=', filters.maxYear))
      if (filters.status) conditions.push(where('status', '==', filters.status))

      // بناء الاستعلام
      if (conditions.length > 0) {
        q = query(q, ...conditions, orderBy('createdAt', 'desc'))
      } else {
        q = query(q, orderBy('createdAt', 'desc'))
      }

      const querySnapshot = await getDocs(q)
      let cars = []
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() })
      })

      // فلترة إضافية للأسعار (لأن Firestore لا يدعم range queries مع multiple conditions)
      if (filters.minPrice) {
        cars = cars.filter(car => car.price >= filters.minPrice)
      }
      if (filters.maxPrice) {
        cars = cars.filter(car => car.price <= filters.maxPrice)
      }

      return cars

    } catch (err) {
      error.value = 'فشل في البحث'
      console.error('Error searching cars:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // جلب السيارات المميزة
  const getFeaturedCars = async (limitCount = 6) => {
    try {
      const q = query(
        collection(db, 'cars'),
        where('status', '==', 'active'),
        orderBy('views', 'desc'),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      const cars = []
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() })
      })

      return cars

    } catch (err) {
      error.value = 'فشل في جلب السيارات المميزة'
      console.error('Error getting featured cars:', err)
      throw err
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

  // رفع صورة السيارة
  const uploadCarImage = async (file, fileName) => {
    try {
      const imageRef = storageRef(storage, `cars/${fileName}`)
      const snapshot = await uploadBytes(imageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (err) {
      console.error('Error uploading image:', err)
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
  const subscribeToCars = (sellerId, callback) => {
    const q = query(
      collection(db, 'cars'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (querySnapshot) => {
      const cars = []
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() })
      })
      callback(cars)
    })
  }

  return {
    isLoading,
    error,
    addCar,
    updateCar,
    deleteCar,
    getCar,
    getCarsBySeller,
    searchCars,
    getFeaturedCars,
    incrementViews,
    uploadCarImage,
    deleteCarImage,
    subscribeToCars
  }
}
