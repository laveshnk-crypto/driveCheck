import { Animated, Easing } from "react-native";

export function fadeInPulseLogo(duration = 2000) {
    const anim = new Animated.Value(0.6); // Start with a faint visible value

    const animation = Animated.loop(
        Animated.sequence([
            Animated.timing(anim, {
                toValue: 1, // Fade in
                duration,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(anim, {
                toValue: 0.6, // Fade out to minimum
                duration,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ])
    );

    return { anim, animation };
}

