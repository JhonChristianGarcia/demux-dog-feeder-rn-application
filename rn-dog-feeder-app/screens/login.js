import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { useNavigation } from '@react-navigation/native';

import {  signOut, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from "../auth/config"



const Login = ({navigation}) => {
  const navigator = useNavigation();
  const [inputEmail, setinputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")

  function handleSignIn(){
    if(!inputEmail || !inputPassword) return;
    // console.log("It went here")
    signInWithEmailAndPassword(auth,inputEmail, inputPassword).then((creds)=>{
      // console.log(creds)
      setinputEmail("")
      setInputPassword("")
      setTimeout(()=> {
        navigation.navigate("Home")
      },1000)
    }).catch(err=> alert("Invalid email or password"))
  }

  return (
    <SafeAreaView style ={{flex: 1, backgroundColor: COLORS.white, justifyContent:"center", alignItems:"center"}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"

      >
       <View>
        <TouchableWithoutFeedback onPress={()=> navigator.navigate("Welcome")}>
          <Text style={{textTransform: "uppercase", color: "#2A2A2A", fontSize: 70, fontWeight: "300"}}>&#8249;</Text>
        </TouchableWithoutFeedback>

          <Text style={{textTransform: "uppercase", color: "#2A2A2A", fontSize: 28, fontWeight: "900"}}>Log in</Text>
       </View>


        <View style={{ gap: 30}}>
          <TextInput placeholder="Email address" value={inputEmail} onChangeText={text=> setinputEmail(text)} style={{fontSize: 18,height: 50, borderBottomWidth: 1, borderBottomColor: "#DDDDDD"}}/>
          <TextInput placeholder="Password" value={inputPassword} secureTextEntry onChangeText={text=> setInputPassword(text)} style={{fontSize: 18,height: 50, borderBottomWidth: 1, borderBottomColor: "#DDDDDD"}}/>
        </View>

       
        <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center"}} onPress={handleSignIn}>
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Log in</Text>
        </TouchableOpacity> 
      
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles= StyleSheet.create({
  container: {
    flex:1,
    width: "90%",
    gap: 120
  }
})
export default Login;
