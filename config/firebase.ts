import { initializeApp } from "firebase/app";
import {initializeAuth,getReactNativePersistence} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore} from "@firebase/firestore";


const firebaseConfig = {
      apiKey: "AIzaSyAxvIxuktdC4qcKd--AY93aBnNHi3DpHR4",
      authDomain: "expense-tracker-de0fd.firebaseapp.com",
      projectId: "expense-tracker-de0fd",
      storageBucket: "expense-tracker-de0fd.firebasestorage.app",
      messagingSenderId: "996730757631",
      appId: "1:996730757631:web:ffed13349aaca351d707ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Auth
export const auth = initializeAuth(app,{
      persistence:getReactNativePersistence(AsyncStorage)
})


//DB
export const firestore = getFirestore(app)
