import { useAppTheme } from '@/constants/theme'
import { useCart } from '@/context/CartContext'
import { Foods } from '@/types/foods'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Card(food: Foods) {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const { title, type, price, image } = food
    const [liked, setLiked] = useState(false)
    const router = useRouter()
    const { addToCart } = useCart()

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.86}
            onPress={() => router.push({
                pathname: '/(foods)/[id]',
                params: { id: title },
            })}
        >
            <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => setLiked(!liked)}
                activeOpacity={0.75}
            >
                <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={17}
                    color={liked ? theme.colors.danger : theme.colors.muted}
                />
            </TouchableOpacity>

            {image && (
                <View style={styles.imgWrapper}>
                    <Image source={{ uri: image }} style={styles.img} />
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.type}>{type}</Text>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>

                <View style={styles.contentBottom}>
                    <Text style={styles.price}>{price.toLocaleString()} Fcfa</Text>
                    <TouchableOpacity
                        style={styles.addBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                            addToCart(food)
                            router.push('/(foods)/basket')
                        }}
                    >
                        <Ionicons name='add' size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    card: {
        flex: 1,
        minHeight: 222,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
        elevation: 4,
    },
    heartBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 1,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.isDark ? '#2F2119E6' : '#FFFFFFE6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgWrapper: {
        alignSelf: 'center',
        width: 108,
        height: 108,
        borderRadius: 54,
        overflow: 'hidden',
        marginTop: 8,
        marginBottom: 14,
        backgroundColor: theme.colors.surfaceAlt,
    },
    img: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
    },
    type: {
        fontSize: 11,
        color: theme.colors.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    title: {
        minHeight: 40,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        color: theme.colors.text,
        marginTop: 4,
    },
    contentBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    price: {
        flex: 1,
        fontSize: 13,
        fontWeight: '800',
        color: theme.colors.text,
    },
    addBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
