import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, GestureResponderEvent } from "react-native";


export default function HomeButtons({ label, onPress }) {
    return (
        <View style={styles.wrapper}>
        <View style={styles.shadowLayer} />
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
        marginTop: 30,
        width: "70%",
    },
    button: {
        height: 48,
        backgroundColor: "#F5E8D8",
        borderColor: "#111",
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 25,
        justifyContent: "center",
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
        fontFamily: "Inter",
        lineHeight: 24,
    },
});


