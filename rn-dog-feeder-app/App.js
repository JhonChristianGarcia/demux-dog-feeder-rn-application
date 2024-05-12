import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { useCallback, useState, useEffect} from "react";
import { Login, SignUp, Welcome, Home, DeviceScreen, Account, Camera} from "./screens";
import { StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { initializeApp } from '@firebase/app';

import { auth } from "./auth/config";
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
// const navigator = useNavigation()
import { Device } from "./screens/home";


const Stack = createNativeStackNavigator();

export default function App() {
  const [currentArray, setCurrentArray] = useState(null);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Camera" component={Camera} />
          <Stack.Screen name="Home" >
           {props => <Home {...props} currentArray={currentArray} setCurrentArray={setCurrentArray} />}
          </Stack.Screen>
          {currentArray?.slice(1).map(device=> {
            return <Stack.Screen key = {device} name={device} component={DeviceScreen} initialParams={{device}}  />
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
