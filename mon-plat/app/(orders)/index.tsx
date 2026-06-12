import { useAppTheme } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { API_URL } from '@/constants/api'
import RefreshComponent from '@/components/refresh'
import LoadingComponent from '@/components/Loading'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Retourne la couleur associée au statut de la commande
// On passe le theme en paramètre pour utiliser les couleurs définies dans le thème
function getStatusColor(status: string, theme: ReturnType<typeof useAppTheme>) {
    switch (status) {
        case 'PAID': return theme.colors.success
        case 'CANCELLED': return theme.colors.danger
        default: return theme.colors.primary  // PENDING
    }
}

// Traduit le statut en texte lisible
function getStatusLabel(status: string) {
    switch (status) {
        case 'PAID': return 'Payée'
        case 'CANCELLED': return 'Annulée'
        default: return 'En attente'
    }
}

// Convertit une date ISO (ex: "2026-05-27T10:00:00Z") en format lisible en français
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

export default function Orders() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { token } = useAuth()

    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleGetOrders()
    }, [])

    // Récupère les commandes du user connecté depuis l'API
    // L'API retourne un tableau OU { data: "Aucune commande" } si aucune commande n'existe
    // → on utilise Array.isArray() pour distinguer les deux cas
    const handleGetOrders = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/orders/mes-commandes`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (Array.isArray(data)) {
                setOrders(data)
            } else {
                setOrders([])
            }
        } catch (error) {
            console.error('Erreur commandes:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header avec bouton retour + refresh */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Mes commandes</Text>
                <RefreshComponent onRefresh={handleGetOrders} />
            </View>

            {/* Affiche un spinner pendant le chargement, sinon la liste */}
            {loading ? <LoadingComponent /> : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}

                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.orderCard}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/(orders)/${item.id}` as any)}
                        >
                            {/* Ligne du haut : numéro + badge de statut */}
                            <View style={styles.cardTop}>
                                <Text style={styles.orderId}>Commande #{item.id}</Text>

                                {/* Le badge change de couleur selon le statut */}
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(item.status, theme) + '22' }
                                    // '22' à la fin = 13% d'opacité en hexadécimal → couleur pastel
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        { color: getStatusColor(item.status, theme) }
                                    ]}>
                                        {getStatusLabel(item.status)}
                                    </Text>
                                </View>
                            </View>

                            {/* Liste des noms des plats commandés (sur une seule ligne) */}
                            {/* item.items est le tableau des lignes de commande, chacune avec un .post.title */}
                            <Text style={styles.itemsPreview} numberOfLines={1}>
                                {item.items.map((i: any) => i.post.title).join(', ')}
                            </Text>

                            {/* Ligne du bas : date et total */}
                            <View style={styles.cardBottom}>
                                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
                                <Text style={styles.total}>{item.totalPrice.toLocaleString()} Fcfa</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name='receipt-outline' size={36} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Aucune commande</Text>
                            <Text style={styles.emptyText}>
                                Vous n'avez pas encore passé de commande. Explorez nos plats et faites votre choix !
                            </Text>
                            <TouchableOpacity
                                style={styles.exploreBtn}
                                activeOpacity={0.85}
                                onPress={() => router.replace('/(foods)')}
                            >
                                <Text style={styles.exploreBtnText}>Voir les plats</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    )
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 18,
        },
        iconBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        title: {
            flex: 1,  // prend l'espace restant pour centrer visuellement
            fontSize: 26,
            fontWeight: '900',
            color: theme.colors.text,
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 32,
            gap: 12,
        },
        orderCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            gap: 8,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        cardTop: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        orderId: {
            fontSize: 15,
            fontWeight: '800',
            color: theme.colors.text,
        },
        statusBadge: {
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '800',
        },
        itemsPreview: {
            fontSize: 13,
            color: theme.colors.muted,
        },
        cardBottom: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
        },
        date: {
            fontSize: 12,
            color: theme.colors.muted,
        },
        total: {
            fontSize: 15,
            fontWeight: '900',
            color: theme.colors.text,
        },
        empty: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            paddingTop: 60,
            gap: 12,
        },
        emptyIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: theme.colors.text,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.muted,
            textAlign: 'center',
            lineHeight: 21,
        },
        exploreBtn: {
            marginTop: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            paddingHorizontal: 24,
            paddingVertical: 13,
        },
        exploreBtnText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 14,
        },
    })
}
