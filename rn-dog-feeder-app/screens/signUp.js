import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import React, {useEffect, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "../auth/config"
import { collection, getFirestore, addDoc, doc, setDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

import { moderateScale, verticalScale} from "../utils/sizeModerator";
const db = getFirestore();
const userRef = collection(db, 'users');
// console.log(userRef)
// console.log(auth)
const SignUp = ({navigation}) => {
  const navigator = useNavigation();
  const [inputEmail, setinputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const [userCredentials, setUserCredentials] = useState(null)
  const [signedUp, setSignedUp] = useState(false)
  const handleSignUp =  async () =>{
    try{
      const userCred = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
      setDoc(doc(db, 'users', userCred.user.uid), {deviceIDs: [1]})
      setinputEmail("")
      setInputPassword("")
      setTimeout(()=>{
        navigator.navigate("Home");
      },1500)
      // console.log(userCred.user.uid)

    } catch(err){
      alert("Enter a valid email address") 
    }
    // .then( userCreds => {
    //   setinputEmail("")
    //   setInputPassword("")
    //   // setUserCredentials(userCreds.uid)
    //   console.log(userCreds)
    //   // addDoc(userRef, {motorOn: false})
      
    // })
    // .catch(err=>  alert(err.message))
  }
  // useEffect(()=>{
  //   setDoc(doc(db, 'users', userCredentials), {motorOn:true}).then(res=> console.log(res)).catch(err=> console.log(err.message))
  // }, [userCredentials])
  useEffect(() => {
    if (signedUp) {

      navigation.navigate("Welcome");
    }
  }, [signedUp, navigation]);

  return (
   <SafeAreaView style={{flex:1, justifyContent:"center", alignItems: "center"}}>
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
       <View>
        <TouchableWithoutFeedback onPress={()=> navigator.navigate("Welcome")}>
          <Text style={{textTransform: "uppercase", color: "#000", fontSize: moderateScale(68), fontWeight: "300"}}>&#8249;</Text>
        </TouchableWithoutFeedback>

          <Text style={{textTransform: "uppercase", color: "#000", fontSize: moderateScale(26), fontWeight: "900"}}>Sign Up</Text>
       </View>


        <View style={{ gap: 30}}>
          <TextInput placeholder="Email address" value={inputEmail} onChangeText={text=> setinputEmail(text)} style={{fontSize: 18,height: verticalScale(50), borderBottomWidth: 1, borderBottomColor: "#DDDDDD"}}/>
          <TextInput placeholder="Password" value={inputPassword} secureTextEntry onChangeText={text=> setInputPassword(text)} style={{fontSize: 18,height: verticalScale(50), borderBottomWidth: 1, borderBottomColor: "#DDDDDD"}}/>
        </View>

       
        <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center"}} onPress={handleSignUp}>
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Sign Up</Text>
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

export default SignUp;
