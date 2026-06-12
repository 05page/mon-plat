import { useAppTheme } from "@/constants/theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Animated } from "react-native"

export default function LoadingComponent() {
    const theme = useAppTheme()
    const pulse = new Animated.Value(1) // commence à 1
    Animated.loop(                        // répète à l'infini
        Animated.sequence([               // enchaîne des étapes
            Animated.timing(pulse, {
                toValue: 1.3,             // grandit jusqu'à 1.3
                duration: 600,            // en 600ms
                useNativeDriver: true,
            }),
            Animated.timing(pulse, {
                toValue: 1,               // revient à 1
                duration: 600,
                useNativeDriver: true,
            }),
        ])
    ).start() // ← démarre l'animation

    return (
        <Animated.View style={styles.content}>
            <ActivityIndicator size="large" color="#fff" />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "theme.colors.primary"
    }
})