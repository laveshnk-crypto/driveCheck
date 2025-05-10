import { Animated, Platform } from "react-native";

export function fadeIn(duration = 1000) {
    const anim = new Animated.Value(0);

    const animation = Animated.timing(anim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: Platform.OS !== "web", // ✅ native only
    });

    return { anim, animation };
    }
