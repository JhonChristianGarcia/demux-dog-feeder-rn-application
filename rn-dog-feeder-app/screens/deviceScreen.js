import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Image, TouchableOpacity, Modal, Switch, FlatList, ScrollView , TextInput, ImageBackground} from 'react-native'
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';

import { useEffect, useState, useRef } from 'react';
import React from 'react'
import { db } from './home';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'
// import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome, FontAwesome6, AntDesign, Feather, MaterialIcons, Ionicons} from '@expo/vector-icons';



// // Enable offline persistence
// firestore().settings({
//   persistence: true,
// });

const DeviceScreen = ({route}) => {

    const [dateModalOpen, setDateModalOpen] = useState(false)
    const [motorState, setMotorState] = useState(null);
    const [portionSelected, setPortionSelected] = useState(1);
    const [feedTimeModalOn, setFeedTimeModalOn] = useState(false)
    const [reccuringScheduleVisible, setReccurringScheduleVisible] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
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

    function handleInfoModal(){
        setInfoModalOpen(state=> !state)
    }
    function handleFeedTimeModal(){
        setFeedTimeModalOn(state=> !state)
    }

    function handleReccurringModalOn(){
        setReccurringScheduleVisible(state=> !state)
    }
    
    (async function () {
        const initialMotorState = await getDoc(deviceRef);
        setMotorState(initialMotorState.data().motorOn);
        // console.log(initialMotorState.data())
    })();

   
 
    function updateMotorState(){
        updateDoc(deviceRef, {
            motorOn: !motorState
        }).then(()=> {
            alert("Your dog has been fed!")
        })
        setTimeout(()=> {
            updateDoc(deviceRef, {
                motorOn: false 
            })
        }, portionSelected * 1000)
    }
    
    return <SafeAreaView >
        <View style={{flexDirection: "row", alignItems: "center", justifyContent:"space-around", height: "15%", }}>
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

        

            <TouchableOpacity style={{width: "90%", backgroundColor: "#FFF", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={handleReccurringModalOn}>
                 <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Set Scheduled Feeding</Text>
            </TouchableOpacity> 

            <TouchableOpacity style={{width: "90%", backgroundColor: "#FFF", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={()=> setDateModalOpen(true)}>
            <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: 18, padding: 5}}>Set Custom Date</Text>
            </TouchableOpacity> 

          
            <CalendarModal dateModalOpen={dateModalOpen} setDateModalOpen={setDateModalOpen} updateMotorState={updateMotorState} deviceRef={deviceRef}/>

            <Portion portionSelected={portionSelected} setPortionSelected={setPortionSelected} deviceRef={deviceRef} handleInfoModal={handleInfoModal} />
            <InformationModal infoModalOpen={infoModalOpen} handleInfoModal={handleInfoModal}/>
            <RecurringSchedule deviceRef={deviceRef} reccuringScheduleVisible={reccuringScheduleVisible} handleReccurringModalOn={handleReccurringModalOn}/>
            
            <FeedTimesModal feedTimeModalOn={feedTimeModalOn} handleFeedTimeModal={handleFeedTimeModal} feedTimes={feedTimes}/>
        </View>
        
    </SafeAreaView>
   
}


function InformationModal({infoModalOpen, handleInfoModal}){

    return (
        <Modal
  animationType='slide'
  transparent={true}
  visible={infoModalOpen}
>
  <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
    <View style={{backgroundColor: "#fff", height: 400, width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
      <TouchableOpacity onPress={handleInfoModal} style={{position: "absolute", top: 10, right: 10, zIndex: 1}}>
        <AntDesign name="closecircle" size={24} color="black" />
      </TouchableOpacity>
      <Image resizeMode="contain" style={{width: "100%", height: "100%"}} source={require("./../assets/images/portion.png")}></Image>
    </View>
  </View>
</Modal>
      )
}


function Schedule({item, deviceRef}){
    let existingSchedules = [];
    
    onSnapshot(deviceRef, docSnapshot=> {
        if(docSnapshot.exists()){
            // feedTime.push(docSnapshot.data().feedTimes)
            docSnapshot.data().reccuringSched.forEach(sched=> {
                existingSchedules.push(sched)
            })
            
        }
    })
    const [isActive, setIsActive] = useState(null)
    useEffect(()=> {
        getDoc(deviceRef).then(res=> {
            const [schedule] = res.data().reccuringSched.filter(sched=> sched.id === item.id);
            setIsActive(schedule.isOn)
        })
    }, [])
    

    function handleDeleteSchedule(){
        updateDoc(deviceRef, {
            reccuringSched: existingSchedules.filter(sched=> sched.id !== item.id)
        }).then(()=> console.log("Document deleted"))
    }

    if(!existingSchedules) return;
    const handleSwitch = function(){
        
        const setStateAsync = () => {
            return new Promise(resolve => {
                setIsActive(state=> {
                    resolve(!state)
                    return !state})
            })
           
        }
        setStateAsync().then(res=> {

    const updatedSched = existingSchedules.map(scheds=> {
            if(scheds.id === item.id){
                return {...scheds, isOn: res}
            }
            return scheds;
        })
        updateDoc(deviceRef, {
                reccuringSched: updatedSched
            })

        })
        
        
    }



    return <View style={{ height: 80, padding: 15, backgroundColor: "#fff", width: "95%", alignSelf: "center", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 10,  marginBottom: 10}}>
        <View>
             <Text style={{fontSize: 20, fontWeight: "600", color: "#262C28"}}>{item.time}</Text>
           <View style={{flexDirection: "row"}}>
           {
                item.repeat.length === 7 ? <Text style={{fontSize: 12}}>Everyday</Text> : item.repeat.map(day=> <Text style={{fontSize: 12, marginRight: 3}}>{day}</Text>)
            }
           </View>
        </View>
        <Text>Portion: {item.portion}</Text>
       <View style={{flexDirection: "row", justifyContent: "center", alignItems:"center"}}>
        <TouchableHighlight onPress={handleDeleteSchedule}>
         <MaterialIcons name="delete" size={24} color="#FF204E" />
        </TouchableHighlight>
            <Switch 
            trackColor={{false: '#262C28', true: '#00B14F'}}
            thumbColor={isActive ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={handleSwitch}
            value={isActive}/>
       </View>

      
    </View>
}

function RecurringSchedule({deviceRef, reccuringScheduleVisible, handleReccurringModalOn}){
    // const [isParentVisible, setIsParentVisible] = useState(reccuringScheduleVisible)

    const [addScheduleVisible, setAddScheduleVisible] = useState(false)
    

    let existingSchedules = [];
    onSnapshot(deviceRef, docSnapshot=> {
        if(docSnapshot.exists()){
            // feedTime.push(docSnapshot.data().feedTimes)
            docSnapshot.data().reccuringSched.forEach(sched=> {
                existingSchedules.push(sched)
            })
            
        }
    })

    function handleScheduleVisible(){
        setAddScheduleVisible(state=> !state);
    }
    return <Modal
    animationType='slide'
    transparent={true}
    visible={reccuringScheduleVisible}
    >
         <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
            <View style={{ backgroundColor: "#F5F5F5", height: 600, width: "90%",  justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", backgroundColor: "#35374B"}}>
                    <Text style={{alignSelf: "center", marginLeft: 10, color: "#fff", textTransform: "uppercase", fontSize: 16, fontWeight: "500"}}>Recurring Schedules</Text>
                    <TouchableOpacity style={{alignSelf: "flex-end", padding: 10}} onPress={handleReccurringModalOn}>
                     <AntDesign name="close" size={24} color="#fff" />
                   </TouchableOpacity>
                </View>
            
                <FlatList
                    data={existingSchedules}
                    renderItem={({item})=> <Schedule item={item} deviceRef={deviceRef} existingSchedules={existingSchedules}/>}
                    keyExtractor={(item)=> item.id}
                    style={{width: "100%", height: "80%"}}
                />
                <AddTimeSched isVisible={addScheduleVisible} handleVisibility ={handleScheduleVisible} deviceRef={deviceRef} existingSchedules={existingSchedules}/>
                <TouchableOpacity style={{padding: 20}} onPress={handleScheduleVisible}>
                     <AntDesign name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
}

function AddTimeSched({isVisible, handleVisibility, deviceRef}){
    const dates = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [pickedTime, setPickedTime] = useState(new Date());
    const [stringedTime, setStringedTime] = useState("")
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [datesSelected, setDatesSelected] = useState([]);
    const [portionSelected, setPortionSelected] = useState(1)
    const portions = [1,2,3,4,5,6,7]
 
 
    function handlePortionSelection(numSelected){
        setPortionSelected(numSelected)
    }
    let existingSchedules = [];
    onSnapshot(deviceRef, docSnapshot=> {
        if(docSnapshot.exists()){
            // feedTime.push(docSnapshot.data().feedTimes)
            docSnapshot.data().reccuringSched.forEach(sched=> {
                existingSchedules.push(sched)
            })
            
        }
    })

    function handleAddTimeSched(){
        if(datesSelected.length < 1) {
            alert("Please set day(s)")
            return;
        }
        const newTimeSched = {
            id: new Date().getTime(),
            repeat: [...datesSelected],
            time: stringedTime,
            isOn: true, 
            portion: portionSelected
        }
        updateDoc(deviceRef, {
            reccuringSched: [newTimeSched, ...existingSchedules]
        }).then(()=> {
            handleVisibility(false)
        })
    }
    function handleDateSelection(date){
        if(datesSelected.includes(date)) {
            const removed = datesSelected.filter(d=> d!==date);
            setDatesSelected(removed)
            return;
        }
        setDatesSelected(dates=> [...dates, date])
    }
    function handleTimeChange(event, selectedTime){
            const currentTime = selectedTime
            setPickedTime(new Date(currentTime));
            setStringedTime(`${new Date(currentTime).toLocaleTimeString()}`)
            setShowTimePicker(false)
        }
        
        // console.log(pickedTime)
    return <Modal
        animationType='slide'
        transparent={true}
        visible={isVisible}
        >
         <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
            <View style={{ backgroundColor: "#F5F5F5",height: 450,  width: "90%", borderRadius: 10, alignItems: "center",gap:35,  elevation: 8}}>
                 <TouchableOpacity style={{alignSelf: "flex-end", padding: 10}} onPress={handleVisibility}>
                    <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>

                <View style={{flexDirection: "row", gap: 10}}>
                {
                    dates.map(date=> {
                        return <TouchableOpacity key={date} onPress={()=> handleDateSelection(date)} style={datesSelected.includes(date) ? {padding: 5, borderWidth: 2, borderColor: "#41B06E", borderRadius: 10, backgroundColor: "#EEEEEE"} : {padding: 8}}>
                            <Text style={{color: "#262C28", fontSize: 14, fontWeight: "500"}}>{date}</Text>
                        </TouchableOpacity>
                    })
                }
                </View>
               <View style={{flexDirection: "row", justifyContent: "center", gap: 20, alignItems: "center"}}>
                <TouchableOpacity style={{backgroundColor: "#262C28", padding: 5, borderRadius: 5, flexDirection: "row", gap: 10, alignItems: "center", justifyContent:"center"}} onPress={()=> setShowTimePicker(true)}>
                    <AntDesign name="clockcircleo" size={18} color="#fff" />
                        <Text style={{color: "#fff"}}>Set time</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 16, fontWeight: "500"}}>{stringedTime || new Date().toLocaleTimeString()}</Text>
               </View>
                {
                    showTimePicker && <DateTimePicker
                    mode={"time"}
                    value={pickedTime}
                    onChange={handleTimeChange}
                    onTouchCancel={()=>setShowTimePicker(false)} 
                />
                }

                <View style={{height: 80, width: "80%"}}>
                <Text style={{marginBottom: 10, textTransform: "uppercase", color: "#262C28", fontSize: 14, fontWeight: "500"}}>Set Portion</Text>
                <ScrollView horizontal >
                <View style={{flexDirection: "row", gap: 40,height: 30 }}>
                  { 
                    portions.map((num)=> {
                        return <TouchableHighlight key={num} style={portionSelected === num ? portionStyle.selected : portionStyle.notSelected} onPress={()=> handlePortionSelection(num)}>
                            <Text style={portionSelected  === num ?portionStyle.textSelected : portionStyle.textNotSelected}>{num}</Text>
                        </TouchableHighlight>
                    })
                 }
                </View>
                </ScrollView>
                </View>
                <TouchableOpacity onPress={handleAddTimeSched} style={{padding:8, flexDirection: "row", gap: 5, justifyContent:"center", alignItems:"center", backgroundColor:"#262C28", borderRadius: 8}}>
                    <Feather name="save" size={20} color="#fff" />
                    <Text style={{textTransform: "uppercase", color: "#fff"}}>Save configuration</Text>
                </TouchableOpacity>

               
            </View>
        </View>
    </Modal>
}
function FeedTimesModal({feedTimeModalOn, handleFeedTimeModal, feedTimes}){
  
    return <Modal
    animationType='slide'
    transparent={true}
    visible={feedTimeModalOn}
    >
        <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
            
            <View style={{backgroundColor: "#fff", height: 480, width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
           
                <Text style={{textTransform: "uppercase", fontWeight: "bold", fontSize: 16}}>{feedTimes.length > 0 ? "Your dog's custom feeding schedules:" : "No Feeding Schedules Yet"}</Text>
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
                    <Text style={{color: "#fff", textTransform: "uppercase"}}>Close</Text>
                    {/* <AntDesign name="closesquare" size={24} color="red" />     */}
                    </View>
                </TouchableWithoutFeedback>
            </View>
     </View>
    </Modal>
}

function Portion({portionSelected,setPortionSelected, deviceRef,handleInfoModal }){
    const portions = [1,2,3,4,5,6,7]

    useEffect(()=>{
        updateDoc(deviceRef, {
            portion: portionSelected
        })
    }, [portionSelected]);

    return  <View style={{ width: "90%", justifyContent: "space-between", alignItems:"center", gap: 10}}>
    <View style={{flexDirection: "row", justifyContent:"center", alignItems: "center", gap: 10}}>
    <Text style={{textTransform: "uppercase"}}>Proportion</Text>
   <TouchableOpacity onPress={handleInfoModal}>
     <Ionicons name="information-circle" size={22} color="black" />
   </TouchableOpacity>
    </View>
     <ScrollView horizontal style={{width: "90%"}}>
        <View style={{flexDirection: "row", width: "90%",  gap: 50,  justifyContent: "space-between",}}>
        {portions.map(p => {
            return <TouchableOpacity onPress={() => setPortionSelected(p)} key={p}  >
                <View style={p===portionSelected ? portionStyle.selected : portionStyle.notSelected}>
                    <Text style={p===portionSelected ? portionStyle.textSelected : portionStyle.textNotSelected}>{p}</Text>
                </View>

            </TouchableOpacity>
        })}
        </View>
     </ScrollView>
</View>
}

const portionStyle = StyleSheet.create({
   
    selected:  {height: 30, width: 30, borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#000", color: "#fff"},
    notSelected:  {height: 30, width: 30,justifyContent: "center", alignItems: "center", color:"#000"},
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

