import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import {auth} from "../auth/config"
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from '@firebase/auth'
import { useNavigation } from '@react-navigation/native'
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
    <SafeAreaView>
      <TouchableHighlight onPress={handleLogout}>
        <Text>Log out</Text>
      </TouchableHighlight>
    </SafeAreaView>
  )
}

export default Account

const styles = StyleSheet.create({})