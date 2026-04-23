import { Foods } from '@/types/foods';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
export default function Card({ title, type, price, image }: Foods) {
    const [liked, setLiked] = useState(false);
    const router = useRouter()

    return (
        <View>
            <TouchableOpacity  style={styles.card}
                onPress={() => router.push({
                pathname: '/(foods)/[id]',
                params: { id: title }
            })}
            >
                <TouchableOpacity style={styles.heartBtn} onPress={() => setLiked(!liked)}>
                    <Ionicons name='heart' size={45} style={{ color: liked ? 'red' : '#ccc', fontSize: 18 }} />
                </TouchableOpacity>

                {image && (
                    <View style={styles.imgWrapper}>
                        <Image source={{ uri: image }} style={styles.img} />
                    </View>
                )}

                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.type}>{type}</Text>

                    <View style={styles.contentBottom}>
                        <Text style={styles.price}>{price.toLocaleString()} Fcfa</Text>
                        <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
                            <Text style={styles.addBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    list: {
        padding: 16,
        gap: 16,
    },
    row: {
        gap: 16,
        justifyContent: 'center',
    },
    card: {
        width: 150,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingBottom: 12,
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5
    },
    heartBtn: {
        position: 'absolute',
        top: 10,
        right: 12,
        zIndex: 1
    },
    content: {
        width: "100%",
        paddingHorizontal: 14,
        marginTop: 12,
    },
    contentBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    img: {
        width: '100%',
        height: '100%',
    },
    imgWrapper: {
        marginTop: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    type: {
        fontSize: 12,
        color: '#999',
    },
    price: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FF6B00'
    },
    addBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: {
        fontSize: 20,
        color: 'black',
        lineHeight: 24,
    }
})
