import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAu1YaRfNehDR4f3mTWQ6N25LjRJYo3cVM",
  authDomain: "sharemyride-7a831.firebaseapp.com",
  projectId: "sharemyride-7a831",
  storageBucket: "sharemyride-7a831.appspot.com",
  messagingSenderId: "540486614422",
  appId: "1:540486614422:web:e56e2ec7767b04130fb1b7",
  measurementId: "G-RMH0BTQ78J",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Analytics (Check if window exists to avoid SSR issues)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// ✅ Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 🔹 Customize Google Login Experience (Optional)
googleProvider.setCustomParameters({ prompt: "select_account" });

// ✅ Firestore Database
export const db = getFirestore(app);

export { app, analytics };
