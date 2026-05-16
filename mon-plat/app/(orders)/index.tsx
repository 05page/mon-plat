import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Orders() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Mes commandes</Text>
            </View>

            {/* TODO: remplacer par FlatList quand les données API arrivent */}
            <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                    <Ionicons name='receipt-outline' size={36} color={theme.colors.primary} />
                </View>
                <Text style={styles.emptyTitle}>Aucune commande</Text>
                <Text style={styles.emptyText}>
                    Vous n'avez pas encore passé de commande. Explorez nos plats et faites votre choix !
                </Text>
                <TouchableOpacity
                    style={styles.exploreBtn}
                    activeOpacity={0.85}
                    onPress={() => router.replace('/(foods)')}
                >
                    <Text style={styles.exploreBtnText}>Voir les plats</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 20,
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
        title: {
            fontSize: 26,
            fontWeight: '900',
            color: theme.colors.text,
        },
        empty: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
            gap: 12,
        },
        emptyIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: theme.colors.text,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.muted,
            textAlign: 'center',
            lineHeight: 21,
        },
        exploreBtn: {
            marginTop: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            paddingHorizontal: 24,
            paddingVertical: 13,
        },
        exploreBtnText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 14,
        },
    })
}
