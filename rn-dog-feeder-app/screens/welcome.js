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
        resizeMode='cover'
        source={require('../assets/images/demuxdogpng.png')}
        style={styles.background}
      >
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.outlineBtn} onPress={()=> navigation.navigate("Login")}>
            <Text style={styles.outlineBtnText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.solidBtn} onPress={()=> navigation.navigate("SignUp")}>
            <Text style={styles.solidBtnText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btnGroup: {
    width: '90%',
    gap: 10,
    marginBottom: 48,
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: '#FFF',
    paddingVertical: 16,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 2,
  },
  solidBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    alignItems: 'center',
  },
  solidBtnText: {
    color: '#000',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 2,
  },
})

export default Welcome;
