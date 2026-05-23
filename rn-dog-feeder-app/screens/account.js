import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, ImageBackground, TouchableWithoutFeedback, Pressable } from 'react-native'
import { moderateScale, horizontalScale, verticalScale } from '../utils/sizeModerator'
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
        resizeMode='cover'
        source={require('../assets/images/doglogout.png')}
        style={styles.background}
      >
        <Pressable style={styles.backBtn} onPress={()=> navigator.navigate("Home")}>
          <Text style={styles.backArrow}>&#8249;</Text>
        </Pressable>

        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.outlineBtn} onPress={handleLogout}>
            <Text style={styles.outlineBtnText}>Log Out</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  backArrow: {
    color: '#FFF',
    fontSize: moderateScale(68),
    fontWeight: '300',
    lineHeight: moderateScale(68),
  },
  btnGroup: {
    width: '90%',
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
})