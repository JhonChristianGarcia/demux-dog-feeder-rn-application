import { View, Text, ImageBackground,StyleSheet, Image, TouchableOpacity, Button} from "react-native";
import React, { useState, useEffect } from "react";
// import Button from "../components/Button";

import { SafeAreaView } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import {auth} from "../auth/config"

const Welcome = ({navigation}) => {
  const navigator = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) return;
        navigator.navigate("Home");
    });
    return () => unsubscribe();
}, []);

//   if(hasUser){
//     setTimeout(()=> {
//       navigator.navigate("Home");
//     },1000)
//     return;
//   }

  return (
    <SafeAreaView style={{flex:1}}>
      <ImageBackground
      resizeMode= 'cover'
        source={require('../assets/images/demuxdogpng.png')}
        style={styles.background}
        
      >
       <View style={{width: "80%"} }>
        <TouchableOpacity style={{backgroundColor: "none", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center"}} onPress={()=> navigation.navigate("Login")}>
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Log in</Text>
        </TouchableOpacity> 
       </View>

       <View style={{width: "80%",  marginBottom: 50} }>
        <TouchableOpacity style={{backgroundColor: "#fff", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center"}} onPress={()=> navigation.navigate("SignUp")}>
          <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Sign up</Text>
        </TouchableOpacity> 
       </View>

      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex:1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5
  },
  logo: {
    width:200,
    height: 200
  }, 
  btn: {
    width: 300,
    color: "#fff",
    backgroundColor: "none"
  }
})

export default Welcome;
