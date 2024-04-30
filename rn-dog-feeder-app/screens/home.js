import { View, Text, TouchableHighlight, TextInput, Button, KeyboardAvoidingView, Image, ScrollView, Modal, TouchableOpacity, ImageBackground, BackHandler} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {auth, app} from "../auth/config"
import {  signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue, onSnapshotsInSync} from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';    
import { FontAwesome, FontAwesome6, AntDesign} from '@expo/vector-icons';
export const db = getFirestore();


const Home = ({navigation, currentArray, setCurrentArray}) => {
    const navigator = useNavigation()
    const [user, setUser] = useState(null);
    const [inputDevice, setInputDevice] = useState("");
    const [modalOpen, setModalOpen] = useState(false)
    let devices = [];
    const devicesRef = collection(db, "device-feeder");
    onSnapshot(devicesRef, snapshot => {
        snapshot.forEach(doc=> {
            devices.push(doc.id)
        })
    })
    // function handleBackPress(){
    //     navigator.navigate("Home")
    // }
    // BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    
    
    // (async function () {
    //     const initialMotorState = await getDoc(deviceRef);
    //     setMotorState(initialMotorState.data().motorOn);
    // })();
    
    
    useEffect(()=>{
        if(!user) return;
        const currentDeviceRef = doc(db, "users", user);
        if(!currentDeviceRef) return
        getDoc(currentDeviceRef)
        .then(doc=> {
         const {devices} = doc.data();
         setCurrentArray(devices)
         }).catch(err=> console.log(err.message)) // set initial array based from the database
    },[user])




    function handleAddDevice(){
        if(!inputDevice) {
            alert("Enter a valid device ID")
            return;
         }
        if(!user) return;
        if(!currentArray) {
            setCurrentArray([1])
            return
        }
        if(!devices.includes(inputDevice)){
            alert("Please enter a valid device ID");
            return;
        }
        const ref = doc(db, "users", user);
        const toUpdate= {
            devices: [...currentArray, inputDevice]
        }
        
        updateDoc(ref, toUpdate).then(()=> {
            getDoc(ref)
            .then(doc=> {
             const {devices} = doc.data();
             setCurrentArray(devices)
             }).catch(err=> console.log(err.message)) // set initial array based from the database
        setInputDevice("")
        }).catch(Err=> console.log(Err.message))
        setModalOpen(false)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user.uid);
                console.log(`Current user:${user.uid}`);
            } else {
                setUser(null);
                console.log("No user signed in");
            }
        });
    }, [auth]); 

 
    
    return (
        <>
        <SafeAreaView style={{flex:1, backgroundColor: "#F5F5F5", alignItems:"center", justifyContent: "space-between"}}>
        <View style={{width: "100%",height: 280}}>
            <ImageBackground style={{width: "100%",height: 280, justifyContent: "start", alignItems: "flex-end" }} source={require("../assets/images/dog2.png")}>
                <TouchableOpacity style={{padding: 20}} onPress={()=> setModalOpen(true)}>
                 <AntDesign name="pluscircle" size={30} color="#FFF" />
                </TouchableOpacity>
            </ImageBackground>
        </View>
            {/* <Text style={{color: "#000"}}>All</Text> */}
           {!currentArray?.length >= 1 && <KeyboardAvoidingView behavior= "padding"style={{justifyContent: "center", alignItems:"center", width: "90%", height: 200, backgroundColor:"#FBFBFB", transform: [{translateY: -60}], borderRadius: 10}}>
                <View style={{justifyContent: "center", alignItems: "center", gap:15}}>
                    <TouchableOpacity onPress={()=> setModalOpen(true)}>
                        <AntDesign name="pluscircle" size={50} color="#D9BEA3" />
                    </TouchableOpacity>
                    <Text style={{textTransform: "uppercase", fontSize: 18, fontWeight: "700"}}>Add device</Text>
                    <Text style={{color: "#000", fontSize: 10}}>Add a device to get started.</Text>
                </View>

            </KeyboardAvoidingView>}
             <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen} inputDevice={inputDevice} setInputDevice={setInputDevice} handleAddDevice={handleAddDevice}/>
         
         
            <ScrollView style={{ width: "90%", backgroundColor: "#F5F5F5"}}>
        
               <View>
                <Text style={{color: "#000", fontSize: 18, textTransform: "uppercase", fontWeight: "bold", padding: 10}}>All Devices</Text>
               </View>
           
              {currentArray?.slice(1).map((device, index)=> <Device key={index} deviceId={device}/>)}
            </ScrollView>
            
         
         </SafeAreaView>
        <Footer/>
        </>
  )
}


