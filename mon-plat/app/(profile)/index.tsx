import EditProfileModal from '@/components/EditProfil'
import { useCart } from '@/context/CartContext'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    Image, ScrollView, StyleSheet,
    Text, TouchableOpacity, View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
    const router = useRouter()
    const { cart } = useCart()
    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState({
        fullname: "Jean Kouassi",
        email: "jean.kouassi@gmail.com",
        telephone: "+225 07 00 00 00",
        role: "client",
        avatar: "https://i.pravatar.cc/150?img=8"
    })

    const stats = [
        { label: 'Commandes', value: '12', icon: 'receipt-outline' },
        { label: 'Favoris', value: '5', icon: 'heart-outline' },
        { label: 'Panier', value: cart.length.toString(), icon: 'cart-outline' },
    ]

    const menuItems = [
        { label: 'Mes commandes', icon: 'receipt-outline', route: '/orders' },
        { label: 'Mes favoris', icon: 'heart-outline', route: '/favorites' },
        { label: 'Adresses', icon: 'location-outline', route: '/addresses' },
        { label: 'Notifications', icon: 'notifications-outline', route: '/notifications' },
        { label: 'Aide & Support', icon: 'help-circle-outline', route: '/support' },
    ]

    const handleLogout = () => {
        router.replace('/(auth)/register')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mon Profil</Text>
                </View>

                {/* Avatar + Infos */}
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

                    {/* Bouton modifier */}
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name='pencil-outline' size={16} color="#fff" />
                        <Text style={styles.editBtnText}>Modifier le profil</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <Ionicons name={stat.icon as any} size={22} color="#FF6B00" />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu */}
                <View style={styles.menu}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.menuIcon}>
                                    <Ionicons name={item.icon as any} size={20} color="#FF6B00" />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name='chevron-forward' size={18} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Déconnexion */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name='log-out-outline' size={20} color="#FF6B00" />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Modal modification */}
            <EditProfileModal
                visible={modalVisible}
                user={user}
                onClose={() => setModalVisible(false)}
                onSave={(data) => setUser(prev => ({ ...prev, ...data }))}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#1a1a1a' },

    // Profil
    profileSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        padding: 24,
        gap: 6,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
    },
    avatarWrapper: { position: 'relative', marginBottom: 8 },
    avatar: { width: 90, height: 90, borderRadius: 45 },
    roleBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6B00',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    roleText: { color: '#fff', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    fullname: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
    email: { fontSize: 14, color: '#888' },
    phone: { fontSize: 14, color: '#888' },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FF6B00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginTop: 10,
    },
    editBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

    // Stats
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    statValue: { fontSize: 20, fontWeight: '800', color: '#1a1a1a' },
    statLabel: { fontSize: 11, color: '#999' },

    // Menu
    menu: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#FF6B00',
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    menuIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: { fontSize: 15, color: '#1a1a1a', fontWeight: '500' },

    // Déconnexion
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        margin: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 25,
        backgroundColor: '#fff5f5',
        borderWidth: 1.5,
        borderColor: '#ffcccc',
        marginBottom: 32,
    },
    logoutText: { fontSize: 15, color: 'black', fontWeight: '700' },
})
