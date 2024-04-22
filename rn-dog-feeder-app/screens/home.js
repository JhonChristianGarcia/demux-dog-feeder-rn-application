import { View, Text, TouchableHighlight, TextInput, Button, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {auth, app} from "../auth/config"
import {  signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';    
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
    
    // useEffect(()=>{
    //     if(!user) return;
    //     const colRef = doc(db, "users", user);
    //     // console.log(colRef)
    //     // setCurrentDeviceRef()
    //     console.log(`This is their user`,doc(db, "users", user))
    //     getDoc(colRef).then(snapshot=> console.log(snapshot.data()))
    //     console.log(user)
    // },[user])


    // console.log(userSignedIn)
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
    <SafeAreaView style={{flex:1, justifyContent: "center", alignItems:"center"}}>
        <KeyboardAvoidingView>
        <Text>Home</Text>
        <Text>{user ? user: "No user signed in"}</Text>
        <TouchableHighlight onPress={handleLogout}>
            <Text>Logout</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={()=> navigator.navigate("Welcome")}>
            <Text>Go to welcome page</Text>
        </TouchableHighlight>

        <View>
            <TextInput onChangeText={(text)=> setInputDevice(text)} value={inputDevice} placeholder='Enter device ID'>
            </TextInput>
            <TouchableHighlight onPress={handleAddDevice}>
                <Text>Add device</Text>
            </TouchableHighlight>
        </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Home