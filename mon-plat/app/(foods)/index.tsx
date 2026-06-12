import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import RefreshComponent from '@/components/refresh'
import LoadingComponent from '@/components/Loading'
import { useAppTheme } from '@/constants/theme'
import { API_URL } from '@/constants/api'
import { useAuth } from '@/context/AuthContext'
import { Foods } from '@/types/foods'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FoodsScreen() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { token } = useAuth()  // ← le token JWT pour les requêtes protégées

    const [foods, setFoods] = useState<Foods[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        handleGetFoods()
    }, [])

    // Récupère la liste des plats disponibles depuis l'API
    // Attention : l'API retourne soit un tableau, soit { data: "Aucun plat disponible" }
    // On vérifie avec Array.isArray() avant de sauvegarder pour éviter d'écraser le state avec un objet
    const handleGetFoods = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/foods/catalogue`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (Array.isArray(data)) {
                setFoods(data)
            } else {
                setFoods([])  // catalogue vide → on remet un tableau vide
            }
        } catch (error) {
            console.error('Erreur catalogue:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.safe}>
            <FlatList
                data={foods}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <Card {...item} />}

                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        {/* Barre du haut : titre + boutons refresh & notifs */}
                        <View style={styles.topbar}>
                            <View>
                                <Text style={styles.eyebrow}>Mon Plat</Text>
                                <Text style={styles.title}>Bonjour 👋</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RefreshComponent onRefresh={handleGetFoods} />
                                <TouchableOpacity
                                    style={styles.cartBtn}
                                    onPress={() => router.push('/notification')}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name='notifications-outline' size={22} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.subtitle}>Que voulez-vous manger {"aujourd'hui"} ?</Text>

                        <View style={styles.searchContainer}>
                            <Ionicons name='search' size={20} color={theme.colors.muted} />
                            <TextInput
                                style={styles.input}
                                placeholder='Rechercher un plat'
                                placeholderTextColor={theme.colors.muted}
                            />
                            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.75}>
                                <Ionicons name='options-outline' size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recommandations</Text>
                            <Text style={styles.sectionHint}>
                                {loading ? 'Chargement…' : `${foods.length} plats`}
                            </Text>
                        </View>

                        {/* Spinner affiché pendant le chargement, en dessous du header */}
                        {loading && <LoadingComponent />}
                    </View>
                }

                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyState}>
                            <Ionicons name='restaurant-outline' size={40} color={theme.colors.muted} />
                            <Text style={styles.emptyText}>Aucun plat disponible</Text>
                        </View>
                    ) : null
                }
            />
            <Navbar />
        </SafeAreaView>
    )
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
        safe: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        list: {
            padding: theme.spacing.screen,
            paddingBottom: 110,
            gap: 16,
        },
        row: {
            gap: 14,
        },
        headerContent: {
            gap: 18,
            marginBottom: 2,
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
        title: {
            fontSize: 30,
            lineHeight: 36,
            fontWeight: '900',
            color: theme.colors.text,
            marginTop: 2,
        },
        subtitle: {
            fontSize: 17,
            lineHeight: 24,
            color: theme.colors.muted,
            maxWidth: 260,
        },
        cartBtn: {
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        searchContainer: {
            height: 54,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            paddingHorizontal: 16,
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        input: {
            flex: 1,
            color: theme.colors.text,
            fontSize: 15,
        },
        filterBtn: {
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: theme.colors.text,
        },
        sectionHint: {
            fontSize: 13,
            fontWeight: '700',
            color: theme.colors.muted,
        },
        emptyState: {
            alignItems: 'center',
            gap: 10,
            marginTop: 24,
        },
        emptyText: {
            color: theme.colors.muted,
            fontWeight: '700',
            fontSize: 15,
        },
    })
}
