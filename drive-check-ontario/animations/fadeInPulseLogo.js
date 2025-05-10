import { Animated, Easing, Platform } from "react-native";

export function fadeInPulseLogo(duration = 2000) {
  const anim = new Animated.Value(0.6); // Start with a faint visible value

  const useNative = Platform.OS !== "web"; // ✅ Safe for native only

    const animation = Animated.loop(
        Animated.sequence([
        Animated.timing(anim, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: useNative,
        }),
        Animated.timing(anim, {
            toValue: 0.6,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: useNative,
        }),
        ])
    );

    return { anim, animation };
    }


