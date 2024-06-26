import { StyleSheet, Text, View, TouchableHighlight, Pressable, TouchableWithoutFeedback, Image, TouchableOpacity, Modal, Switch, FlatList, ScrollView , TextInput, ImageBackground} from 'react-native'
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';

import { useEffect, useState, useRef } from 'react';
import React from 'react'
import { db } from './home';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'
// import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome, FontAwesome6, AntDesign, Feather, MaterialIcons, Ionicons, Entypo} from '@expo/vector-icons';
import { horizontalScale, verticalScale, moderateScale } from "./../utils/sizeModerator"


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
    const [weight, setWeight] = useState(null);
    const [containerModalOpen, setContainerModalOpen] = useState(false);


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
        // setTimeout(()=> {
        //     updateDoc(deviceRef, {
        //         motorOn: false 
        //     })
        // }, portionSelected * 1000)
    }
        useEffect(()=> {
        onSnapshot(deviceRef, docSnapshot=> {
            if(docSnapshot.exists()){
                // feedTime.push(docSnapshot.data().feedTimes)
                const weight = docSnapshot.data()?.weight
                setWeight(Math.abs(weight).toFixed(2))
            }
        })
    }, [weight]);

    return <SafeAreaView >
        <View style={{flexDirection: "row", alignItems: "center", justifyContent:"space-around", height: "15%", }}>
            <TouchableWithoutFeedback onPress={()=> navigator.navigate("Home")}>
             <Text style={{textTransform: "uppercase", color: "#000", fontSize: moderateScale(60), fontWeight: "300", padding:10, paddingBottom: 20}}>&#8249;</Text>
            </TouchableWithoutFeedback>
            <View style={{flex:1, justifyContent: "center",  alignItems:"center", height: 100}}>
                <Text style={{fontSize: moderateScale(16), fontWeight: "700", textTransform: "uppercase"}}>Demux Dog Feeder</Text>
            </View>
            <View style={{flexDirection: "row", gap: 10}}>
                <Pressable onPress={()=> setContainerModalOpen(true)}>
                    <FontAwesome6 name="inbox" size={24} color="black" />
                </Pressable>
                <TouchableHighlight onPress={handleFeedTimeModal} style={{marginRight: horizontalScale(10)}}>
                    <FontAwesome5 name="user-clock" size={moderateScale(20)} color="black" />
                </TouchableHighlight>
            </View>
        </View>

        <View style={{justifyContent: "center", alignItems:"center"}}>
           <View style={{flexDirection: "row-reverse", gap: moderateScale(10)}}>
           <TouchableOpacity onPress={()=> navigator.navigate("Camera")}>
            <Entypo name="video-camera" size={moderateScale(18)} color="black" />
            </TouchableOpacity>
            <Text style={{fontSize: moderateScale(14), fontWeight: "500", textTransform: "uppercase"}}>Device ID: {device}</Text>
           </View>
           <View style={{width:"100%",justifyContent: "center", alignItems:"center", }}>
           <Image style={{width: horizontalScale(180),  height: verticalScale(320)}}  source={require("../assets/images/frontfinal1.png")} resizeMode='contain'></Image>

           </View>
        </View>

        <View style={{justifyContent:"center", alignItems: "center",  height: verticalScale(280), width: "100%", gap: moderateScale(10)}}>
            <TouchableOpacity style={{ width: "90%", backgroundColor: "#000", borderWidth: 2, padding: moderateScale(10), alignItems: "center"}} onPress={updateMotorState}>
                 <Text style={{color:"#fff", textTransform:"uppercase", fontWeight: "bold", fontSize: moderateScale(16), padding: moderateScale(5)}}>Feed now</Text>
            </TouchableOpacity> 

        

            <TouchableOpacity style={{width: "90%", backgroundColor: "#FFF", borderWidth: 2, padding: moderateScale(10), alignItems: "center"}} onPress={handleReccurringModalOn}>
                 <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: moderateScale(16), padding: 5}}>Set Scheduled Feeding</Text>
            </TouchableOpacity> 

            <TouchableOpacity style={{width: "90%", backgroundColor: "#FFF", borderWidth: 2, padding: 10, alignItems: "center"}} onPress={()=> setDateModalOpen(true)}>
            <Text style={{color:"#000", textTransform:"uppercase", fontWeight: "bold", fontSize: moderateScale(16), padding: 5}}>Set Custom Date</Text>
            </TouchableOpacity> 

          
            <CalendarModal dateModalOpen={dateModalOpen} setDateModalOpen={setDateModalOpen} updateMotorState={updateMotorState} deviceRef={deviceRef}/>

            <Portion portionSelected={portionSelected} setPortionSelected={setPortionSelected} deviceRef={deviceRef} handleInfoModal={handleInfoModal} />
            <FoodContainerModal containerModalOpen={containerModalOpen} setContainerModalOpen={setContainerModalOpen} weight={weight}/>

            <InformationModal infoModalOpen={infoModalOpen} handleInfoModal={handleInfoModal}/>
            <RecurringSchedule deviceRef={deviceRef} reccuringScheduleVisible={reccuringScheduleVisible} handleReccurringModalOn={handleReccurringModalOn}/>
            
            <FeedTimesModal feedTimeModalOn={feedTimeModalOn} handleFeedTimeModal={handleFeedTimeModal} feedTimes={feedTimes}/>
        </View>
        
    </SafeAreaView>
   
}


