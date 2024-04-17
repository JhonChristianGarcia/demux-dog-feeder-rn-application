import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { FONTS } from "./constants/fonts";
import { useCallback } from "react";
import { Login, SignUp, Welcome } from "./screens";
import { StyleSheet } from "react-native";
const Stack = createNativeStackNavigator();
export default function App() {
  const [fonstLoaded] = useFonts(FONTS);

  const onLayoutRootView = useCallback(async () => {
    if (fonstLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fonstLoaded]);

  if (!fonstLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
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
