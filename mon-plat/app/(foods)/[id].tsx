// app/(foods)/[id].tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Foods } from '@/types/foods';
import { useCart } from '@/context/CartContext';

const MOCK_FOODS: Foods[] = [
    {
        title: "Honey lime combo",
        type: "Salade",
        content: "Une salade fraîche au miel et citron vert",
        price: 8000,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        quantie: 10,
        authorId: 1
    },
    {
        title: "Burger Classic",
        type: "Burger",
        content: "Burger bœuf avec fromage et salade",
        price: 5500,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        quantie: 5,
        authorId: 1
    },
    {
        title: "Pizza Margherita",
        type: "Pizza",
        content: "Pizza tomate mozzarella basilic",
        price: 7000,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        quantie: 8,
        authorId: 2
    },
    {
        title: "Pizza Margherita",
        type: "Pizza",
        content: "Pizza tomate mozzarella basilic",
        price: 7000,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        quantie: 8,
        authorId: 2
    },
    {
        title: "Pizza Margherita",
        type: "Pizza",
        content: "Pizza tomate mozzarella basilic",
        price: 7000,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        quantie: 8,
        authorId: 2
    },
]
export default function FoodDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);
    const { addToCart } = useCart();

    const food = MOCK_FOODS.find(f => f.title === id);
    if (!food) return <Text>Plat introuvable</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Fond beige en haut */}
            <View style={styles.topBackground}>
                {/* Bouton retour */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name='chevron-back' size={20} color="#333" />
                </TouchableOpacity>

                {/* Image circulaire */}
                <View style={styles.imgWrapper}>
                    <Image source={{ uri: food.image }} style={styles.img} />
                </View>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {/* Card restaurant */}
                <View style={styles.restaurantCard}>
                    <Text style={styles.restaurantName}>Delics {food.type}</Text>
                    <Text style={styles.restaurantAddress}>44 Huynh Tan Phat, District 7</Text>
                    <Text style={styles.restaurantHours}>
                        <Text style={{ color: '#FF6B00', fontWeight: '600' }}>Open </Text>
                        8 am - 10 pm
                    </Text>
                    <View style={styles.restaurantInfo}>
                        <Ionicons name='location-outline' size={14} color="#FF6B00" />
                        <Text style={styles.infoText}>0.67 km</Text>
                        <Ionicons name='checkmark-circle-outline' size={14} color="#FF6B00" />
                        <Text style={styles.infoText}>Verified</Text>
                        <Ionicons name='star-outline' size={14} color="#FF6B00" />
                        <Text style={styles.infoText}>5.0</Text>
                    </View>
                    <View style={styles.restaurantLinks}>
                        <Text style={styles.linkPurple}>Menu</Text>
                        <Text style={styles.linkPink}>999+ Reviews</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Titre + Quantité + Prix */}
                    <Text style={styles.foodTitle}>{food.title}</Text>

                    <View style={styles.quantityRow}>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                                <Ionicons name='remove' size={18} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.qtyBtn}
                                onPress={() => setQuantity(q => q + 1)}
                            >
                                <Ionicons name='add' size={18} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.price}>
                            {(food.price * quantity).toLocaleString()} Fcfa
                        </Text>
                    </View>

                    {/* Ingrédients */}
                    <Text style={styles.sectionTitle}>Contenu du pack :</Text>
                    <Text style={styles.ingredients}>
                        Quinoa rouge, Citron vert, Miel, Myrtilles, Fraises, Mangue, Menthe fraîche.
                    </Text>

                    {/* Description */}
                    <Text style={styles.description}>{food.content}</Text>
                </View>
            </ScrollView>

            {/* Barre du bas fixe */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => setLiked(!liked)}
                >
                    <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={22}
                        color="red"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => {
                        // Ajoute autant de fois que la quantité choisie
                        for (let i = 0; i < quantity; i++) {
                            addToCart(food);
                        }
                    }}
                >
                    <Text style={styles.addToCartText}>Ajouter au panier</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    // Haut beige
    topBackground: {
        backgroundColor: '#fdf3e7',
        alignItems: 'center',
        paddingBottom: 40,
        paddingTop: 10,
    },
    backBtn: {
        position: 'absolute',
        top: 10,
        left: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    imgWrapper: {
        width: 160,
        height: 160,
        borderRadius: 80,
        overflow: 'hidden',
        marginTop: 10,
        elevation: 6,
    },
    img: { width: '100%', height: '100%' },

    // Card restaurant
    body: { flex: 1 },
    restaurantCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: -20,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    restaurantName: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
    restaurantAddress: { fontSize: 13, color: '#888', marginTop: 4 },
    restaurantHours: { fontSize: 13, color: '#444', marginTop: 4 },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
    },
    infoText: { fontSize: 12, color: '#444', marginRight: 6 },
    restaurantLinks: {
        flexDirection: 'row',
        gap: 40,
        marginTop: 10,
    },
    linkPurple: { color: '#FF6B00', fontWeight: '600', fontSize: 14 },
    linkPink: { color: '#ff6b9d', fontWeight: '600', fontSize: 14 },

    // Contenu principal
    content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
    foodTitle: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },

    // Quantité
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    qtyBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1.5,
        borderColor: '#FF6B00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyValue: { fontSize: 18, fontWeight: '600', color: 'black' },
    price: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },

    // Ingrédients
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        borderBottomWidth: 2,
        borderBottomColor: '#ff6b9d',
        paddingBottom: 4,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    ingredients: { fontSize: 14, color: '#444', lineHeight: 22, marginBottom: 20 },
    description: { fontSize: 13, color: '#888', lineHeight: 20 },

    // Barre bas
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    heartBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FF6B00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
