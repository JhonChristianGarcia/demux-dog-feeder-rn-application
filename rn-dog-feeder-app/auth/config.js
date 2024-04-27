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
  apiKey: "AIzaSyArDQgmofZWzdW7KQmXzKkwVimM1IqJ45k",
  authDomain: "dog-feeder-v2-7dc5e.firebaseapp.com",
  projectId: "dog-feeder-v2-7dc5e",
  storageBucket: "dog-feeder-v2-7dc5e.appspot.com",
  messagingSenderId: "930637951807",
  appId: "1:930637951807:web:c76469b7974a557602d98a"
};


export const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
