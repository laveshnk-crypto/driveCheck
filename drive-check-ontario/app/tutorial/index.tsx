import { View, Text, StyleSheet } from "react-native";
import AnalysisHeader from "@/components/analysisHeader";

export default function Tutorial() {
    return (
        <View style={{ flex: 1, backgroundColor: "#1C1C1C" }}>

            <View style={styles.content}>
                <AnalysisHeader title={"Potential Issues?"} />
            </View>

            <View style={styles.line} />
            <Text style={styles.issueHeader}>Header</Text>
            <Text style={styles.issueBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
            
            <Text style={styles.issueHeader}>Header 2</Text>
            <Text style={styles.issueBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>

            <Text style={styles.issueHeader}>Header 3</Text>
            <Text style={styles.issueBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>

        </View>
    );
    }

    const styles = StyleSheet.create({
    line: {
        height: 2,
        width: '100%',
        backgroundColor: '#A8A29B',
        marginVertical: 30,
    },
    content: {
        paddingLeft: "15%",
        paddingRight: "5%", // optional for balance
        paddingTop: 0,
        overflow: "hidden",
    },
    issueHeader: {
        fontSize: 24,
        fontWeight: "500",
        color: "#F5E8D8",
        paddingLeft: "15%",
        paddingRight: "5%", // optional for balance
        paddingTop: 0,
        overflow: "hidden",
    },
    issueBody: {
        fontSize: 18,
        color: "#A8A29B",
        paddingLeft: "15%",
        paddingRight: "5%", // optional for balance
        paddingTop: 0,
        paddingBottom: 30,
        overflow: "hidden",
    }
});
