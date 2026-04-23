import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text, Image } from 'react-native'

export default function AppSplashScreen() {
    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(30)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,        // valeur finale
                duration: 900,     // en millisecondes
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,        // valeur finale
                duration: 900,     // en millisecondes
                useNativeDriver: true,
            })
        ]).start()
    }, [])

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity, transform: [{ translateY }] }}>
                <View style={styles.bg}>
                    <Image source={require('../assets/images/bg.png')} />
                </View>
                <Text style={styles.title}>Mon Plat</Text>
                <Text style={styles.subtitle}>Fast-food & pâtisserie à portée de main</Text>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // fond orange, prend tout l'écran, centre le contenu (horizontalement et verticalement)
        flex: 1,
        backgroundColor: "#FF6B00",
        justifyContent: "center",
        alignItems: "center"
    },
    bg:{
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        // grand, gras, blanc
        color: "white",
        fontSize: 48,
        textAlign: "center",
        fontWeight: "bold",
    },
    subtitle: {
        // petit, blanc mais semi-transparent (opacity: 0.8)
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        opacity: 0.8
    },
})