function CustomModal({modalOpen, setModalOpen, inputDevice, setInputDevice, handleAddDevice}){
    return <Modal visible={modalOpen}
    animationType='slide'
    // presentationStyle="pageSheet"
    style={{margin: 0}}
    transparent={true}
    onRequestClose={()=> setModalOpen(false)}
    >
        <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
            <View style={{backgroundColor: "#fff", height: 480, width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
                <TextInput style={{width: "80%", borderBottomWidth: 1, borderBottomColor: "#DDDDDD", padding:5, fontSize: 16}} onChangeText={(text)=> setInputDevice(text)} value={inputDevice} placeholder='Enter device ID'>
                </TextInput>
                <TouchableHighlight style={{justifyContent:"center", alignItems: "center",width: "80%", backgroundColor: "#000"}} onPress={handleAddDevice}>
                    <Text style={{color: "#fff", textTransform: "uppercase", paddingTop: 10, paddingBottom: 10, fontWeight: "bold", letterSpacing: 3, fontSize: 16}}>Add device</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{borderWidth: 2, borderColor: "#000", justifyContent:"center", alignItems: "center",width: "80%", backgroundColor: "#FFF"}} onPress={()=> setModalOpen(false)}>
                    <Text style={{color: "#000", textTransform: "uppercase", paddingTop: 10, paddingBottom: 10, fontWeight: "bold", letterSpacing: 3, fontSize: 16}}>Close</Text>
                </TouchableHighlight>
            </View>
        </View>
    </Modal>

}
export function Device({deviceId}){
    const navigator = useNavigation()
    const [motorState, setMotorState] = useState(null)
    const deviceRef = doc(db, "device-feeder", deviceId);
    
    (async function () {
        const initialMotorState = await getDoc(deviceRef);
        setMotorState(initialMotorState.data().motorOn);
    })();

    function updateMotorState(){
        updateDoc(deviceRef, {
            motorOn: !motorState
        })
        setTimeout(()=> {
            updateDoc(deviceRef, {
                motorOn: false 
            })
        }, 3000)
    }
    
    return <TouchableHighlight onPress={()=> navigator.navigate(deviceId)}>
        <View style={{justifyContent:"space-between", alignItems: "center", flexDirection: "row", backgroundColor: "#FFF", marginBottom: 10, borderRadius: 10, height: 100, marginTop: 10}}>
        <Image style={{width: 60, height: 60}} source={require("../assets/images/feeder1.png")} resizeMode='contain'></Image>
        <Text>Device ID {deviceId}</Text>


        <TouchableOpacity style={{ backgroundColor: "#000", borderWidth: 2, padding: 8, alignItems: "center", marginRight: 10}} onPress={updateMotorState}>
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 14, padding: 3}}>Feed</Text>
        </TouchableOpacity> 
    </View>
    </TouchableHighlight>
}

export function Footer(){
    const navigator = useNavigation()

    return <View style={{flexDirection: "row", justifyContent: "space-evenly", height: 70}}>
  <TouchableHighlight style={{flex:1, justifyContent: "center", alignItems: "center"}} onPress={()=> navigator.navigate("Home")}>
    <View ><FontAwesome6 name="toilet-portable" size={24} color="#000" />
        <Text>Devices</Text>
        </View>
  </TouchableHighlight>

    <TouchableHighlight style={{flex:1, justifyContent: "center", alignItems: "center"}} onPress={()=> navigator.navigate("Account")}>
    <View style={{ justifyContent: "center", alignItems: "center"}}>
    
    <FontAwesome name="user" size={24} color="#000" />
   <Text>Me</Text>

</View>
    </TouchableHighlight>
</View>
}


export default Home