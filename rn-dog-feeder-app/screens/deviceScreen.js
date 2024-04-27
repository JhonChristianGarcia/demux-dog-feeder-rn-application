import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native'
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';

import { useState } from 'react';
import React from 'react'
import { db } from './home';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeviceScreen = ({route}) => {
    const navigator = useNavigation();
    const {device} = route.params;
    const [motorState, setMotorState] = useState(null)
    const deviceRef = doc(db, "device-feeder", device);
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
    
    return <SafeAreaView >
        <View style={{flexDirection: "row", alignItems: "center", justifyContent:"space-around"}}>
            <TouchableWithoutFeedback onPress={()=> navigator.navigate("Home")}>
             <Text style={{textTransform: "uppercase", color: "#2A2A2A", fontSize: 70, fontWeight: "300", padding:10, paddingBottom: 20}}>&#8249;</Text>
            </TouchableWithoutFeedback>
            <View style={{flex:1, justifyContent: "center",  alignItems:"center", height: 100}}>
                <Text style={{fontSize: 18, fontWeight: "700", textTransform: "uppercase"}}>Demux Dog Feeder</Text>
            </View>
        </View>

        <View style={{justifyContent: "center", alignItems:"center"}}>
            <Text>Device ID: {device}</Text>
            <Image style={{width: 200,  height: 300}} source={require("../assets/images/feeder1.png")} resizeMode='contain'></Image>
        </View>

        <View style={{justifyContent:"center", alignItems: "center",  height: 300, width: "100%"}}>
        <TouchableOpacity style={{width: "90%", backgroundColor: "#000", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={updateMotorState}>
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Feed</Text>
        </TouchableOpacity> 

          
        </View>
        
    </SafeAreaView>
   
}

export default DeviceScreen

const styles = StyleSheet.create({})