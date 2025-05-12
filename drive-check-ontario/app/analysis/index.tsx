import { KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Text, View, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AnalysisHeader from "@/components/analysisHeader";
import { useState } from "react";

import ArrowLogo from "../../assets/arrowLogo.svg";

// logos for issues
import CarLogo from "../../assets/issueLogos/carLogo.svg"
import CarWithInformation from "../../assets/issueLogos/carWithInformationLogo.svg"
import LaneRoad from "../../assets/issueLogos/laneRoadLogo.svg"
import LeftArrow from "../../assets/issueLogos/leftArrowLogo.svg"
import RightArrow from "../../assets/issueLogos/rightArrowLogo.svg"
import RiskWithMagnify from "../../assets/issueLogos/riskWithMagnifyLogo.svg"
import SignalLogo from "../../assets/issueLogos/signalLogo.svg"
import StarLogo from "../../assets/issueLogos/starLogo.svg"


export default function AnalysisScreen() {
    const { result } = useLocalSearchParams();

    const content = decodeURIComponent(result as string);
    const parsed = JSON.parse(content);
    const issues = parsed.issues;
    const renderedIssues = [];


    for (const key in issues) {
        const value = issues[key];
        renderedIssues.push(
            <View key={key}>
                <Text style={styles.issueHeader}>{key}</Text>
                <Text style={styles.issueBody}>{String(value)}</Text>
            </View>
        );
    }

    const summary = [] 
    summary.push(parsed.notes)

    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant", content: string }[]>([]);

    const sendMessage = async () => {
        if (!chatInput.trim()) return;

            const userId = "123" // TODO: Placeholder for user ID, replace with actual user ID from context or props
        // Add user message to chat
        setChatMessages(prev => [...prev, { role: "user", content: chatInput }]);

        const response = await fetch("http://192.168.2.114:3001/chat", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                message: chatInput,
                id: userId,
            })
        })
        const data = await response.json();
        const aiReply = data.response;

        console.log("AI response:", aiReply);
        console.log("Data:", data);

        // Add AI response to chat
        setChatMessages(prev => [...prev, { role: "assistant", content: aiReply }]);
        setChatInput("");
    }


return (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#1C1C1C" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-60} // adjust if needed
    >
        <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
            <View style={{ marginTop: "20%" }}>
            <View style={styles.content}>
                <AnalysisHeader title={"Potential Issues?"} />
            </View>
            <View style={styles.line} />
            {renderedIssues}
            <View style={styles.line} />
            <View style={styles.content}>
                <AnalysisHeader title={"Chat Summary"} />
            </View>
            </View>
            <Text style={styles.chatBody}>{summary}</Text>
            {chatMessages.map((msg, index) => (
            <Text
                key={index}
                style={msg.role === "user" ? styles.userChatBody : styles.chatBody}
            >
                {msg.content}
            </Text>
))}

        </ScrollView>

        <View style={styles.chatBar}>
            <TextInput
            style={[styles.chatBarText, {marginTop: -75}]}
            placeholder="Need advice on any of these?"
            placeholderTextColor="#87827b"
            multiline
            numberOfLines={2}
            value={chatInput}
            onChangeText={setChatInput}
            />
            <TouchableOpacity onPress={sendMessage}>
            <View style={{ marginTop: -55 }}>
                <ArrowLogo width={60} height={45} />
            </View>
            </TouchableOpacity>
        </View>
        </View>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    chatBar: {
    height: 140,
    flexDirection: "row",
    alignItems: "center",    
    backgroundColor: "#2D2828",
    paddingHorizontal: 20,
    justifyContent: "center",

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    },
    chatBarText: {
        flex: 1,
        color: "#A8A29B",
        fontSize: 16,
    },
    chatBody: {
        color: "#F5E8D8",
        fontSize: 18,
        paddingLeft: "7%",
        paddingRight: "5%",
        paddingBottom: 30,
        marginTop: 20,
    },
    userChatBody: {
        backgroundColor: "#fffcfc",
        color: "#383636",
        fontSize: 18,
        alignSelf: "flex-end", // makes it wrap left (or use 'flex-end' for right)
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 20,
        borderRadius: 12,
        marginVertical: 6,
        maxWidth: "80%", // prevents stretching full width
        },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#1C1C1C",
        borderColor: "#F5E8D8",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "15%",
        paddingRight: "5%",
        paddingTop: 0,
        overflow: "hidden",
    },
    line: {
        height: 2,
        width: '100%',
        backgroundColor: '#A8A29B',
        marginVertical: 30,
    },
    content: {
        paddingLeft: "15%",
        paddingRight: "5%",
        paddingTop: 0,
        overflow: "hidden",
    },
    result: {
        fontSize: 16,
        color: "#F5E8D8",
        lineHeight: 24,
    },
    issueHeader: {
        fontSize: 24,
        fontWeight: "500",
        color: "#F5E8D8",
        paddingLeft: "15%",
        paddingRight: "5%",
        paddingTop: 0,
        overflow: "hidden",
    },
    issueBody: {
        fontSize: 18,
        color: "#A8A29B",
        paddingLeft: "15%",
        paddingRight: "5%",
        paddingTop: 0,
        paddingBottom: 30,
    }
});
