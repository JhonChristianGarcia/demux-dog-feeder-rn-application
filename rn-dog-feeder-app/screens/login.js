import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableHighlight } from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import {  signOut, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from "../auth/config"



const Login = ({navigation}) => {
  const [inputEmail, setinputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")

  function handleSignIn(){
    // console.log("It went here")
    signInWithEmailAndPassword(auth,inputEmail, inputPassword).then((creds)=>{
      // console.log(creds)
      setinputEmail("")
      setInputPassword("")
      setTimeout(()=> {
        navigation.navigate("Home")
      },1000)
    }).catch(err=> console.log(err))
  }

  return (
    <SafeAreaView style ={{flex: 1, backgroundColor: COLORS.background}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <TextInput placeholder="Email" value={inputEmail} onChangeText={text=> setinputEmail(text)}/>
        <TextInput placeholder="Password" value={inputPassword} secureTextEntry onChangeText={text=> setInputPassword(text)}/>
        <View>
          <TouchableHighlight onPress={handleSignIn}>
            <Text>Log in</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles= StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5
  }
})
export default Login;
