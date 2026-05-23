import { StyleSheet, Text, View, TouchableHighlight, TouchableWithoutFeedback, Image, TouchableOpacity, Modal, Switch, FlatList, ScrollView, TextInput, ImageBackground, Pressable} from 'react-native'
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue} from 'firebase/firestore';

import { useEffect, useState, useRef } from 'react';
import React from 'react'
import { db } from './home';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'
// import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome, FontAwesome6, AntDesign, Feather, MaterialIcons, Ionicons, Entypo, MaterialCommunityIcons} from '@expo/vector-icons';
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
    const [containerModalOpen, setContainerModalOpen] = useState(false);
    const navigator = useNavigation();
    const {device} = route.params;
    const deviceRef = doc(db, "device-feeder", device); 
    const [weight, setWeight] = useState(null);
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

    useEffect(()=> {
        onSnapshot(deviceRef, docSnapshot=> {
            if(docSnapshot.exists()){
                // feedTime.push(docSnapshot.data().feedTimes)
                const weight = docSnapshot.data()?.weight
                setWeight(Math.abs(weight).toFixed(2))
            }
        })
    }, [weight]);

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
    
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=> navigator.navigate("Home")} style={styles.headerIconBtn}>
                    <AntDesign name="arrowleft" size={22} color="#2D2D2D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Demux Dog Feeder</Text>
                <View style={styles.headerRight}>
                    <Pressable onPress={()=> setContainerModalOpen(true)} style={styles.headerIconBtn}>
                        <FontAwesome6 name="inbox" size={20} color="#2D2D2D" />
                    </Pressable>
                    <TouchableOpacity onPress={handleFeedTimeModal} style={styles.headerIconBtn}>
                        <FontAwesome5 name="user-clock" size={18} color="#2D2D2D" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Device meta */}
                <View style={styles.deviceMeta}>
                    <Text style={styles.deviceIdText}>ID: {device}</Text>
                    <TouchableOpacity onPress={()=> navigator.navigate("Camera")} style={styles.cameraChip}>
                        <Entypo name="video-camera" size={13} color="#C17B4E" />
                        <Text style={styles.cameraChipText}>Live Feed</Text>
                    </TouchableOpacity>
                </View>

                {/* Device image */}
                <View style={styles.deviceImageCard}>
                    <Image
                        style={styles.deviceMainImage}
                        source={require("../assets/images/frontfinal1.png")}
                        resizeMode='contain'
                    />
                </View>

                {/* Action buttons */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.feedNowBtn} onPress={updateMotorState}>
                        <MaterialCommunityIcons name="food-drumstick" size={20} color="#FFF" />
                        <Text style={styles.feedNowBtnText}>Feed Now</Text>
                    </TouchableOpacity>

                    <View style={styles.secondaryBtnsRow}>
                        <TouchableOpacity style={styles.outlineBtn} onPress={handleReccurringModalOn}>
                            <AntDesign name="clockcircleo" size={15} color="#4A3728" />
                            <Text style={styles.outlineBtnText}>Scheduled{"\n"}Feeding</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.outlineBtn} onPress={()=> setDateModalOpen(true)}>
                            <AntDesign name="calendar" size={15} color="#4A3728" />
                            <Text style={styles.outlineBtnText}>Custom{"\n"}Date</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Portion selector */}
                <Portion portionSelected={portionSelected} setPortionSelected={setPortionSelected} deviceRef={deviceRef} handleInfoModal={handleInfoModal} />
            </ScrollView>

            {/* Modals */}
            <CalendarModal dateModalOpen={dateModalOpen} setDateModalOpen={setDateModalOpen} updateMotorState={updateMotorState} deviceRef={deviceRef}/>
            <FoodContainerModal containerModalOpen={containerModalOpen} setContainerModalOpen={setContainerModalOpen} weight={weight}/>
            <InformationModal infoModalOpen={infoModalOpen} handleInfoModal={handleInfoModal}/>
            <RecurringSchedule deviceRef={deviceRef} reccuringScheduleVisible={reccuringScheduleVisible} handleReccurringModalOn={handleReccurringModalOn}/>
            <FeedTimesModal feedTimeModalOn={feedTimeModalOn} handleFeedTimeModal={handleFeedTimeModal} feedTimes={feedTimes}/>
        </SafeAreaView>
    )
}


