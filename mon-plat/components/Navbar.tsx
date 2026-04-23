import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

const NAV_ITEMS = [
    { name: 'home-outline', active: 'home', route: '' },
    { name: 'notifications-outline', active: 'notifications', route: '' },
    { name: 'checkbox-outline', active: 'checkbox', route: '' },
    { name: 'heart-outline', active: 'heart', route:'' },
    { name: 'person-outline', active: 'person', route: '/(profile)' },
]
export default function Navbar() {
    const router = useRouter()
    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <View style={styles.content}>
            {NAV_ITEMS.map((i, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.navBtn}
                    onPress={() => {
                        setActiveIndex(index)
                        router.push(i.route as any) // ✅ navigation ici
                    }}
                >
                    {activeIndex === index && <View style={styles.indicator} />}
                    <Ionicons
                        name={activeIndex === index ? i.active : i.name}
                        size={26}
                        color={activeIndex === index ? '#FF6B00' : 'black'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        height: 84,
        borderRadius: 15,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 10,
    },
    navBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: '100%'
    },
    indicator: {
        position: 'absolute',
        top: 0,
        width: 30,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#FF6B00', // ← trait violet en haut
    },
})
