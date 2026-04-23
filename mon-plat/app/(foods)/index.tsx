import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Foods } from '@/types/foods'
import { User } from '@/types/auth'
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import Card from '@/components/Card'
import { useRouter } from 'expo-router'
import Navbar from '@/components/Navbar'

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
export default function foods() {
    const [foods, setFoods] = useState<Foods>({
        title: "",
        type: "",
        content: "",
        price: 0,
        image: "",
        quantie: 0,
        authorId: 0
    })
    const [user, setUser] = useState<User>({
        fullname: "",
        email: "",
        telephone: "",
        role: ""
    })
    const router = useRouter()
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.push('/basket')}>
                    <Ionicons name='cart-outline' size={30} />
                </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={styles.description}>
                <Text style={styles.title}>Bonjour, {user.fullname}</Text>
                <Text style={styles.subtitle}>Que voulez vous manger</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput style={styles.input} placeholder='Croissant' />
                <Ionicons name='search' size={24} color="#3E4462" />
                <TouchableOpacity>
                    <Ionicons name='filter' size={24} color="#3E4462" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={MOCK_FOODS}
                keyExtractor={(item, index) => item.title + index}
                numColumns={2}
                columnWrapperStyle={{ gap: 16, justifyContent: 'center' }}
                contentContainerStyle={{ gap: 16, padding: 16 }}
                renderItem={({ item }) => <Card {...item} />}

                //Tout le contenu du haut va ici
                ListHeaderComponent={
                    <View>
                        {/* Titre section */}
                        <Text style={styles.text}>Recommandation</Text>
                    </View>
                }
            />
            
            <Navbar />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    header: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
        margin: 5,
    },
    description: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 25,
        fontWeight: 800
    },
    subtitle: {
        fontSize: 15,
        fontWeight: 400,
        color: "#FF6B00"
    },
    content: {
        margin: 5
    },
    text: {
        fontSize: 24,
        paddingTop: 5
    },
    input: {
        flex: 1,              // prend tout l'espace disponible
        height: 45,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    searchContainer: {
        flexDirection: 'row',   // ← les enfants s'alignent en ligne
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 10
    }
})