function InformationModal({infoModalOpen, handleInfoModal}){
    return (
        <Modal animationType='slide' transparent={true} visible={infoModalOpen}>
            <View style={styles.modalBackdrop}>
                <View style={[styles.modalCard, {padding: 0, overflow: 'hidden'}]}>
                    <TouchableOpacity onPress={handleInfoModal} style={styles.modalCloseAbsolute}>
                        <AntDesign name="closecircle" size={moderateScale(22)} color="#4A3728" />
                    </TouchableOpacity>
                    <Image resizeMode="contain" style={{width: '100%', height: verticalScale(350)}} source={require("./../assets/images/portion1.png")} />
                </View>
            </View>
        </Modal>
    )
}

function FoodContainerModal({containerModalOpen, setContainerModalOpen, weight}){
    function closeModal(){ setContainerModalOpen(false) }
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
        <Modal animationType='slide' transparent={true} visible={containerModalOpen}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                    <TouchableOpacity onPress={closeModal} style={styles.modalCloseAbsolute}>
                        <AntDesign name="closecircle" size={moderateScale(22)} color="#4A3728" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Food Container</Text>
                    <Image resizeMode="contain" style={{width: '100%', height: verticalScale(240)}} source={imgSrc} />
                    <View style={styles.foodWeightRow}>
                        <FontAwesome name="paw" size={20} color="#C17B4E" />
                        <Text style={styles.foodWeightText}>Food Remaining: {weight}g</Text>
                    </View>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
                        <Text style={styles.modalCloseBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


function Schedule({item, deviceRef, setDeleteCount}){
    let existingSchedules = [];
    onSnapshot(deviceRef, docSnapshot=> {
        if(docSnapshot.exists()){
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
            updateDoc(deviceRef, { reccuringSched: updatedSched })
        })
    }

    return (
        <View style={styles.scheduleItem}>
            <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTime}>{item.time}</Text>
                <View style={styles.scheduleDays}>
                    {item.repeat.length === 7
                        ? <Text style={styles.scheduleDayText}>Everyday</Text>
                        : item.repeat.map((day, i)=> <Text key={i} style={styles.scheduleDayText}>{day} </Text>)
                    }
                </View>
            </View>
            <View style={styles.schedulePortionBadge}>
                <Text style={styles.schedulePortionText}>×{item.portion}</Text>
            </View>
            <View style={styles.scheduleActions}>
                <TouchableOpacity onPress={handleDeleteSchedule} style={{padding: 4}}>
                    <MaterialIcons name="delete-outline" size={22} color="#FF204E" />
                </TouchableOpacity>
                <Switch
                    trackColor={{false: '#E8E0D8', true: '#4CAF50'}}
                    thumbColor={'#FFFFFF'}
                    onValueChange={handleSwitch}
                    value={isActive}
                />
            </View>
        </View>
    )
}

function RecurringSchedule({deviceRef, reccuringScheduleVisible, handleReccurringModalOn}){
    const [addScheduleVisible, setAddScheduleVisible] = useState(false);
    const [deleteCount, setDeleteCount] = useState(0);
    let existingSchedules = [];
    onSnapshot(deviceRef, docSnapshot=> {
        if(docSnapshot.exists()){
            docSnapshot.data().reccuringSched.forEach(sched=> {
                existingSchedules.push(sched)
            })
        }
    })

    function handleScheduleVisible(){
        setAddScheduleVisible(state=> !state);
    }

    return (
        <Modal animationType='slide' transparent={true} visible={reccuringScheduleVisible}>
            <View style={styles.modalBackdrop}>
                <View style={[styles.modalCard, {height: verticalScale(600), padding: 0, overflow: 'hidden'}]}>
                    <View style={styles.darkModalHeader}>
                        <Text style={styles.darkModalHeaderTitle}>Recurring Schedules</Text>
                        <TouchableOpacity style={{padding: 12}} onPress={handleReccurringModalOn}>
                            <AntDesign name="close" size={moderateScale(20)} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={existingSchedules}
                        renderItem={({item})=> <Schedule item={item} deviceRef={deviceRef} setDeleteCount={setDeleteCount} />}
                        keyExtractor={(item, i)=> String(i)}
                        style={{width: "100%", flex: 1}}
                        contentContainerStyle={{paddingVertical: 10}}
                    />
                    <AddTimeSched isVisible={addScheduleVisible} handleVisibility={handleScheduleVisible} deviceRef={deviceRef} existingSchedules={existingSchedules}/>
                    <TouchableOpacity style={styles.addScheduleBtn} onPress={handleScheduleVisible}>
                        <AntDesign name="plus" size={18} color="#FFF" />
                        <Text style={styles.addScheduleBtnText}>Add Schedule</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
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

    return (
        <Modal animationType='slide' transparent={true} visible={isVisible}>
            <View style={styles.modalBackdrop}>
                <View style={[styles.modalCard, {height: verticalScale(450), padding: 0, overflow: 'hidden'}]}>
                    <View style={styles.darkModalHeader}>
                        <Text style={styles.darkModalHeaderTitle}>Add Time Schedule</Text>
                        <TouchableOpacity style={{padding: 12}} onPress={handleVisibility}>
                            <AntDesign name="close" size={moderateScale(20)} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.addSchedBody}>
                        {/* Day selector */}
                        <View style={styles.daySelector}>
                            {dates.map(date=> (
                                <TouchableOpacity
                                    key={date}
                                    onPress={()=> handleDateSelection(date)}
                                    style={datesSelected.includes(date) ? styles.daySelected : styles.dayUnselected}
                                >
                                    <Text style={datesSelected.includes(date) ? styles.dayTextSelected : styles.dayTextUnselected}>{date}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Time picker */}
                        <View style={styles.timePickerRow}>
                            <TouchableOpacity style={styles.setTimeBtn} onPress={()=> setShowTimePicker(true)}>
                                <AntDesign name="clockcircleo" size={15} color="#FFF" />
                                <Text style={styles.setTimeBtnText}>Set time</Text>
                            </TouchableOpacity>
                            <Text style={styles.selectedTimeText}>{stringedTime || new Date().toLocaleTimeString()}</Text>
                        </View>
                        {showTimePicker && (
                            <DateTimePicker
                                mode={"time"}
                                value={pickedTime}
                                onChange={handleTimeChange}
                                onTouchCancel={()=>setShowTimePicker(false)}
                            />
                        )}

                        {/* Portion */}
                        <View style={styles.addSchedPortionSection}>
                            <Text style={styles.addSchedPortionLabel}>Set Portion</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{flexDirection: "row", gap: 10}}>
                                    {portions.map((num)=> (
                                        <TouchableOpacity
                                            key={num}
                                            style={portionSelected === num ? portionStyle.selected : portionStyle.notSelected}
                                            onPress={()=> handlePortionSelection(num)}
                                        >
                                            <Text style={portionSelected === num ? portionStyle.textSelected : portionStyle.textNotSelected}>{num}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Save */}
                        <TouchableOpacity onPress={handleAddTimeSched} style={styles.saveSchedBtn}>
                            <Feather name="save" size={18} color="#FFF" />
                            <Text style={styles.saveSchedBtnText}>Save Configuration</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
function FeedTimesModal({feedTimeModalOn, handleFeedTimeModal, feedTimes}){
    return (
        <Modal animationType='slide' transparent={true} visible={feedTimeModalOn}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>
                        {feedTimes.length > 0 ? "Feeding Schedules" : "No Schedules Yet"}
                    </Text>
                    <ScrollView style={{width: '100%', maxHeight: verticalScale(280)}} showsVerticalScrollIndicator={false}>
                        {feedTimes?.sort((a,b)=> a-b).map((time, i)=> {
                            const timeStr = new Date(time).toLocaleTimeString()
                            const dateStr = new Date(time).toDateString()
                            return (
                                <View key={i} style={styles.feedTimeItem}>
                                    <AntDesign name="clockcircle" size={13} color="#C17B4E" />
                                    <Text style={styles.feedTimeText}>{dateStr} · {timeStr}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={handleFeedTimeModal}>
                        <Text style={styles.modalCloseBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

function Portion({portionSelected,setPortionSelected, deviceRef,handleInfoModal }){
    const portions = [1,2,3,4,5,6,7,8,9,10]

    useEffect(()=>{
        updateDoc(deviceRef, {
            portion: portionSelected
        })
    }, [portionSelected]);

    return (
        <View style={styles.portionSection}>
            <View style={styles.portionHeader}>
                <Text style={styles.portionLabel}>Portion Size</Text>
                <TouchableOpacity onPress={handleInfoModal}>
                    <Ionicons name="information-circle" size={moderateScale(22)} color="#C17B4E" />
                </TouchableOpacity>
            </View>
            <ScrollView horizontal style={{width: '100%'}} showsHorizontalScrollIndicator={false}>
                <View style={{flexDirection: 'row', gap: 10, paddingHorizontal: 4}}>
                    {portions.map(p => (
                        <TouchableOpacity onPress={() => setPortionSelected(p)} key={p}>
                            <View style={p===portionSelected ? portionStyle.selected : portionStyle.notSelected}>
                                <Text style={p===portionSelected ? portionStyle.textSelected : portionStyle.textNotSelected}>{p}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

const portionStyle = StyleSheet.create({
    selected:  {height: 36, width: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#4A3728"},
    notSelected: {height: 36, width: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", backgroundColor: '#F0EAE3', borderWidth: 1, borderColor: '#E8E0D8'},
    textSelected: {color: "#FFF", fontWeight: '700'},
    textNotSelected: {color: "#4A3728", fontWeight: '500'}
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
            return;
        }
        updateDoc(deviceRef, {
            feedTimes: [...feedTime, time]
        }).then(getDoc(deviceRef).then(res=> {
            if(res.data().feedTimes.length < 1) return;
            setFeedTimes(res.data().feedTimes.filter(times=> times > Date.now()));
            alert("Added feeding schedule successfully")
        })).catch(err=> console.log(err?.message))  
    }

    return (
        <Modal animationType='slide' transparent={true} visible={dateModalOpen}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Set Feeding Time</Text>
                    {showDatePicker && (
                        <DateTimePicker
                            mode={'date'}
                            value={date || new Date()}
                            onChange={handleDateChange}
                            onTouchCancel={()=>setShowDatePicker(false)}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            mode={"time"}
                            value={date}
                            onChange={handleTimeChange}
                            onTouchCancel={()=>setShowTimePicker(false)}
                        />
                    )}
                    <View style={styles.calendarDateDisplay}>
                        <AntDesign name="calendar" size={15} color="#C17B4E" />
                        <Text style={styles.calendarDateText}>{`${date.toDateString()} · ${time.toLocaleTimeString()}`}</Text>
                    </View>
                    <View style={styles.calendarBtnRow}>
                        <TouchableOpacity style={styles.calendarPickerBtn} onPress={()=> setShowDatePicker(true)}>
                            <AntDesign name="calendar" size={14} color="#FFF" />
                            <Text style={styles.calendarPickerBtnText}>Set Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.calendarPickerBtn} onPress={()=> setShowTimePicker(true)}>
                            <AntDesign name="clockcircleo" size={14} color="#FFF" />
                            <Text style={styles.calendarPickerBtnText}>Set Time</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.addFeedScheduleBtn} onPress={handleFeedOnSetTime}>
                        <Text style={styles.addFeedScheduleBtnText}>Add Feeding Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalCloseBtn} onPress={()=> setDateModalOpen(false)}>
                        <Text style={styles.modalCloseBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: '#F7F3EE',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D8',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    headerIconBtn: {
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: '#2D2D2D',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 2,
    },
    // Scroll
    scrollContent: {
        paddingBottom: 30,
    },
    // Device meta
    deviceMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },
    deviceIdText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: '#8A8A8A',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cameraChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#FFF3EC',
        borderWidth: 1,
        borderColor: '#E8D0BC',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    cameraChipText: {
        color: '#C17B4E',
        fontSize: 12,
        fontWeight: '600',
    },
    // Device image
    deviceImageCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    deviceMainImage: {
        width: horizontalScale(180),
        height: verticalScale(300),
    },
    // Actions
    actionsSection: {
        paddingHorizontal: 20,
        paddingTop: 18,
        gap: 12,
    },
    feedNowBtn: {
        backgroundColor: '#4CAF50',
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        elevation: 2,
        shadowColor: '#4CAF50',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.30,
        shadowRadius: 4,
    },
    feedNowBtnText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: moderateScale(16),
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    secondaryBtnsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    outlineBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#C17B4E',
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 7,
        backgroundColor: '#FFFFFF',
    },
    outlineBtnText: {
        color: '#4A3728',
        fontWeight: '700',
        fontSize: moderateScale(11),
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    // Portion
    portionSection: {
        marginHorizontal: 20,
        marginTop: 18,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 6,
        gap: 12,
    },
    portionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    portionLabel: {
        fontSize: moderateScale(13),
        fontWeight: '700',
        color: '#2D2D2D',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Shared modal styles
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.50)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        gap: 16,
        elevation: 12,
        maxHeight: '92%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2D2D2D',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    modalCloseAbsolute: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1,
    },
    modalCloseBtn: {
        width: '100%',
        borderWidth: 1.5,
        borderColor: '#E8E0D8',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    modalCloseBtnText: {
        color: '#4A3728',
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Dark modal header
    darkModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#4A3728',
        paddingLeft: 16,
    },
    darkModalHeaderTitle: {
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontSize: moderateScale(13),
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    // Schedule item
    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    scheduleInfo: {
        flex: 1,
    },
    scheduleTime: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2D2D',
    },
    scheduleDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 3,
    },
    scheduleDayText: {
        fontSize: 11,
        color: '#8A8A8A',
        fontWeight: '500',
    },
    schedulePortionBadge: {
        backgroundColor: '#FFF3EC',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginHorizontal: 8,
    },
    schedulePortionText: {
        color: '#C17B4E',
        fontWeight: '700',
        fontSize: 12,
    },
    scheduleActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    // Add schedule button
    addScheduleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#4A3728',
        margin: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignSelf: 'center',
    },
    addScheduleBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        textTransform: 'uppercase',
    },
    // AddTimeSched
    addSchedBody: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 20,
        alignItems: 'center',
    },
    daySelector: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D8',
        paddingBottom: 16,
        width: '100%',
    },
    daySelected: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        borderRadius: 8,
        backgroundColor: '#F0F9F0',
    },
    dayUnselected: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#E8E0D8',
        borderRadius: 8,
    },
    dayTextSelected: {
        color: '#2D7A2D',
        fontSize: moderateScale(13),
        fontWeight: '600',
    },
    dayTextUnselected: {
        color: '#4A3728',
        fontSize: moderateScale(13),
        fontWeight: '500',
    },
    timePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    setTimeBtn: {
        backgroundColor: '#4A3728',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    setTimeBtnText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 13,
    },
    selectedTimeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D2D2D',
    },
    addSchedPortionSection: {
        width: '100%',
        gap: 8,
    },
    addSchedPortionLabel: {
        textTransform: 'uppercase',
        color: '#4A3728',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    saveSchedBtn: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A3728',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: 'center',
    },
    saveSchedBtnText: {
        textTransform: 'uppercase',
        color: '#FFF',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    // FeedTimesModal
    feedTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0EAE3',
        width: '100%',
    },
    feedTimeText: {
        fontWeight: '600',
        fontSize: moderateScale(13),
        color: '#2D2D2D',
        flex: 1,
    },
    // FoodContainerModal
    foodWeightRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    foodWeightText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2D2D2D',
    },
    // CalendarModal
    calendarDateDisplay: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        backgroundColor: '#FFF3EC',
        borderRadius: 10,
        padding: 12,
        width: '100%',
    },
    calendarDateText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4A3728',
        flex: 1,
    },
    calendarBtnRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    calendarPickerBtn: {
        flex: 1,
        backgroundColor: '#4A3728',
        borderRadius: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    calendarPickerBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 13,
        textTransform: 'uppercase',
    },
    addFeedScheduleBtn: {
        width: '100%',
        backgroundColor: '#C17B4E',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    addFeedScheduleBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default DeviceScreen