function FoodContainerModal({containerModalOpen, setContainerModalOpen, weight}){
    function closeModal(){
        setContainerModalOpen(false)
    }
    let imgSrc = require(`./../assets/images/${1}.png`);
    if(weight <= 4){
        imgSrc = require(`./../assets/images/${1}.png`);
    }
    if(weight <= 15 && weight > 4){
        imgSrc = require(`./../assets/images/${2}.png`);
    }
    if(weight <= 70 && weight > 15){
        imgSrc = require(`./../assets/images/${3}.png`);

    }
    if(weight <= 90 && weight > 70){
        imgSrc = require(`./../assets/images/${4}.png`);
    }
    if(weight <= 120 && weight > 90){
        imgSrc = require(`./../assets/images/${5}.png`);

    }
    if(weight > 120){
        imgSrc = require(`./../assets/images/${6}.png`);
    }

    return (
        <Modal
  animationType='slide'
  transparent={true}
  visible={containerModalOpen}
>
  <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
    <View style={{backgroundColor: "#fff", height: verticalScale(380), width: "90%", borderRadius: moderateScale(10), justifyContent: "center", alignItems: "center", gap:moderateScale(5),  elevation: 8}}>
      <TouchableHighlight onPress={closeModal} style={{position: "absolute", top: 15, right: 15, zIndex: 1}}>
        <AntDesign name="closecircle" size={moderateScale(22)} color="black" />
      </TouchableHighlight>

      <View style={{width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
        <View style={{flex:3}}>
            <Image resizeMode="contain" style={{flex:1}}  source={imgSrc}></Image>
        </View>
        <View style={{flex:1, flexDirection: "row", gap: 10}}>
        <FontAwesome name="paw" size={24} color="black" />
            <Text style={{fontSize: 18, fontWeight:"600"}}>Food Remaining: {weight}g</Text>
        </View>
        
      </View>
    </View>
  </View>
</Modal>
      )
}

function InformationModal({infoModalOpen, handleInfoModal}){

    return (
        <Modal
  animationType='slide'
  transparent={true}
  visible={infoModalOpen}
>
  <View style={{flex:1, justifyContent: "center", alignItems: "center",}}>
    <View style={{backgroundColor: "#fff", height: verticalScale(350), width: "90%", borderRadius: moderateScale(2), justifyContent: "center", alignItems: "center", gap:moderateScale(5),  elevation: 8}}>
      <TouchableOpacity onPress={handleInfoModal} style={{position: "absolute", top: 10, right: 10, zIndex: 1}}>
        <AntDesign name="closecircle" size={moderateScale(22)} color="black" />
      </TouchableOpacity>
      <Image resizeMode="contain" style={{width: "100%", height: "100%"}} source={require("./../assets/images/portion1.png")}></Image>
    </View>
  </View>
</Modal>
      )
}


function Schedule({item, deviceRef, setDeleteCount}){
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
        }).then(()=>{ 
            setDeleteCount(count=> count+1)
            console.log("Document deleted")
            
        })
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



    return <View style={{ height: verticalScale(80), padding: 15, backgroundColor: "#fff", width: "95%", alignSelf: "center", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: moderateScale(10),  marginBottom: 10}}>
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
    const [addScheduleVisible, setAddScheduleVisible] = useState(false);
    const [deleteCount, setDeleteCount] = useState(0);
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
            <View style={{ backgroundColor: "#F5F5F5", height: verticalScale(600), width: "90%",  justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", backgroundColor: "#35374B"}}>
                    <Text style={{alignSelf: "center", marginLeft: 10, color: "#fff", textTransform: "uppercase", fontSize: moderateScale(15), fontWeight: "500"}}>Recurring Schedules</Text>
                    <TouchableOpacity style={{alignSelf: "flex-end", padding: 10}} onPress={handleReccurringModalOn}>
                     <AntDesign name="close" size={moderateScale(22)} color="#fff" />
                   </TouchableOpacity>
                </View>
            
                <FlatList
                    data={existingSchedules}
                    renderItem={({item})=> <Schedule item={item} deviceRef={deviceRef} setDeleteCount={setDeleteCount} />}
                    keyExtractor={(item, i)=> i}
                    style={{width: "100%", height: "80%"}}
                />
                <AddTimeSched isVisible={addScheduleVisible} handleVisibility ={handleScheduleVisible} deviceRef={deviceRef} existingSchedules={existingSchedules}/>
                <TouchableOpacity style={{padding: 20}} onPress={handleScheduleVisible}>
                     <AntDesign name="pluscircleo" size={moderateScale(38)} color="black" />
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
    const portions = [1,2,3,4,5,6,7,8,9,10]
 
 
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
        if(stringedTime === ""){
            alert("Please set time");
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
            <View style={{ backgroundColor: "#F5F5F5",height: verticalScale(450),  width: "90%",  alignItems: "center",gap:35,  elevation: 8}}>
                 <View style={{flexDirection: "row", justifyContent: "center", alignItems:"center", backgroundColor: "#262C28"}}>
                    <View style={{flex: 5,  justifyContent:"center", alignItems:"center", }}>
                        <Text style={{fontSize: moderateScale(14), fontWeight: "600", textTransform: "uppercase", color: "#FFF"}}>Add Time Schedule</Text>
                    </View>
                    <TouchableOpacity style={{alignSelf: "flex-end", padding: 10,}} onPress={handleVisibility}>
                        <AntDesign name="close" size={moderateScale(22)} color="#fff" />
                    </TouchableOpacity>
                 </View>

                <View style={{flexDirection: "row", gap: 10, width: "100%", alignItems:"center", justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#262C28", borderTopWidth: 1, borderTopColor: "#262C28", paddingVertical: horizontalScale(10)}}>
                {
                    dates.map(date=> {
                        return <TouchableOpacity key={date} onPress={()=> handleDateSelection(date)} style={datesSelected.includes(date) ? {padding: 5, borderWidth: 2, borderColor: "#41B06E", borderRadius: 10, backgroundColor: "#EEEEEE"} : {padding: 8}}>
                            <Text style={{color: "#262C28", fontSize: moderateScale(14), fontWeight: "500"}}>{date}</Text>
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

                <View style={{height: verticalScale(90), width: "80%"}}>
                <Text style={{marginBottom: 10, textTransform: "uppercase", color: "#262C28", fontSize: 14, fontWeight: "500"}}>Set Portion</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection: "row", gap: 40,height: verticalScale(30) }}>
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
            
            <View style={{backgroundColor: "#FFF", height: verticalScale(480), width: "90%", borderRadius: 10, justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
           
                <Text style={{textTransform: "uppercase", fontWeight: "bold", fontSize: 16}}>{feedTimes.length > 0 ? "Your dog's custom feeding schedules:" : "No Feeding Schedules Yet"}</Text>
                    {feedTimes?.sort((a,b)=> a-b).map((time, i)=> {
                        const timeStr = new Date(time).toLocaleTimeString()
                        const dateStr = new Date(time).toDateString()
                        const combinedStr = `${dateStr} ${timeStr}`
                    return <View key={i} style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <AntDesign name="arrowright" size={18} color="black" />
                        <Text style={{ marginLeft: 8, fontWeight: "bold", fontSize: moderateScale(16)}}>{combinedStr}</Text>
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
    const portions = [1,2,3,4,5,6,7,8,9,10]

    useEffect(()=>{
        updateDoc(deviceRef, {
            portion: portionSelected
        })
    }, [portionSelected]);

    return  <View style={{ width: "90%", justifyContent: "space-between", alignItems:"center", gap: 10}}>
    <View style={{flexDirection: "row", justifyContent:"center", alignItems: "center", gap: 10}}>
    <Text style={{textTransform: "uppercase"}}>Proportion</Text>
   <TouchableOpacity onPress={handleInfoModal}>
     <Ionicons name="information-circle" size={moderateScale(22)} color="black" />
   </TouchableOpacity>
    </View>
     <ScrollView horizontal style={{width: "90%"}} showsHorizontalScrollIndicator={false}>
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
            <View style={{backgroundColor: "#fff", height: verticalScale(380), width: "90%", justifyContent: "center", alignItems: "center", gap:20,  elevation: 8}}>
              
                <View>
                {showDatePicker && <DateTimePicker 
                    mode={'date'}
                    value={date || new Date()}
                    onChange={handleDateChange}
                    onTouchCancel={()=> setShowDatePicker(false) }
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

