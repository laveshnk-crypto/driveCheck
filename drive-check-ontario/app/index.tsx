import { Text, Animated, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { fadeInPulse } from "@/animations/fadeInPulse";
import HomeButtons from "@/components/homeButtons";
import * as ImagePicker from "expo-image-picker";
import {convertToBase64} from "@/utils/imageUtils"; 

import HistoryLogoWhite from "../assets/historyLogoWhite.svg";
import CameraLogo from "../assets/cameraLogo.svg";
import HandBookLogo from "../assets/handbookLogo.svg";
import CoffeeLogo from "../assets/coffeeLogo.svg";

export default function HomeScreen() {
    const {anim, animation} = fadeInPulse(1000); // Animation hook for fade in
    const [image, setImage] = useState<string | null>(null); // State to hold the image

    const processImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3], // Only applicable for android, iOS will always have a square crop
            quality: 1,
        });

        if(!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;

            try{
                const base64 = await convertToBase64(uri); 
                const response = await fetch("http://localhost:3001/upload",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({image: base64})
                    });
                    
                    const data = await response.json();
                    console.log("Backend response: ", data)

                    setImage(uri); // Optional: update preview
            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        }
    };
    
    useEffect(() => {
        animation.start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ position: "absolute", top: "3%", right: 20, zIndex: 1 }}>
            <Animated.View style={{ opacity: anim }}>
                <TouchableOpacity onPress={() => console.log("History Pressed!")}>
                    <HistoryLogoWhite width={60} height={45} />
                </TouchableOpacity>
            </Animated.View>
            </View>
            <Animated.Image
                source={require("../assets/logoWhite.png")}
                style={{ width: 300, height: 300, opacity: anim }}
            />
            <HomeButtons IconSVG={CameraLogo} label="Upload Results" onPress={processImage}/>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }}/>} {/* Just for preview */}
            
            {/* <HomeButtons IconSVG={HandBookLogo} label="Ontario Driver's Handbook" onPress={sendToBackend}/> */}
            <HomeButtons IconSVG={CoffeeLogo} label="About" onPress={() => console.log("Pressed!")}/>
                <View style={styles.textContainer} >
                    <Animated.View style={{ opacity: anim }}>
                        <Text style = {styles.text}>Region: Onatrio</Text>
                    </Animated.View>
                </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        paddingTop: "20%",
        alignItems: "center",
        backgroundColor: "#1C1C1C",
    },
    textContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: "10%",
        alignItems: "center",
    },
    text:{
        color: "#F5E8D8",
        fontSize: 15
    }
});