import Navbar from '@/components/Navbar'
import RefreshComponent from '@/components/refresh'
import { useAppTheme } from '@/constants/theme'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { API_URL } from "@/constants/api"
import { EditProfile, User } from '@/types/auth'
import Toast from 'react-native-toast-message'
import EditProfileModal from "@/components/EditProfil"
import LoadingComponent from "@/components/Loading"

export default function Profile() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { cart } = useCart()
    const { token, logout } = useAuth()

    const [modalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    // Le menu est recalculé dès que user change (grâce au fait que c'est une variable, pas un const hors composant)
    // Les vendeurs ont un lien supplémentaire vers leur tableau de bord
    const menuItems = [
        ...(user?.role === 'SELLER'
            ? [{ label: 'Tableau de bord vendeur', icon: 'storefront-outline', route: '/(seller)' }]
            : []
        ),
        { label: 'Mes commandes', icon: 'receipt-outline', route: '/(orders)' },
        { label: 'Mon Wallet', icon: 'wallet-outline', route: '/(wallet)' },
        { label: 'Aide & Support', icon: 'help-circle-outline' },
    ]

    useEffect(() => {
        handleGetUser()
    }, [])

    // Récupère les infos du user connecté depuis l'API
    const handleGetUser = async () => {
        setLoading(true)
        const response = await fetch(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setUser(data)
        setLoading(false)
    }

    // Met à jour le profil (email + fullname) via l'API
    const handleEditProfil = async () => {
        if (!user?.email || !user.fullname) {
            Toast.show({ type: "error", text1: "Ces champs sont requis" })
            return
        }
        const response = await fetch(`${API_URL}/updateProfil`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                email: user.email,
                fullname: user.fullname,
            })
        })
        const data = await response.json()
        setUser(data.user)
    }

    // Déconnecte le user : appelle l'API pour invalider le token côté serveur,
    // puis vide le state auth local et redirige vers la page de connexion
    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (error) {
            // Si le réseau échoue on déconnecte quand même côté client
            console.error('Erreur logout:', error)
        } finally {
            logout()                         // vide token + user dans AuthContext
            router.replace('/(auth)/login')  // redirige vers la page de connexion
        }
    }

    // --- Rendu du composant ---
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Mon profil</Text>
                    <RefreshComponent onRefresh={handleGetUser} />
                </View>


                {loading ? <LoadingComponent /> :
                    <>
                        < View style={styles.profileSection}>
                            <View style={styles.avatarWrapper}>
                                <Image source={{ uri: user?.avatar ?? undefined }} style={styles.avatar} />
                                <View style={styles.roleBadge}>
                                    <Text style={styles.roleText}>{user?.role}</Text>
                                </View>
                            </View>
                            <Text style={styles.fullname}>{user?.fullname}</Text>
                            <Text style={styles.email}>{user?.email}</Text>
                            <Text style={styles.phone}>{user?.telephone}</Text>

                            <TouchableOpacity
                                style={styles.editBtn}
                                onPress={() => setModalVisible(true)}
                                activeOpacity={0.85}
                            >
                                <Ionicons name='pencil-outline' size={16} color="#fff" />
                                <Text style={styles.editBtnText}>Modifier le profil</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <View style={styles.statsRow}>
                            {stats.map((stat) => (
                                <View key={stat.label} style={styles.statCard}>
                                    <Ionicons name={stat.icon as any} size={21} color={theme.colors.primary} />
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View> */}

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
                            onPress={handleLogout}
                            activeOpacity={0.85}
                        >
                            <Ionicons name='log-out-outline' size={20} color={theme.colors.primary} />
                            <Text style={styles.logoutText}>Se deconnecter</Text>
                        </TouchableOpacity>

                    </>
                }
            </ScrollView>

            {/* Modal d'édition — affiché uniquement si user est chargé */}
            {
                user && (
                    <EditProfileModal
                        visible={modalVisible}
                        user={user}
                        onClose={() => setModalVisible(false)}
                        onSave={(data: EditProfile) => {
                            if (user) setUser({ ...user, ...data })
                        }}
                    />
                )
            }
            <Navbar />
        </SafeAreaView >
    )
}

// createStyles est en dehors du composant pour éviter d'être recréé à chaque render
function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
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
}
