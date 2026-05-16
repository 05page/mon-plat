import { useAppTheme } from '@/constants/theme'
import { useCart } from '@/context/CartContext'
import { Foods } from '@/types/foods'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const MOCK_FOODS: Foods[] = [
    {
        title: 'Honey lime combo',
        type: 'Salade',
        content: 'Une salade fraiche au miel et citron vert',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        quantie: 10,
        authorId: 1,
    },
    {
        title: 'Burger Classic',
        type: 'Burger',
        content: 'Burger boeuf avec fromage et salade',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        quantie: 5,
        authorId: 1,
    },
    {
        title: 'Pizza Margherita',
        type: 'Pizza',
        content: 'Pizza tomate mozzarella basilic',
        price: 7000,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        quantie: 8,
        authorId: 2,
    },
    {
        title: 'Poulet braise',
        type: 'Grillade',
        content: 'Poulet marine, attieke et sauce oignon',
        price: 6500,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
        quantie: 7,
        authorId: 2,
    },
]

export default function FoodDetail() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)
    const [liked, setLiked] = useState(false)
    const { addToCart } = useCart()

    const food = MOCK_FOODS.find((item) => item.title === id)
    if (!food) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.notFound}>Plat introuvable</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.hero}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                        <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => setLiked(!liked)}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={liked ? 'heart' : 'heart-outline'}
                            size={21}
                            color={liked ? theme.colors.danger : theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.imageWrap}>
                    <Image source={{ uri: food.image }} style={styles.image} />
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.type}>{food.type}</Text>
                    <Text style={styles.foodTitle}>{food.title}</Text>
                    <Text style={styles.description}>{food.content}</Text>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name='star' size={16} color={theme.colors.primary} />
                            <Text style={styles.metaText}>5.0</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name='location-outline' size={16} color={theme.colors.primary} />
                            <Text style={styles.metaText}>0.67 km</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name='time-outline' size={16} color={theme.colors.primary} />
                            <Text style={styles.metaText}>20 min</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dans le pack</Text>
                    <Text style={styles.ingredients}>
                        Quinoa rouge, citron vert, miel, myrtilles, fraises, mangue et menthe fraiche.
                    </Text>
                </View>

                <View style={styles.quantityRow}>
                    <View>
                        <Text style={styles.priceLabel}>Total</Text>
                        <Text style={styles.price}>{(food.price * quantity).toLocaleString()} Fcfa</Text>
                    </View>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => setQuantity((value) => Math.max(1, value - 1))}
                        >
                            <Ionicons name='remove' size={18} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => setQuantity((value) => value + 1)}
                        >
                            <Ionicons name='add' size={18} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addToCartBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                        for (let i = 0; i < quantity; i++) {
                            addToCart(food)
                        }
                        router.push('/(foods)/basket')
                    }}
                >
                    <Ionicons name='basket-outline' size={20} color="#fff" />
                    <Text style={styles.addToCartText}>Ajouter au panier</Text>
                </TouchableOpacity>
            </View>
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
    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    imageWrap: {
        alignSelf: 'center',
        width: 220,
        height: 220,
        borderRadius: 110,
        overflow: 'hidden',
        marginVertical: 20,
        backgroundColor: theme.colors.surfaceAlt,
        borderWidth: 8,
        borderColor: theme.colors.surface,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: 8,
    },
    type: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    foodTitle: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '900',
        color: theme.colors.text,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        color: theme.colors.muted,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: theme.radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    metaText: {
        color: theme.colors.text,
        fontSize: 12,
        fontWeight: '700',
    },
    section: {
        marginTop: 22,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: theme.colors.text,
    },
    ingredients: {
        color: theme.colors.muted,
        fontSize: 15,
        lineHeight: 23,
    },
    quantityRow: {
        marginTop: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 18,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    priceLabel: {
        color: theme.colors.muted,
        fontWeight: '700',
        fontSize: 12,
    },
    price: {
        color: theme.colors.text,
        fontSize: 21,
        fontWeight: '900',
        marginTop: 2,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    qtyBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyValue: {
        minWidth: 20,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '900',
        color: theme.colors.text,
    },
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        paddingBottom: 18,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    addToCartBtn: {
        height: 54,
        borderRadius: theme.radius.pill,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    notFound: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: '800',
        margin: 24,
    },
})
