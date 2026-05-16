import Card from '@/components/Card'
import Navbar from '@/components/Navbar'
import { useAppTheme } from '@/constants/theme'
import { Foods } from '@/types/foods'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
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

export default function FoodsScreen() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()

    return (
        <SafeAreaView style={styles.safe}>
            <FlatList
                data={MOCK_FOODS}
                keyExtractor={(item, index) => item.title + index}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <Card {...item} />}
                ListHeaderComponent={
                    <View style={styles.headerContent}>
                        <View style={styles.topbar}>
                            <View>
                                <Text style={styles.eyebrow}>Mon Plat</Text>
                                <Text style={styles.title}>Bonjour, Jean</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.cartBtn}
                                onPress={() => router.push('/notification')}
                                activeOpacity={0.8}
                            >
                                <Ionicons name='notifications-outline' size={22} color={theme.colors.text} />
                            </TouchableOpacity>
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
                            <Text style={styles.sectionHint}>{MOCK_FOODS.length} plats</Text>
                        </View>
                    </View>
                }
            />
            <Navbar />
        </SafeAreaView>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
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
})
