import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Image, TouchableOpacity, Modal } from 'react-native'
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';

import { useEffect, useState } from 'react';
import React from 'react'
import { db } from './home';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'
// import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome, FontAwesome6, AntDesign} from '@expo/vector-icons';

import { ScrollView } from 'react-native-gesture-handler';

// // Enable offline persistence
// firestore().settings({
//   persistence: true,
// });

const DeviceScreen = ({route}) => {

    const [dateModalOpen, setDateModalOpen] = useState(false)
    const [motorState, setMotorState] = useState(null);
    const [portionSelected, setPortionSelected] = useState(1);
    const [feedTimeModalOn, setFeedTimeModalOn] = useState(false)
    const navigator = useNavigation();
    const {device} = route.params;
    const deviceRef = doc(db, "device-feeder", device); 

    const [feedTimes, setFeedTimes] = useState([]);
    useEffect(()=>{
        onSnapshot(deviceRef, docSnapshot=> {
            if(docSnapshot.exists()){
                // feedTime.push(docSnapshot.data().feedTimes)
                docSnapshot.data().feedTimes.forEach(time=> {
                    setFeedTimes(times=> {
                        return [time, ...times.filter(t=> t != time)]
                    })
                })
                
            }
        })

    }, [])


    function handleFeedTimeModal(){
        setFeedTimeModalOn(state=> !state)
    }
    
    (async function () {
        const initialMotorState = await getDoc(deviceRef);
        setMotorState(initialMotorState.data().motorOn);
        // console.log(initialMotorState.data())
    })();

   
 
    function updateMotorState(){
        updateDoc(deviceRef, {
            motorOn: !motorState
        })
        setTimeout(()=> {
            updateDoc(deviceRef, {
                motorOn: false 
            })
        }, portionSelected * 1000)
    }
    
    return <SafeAreaView >
        <View style={{flexDirection: "row", alignItems: "center", justifyContent:"space-around", height: "15%"}}>
            <TouchableWithoutFeedback onPress={()=> navigator.navigate("Home")}>
             <Text style={{textTransform: "uppercase", color: "#000", fontSize: 70, fontWeight: "300", padding:10, paddingBottom: 20}}>&#8249;</Text>
            </TouchableWithoutFeedback>
            <View style={{flex:1, justifyContent: "center",  alignItems:"center", height: 100}}>
                <Text style={{fontSize: 18, fontWeight: "700", textTransform: "uppercase"}}>Demux Dog Feeder</Text>
            </View>
            <TouchableHighlight onPress={handleFeedTimeModal} style={{marginRight: 10}}>
                <FontAwesome5 name="user-clock" size={22} color="black" />
            </TouchableHighlight>
        </View>

        <View style={{justifyContent: "center", alignItems:"center"}}>
            <Text>Device ID: {device}</Text>
            <Image style={{width: 200,  height: 280}} source={require("../assets/images/feeder1.png")} resizeMode='contain'></Image>
        </View>

        <View style={{justifyContent:"center", alignItems: "center",  height: 300, width: "100%", gap: 10}}>
            <TouchableOpacity style={{ width: "90%", backgroundColor: "#000", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={updateMotorState}>
            <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Feed now</Text>
            </TouchableOpacity> 

        
            <TouchableOpacity style={{width: "90%", backgroundColor: "#FFF", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={()=> setDateModalOpen(true)}>
            <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Set Feeding Time</Text>
            </TouchableOpacity> 
            <CalendarModal dateModalOpen={dateModalOpen} setDateModalOpen={setDateModalOpen} updateMotorState={updateMotorState} deviceRef={deviceRef}/>

            <Portion portionSelected={portionSelected} setPortionSelected={setPortionSelected} deviceRef={deviceRef}/>
            <FeedTimesModal feedTimeModalOn={feedTimeModalOn} handleFeedTimeModal={handleFeedTimeModal} feedTimes={feedTimes}/>
        </View>
        
    </SafeAreaView>
   
}


function FeedTimesModal({feedTimeModalOn, handleFeedTimeModal, feedTimes}){
  
    return <Modal
    animationType='slide'
    transparent={true}
    visible={feedTimeModalOn}
    >
        <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
            
            <View style={{backgroundColor: "#fff", height: 480, width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
           
                <Text style={{textTransform: "uppercase", fontWeight: "bold", fontSize: 18}}>{feedTimes.length > 0 ? "Your dog's feeding schedules:" : "No Feeding Schedules Yet"}</Text>
                    {feedTimes?.sort((a,b)=> a-b).map((time, i)=> {
                        const timeStr = new Date(time).toLocaleTimeString()
                        const dateStr = new Date(time).toDateString()
                        const combinedStr = `${dateStr} ${timeStr}`
                    return <View key={i} style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <AntDesign name="arrowright" size={18} color="black" />
                        <Text style={{ marginLeft: 8, fontWeight: "bold", fontSize: 16}}>{combinedStr}</Text>
                    </View>}) 
                    }
                 <TouchableWithoutFeedback onPress={handleFeedTimeModal}>
                    <View style={{flexDirection: "row", backgroundColor: "black", paddingLeft: 20, paddingRight: 20, padding: 5}}>
                    <Text style={{color: "#fff"}}>Close</Text>
                    {/* <AntDesign name="closesquare" size={24} color="red" />     */}
                    </View>
                </TouchableWithoutFeedback>
            </View>
     </View>
    </Modal>
}

function Portion({portionSelected,setPortionSelected, deviceRef }){
    const portions = [1,2,3,4,5]

    useEffect(()=>{
        updateDoc(deviceRef, {
            portion: portionSelected
        })
    }, [portionSelected]);

    return  <View style={{ width: "90%", justifyContent: "space-between", alignItems:"center", gap: 10}}>
    <Text style={{textTransform: "uppercase"}}>Proportion</Text>
     <View style={{flexDirection: "row", width: "90%",  justifyContent: "space-between", gap:10}}>
        {portions.map(p => {
            return <TouchableOpacity onPress={() => setPortionSelected(p)} key={p} style={{flex:1}} >
                <View style={p===portionSelected ? portionStyle.selected : portionStyle.notSelected}>
                    <Text style={p===portionSelected ? portionStyle.textSelected : portionStyle.textNotSelected}>{p}</Text>
                </View>

            </TouchableOpacity>
        })}
     </View>
</View>
}

const portionStyle = StyleSheet.create({
   
    selected:  {height: 30, borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#000", color: "#fff"},
    notSelected:  {height: 30, justifyContent: "center", alignItems: "center", color:"#000"},
    textSelected: {color: "#fff"},
    textNotSelected: {color: "#000"}
})

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

    let feedTime = [];
    onSnapshot(deviceRef, docSnapshot=> {
        if(docSnapshot.exists()){
            // feedTime.push(docSnapshot.data().feedTimes)
            docSnapshot.data().feedTimes.forEach(time=> {
                feedTime.push(time)
            })
            
        }
    })
    

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
        feedTimes: [...feedTime, time]
    }).then(getDoc(deviceRef).then(res=> {
        if(res.data().feedTimes.length < 1) return;
        setFeedTimes(res.data().feedTimes.filter(times=> times > Date.now()));
        alert("Added feeding schedule successfully")
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
                    onTouchCancel={()=>setShowDatePicker(false)}
                />}
                {
                    showTimePicker && <DateTimePicker 
                    mode={"time"}
                    value={date}
                    onChange={handleTimeChange}
                    onTouchCancel={()=>setShowTimePicker(false)} 
                />
                }
                </View>
                <Text style={{}}>{`${date.toDateString()} ${time.toLocaleTimeString()}`}</Text>
                <View style={{flexDirection: "row", gap: 10, width: "60%", justifyContent: "space-between"}}>

                <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={()=> setShowDatePicker(true)}>
                    <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 14, padding: 5}}>Set date</Text>
                </TouchableOpacity> 

                <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={()=> setShowTimePicker(true)}>
                    <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 14, padding: 5}}>Set time</Text>
                </TouchableOpacity> 

                
                </View>

                <TouchableOpacity style={{backgroundColor: "#fff", borderWidth: 1, padding: 10, alignItems: "center", width: "60%"}} onPress={handleFeedOnSetTime}>
                     <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 14, padding: 5}}>Add feeding schedule</Text>
              </TouchableOpacity> 


              <TouchableOpacity style={{backgroundColor: "#000", borderWidth: 1, padding: 10, alignItems: "center", width: "60%"}} onPress={()=> setDateModalOpen(false)}>
                     <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: 14, padding: 5}}>Close</Text>
              </TouchableOpacity> 

              
            </View>
        </View>
    </Modal>
}

export default DeviceScreen

