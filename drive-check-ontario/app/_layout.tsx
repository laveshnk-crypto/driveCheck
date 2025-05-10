import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
    return (
        <React.Fragment>
            <Stack  screenOptions={{headerShown:false, contentStyle: {backgroundColor: "#1C1C1C"}}}/>
        </React.Fragment>
    )
}