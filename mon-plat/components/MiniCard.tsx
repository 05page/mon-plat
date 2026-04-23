import { Foods } from '@/types/foods'
import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';

export default function miniCard({ title, type, content, price, image, quantie, authorId }: Foods) {
    return (
        <View>
            <TouchableOpacity></TouchableOpacity>
            {image && (
                <Image source={{ uri: image }} style={styles.imgWrapper} />
            )}

            <View>
                <Text>{title}</Text>
                <View>
                    <Text>{price}</Text>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => console.log('ajouté')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 196,
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
        paddingHorizontal: 14,
        marginTop: 12,
    },
    contentBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    img: {
        height: 60,
        width: 60
    },
    title: {
        fontSize: 10,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    type: {

    },
    description: {

    },
    imgWrapper: {
        marginTop: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
    },
    price: {
        fontSize: 10,
        fontWeight: '500',
        color: '#b066cc'
    },
    addBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: '#b066cc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addBtnText: {
        fontSize: 20,
        color: '#b066cc',
        lineHeight: 24,
    }
})