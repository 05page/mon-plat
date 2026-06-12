import { API_URL } from '@/constants/api'
import { useAuth } from '@/context/AuthContext'
import LoadingComponent from '@/components/Loading'
import RefreshComponent from '@/components/refresh'
import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

// Décode le payload du JWT sans bibliothèque externe
// Le JWT est structuré en 3 parties séparées par des points : header.payload.signature
// Le payload est encodé en base64 — atob() le décode, JSON.parse() le transforme en objet
function getSellerIdFromToken(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId
    } catch {
        return null
    }
}

export default function SellerCatalogue() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { token } = useAuth()

    const [dishes, setDishes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const sellerId = token ? getSellerIdFromToken(token) : null

    useEffect(() => {
        handleLoad()
    }, [])

    // Récupère tous les plats publiés et filtre ceux du vendeur connecté
    // On utilise authorId === sellerId pour ne garder que SES plats
    const handleLoad = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/foods/catalogue`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (Array.isArray(data)) {
                // Filtre pour n'afficher que les plats du vendeur connecté
                setDishes(data.filter((p: any) => p.authorId === sellerId))
            } else {
                setDishes([])
            }
        } catch (error) {
            console.error('Catalogue erreur:', error)
        } finally {
            setLoading(false)
        }
    }

    // Demande confirmation avant de supprimer, puis appelle l'API DELETE
    // Alert.alert est le composant natif de confirmation (comme window.confirm sur web)
    const handleDelete = (id: number, title: string) => {
        Alert.alert(
            'Supprimer ce plat ?',
            `"${title}" sera retiré du catalogue.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/foods/catlogue/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                            })
                            if (!response.ok) {
                                Toast.show({ type: 'error', text1: 'Erreur', text2: 'Suppression échouée' })
                                return
                            }
                            // Mise à jour locale : retire le plat de la liste sans refetch
                            setDishes(prev => prev.filter(d => d.id !== id))
                            Toast.show({ type: 'success', text1: 'Plat supprimé' })
                        } catch {
                            Toast.show({ type: 'error', text1: 'Erreur réseau' })
                        }
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Mon catalogue</Text>
                <RefreshComponent onRefresh={handleLoad} />
            </View>

            {loading ? <LoadingComponent /> : (
                <FlatList
                    data={dishes}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}

                    ListHeaderComponent={
                        <TouchableOpacity
                            style={styles.addBtn}
                            activeOpacity={0.85}
                            onPress={() => router.push('/(seller)/add' as any)}
                        >
                            <Ionicons name='add-circle-outline' size={20} color='#fff' />
                            <Text style={styles.addBtnText}>Ajouter un plat</Text>
                        </TouchableOpacity>
                    }

                    renderItem={({ item }) => (
                        <View style={styles.dishCard}>
                            {/* Image du plat (ou placeholder si pas d'image) */}
                            {item.image
                                ? <Image source={{ uri: item.image }} style={styles.dishImage} />
                                : (
                                    <View style={[styles.dishImage, styles.dishImagePlaceholder]}>
                                        <Ionicons name='image-outline' size={24} color={theme.colors.muted} />
                                    </View>
                                )
                            }

                            <View style={styles.dishInfo}>
                                <Text style={styles.dishTitle} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.dishType}>{item.type}</Text>
                                <View style={styles.dishMeta}>
                                    <Text style={styles.dishPrice}>{item.price.toLocaleString()} Fcfa</Text>
                                    <Text style={styles.dishQty}>Qté : {item.quantie}</Text>
                                </View>
                            </View>

                            {/* Bouton supprimer */}
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => handleDelete(item.id, item.title)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name='trash-outline' size={20} color={theme.colors.danger} />
                            </TouchableOpacity>
                        </View>
                    )}

                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name='grid-outline' size={38} color={theme.colors.muted} />
                            <Text style={styles.emptyTitle}>Aucun plat</Text>
                            <Text style={styles.emptyText}>Commencez par ajouter votre premier plat au catalogue.</Text>
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
            flex: 1,
            fontSize: 24,
            fontWeight: '900',
            color: theme.colors.text,
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 32,
            gap: 12,
        },
        addBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 14,
            padding: 14,
            marginBottom: 4,
        },
        addBtnText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 15,
        },
        dishCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 12,
            gap: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        dishImage: {
            width: 64,
            height: 64,
            borderRadius: 10,
        },
        dishImagePlaceholder: {
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dishInfo: {
            flex: 1,
            gap: 3,
        },
        dishTitle: {
            fontSize: 15,
            fontWeight: '800',
            color: theme.colors.text,
        },
        dishType: {
            fontSize: 12,
            color: theme.colors.primary,
            fontWeight: '700',
        },
        dishMeta: {
            flexDirection: 'row',
            gap: 10,
            marginTop: 2,
        },
        dishPrice: {
            fontSize: 13,
            fontWeight: '800',
            color: theme.colors.text,
        },
        dishQty: {
            fontSize: 12,
            color: theme.colors.muted,
        },
        deleteBtn: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: theme.colors.danger + '18',
            alignItems: 'center',
            justifyContent: 'center',
        },
        empty: {
            alignItems: 'center',
            gap: 10,
            marginTop: 48,
            paddingHorizontal: 20,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '900',
            color: theme.colors.text,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.muted,
            textAlign: 'center',
        },
    })
}
