import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Animated } from "react-native";
import { useEffect } from "react";
import { fadeIn } from "@/animations/fadeIn";

export default function HomeButtons({ label, onPress, IconSVG }) {
    const {anim, animation} = fadeIn(1000);

    useEffect(() => {
        animation.start();
    }, []);

    return (
        <View style={styles.wrapper}>
            <View style={styles.shadowLayer} />
            <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
                <Animated.View style={{ opacity: anim }}>
                    <Text style={styles.text}>{label}</Text>
                </Animated.View>
                {IconSVG && (
                <Animated.View style={{ opacity: anim }}>
                    <IconSVG width={30} height={30} />
                </Animated.View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
        marginTop: 30,
        width: "70%"
    },
    button: {
        height: 60,
        backgroundColor: "#F5E8D8",
        borderColor: "#111",
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 25,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        shadowColor: "#b08f6c", // iOS shadow
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 2,
        shadowRadius: 0,
        elevation: 5,
    },
    text: {
        color: "#111",
        fontSize: 16,
        fontFamily: "System",
        lineHeight: 24,
    },
});


