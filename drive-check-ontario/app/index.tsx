import { Text, Animated, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { fadeInPulse } from "@/animations/fadeInPulse";
import HomeButtons from "@/components/homeButtons";

export default function HomeScreen() {
    const {anim, animation} = fadeInPulse(1000);

    useEffect(() => {
        animation.start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require("../assets/logoWhite.png")}
                style={{ width: 300, height: 300, opacity: anim }}
            />
            <HomeButtons label="Upload Results" onPress={() => console.log("Pressed!")}/>
            <HomeButtons label="Driver's handbook" onPress={() => console.log("Pressed!")}/>
            <HomeButtons label="Donate!" onPress={() => console.log("Pressed!")}/>
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