import { initializeApp } from '@firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCPFDskVJJVhKrOcHHAU5phfH8dPHsyaP0",
  authDomain: "dog-feeder-3d20b.firebaseapp.com",
  databaseURL: "https://dog-feeder-3d20b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dog-feeder-3d20b",
  storageBucket: "dog-feeder-3d20b.appspot.com",
  messagingSenderId: "137219263649",
  appId: "1:137219263649:web:d8c7caf0f838191aeef4e0",
  measurementId: "G-VDL4RW4V4G"
};

export const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
