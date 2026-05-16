import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Passer à true pour simuler un wallet existant — à remplacer par GET /my-wallet
const MOCK_HAS_WALLET = false

const MOCK_BALANCE = 45000

const MOCK_TRANSACTIONS = [
    { id: 1, type: 'DEBIT', amount: 8500, createdAt: '2026-05-15T10:30:00Z' },
    { id: 2, type: 'CREDIT', amount: 20000, createdAt: '2026-05-14T08:00:00Z' },
    { id: 3, type: 'DEBIT', amount: 6500, createdAt: '2026-05-13T19:45:00Z' },
    { id: 4, type: 'CREDIT', amount: 50000, createdAt: '2026-05-12T11:00:00Z' },
    { id: 5, type: 'DEBIT', amount: 9500, createdAt: '2026-05-10T14:20:00Z' },
]

function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Wallet() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [hasWallet] = useState(MOCK_HAS_WALLET)

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Mon Wallet</Text>
            </View>

            {/* Vue : pas de wallet */}
            {!hasWallet && (
                <View style={styles.emptyWallet}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name='wallet-outline' size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.emptyTitle}>Aucun wallet trouvé</Text>
                    <Text style={styles.emptyText}>
                        Créez votre wallet pour payer vos commandes et gérer votre argent directement dans l'application.
                    </Text>
                    <TouchableOpacity
                        style={styles.createBtn}
                        activeOpacity={0.85}
                        onPress={() => router.push('/(wallet)/create')}
                    >
                        <Ionicons name='add-circle-outline' size={20} color='#fff' />
                        <Text style={styles.createBtnText}>Créer mon wallet</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Vue : wallet existant */}
            {hasWallet && <FlatList
                data={MOCK_TRANSACTIONS}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}

                /* Carte solde en haut de la liste */
                ListHeaderComponent={
                    <View>
                        <View style={styles.balanceCard}>
                            <Ionicons name='wallet-outline' size={28} color='#fff' />
                            <Text style={styles.balanceLabel}>Solde disponible</Text>
                            <Text style={styles.balanceValue}>{MOCK_BALANCE.toLocaleString()} Fcfa</Text>

                            {/* Bouton recharger */}
                            <TouchableOpacity
                                style={styles.rechargeBtn}
                                activeOpacity={0.85}
                                onPress={() => router.push('/(wallet)/recharge')}
                            >
                                <Ionicons name='add-circle-outline' size={18} color={theme.colors.primary} />
                                <Text style={styles.rechargeBtnText}>Recharger</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>Historique</Text>
                    </View>
                }

                renderItem={({ item }) => {
                    const isDebit = item.type === 'DEBIT'
                    return (
                        <View style={styles.txRow}>
                            {/* Icône selon le type */}
                            <View style={[styles.txIcon, { backgroundColor: isDebit ? theme.isDark ? '#3A1F1F' : '#FFF1F1' : theme.isDark ? '#1A2F1F' : '#F0FFF4' }]}>
                                <Ionicons
                                    name={isDebit ? 'arrow-up-outline' : 'arrow-down-outline'}
                                    size={20}
                                    color={isDebit ? theme.colors.danger : theme.colors.success}
                                />
                            </View>

                            <View style={styles.txInfo}>
                                <Text style={styles.txType}>{isDebit ? 'Paiement' : 'Recharge'}</Text>
                                <Text style={styles.txDate}>{formatDate(item.createdAt)}</Text>
                            </View>

                            <Text style={[styles.txAmount, { color: isDebit ? theme.colors.danger : theme.colors.success }]}>
                                {isDebit ? '-' : '+'}{item.amount.toLocaleString()} F
                            </Text>
                        </View>
                    )
                }}

                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name='receipt-outline' size={34} color={theme.colors.muted} />
                        <Text style={styles.emptyText}>Aucune transaction</Text>
                    </View>
                }
            />}
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
        list: {
            paddingHorizontal: 20,
            paddingBottom: 32,
            gap: 10,
        },
        balanceCard: {
            backgroundColor: theme.colors.primary,
            borderRadius: 22,
            padding: 24,
            alignItems: 'center',
            gap: 8,
            marginBottom: 28,
        },
        balanceLabel: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '600',
            marginTop: 4,
        },
        balanceValue: {
            fontSize: 36,
            fontWeight: '900',
            color: '#fff',
        },
        rechargeBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#fff',
            borderRadius: 999,
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 8,
        },
        rechargeBtnText: {
            color: theme.colors.primary,
            fontWeight: '800',
            fontSize: 14,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '900',
            color: theme.colors.text,
            marginBottom: 12,
        },
        txRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 14,
            gap: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        txIcon: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
        },
        txInfo: {
            flex: 1,
        },
        txType: {
            fontSize: 15,
            fontWeight: '700',
            color: theme.colors.text,
        },
        txDate: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 2,
        },
        txAmount: {
            fontSize: 16,
            fontWeight: '900',
        },
        empty: {
            alignItems: 'center',
            gap: 10,
            marginTop: 40,
        },
        emptyText: {
            fontSize: 15,
            textAlign: "center",
            color: theme.colors.muted,
            fontWeight: '600',
        },
        emptyWallet: {
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
        createBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            paddingHorizontal: 24,
            paddingVertical: 14,
            marginTop: 8,
        },
        createBtnText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 15,
        },
    })
}
