import { TextInput, Text, Animated, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { fadeInPulseLogo } from "@/animations/fadeInPulseLogo";
import { useRouter } from "expo-router";

import HomeButtons from "@/components/homeButtons";
import * as ImagePicker from "expo-image-picker";
//import {convertToBase64} from "@/utils/imageUtils"; 

import HistoryLogoWhite from "../assets/historyLogoWhite.svg";
import CameraLogo from "../assets/cameraLogo.svg";
import HandBookLogo from "../assets/handbookLogo.svg";
import CoffeeLogo from "../assets/coffeeLogo.svg";


export default function HomeScreen() {
    const {anim, animation} = fadeInPulseLogo(1100); // Animation hook for fade in
    const [image, setImage] = useState<string | null>(null); // State to hold the image
    const [context, setContext] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter();
    
    const userId = "123"; // TODO: Placeholder for user ID, replace with actual user ID from context or props


    const processImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });


        if(!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const uri = asset.uri;

            const filename = uri.split("/").pop() || "image.jpg";
            const match = /\.(\w+)$/.exec(filename || "");
            const type = match ? `image/${match[1]}` : `image`;

            const formData = new FormData();
            formData.append("id", userId);
            formData.append("context", context);
            formData.append("file", {
            uri,
            name: filename,
            type,
            } as any);


            try{
                setIsLoading(true);
                const response = await fetch(`http://192.168.2.114:3001/upload`,{
                    method: "POST",
                    headers: {
                    // 'Content-Type' should NOT be set manually for FormData in fetch
                    // Let fetch set it automatically including boundary
                    },
                    body: formData
                    });
                    
                    const data = await response.json();
                    console.log("Backend response: ", data);
                    router.push({ pathname: "/analysis", params: { result: JSON.stringify(data.analysis) } });

;

            } catch (error) {
                console.error("Error uploading image: ", error);
            }  finally {
                setIsLoading(false);
            }
        }
    };
    
    useEffect(() => {
        animation.start();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading && (
            <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>Analyzing...</Text>
            </View>
            )}
            <View style={{ position: "absolute", top: "7%", right: 20, zIndex: 1 }}>
                <TouchableOpacity onPress={() => console.log("History Pressed!")}>
                    <HistoryLogoWhite width={60} height={45} />
                </TouchableOpacity>
            </View>
            <Animated.Image
                source={require("../assets/logoWhite.png")}
                style={{ width: 300, height: 300, opacity: anim }}
            />
            <TextInput style={styles.textInput} value={context} onChangeText={setContext} placeholder= "(Optional) Enter context" placeholderTextColor={"#87827b"}></TextInput>
            <HomeButtons IconSVG={CameraLogo} label="Upload DriveTest Results" onPress={processImage}/>
            
            <HomeButtons IconSVG={HandBookLogo} label="Ontario Driver's Handbook" onPress={() => console.log("Handbook Pressed!")}/>
            <HomeButtons IconSVG={CoffeeLogo} label="Tutorial" onPress={() => router.navigate("/tutorial")}/>
                <View style={styles.textContainer} >
                        <Text style = {styles.text}>Region: Ontario</Text>
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
    },
    textInput:{
        width: "60%",

        height: 50,
        color: "#F5E8D8",
        fontFamily: "System",
        fontSize: 20,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
    },
    loadingText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    },
});