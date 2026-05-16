import { useAppTheme } from '@/constants/theme'
import { useCart } from '@/context/CartContext'
import PayCard from '@/components/PayCard'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Données fictives — à remplacer par les vraies données du contexte utilisateur plus tard
const MOCK_USER = {
    fullname: 'Kouamé Jean',
    email: 'kouame.jean@gmail.com',
    telephone: '0703456789',
    adress: '12 Rue des Bananiers, Cocody',
}

export default function Basket() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { cart, removeFromCart, total } = useCart()
    const [showPayCard, setShowPayCard] = useState(false)

    return (
        <>
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Mon panier</Text>
                    <Text style={styles.headerSubtitle}>{cart.length} article(s)</Text>
                </View>
            </View>

            <FlatList
                data={cart}
                keyExtractor={(item) => item.title}
                contentContainerStyle={[styles.list, cart.length === 0 && styles.emptyList]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        {item.image && <Image source={{ uri: item.image }} style={styles.img} />}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.itemType}>{item.type}</Text>
                            <Text style={styles.itemPrice}>
                                {(item.price * item.quantity).toLocaleString()} Fcfa
                            </Text>
                        </View>
                        <View style={styles.itemRight}>
                            <Text style={styles.itemQty}>x{item.quantity}</Text>
                            <TouchableOpacity
                                style={styles.trashBtn}
                                onPress={() => removeFromCart(item.title)}
                                activeOpacity={0.75}
                            >
                                <Ionicons name='trash-outline' size={18} color={theme.colors.danger} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name='basket-outline' size={34} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.emptyTitle}>Panier vide</Text>
                        <Text style={styles.emptyText}>Ajoutez un plat depuis {"l'accueil"} pour commencer.</Text>
                        <TouchableOpacity
                            style={styles.emptyBtn}
                            onPress={() => router.replace('/(foods)')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.emptyBtnText}>Voir les plats</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {cart.length > 0 && (
                <View style={styles.bottomBar}>
                    <View>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalPrice}>{total.toLocaleString()} Fcfa</Text>
                    </View>
                    <TouchableOpacity style={styles.orderBtn} activeOpacity={0.85} onPress={() => setShowPayCard(true)}>
                        <Text style={styles.orderBtnText}>Commander</Text>
                        <Ionicons name='arrow-forward' size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>

        <PayCard
            visible={showPayCard}
            totalPrice={total}
            user={MOCK_USER}
            onClose={() => setShowPayCard(false)}
            onPayDelivery={(data) => {
                setShowPayCard(false)
                console.log('Paiement à la livraison :', data)
            }}
        />
        </>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: theme.spacing.screen,
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
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
    },
    headerSubtitle: {
        fontSize: 13,
        color: theme.colors.muted,
        fontWeight: '700',
        marginTop: 2,
    },
    list: {
        paddingHorizontal: theme.spacing.screen,
        paddingBottom: 118,
        gap: 12,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    img: {
        width: 68,
        height: 68,
        borderRadius: 18,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: theme.colors.text,
    },
    itemType: {
        fontSize: 12,
        color: theme.colors.muted,
        marginTop: 3,
        fontWeight: '600',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '900',
        color: theme.colors.primary,
        marginTop: 7,
    },
    itemRight: {
        alignItems: 'center',
        gap: 10,
    },
    itemQty: {
        fontSize: 13,
        fontWeight: '900',
        color: theme.colors.text,
        backgroundColor: theme.colors.surfaceAlt,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: theme.radius.pill,
    },
    trashBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.isDark ? '#3A1F1F' : '#FFF1F1',
    },
    empty: {
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 28,
    },
    emptyIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: theme.colors.text,
    },
    emptyText: {
        fontSize: 15,
        color: theme.colors.muted,
        textAlign: 'center',
        lineHeight: 22,
    },
    emptyBtn: {
        marginTop: 12,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.pill,
        paddingHorizontal: 22,
        paddingVertical: 13,
    },
    emptyBtnText: {
        color: '#fff',
        fontWeight: '800',
    },
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: 14,
    },
    totalLabel: {
        fontSize: 12,
        color: theme.colors.muted,
        fontWeight: '800',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '900',
        color: theme.colors.text,
        marginTop: 2,
    },
    orderBtn: {
        flex: 1,
        height: 52,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    orderBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
})
