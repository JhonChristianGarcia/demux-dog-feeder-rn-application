import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {auth} from "../auth/config"
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from '@firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { Footer } from './home'
import { FontAwesome, FontAwesome6, AntDesign} from '@expo/vector-icons';

const Account = () => {
    const navigator = useNavigation();

    function handleLogout(){
        signOut(auth)
        .then(()=>{
            navigator.navigate("Welcome")
        })
        .catch(err=> {
            console.log(err.message)
        })
    }


  return (
   <SafeAreaView style={{justifyContent: "space-between", flex:1}}>
   
      <View style={{justifyContent: "center", alignItems: "center", flex:1}}>
      <Text>Account Settings</Text>
      <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center", flexDirection: "row", gap: 5}} onPress={handleLogout}>
       <FontAwesome name="user" size={24} color="#fff" />
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Log out</Text>
        </TouchableOpacity> 
      </View>
      <Footer/>
   
   </SafeAreaView>

  )
}

export default Account

const styles = StyleSheet.create({})