import { Animated } from "react-native";

export function fadeIn(duration = 1000) {
    const anim = new Animated.Value(0);
    const animation = Animated.timing(anim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
    });

    return {anim, animation};
}