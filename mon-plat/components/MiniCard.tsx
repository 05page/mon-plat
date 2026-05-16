import { Foods } from '@/types/foods'
import { useAppTheme } from '@/constants/theme'
import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function MiniCard({ title, type, price, image }: Foods) {
    const theme = useAppTheme()
    const styles = createStyles(theme)

    return (
        <View style={styles.card}>
            <TouchableOpacity></TouchableOpacity>
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
                        onPress={() => console.log('ajoute')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    card: {
        width: 150,
        minHeight: 196,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 12,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5
    },
    heartBtn: {
        width: 24,
        height: 24,
        top: 10,
        right: 12,
        zIndex: 1
    },
    content: {
        width: "100%",
        marginTop: 10,
    },
    contentBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    img: {
        height: '100%',
        width: '100%',
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        color: theme.colors.text,
        marginBottom: 8,
    },
    type: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    description: {

    },
    imgWrapper: {
        marginTop: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        alignSelf: 'center',
        backgroundColor: theme.colors.surfaceAlt,
    },
    price: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.text,
    },
    addBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: {
        fontSize: 20,
        color: '#fff',
        lineHeight: 24,
    }
})
