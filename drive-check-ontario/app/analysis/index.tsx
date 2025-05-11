import { Text, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AnalysisHeader from "@/components/analysisHeader";

export default function AnalysisScreen() {
    const { result } = useLocalSearchParams();
    const content = decodeURIComponent(result as string);

    const parsed = JSON.parse(content);
    console.log("Parsed: ", parsed);

    const issues = parsed.issues;
    console.log("Issues: ", issues);

    const renderedIssues = [];
    for (const key in issues) {
        const value = issues[key];
        console.log(`${key} : ${value}`);
        renderedIssues.push(
            <View key={key}>
                <Text style={styles.issueHeader}>{key}</Text>
                <Text style={styles.issueBody}>{String(value)}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#1C1C1C", marginTop: "20%" }}>
            <View style={styles.content}>
                <AnalysisHeader title={"Potential Issues?"} />
            </View>

            <View style={styles.line} />
            {renderedIssues}
        </View>
    );
}

const styles = StyleSheet.create({
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
        overflow: "hidden",
    }
});
