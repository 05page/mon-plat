import { API_URL } from '@/constants/api'
import { useAuth } from '@/context/AuthContext'
import LoadingComponent from '@/components/Loading'
import RefreshComponent from '@/components/refresh'
import { useAppTheme } from '@/constants/theme'
import { User } from '@/types/auth'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function getStatusLabel(status: string) {
    switch (status) {
        case 'PAID': return 'Payée'
        case 'CANCELLED': return 'Annulée'
        default: return 'En attente'
    }
}

function getStatusColor(status: string, theme: ReturnType<typeof useAppTheme>) {
    switch (status) {
        case 'PAID': return theme.colors.success
        case 'CANCELLED': return theme.colors.danger
        default: return theme.colors.primary
    }
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

type Stats = {
    totalVentes: number
    chiffreAffaires: number
    quantiteTotale: number
}

export default function SellerDashboard() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { token } = useAuth()

    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState<Stats | null>(null)
    const [sales, setSales] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleLoad()
    }, [])

    // Charge le profil, les stats et les ventes en parallèle avec Promise.all
    // Les 3 requêtes partent en même temps → résultat 3x plus rapide qu'en série
    const handleLoad = async () => {
        setLoading(true)
        try {
            const headers = { Authorization: `Bearer ${token}` }

            const [meRes, statsRes, salesRes] = await Promise.all([
                fetch(`${API_URL}/me`, { headers }),
                fetch(`${API_URL}/orders/stats`, { headers }),
                fetch(`${API_URL}/orders/sales`, { headers })
            ])

            const meData = await meRes.json()
            const statsData = await statsRes.json()
            const salesData = await salesRes.json()

            if (meRes.ok) setUser(meData)
            if (statsRes.ok) setStats(statsData)
            if (salesRes.ok && Array.isArray(salesData)) setSales(salesData.slice(0, 5))

        } catch (error) {
            console.error('Dashboard erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <FlatList
                data={sales}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}

                ListHeaderComponent={
                    <View style={styles.headerContent}>

                        {/* Barre du haut */}
                        <View style={styles.topbar}>
                            <Text style={styles.eyebrow}>Mon Plat · Vendeur</Text>
                            <RefreshComponent onRefresh={handleLoad} />
                        </View>

                        {loading && <LoadingComponent />}

                        {/* Carte profil vendeur */}
                        {!loading && user && (
                            <View style={styles.profileCard}>
                                <View style={styles.avatarWrapper}>
                                    <Image
                                        source={{ uri: user.avatar ?? undefined }}
                                        style={styles.avatar}
                                    />
                                    {/* Icône boutique superposée sur l'avatar */}
                                    <View style={styles.shopBadge}>
                                        <Ionicons name='storefront' size={12} color='#fff' />
                                    </View>
                                </View>

                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileName}>{user.fullname}</Text>
                                    <Text style={styles.profileEmail}>{user.email}</Text>
                                    <View style={styles.rolePill}>
                                        <Text style={styles.roleText}>VENDEUR</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Cartes de statistiques */}
                        {!loading && stats && (
                            <>
                                <Text style={styles.sectionTitle}>Performances</Text>
                                <View style={styles.statsRow}>
                                    <View style={styles.statCard}>
                                        <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '18' }]}>
                                            <Ionicons name='receipt-outline' size={20} color={theme.colors.primary} />
                                        </View>
                                        <Text style={styles.statValue}>{stats.totalVentes}</Text>
                                        <Text style={styles.statLabel}>Ventes</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '18' }]}>
                                            <Ionicons name='cash-outline' size={20} color={theme.colors.success} />
                                        </View>
                                        <Text style={styles.statValue} numberOfLines={1}>
                                            {stats.chiffreAffaires.toLocaleString()}
                                        </Text>
                                        <Text style={styles.statLabel}>Fcfa</Text>
                                    </View>
                                    <View style={styles.statCard}>
                                        <View style={[styles.statIcon, { backgroundColor: theme.colors.muted + '18' }]}>
                                            <Ionicons name='cube-outline' size={20} color={theme.colors.muted} />
                                        </View>
                                        <Text style={styles.statValue}>{stats.quantiteTotale}</Text>
                                        <Text style={styles.statLabel}>Articles</Text>
                                    </View>
                                </View>
                            </>
                        )}

                        {/* Raccourcis d'action */}
                        {!loading && (
                            <>
                                <Text style={styles.sectionTitle}>Actions</Text>
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/(seller)/catalogue' as any)}
                                    >
                                        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '18' }]}>
                                            <Ionicons name='grid-outline' size={22} color={theme.colors.primary} />
                                        </View>
                                        <Text style={styles.actionLabel}>Mon catalogue</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/(seller)/add' as any)}
                                    >
                                        <View style={[styles.actionIcon, { backgroundColor: theme.colors.success + '18' }]}>
                                            <Ionicons name='add-circle-outline' size={22} color={theme.colors.success} />
                                        </View>
                                        <Text style={styles.actionLabel}>Ajouter un plat</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        activeOpacity={0.8}
                                        onPress={() => router.push('/(wallet)' as any)}
                                    >
                                        <View style={[styles.actionIcon, { backgroundColor: '#F59E0B18' }]}>
                                            <Ionicons name='wallet-outline' size={22} color='#F59E0B' />
                                        </View>
                                        <Text style={styles.actionLabel}>Mon wallet</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Titre section ventes récentes */}
                        {!loading && sales.length > 0 && (
                            <Text style={styles.sectionTitle}>Ventes récentes</Text>
                        )}
                    </View>
                }

                renderItem={({ item }) => (
                    <View style={styles.saleCard}>
                        <View style={styles.saleLeft}>
                            <Text style={styles.saleName} numberOfLines={1}>{item.post.title}</Text>
                            <Text style={styles.saleClient}>{item.order.user.fullname}</Text>
                            <Text style={styles.saleDate}>{formatDate(item.order.created_at)}</Text>
                        </View>
                        <View style={styles.saleRight}>
                            <Text style={styles.saleAmount}>
                                {(item.unitPrice * item.quantity).toLocaleString()} F
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(item.order.status, theme) + '22' }
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    { color: getStatusColor(item.order.status, theme) }
                                ]}>
                                    {getStatusLabel(item.order.status)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.empty}>
                            <Ionicons name='storefront-outline' size={38} color={theme.colors.muted} />
                            <Text style={styles.emptyText}>Aucune vente pour l'instant</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    )
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        list: {
            padding: 20,
            paddingBottom: 40,
            gap: 10,
        },
        headerContent: {
            gap: 16,
            marginBottom: 8,
        },
        topbar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        eyebrow: {
            color: theme.colors.primary,
            fontSize: 13,
            fontWeight: '800',
            textTransform: 'uppercase',
        },

        // --- Profil ---
        profileCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            backgroundColor: theme.colors.surface,
            borderRadius: 18,
            padding: 18,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        avatarWrapper: {
            position: 'relative',
        },
        avatar: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.colors.surfaceAlt,
        },
        shopBadge: {
            position: 'absolute',
            bottom: 0,
            right: -2,
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: theme.colors.surface,
        },
        profileInfo: {
            flex: 1,
            gap: 3,
        },
        profileName: {
            fontSize: 18,
            fontWeight: '900',
            color: theme.colors.text,
        },
        profileEmail: {
            fontSize: 13,
            color: theme.colors.muted,
        },
        rolePill: {
            alignSelf: 'flex-start',
            backgroundColor: theme.colors.primary + '18',
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 3,
            marginTop: 4,
        },
        roleText: {
            fontSize: 10,
            fontWeight: '900',
            color: theme.colors.primary,
            textTransform: 'uppercase',
        },

        // --- Stats ---
        sectionTitle: {
            fontSize: 17,
            fontWeight: '900',
            color: theme.colors.text,
        },
        statsRow: {
            flexDirection: 'row',
            gap: 10,
        },
        statCard: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        statIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        statValue: {
            fontSize: 17,
            fontWeight: '900',
            color: theme.colors.text,
        },
        statLabel: {
            fontSize: 11,
            color: theme.colors.muted,
            fontWeight: '700',
        },

        // --- Actions ---
        actionsRow: {
            flexDirection: 'row',
            gap: 10,
        },
        actionBtn: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 14,
            alignItems: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        actionIcon: {
            width: 46,
            height: 46,
            borderRadius: 23,
            alignItems: 'center',
            justifyContent: 'center',
        },
        actionLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: theme.colors.text,
            textAlign: 'center',
        },

        // --- Ventes ---
        saleCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        saleLeft: {
            flex: 1,
            gap: 2,
        },
        saleName: {
            fontSize: 14,
            fontWeight: '800',
            color: theme.colors.text,
        },
        saleClient: {
            fontSize: 12,
            color: theme.colors.muted,
        },
        saleDate: {
            fontSize: 11,
            color: theme.colors.muted,
        },
        saleRight: {
            alignItems: 'flex-end',
            gap: 6,
        },
        saleAmount: {
            fontSize: 15,
            fontWeight: '900',
            color: theme.colors.text,
        },
        statusBadge: {
            borderRadius: 999,
            paddingHorizontal: 8,
            paddingVertical: 3,
        },
        statusText: {
            fontSize: 11,
            fontWeight: '800',
        },
        empty: {
            alignItems: 'center',
            gap: 10,
            marginTop: 32,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.muted,
            fontWeight: '600',
        },
    })
}
