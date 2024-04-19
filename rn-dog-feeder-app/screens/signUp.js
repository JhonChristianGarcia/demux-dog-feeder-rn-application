import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, TouchableHighlight } from "react-native";
import React, {useEffect, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "../auth/config"
import { collection, getFirestore, addDoc, doc, setDoc } from "firebase/firestore";

const db = getFirestore();
const userRef = collection(db, 'users');
// console.log(userRef)
// console.log(auth)
const SignUp = ({navigation}) => {
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
      // console.log(userCred.user.uid)

    } catch(err){
      console.log(err.message)
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
        <TextInput placeholder="Email" value={inputEmail} onChangeText={text=> setinputEmail(text)}/>
        <TextInput placeholder="Password" value={inputPassword} secureTextEntry onChangeText={text=> setInputPassword(text)}/>
        <View>
          <TouchableHighlight onPress={handleSignUp}>
            <Text>Sign Up</Text>
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

export default SignUp;
