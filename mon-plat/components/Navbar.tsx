import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useSegments } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const NAV_ITEMS = [
    { label: 'Accueil', name: 'home-outline', active: 'home', route: '/(foods)', segment: '(foods)' },
    { label: 'Panier', name: 'basket-outline', active: 'basket', route: '/basket', segment: 'basket' },
    { label: 'Profil', name: 'person-outline', active: 'person', route: '/(profile)', segment: '(profile)' },
]

export default function Navbar() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const segments = useSegments()

    return (
        <View style={styles.content}>
            {NAV_ITEMS.map((item) => {
                const isActive = segments.map(String).includes(item.segment)

                return (
                    <TouchableOpacity
                        key={item.label}
                        style={[styles.navBtn, isActive && styles.navBtnActive]}
                        onPress={() => router.push(item.route as any)}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={(isActive ? item.active : item.name) as any}
                            size={22}
                            color={isActive ? theme.colors.primary : theme.colors.muted}
                        />
                        <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    content: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        height: 72,
        borderRadius: theme.radius.lg,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 8,
    },
    navBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: 54,
        borderRadius: theme.radius.md,
        gap: 3,
    },
    navBtnActive: {
        backgroundColor: theme.colors.surfaceAlt,
    },
    label: {
        fontSize: 11,
        color: theme.colors.muted,
        fontWeight: '600',
    },
    labelActive: {
        color: theme.colors.primary,
    },
})
