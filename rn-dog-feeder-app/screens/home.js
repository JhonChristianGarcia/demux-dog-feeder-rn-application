import { View, Text, TouchableHighlight, TextInput, KeyboardAvoidingView, Image, ScrollView, Modal, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {auth, app} from "../auth/config"
import {  signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs, getDoc, doc, onSnapshot, updateDoc, addDoc, setDoc, FieldValue, onSnapshotsInSync} from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';    
import { FontAwesome, FontAwesome6, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { horizontalScale, moderateScale, verticalScale } from '../utils/sizeModerator';
export const db = getFirestore();


const Home = ({navigation, currentArray, setCurrentArray}) => {
    const navigator = useNavigation()
    const [user, setUser] = useState(null);
    const [inputDevice, setInputDevice] = useState("");
    const [modalOpen, setModalOpen] = useState(false)
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
         if(!doc.exists()) return;
         const {devices} = doc.data();
         setCurrentArray(devices)
         }).catch(err=> console.log(err.message)) // set initial array based from the database
    },[user])




    async function handleAddDevice(){
        if(!inputDevice) {
            alert("Enter a valid device ID")
            return;
         }
        if(!user) return;
        if(!currentArray) {
            setCurrentArray([1])
            return
        }
        const deviceDoc = await getDoc(doc(db, "device-feeder", inputDevice)).catch(()=> null);
        if(!deviceDoc || !deviceDoc.exists()){
            alert("Please enter a valid device ID");
            return;
        }
        const ref = doc(db, "users", user);
        const toUpdate= {
            devices: [...currentArray, inputDevice]
        }
        
        setDoc(ref, toUpdate, { merge: true }).then(()=> {
            getDoc(ref)
            .then(doc=> {
             if(!doc.exists()) return;
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

    const deviceCount = currentArray ? currentArray.slice(1).length : 0;
    
    return (
        <>
        <SafeAreaView style={styles.container}>

            {/* Hero Header */}
            <View style={styles.heroContainer}>
                <ImageBackground
                    style={styles.heroImage}
                    source={require("../assets/images/dog2.png")}
                    resizeMode="cover"
                >
                    <View style={styles.heroOverlay}>
                        <View>
                            <Text style={styles.heroTitle}>Demux Dog Feeder</Text>
                            <Text style={styles.heroSubtitle}>Manage your pet feeders</Text>
                        </View>
                        <TouchableOpacity style={styles.addButtonHero} onPress={()=> setModalOpen(true)}>
                            <AntDesign name="pluscircle" size={32} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>

            {/* Empty state */}
            {!currentArray?.length >= 1 && (
                <KeyboardAvoidingView behavior="padding" style={styles.emptyStateContainer}>
                    <View style={styles.emptyStateInner}>
                        <TouchableOpacity onPress={()=> setModalOpen(true)} style={styles.emptyStateButton}>
                            <AntDesign name="pluscircle" size={52} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.emptyStateTitle}>No Devices Yet</Text>
                        <Text style={styles.emptyStateSubtext}>Tap the + button to add your first feeder</Text>
                    </View>
                </KeyboardAvoidingView>
            )}

            <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen} inputDevice={inputDevice} setInputDevice={setInputDevice} handleAddDevice={handleAddDevice}/>

            {/* Device List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>My Devices</Text>
                    <View style={styles.deviceBadge}>
                        <Text style={styles.deviceBadgeText}>{deviceCount}</Text>
                    </View>
                </View>

                {currentArray?.slice(1).map((device, index)=> <Device key={index} deviceId={device}/>)}
            </ScrollView>

        </SafeAreaView>
        <Footer/>
        </>
  )
}


function CustomModal({modalOpen, setModalOpen, inputDevice, setInputDevice, handleAddDevice}){
    return (
        <Modal
            visible={modalOpen}
            animationType='slide'
            style={{margin: 0}}
            transparent={true}
            onRequestClose={()=> setModalOpen(false)}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalCard}>
                    <View style={styles.modalHandle} />
                    <View style={styles.modalHeader}>
                        <MaterialCommunityIcons name="dog" size={36} color="#000" />
                        <Text style={styles.modalTitle}>Add New Device</Text>
                        <Text style={styles.modalSubtitle}>Enter the ID of your feeder to link it to your account.</Text>
                    </View>
                    <TextInput
                        style={styles.modalInput}
                        onChangeText={(text)=> setInputDevice(text)}
                        value={inputDevice}
                        placeholder='Enter device ID'
                        placeholderTextColor="#BBBBBB"
                    />
                    <TouchableHighlight
                        style={styles.modalAddBtn}
                        underlayColor="#A0633A"
                        onPress={handleAddDevice}
                    >
                        <Text style={styles.modalAddBtnText}>Add Device</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.modalCancelBtn}
                        underlayColor="#F0E8E0"
                        onPress={()=> setModalOpen(false)}
                    >
                        <Text style={styles.modalCancelBtnText}>Cancel</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
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
    
    return (
        <TouchableHighlight
            onPress={()=> navigator.navigate(deviceId)}
            underlayColor="#F0EAE3"
            style={styles.deviceCardWrapper}
        >
            <View style={styles.deviceCard}>
                <View style={styles.deviceImageContainer}>
                    <Image
                        style={styles.deviceImage}
                        source={require("../assets/images/side.png")}
                        resizeMode='contain'
                    />
                </View>
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>Home</Text>
                    <Text style={styles.deviceId}>ID: {deviceId}</Text>
                    <Text style={styles.deviceHint}>Tap to manage</Text>
                </View>
                <TouchableOpacity
                    style={[styles.feedButton, motorState && styles.feedButtonActive]}
                    onPress={updateMotorState}
                >
                    <MaterialCommunityIcons name="food-drumstick" size={16} color="#FFF" />
                    <Text style={styles.feedButtonText}>Feed</Text>
                </TouchableOpacity>
            </View>
        </TouchableHighlight>
    )
}

export function Footer(){
    const navigator = useNavigation()

    return (
        <View style={styles.footer}>
            <TouchableHighlight
                style={styles.footerTab}
                underlayColor="#F0EAE3"
                onPress={()=> navigator.navigate("Home")}
            >
                <View style={styles.footerTabInner}>
                    <FontAwesome6 name="toilet-portable" size={22} color="#4A3728" />
                    <Text style={styles.footerTabText}>Devices</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={styles.footerTab}
                underlayColor="#F0EAE3"
                onPress={()=> navigator.navigate("Account")}
            >
                <View style={styles.footerTabInner}>
                    <FontAwesome name="user" size={22} color="#999" />
                    <Text style={[styles.footerTabText, {color: "#999"}]}>Me</Text>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // Hero
    heroContainer: {
        width: '100%',
        height: 240,
    },
    heroImage: {
        width: '100%',
        height: 240,
    },
    heroOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 22,
        paddingBottom: 22,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    heroSubtitle: {
        color: 'rgba(255,255,255,0.70)',
        fontSize: 12,
        marginTop: 3,
        letterSpacing: 0.5,
    },
    addButtonHero: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 50,
        padding: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    // Empty state
    emptyStateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 180,
        backgroundColor: '#FFFFFF',
        transform: [{translateY: -28}],
        borderRadius: 18,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    emptyStateInner: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    emptyStateButton: {
        padding: 4,
    },
    emptyStateTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emptyStateSubtext: {
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    // Scroll / Section
    scrollView: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        marginTop: 6,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    sectionTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    deviceBadge: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 2,
    },
    deviceBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    // Device card
    deviceCardWrapper: {
        borderRadius: 16,
        marginBottom: 10,
    },
    deviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    deviceImageContainer: {
        width: horizontalScale(56),
        height: verticalScale(56),
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deviceImage: {
        width: horizontalScale(44),
        height: verticalScale(44),
    },
    deviceInfo: {
        flex: 1,
        marginLeft: 14,
    },
    deviceName: {
        fontSize: moderateScale(14),
        fontWeight: '900',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    deviceId: {
        fontSize: moderateScale(11),
        color: '#999',
        marginTop: 2,
    },
    deviceHint: {
        fontSize: moderateScale(10),
        color: '#666',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    feedButton: {
        backgroundColor: '#000',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    feedButtonActive: {
        backgroundColor: '#333',
    },
    feedButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Modal
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 28,
        paddingTop: 16,
        paddingBottom: 44,
        alignItems: 'center',
        gap: 14,
        elevation: 12,
    },
    modalHandle: {
        width: 40,
        height: 3,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 8,
    },
    modalHeader: {
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    modalSubtitle: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#000',
        backgroundColor: '#FAFAFA',
    },
    modalAddBtn: {
        width: '100%',
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
    },
    modalAddBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    modalCancelBtn: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    modalCancelBtnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: 70,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    footerTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTabInner: {
        alignItems: 'center',
        gap: 3,
    },
    footerTabText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#000',
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default Home