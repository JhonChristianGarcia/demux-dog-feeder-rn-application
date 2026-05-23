import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import React, {useState, useEffect} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { useNavigation } from '@react-navigation/native';

import {  signOut, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from "../auth/config"
import { moderateScale, verticalScale } from "../utils/sizeModerator";



const Login = ({navigation}) => {
  const navigator = useNavigation();
  const [inputEmail, setinputEmail] = useState("")
  const [inputPassword, setInputPassword] = useState("")
  const [user, setUser] = useState(null)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user.uid);
            navigator.navigate("Home")
            console.log(`Current user:${user.uid}`);
        } else {
            setUser(null);
            console.log("No user signed in");
        }
    });
  }, [auth]); 



  function handleSignIn(){
    if(!inputEmail || !inputPassword) {
      alert("Please enter email and password")
      return;
    }
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
    !user && <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <View>
          <TouchableWithoutFeedback onPress={()=> navigator.navigate("Welcome")}>
            <Text style={styles.backArrow}>&#8249;</Text>
          </TouchableWithoutFeedback>
          <Text style={styles.heading}>Log in</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Email address"
            value={inputEmail}
            onChangeText={text=> setinputEmail(text)}
            style={styles.input}
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={inputPassword}
            secureTextEntry
            onChangeText={text=> setInputPassword(text)}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSignIn}>
          <Text style={styles.primaryBtnText}>Log in</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles= StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '90%',
    gap: 80,
    justifyContent: 'center',
  },
  backArrow: {
    color: '#000',
    fontSize: moderateScale(68),
    fontWeight: '300',
    lineHeight: moderateScale(68),
    marginBottom: 4,
  },
  heading: {
    textTransform: 'uppercase',
    color: '#000',
    fontSize: moderateScale(28),
    fontWeight: '900',
    letterSpacing: 1,
  },
  inputGroup: {
    gap: 24,
  },
  input: {
    fontSize: moderateScale(15),
    height: verticalScale(50),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    color: '#000',
  },
  primaryBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontSize: moderateScale(14),
    letterSpacing: 2,
  },
})
export default Login;
