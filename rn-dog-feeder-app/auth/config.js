// import { initializeApp } from '@firebase/app';
// import { getAuth, initializeAuth, getReactNativePersistence} from '@firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// export const firebaseConfig = {
//   apiKey: "AIzaSyCPFDskVJJVhKrOcHHAU5phfH8dPHsyaP0",
//   authDomain: "dog-feeder-3d20b.firebaseapp.com",
//   databaseURL: "https://dog-feeder-3d20b-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "dog-feeder-3d20b",
//   storageBucket: "dog-feeder-3d20b.appspot.com",
//   messagingSenderId: "137219263649",
//   appId: "1:137219263649:web:d8c7caf0f838191aeef4e0",
//   measurementId: "G-VDL4RW4V4G"
// };

// export const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// export { auth };



// // Import the functions you need from the SDKs you need
import { initializeApp } from '@firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};


export const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
