import EditProfileModal from '@/components/EditProfil'
import Navbar from '@/components/Navbar'
import { useAppTheme } from '@/constants/theme'
import { useCart } from '@/context/CartContext'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { cart } = useCart()
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState({
        fullname: 'Jean Kouassi',
        email: 'jean.kouassi@gmail.com',
        telephone: '+225 07 00 00 00',
        role: 'client',
        avatar: 'https://i.pravatar.cc/150?img=8',
    })

    const stats = [
        { label: 'Commandes', value: '12', icon: 'receipt-outline' },
        { label: 'Panier', value: cart.length.toString(), icon: 'basket-outline' },
    ]

    const menuItems = [
        { label: 'Mes commandes', icon: 'receipt-outline', route: '/(orders)' },
        { label: 'Mon Wallet', icon: 'wallet-outline', route: '/(wallet)' },
        { label: 'Aide & Support', icon: 'help-circle-outline' },
    ]

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>Mon profil</Text>

                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{user.role}</Text>
                        </View>
                    </View>
                    <Text style={styles.fullname}>{user.fullname}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <Text style={styles.phone}>{user.telephone}</Text>

                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.85}
                    >
                        <Ionicons name='pencil-outline' size={16} color="#fff" />
                        <Text style={styles.editBtnText}>Modifier le profil</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    {stats.map((stat) => (
                        <View key={stat.label} style={styles.statCard}>
                            <Ionicons name={stat.icon as any} size={21} color={theme.colors.primary} />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.menu}>
                    {menuItems.map((item) => (
                        <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.75}
                        onPress={() => item.route && router.push(item.route as any)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.menuIcon}>
                                    <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name='chevron-forward' size={18} color={theme.colors.muted} />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => router.replace('/(auth)/register')}
                    activeOpacity={0.85}
                >
                    <Ionicons name='log-out-outline' size={20} color={theme.colors.primary} />
                    <Text style={styles.logoutText}>Se deconnecter</Text>
                </TouchableOpacity>
            </ScrollView>

            <EditProfileModal
                visible={modalVisible}
                user={user}
                onClose={() => setModalVisible(false)}
                onSave={(data) => setUser((prev) => ({ ...prev, ...data }))}
            />
            <Navbar />
        </SafeAreaView>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.screen,
        paddingBottom: 116,
    },
    headerTitle: {
        fontSize: 30,
        lineHeight: 36,
        fontWeight: '900',
        color: theme.colors.text,
        marginBottom: 18,
    },
    profileSection: {
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 24,
        gap: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    roleBadge: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.pill,
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderWidth: 2,
        borderColor: theme.colors.surface,
    },
    roleText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    fullname: {
        fontSize: 21,
        fontWeight: '900',
        color: theme.colors.text,
    },
    email: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    phone: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: theme.radius.pill,
        marginTop: 12,
    },
    editBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        paddingVertical: 16,
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: 11,
        color: theme.colors.muted,
        fontWeight: '700',
    },
    menu: {
        backgroundColor: theme.colors.surface,
        marginTop: 16,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuIcon: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        fontSize: 15,
        color: theme.colors.text,
        fontWeight: '700',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        padding: 16,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    logoutText: {
        fontSize: 15,
        color: theme.colors.text,
        fontWeight: '800',
    },
})
