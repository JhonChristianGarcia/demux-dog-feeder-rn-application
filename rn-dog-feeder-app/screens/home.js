import { View, Text, TouchableHighlight, TextInput, Button, KeyboardAvoidingView, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {auth, app} from "../auth/config"
import {  signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';    
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
const db = getFirestore();


const Home = ({navigation}) => {
    const navigator = useNavigation()
    const [user, setUser] = useState(null);
    const [inputDevice, setInputDevice] = useState("");
    const [currentArray, setCurrentArray] = useState(null);
    // const [currentDeviceID, setCurrentDeviceID] = useState(null)    

    if(user){
        const currentDeviceRef = doc(db, "users", user);
        getDoc(currentDeviceRef)
        .then(doc=> {
         const {devices} = doc.data();
         setCurrentArray(devices)
         }).catch(err=> console.log(err.message)) // set initial array based from the database
    }

    

    function handleAddDevice(){
        if(!inputDevice) return;
        if(!user) return;
        if(!currentArray) {
            setCurrentArray([1])
            return
        }
        const ref = doc(db, "users", user);
        const toUpdate= {
            devices: [...currentArray, inputDevice]
        }
        
        updateDoc(ref, toUpdate).then(()=> console.log("Document updated successfuly")).catch(Err=> console.log(Err.message))
        setInputDevice("")
     
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user.uid);
                console.log(`Current user:${user.uid}`);
            } else {
                setUser(null);
                console.log("No user signed in");
            }
        });
    
        return () => unsubscribe();
    }, []); 
    

    function handleLogout(){
        signOut(auth)
        .then(()=>{
            navigation.navigate("Welcome")
        })
        .catch(err=> {
            console.log(err.message)
        })
    }
    
    return (
        <>
        <Image style={{width: "100%",height: 280}}source={require("../assets/images/catbg.jpg")}></Image>
        <SafeAreaView style={{flex:1, backgroundColor: "yellow", alignItems:"center", justifyContent: "space-between"}}>
            {/* <Text style={{color: "#000"}}>All</Text> */}
            <KeyboardAvoidingView behavior= "padding"style={{width: "90%", backgroundColor:"orange" }}>
                <Text>All devices</Text>
                <Text>{user ? user : "No user signed in"}</Text>
                <TouchableHighlight onPress={handleLogout}>
                    <Text>Logout</Text>
                </TouchableHighlight>

            </KeyboardAvoidingView>
            <View>
                <TextInput onChangeText={(text)=> setInputDevice(text)} value={inputDevice} placeholder='Enter device ID'>
                </TextInput>
                <TouchableHighlight onPress={handleAddDevice}>
                    <Text>Add device</Text>
                </TouchableHighlight>
            </View>
         
            <ScrollView>
              {currentArray?.slice(1).map((device, index)=> <Text key={index}>{device}</Text>)}
            </ScrollView>
            
            <Footer/>
         
    </SafeAreaView>
        </>
  )
}


function Footer(){
    return    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
    <View style={{backgroundColor: "green", flex:1}}><FontAwesome6 name="toilet-portable" size={24} color="black" />
    <Text>Devices</Text>
    </View>

    <View style={{flex:1}}><FontAwesome name="user" size={24} color="#00AA81" /><Text>Me</Text></View>
</View>
}


export default Home