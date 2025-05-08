import { Text, Animated, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { fadeInPulse } from "@/animations/fadeInPulse";
import HomeButtons from "@/components/homeButtons";

import HistoryLogoWhite from "../assets/historyLogoWhite.svg";
import CameraLogo from "../assets/cameraLogo.svg";
import HandBookLogo from "../assets/handbookLogo.svg";
import CoffeeLogo from "../assets/coffeeLogo.svg";

export default function HomeScreen() {
    const {anim, animation} = fadeInPulse(1000);

    useEffect(() => {
        animation.start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ position: "absolute", top: "3%", right: 20, zIndex: 1 }}>
            <TouchableOpacity onPress={() => console.log("History Pressed!")}>
                <HistoryLogoWhite width={60} height={45} />
            </TouchableOpacity>
            </View>
            <Animated.Image
                source={require("../assets/logoWhite.png")}
                style={{ width: 300, height: 300, opacity: anim }}
            />
            <HomeButtons IconSVG={CameraLogo} label="Upload Results" onPress={() => console.log("Pressed!")}/>
            <HomeButtons IconSVG={HandBookLogo} label="Ontario Driver's Handbook" onPress={() => console.log("Pressed!")}/>
            <HomeButtons IconSVG={CoffeeLogo} label="About" onPress={() => console.log("Pressed!")}/>

            <View style={styles.textContainer} >
                <Text style = {styles.text}>Region: Onatrio</Text>
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