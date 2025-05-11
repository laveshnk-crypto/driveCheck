import { View, Text, StyleSheet } from 'react-native';

export default function AnalysisHeader({ title }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{title}</Text>
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#A8A29B',
        paddingVertical: 15,
        paddingHorizontal: 3,
        marginTop: 30,
        maxWidth: '60%',
    },
    titleText: {
        fontSize: 24,
        color: '#F5E8D8',
        textAlign: 'center',
    },
    });
