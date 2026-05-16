import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Notification = {
    id: number
    title: string
    message: string
    time: string
    read: boolean
    icon: 'receipt-outline' | 'wallet-outline' | 'checkmark-circle-outline' | 'alert-circle-outline'
}

// Données fictives — à remplacer par un vrai système de notifications
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        title: 'Commande confirmée',
        message: 'Votre commande de Poulet braisé a bien été enregistrée.',
        time: 'Il y a 5 min',
        read: false,
        icon: 'receipt-outline',
    },
    {
        id: 2,
        title: 'Paiement réussi',
        message: 'Votre paiement de 6 500 Fcfa a été effectué avec succès.',
        time: 'Il y a 1h',
        read: false,
        icon: 'wallet-outline',
    },
    {
        id: 3,
        title: 'Commande livrée',
        message: 'Votre commande a été livrée. Bon appétit !',
        time: 'Hier',
        read: true,
        icon: 'checkmark-circle-outline',
    },
    {
        id: 4,
        title: 'Solde insuffisant',
        message: 'Votre solde wallet est insuffisant pour cette commande. Pensez à recharger.',
        time: 'Il y a 2 jours',
        read: true,
        icon: 'alert-circle-outline',
    },
]

export default function Notification() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()

    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Notifications</Text>
                    {unreadCount > 0 && (
                        <Text style={styles.unreadCount}>{unreadCount} non lue(s)</Text>
                    )}
                </View>
            </View>

            <FlatList
                data={MOCK_NOTIFICATIONS}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card, !item.read && styles.cardUnread]}
                        activeOpacity={0.75}
                    >
                        {/* Icône */}
                        <View style={[styles.iconWrap, !item.read && styles.iconWrapUnread]}>
                            <Ionicons
                                name={item.icon}
                                size={22}
                                color={item.read ? theme.colors.muted : theme.colors.primary}
                            />
                        </View>

                        {/* Contenu */}
                        <View style={styles.content}>
                            <View style={styles.topRow}>
                                <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
                                    {item.title}
                                </Text>
                                {!item.read && <View style={styles.dot} />}
                            </View>
                            <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name='notifications-off-outline' size={40} color={theme.colors.muted} />
                        <Text style={styles.emptyText}>Aucune notification</Text>
                    </View>
                }
            />
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
        unreadCount: {
            fontSize: 12,
            color: theme.colors.primary,
            fontWeight: '700',
            marginTop: 2,
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 32,
            gap: 10,
        },
        card: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 12,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        cardUnread: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.isDark ? '#2A1A0D' : '#FFF6EE',
        },
        iconWrap: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconWrapUnread: {
            backgroundColor: theme.isDark ? '#3B2512' : '#FFE7D1',
        },
        content: {
            flex: 1,
            gap: 4,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        cardTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.muted,
        },
        cardTitleUnread: {
            color: theme.colors.text,
            fontWeight: '800',
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
        },
        message: {
            fontSize: 13,
            color: theme.colors.muted,
            lineHeight: 19,
        },
        time: {
            fontSize: 11,
            color: theme.colors.muted,
            fontWeight: '600',
            marginTop: 2,
        },
        empty: {
            alignItems: 'center',
            gap: 12,
            marginTop: 80,
        },
        emptyText: {
            fontSize: 15,
            color: theme.colors.muted,
            fontWeight: '600',
        },
    })
}
