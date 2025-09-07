import { ref } from 'vue'
import { auth, db } from '../services/firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

export const useAuth = () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // تسجيل مستخدم جديد
  const register = async (userData) => {
    isLoading.value = true
    error.value = null

    try {
      const { email, password, displayName, userType } = userData

      // إنشاء حساب في Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // تحديث الملف الشخصي
      await updateProfile(userCredential.user, {
        displayName: displayName
      })

      // حفظ بيانات المستخدم في Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        userType: userType, // 'buyer' or 'seller'
        createdAt: new Date(),
        isActive: true,
        profileComplete: false
      })

      return userCredential.user
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // تسجيل الدخول
  const login = async (email, password) => {
    isLoading.value = true
    error.value = null

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // تسجيل الدخول بـ Google
  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // التحقق من وجود المستخدم في Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))

      if (!userDoc.exists()) {
        // إنشاء مستند جديد للمستخدم
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          userType: 'buyer', // افتراضي
          createdAt: new Date(),
          isActive: true,
          profileComplete: false
        })
      }

      return result.user
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // تسجيل الخروج
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    }
  }

  // إعادة تعيين كلمة المرور
  const resetPassword = async (email) => {
    isLoading.value = true
    error.value = null

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // تحديث بيانات المستخدم
  const updateUserProfile = async (userData) => {
    isLoading.value = true
    error.value = null

    try {
      if (!user.value) throw new Error('No user logged in')

      // تحديث Firebase Auth profile
      if (userData.displayName) {
        await updateProfile(user.value, {
          displayName: userData.displayName
        })
      }

      // تحديث Firestore
      await updateDoc(doc(db, 'users', user.value.uid), {
        ...userData,
        updatedAt: new Date()
      })
    } catch (err) {
      error.value = getErrorMessage(err.code)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // مراقبة حالة المصادقة
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // جلب بيانات المستخدم من Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            user.value = {
              ...firebaseUser,
              ...userDoc.data()
            }
          } else {
            user.value = firebaseUser
          }
        } catch (err) {
          console.error('Error fetching user data:', err)
          user.value = firebaseUser
        }
      } else {
        user.value = null
      }
    })
  }

  // التحقق من نوع المستخدم
  const isSeller = () => {
    return user.value?.userType === 'seller'
  }

  const isBuyer = () => {
    return user.value?.userType === 'buyer'
  }

  // رسائل الخطأ المحلية
  const getErrorMessage = (errorCode) => {
    const messages = {
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً',
      'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/network-request-failed': 'خطأ في الشبكة',
      'auth/too-many-requests': 'تم حظر الحساب مؤقتاً بسبب محاولات كثيرة'
    }

    return messages[errorCode] || 'حدث خطأ غير متوقع'
  }

  return {
    user,
    isLoading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    initAuth,
    isSeller,
    isBuyer
  }
}
