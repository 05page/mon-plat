import { useCart } from '@/context/CartContext'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Basket() {
    const router = useRouter()
    const { cart, removeFromCart, total } = useCart()

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name='chevron-back' size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mon Panier</Text>
            </View>

            {/* Liste des articles */}
            <FlatList
                data={cart}
                keyExtractor={(item) => item.title}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        {item.image && (
                            <Image source={{ uri: item.image }} style={styles.img} />
                        )}
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemType}>{item.type}</Text>
                            <Text style={styles.itemPrice}>
                                {(item.price * item.quantity).toLocaleString()} Fcfa
                            </Text>
                        </View>
                        <View style={styles.itemRight}>
                            <Text style={styles.itemQty}>x{item.quantity}</Text>
                            <TouchableOpacity onPress={() => removeFromCart(item.title)}>
                                <Ionicons name='trash-outline' size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name='cart-outline' size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Votre panier est vide</Text>
                    </View>
                }
            />

            {/* Total + Commander */}
            {cart.length > 0 && (
                <View style={styles.bottomBar}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalPrice}>{total.toLocaleString()} Fcfa</Text>
                    </View>
                    <TouchableOpacity style={styles.orderBtn}>
                        <Text style={styles.orderBtnText}>Commander</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backBtn: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 16,
    },
    list: { padding: 16, gap: 12 },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        gap: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    itemInfo: { flex: 1 },
    itemTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
    itemType: { fontSize: 12, color: '#999', marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: '700', color: '#b066cc', marginTop: 4 },
    itemRight: { alignItems: 'center', gap: 8 },
    itemQty: { fontSize: 14, fontWeight: '600', color: '#444' },
    empty: { alignItems: 'center', marginTop: 80, gap: 12 },
    emptyText: { fontSize: 16, color: '#999' },
    bottomBar: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        gap: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: { fontSize: 18, fontWeight: '700' },
    totalPrice: { fontSize: 18, fontWeight: '700', color: '#FF6B00' },
    orderBtn: {
        backgroundColor: '#FF6B00',
        padding: 16,
        borderRadius: 25,
        alignItems: 'center',
    },
    orderBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
