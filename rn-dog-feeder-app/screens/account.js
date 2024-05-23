import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, ImageBackground } from 'react-native'
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




    return (<SafeAreaView style={{flex:1}}>
      <ImageBackground
      resizeMode= 'cover'
        source={require('../assets/images/demuxdogpng.png')}
        style={styles.background}
  
      >
         {/* <TouchableOpacity style={{backgroundColor: "#FFFFFF", width: "50%", justifyContent: "center", alignItems: "center", borderWidth: 2, padding: 10, marginBottom: 100, alignItems: "center", flexDirection: "row", gap: 5}}>
       <FontAwesome name="user" size={24} color="#000" />
          <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Log out</Text>
        </TouchableOpacity>  */}

        <View style={{width: "80%", marginBottom: "20%"} }>
        <TouchableOpacity style={{backgroundColor: "none", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center"}}  onPress={handleLogout}>
          <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Log Out</Text>
        </TouchableOpacity> 
       </View>
      
      </ImageBackground>
    </SafeAreaView>)
  // return (
  //  <SafeAreaView style={{justifyContent: "space-between", flex:1}}>
   
  //     <View style={{justifyContent: "center", alignItems: "center", flex:1}}>
  //     <Text>Account Settings</Text>
  //     <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 2, padding: 10, borderColor: "#fff", alignItems: "center", flexDirection: "row", gap: 5}} onPress={handleLogout}>
  //      <FontAwesome name="user" size={24} color="#fff" />
  //         <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Log out</Text>
  //       </TouchableOpacity> 
  //     </View>
  //     <Footer/>
   
  //  </SafeAreaView>

  // )
}

export default Account

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