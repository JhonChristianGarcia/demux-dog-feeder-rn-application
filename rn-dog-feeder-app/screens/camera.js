import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import { Feather} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



const ws_page = `
<body>
<img id="image" src="" width="100%" height="100%" >
<script>
    const img = document.getElementById('image'); 
    const WS_URL = 'ws://192.168.0.175:8898';
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => console.log('Connected to ' + WS_URL); // Fix template string
    
    ws.onmessage = message => {
        const base64Data = message.data; // Assuming server sends base64 directly
        img.src = 'data:image/jpeg;base64,' + base64Data; // Fix template string
    };
</script>
</body>
`;


export default function Camera() {
    const navigator = useNavigation();
  return (
    <SafeAreaView>
            {/* <TouchableWithoutFeedback onPress={()=> navigator.navigate("Home")}>
          <Text style={{textTransform: "uppercase", color: "#000", fontSize: 70, fontWeight: "300"}}>&#8249;</Text>
        </TouchableWithoutFeedback> */}
      <View style={{height:500, width:'100%', justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.container}>
            <View style={{justifyContent:"center", alignItems: "center", flexDirection: "row", gap: 10}}>
                <Text style={{textTransform: "uppercase", fontSize: 18, fontWeight: "500"}}>RealTime View</Text>
                 <Feather name="eye" size={24} color="black" />
            </View>
          <WebView
            source={{ html: ws_page }}
          />
        </View>
      </View>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '95%',
    borderWidth: 2, 
    borderColor: "black",
    justifyContent: "center",
  },
//   webview: {
//     height: "100%", // Set the height to 100
//   },
});