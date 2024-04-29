import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Image, TouchableOpacity, Modal } from 'react-native'
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';

import { useEffect, useState } from 'react';
import React from 'react'
import { db } from './home';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'
// import firestore from '@react-native-firebase/firestore';

// // Enable offline persistence
// firestore().settings({
//   persistence: true,
// });

const DeviceScreen = ({route}) => {
    const [dateModalOpen, setDateModalOpen] = useState(false)
    const [feedTimes, setFeedTimes] = useState([]);
    const [motorState, setMotorState] = useState(null);

    
    
    const navigator = useNavigation();
    const {device} = route.params;
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
        <TouchableOpacity style={{marginBottom: 10, width: "90%", backgroundColor: "#000", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={updateMotorState}>
          <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Feed now</Text>
        </TouchableOpacity> 


        <TouchableOpacity style={{width: "90%", backgroundColor: "#FFF", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={()=> setDateModalOpen(true)}>
          <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Set Feeding Time</Text>
        </TouchableOpacity> 
          <CalendarModal dateModalOpen={dateModalOpen} setDateModalOpen={setDateModalOpen} updateMotorState={updateMotorState} deviceRef={deviceRef}/>
        </View>
        
    </SafeAreaView>
   
}


function CalendarModal({dateModalOpen, setDateModalOpen, updateMotorState, deviceRef}){
    const [showDatePicker, setShowDatePicker]  = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(date)
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(date)
    const [feedTimes, setFeedTimes] = useState(null)
    useEffect(()=>{
        getDoc(deviceRef).then(res=> {
            if(res.data().feedTimes.length < 1) return;
            setFeedTimes(res.data().feedTimes);
        })
    
    },[])

    useEffect(()=>{
        feedTimes?.forEach(time=> {
            const delay = time - Date.now();
            if(delay<0) return;
            console.log(`Delay: ${delay}`)
            setTimeout(()=>{
                updateMotorState()
            }, delay)
        })
    }, [feedTimes])

    function handleDateChange(event, selectedDate){
        setDate(selectedDate)
        setShowDatePicker(false)
    }

    function handleTimeChange(event, selectedTime){
        const currentTime = selectedTime || time;
        setTime(currentTime);
        setDate(currentTime)
        setShowTimePicker(false)
    }
    function handleFeedOnSetTime(){
        const time = new Date(`${date}`).getTime();
        const delay = time - Date.now();
        if(delay < 0) {
            alert("You can not set feeding time on the past :)")
            return;}
        updateDoc(deviceRef, {
            feedTimes: [...feedTimes, time]
        }).then(getDoc(deviceRef).then(res=> {
            if(res.data().feedTimes.length < 1) return;
            setFeedTimes(res.data().feedTimes.filter(times=> times > Date.now()));
        })).catch(err=> console.log(err?.message))    
    }


    return <Modal
    animationType='slide'
    transparent={true}
    visible={dateModalOpen}
    >
          <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
            <View style={{backgroundColor: "#fff", height: 480, width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
                <View>
                {showDatePicker && <DateTimePicker 
                    mode={'date'}
                    value={date || new Date()}
                    onChange={handleDateChange}
                />}
                {
                    showTimePicker && <DateTimePicker 
                    mode={"time"}
                    value={date}
                    onChange={handleTimeChange}
                />
                }
                </View>
                <Text>{`${date}`}</Text>
                <TouchableHighlight onPress={()=> setShowDatePicker(true)}>
                    <Text>Show Date Picker</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={()=> setShowTimePicker(true)}>
                    <Text>Show Time Picker</Text>
                </TouchableHighlight>

                <TouchableHighlight onPress={handleFeedOnSetTime}>
                    <Text>Set feed time</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={()=> setDateModalOpen(false)}>
                    <Text>Close</Text>
                </TouchableHighlight>
            </View>
        </View>
    </Modal>
}

export default DeviceScreen

const styles = StyleSheet.create({})