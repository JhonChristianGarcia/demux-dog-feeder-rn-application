import { View, Text, ImageBackground,StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Video from 'react-native-video';
import Button from "../components/Button";
const Welcome = ({navigation}) => {
  return (
    <View style={{flex:1}}>
      <ImageBackground
        source={require('../assets/images/dogWallpaper.png')}
        style={styles.background}
      >
        {/* <Image 
        source={require('../assets/images/corgiLogo.png')}
        resizeMode='contain'
        style={styles.logo}
        /> */}
        <Text>Welcome</Text>
       <View style={{marginTop: 75}}>
        <Button 
          title="Login with Email"
          onPress={()=> navigation.navigate("Login")}
          style={styles.btn}
          filled={true}
        />
       </View>
       <View style={{marginTop: 25, flexDirection: "row"}}>
        {/* <Button 
          title="Login with Email"
          onPress={()=> navigation.navigate("Login")}
          style={styles.btn}
          filled={true}
        /> */}
          <Text>Don't have an account?{"  "}</Text>
        <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
       </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex:1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width:200,
    height: 200
  }, 
  btn: {
    width: 300
  }
})

export default Welcome;
