import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

// Données fictives — à remplacer par GET /mes-commandes/:id
const MOCK_ORDER = {
    id: 1,
    status: 'PENDING' as OrderStatus,
    totalPrice: 21000,
    created_at: '2026-05-15T10:30:00Z',
    items: [
        { id: 1, quantity: 2, unitPrice: 8000, post: { title: 'Honey lime combo', price: 8000 } },
        { id: 2, quantity: 1, unitPrice: 5000, post: { title: 'Burger Classic', price: 5000 } },
    ],
    payment: null as { method: string; status: string; paidAt: string | null } | null,
}

// Étapes de livraison dans l'ordre
const STEPS = [
    { key: 'PENDING', label: 'Commande enregistrée', icon: 'receipt-outline' },
    { key: 'PREPARING', label: 'En cours de préparation', icon: 'restaurant-outline' },
    { key: 'DELIVERING', label: 'En cours de livraison', icon: 'bicycle-outline' },
    { key: 'PAID', label: 'Commande livrée', icon: 'checkmark-circle-outline' },
]

// Retourne l'index de l'étape active selon le statut
function getActiveStep(status: OrderStatus): number {
    if (status === 'PAID') return 3
    if (status === 'PENDING') return 0
    return 0
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

export default function OrderDetail() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { id } = useLocalSearchParams()

    const order = MOCK_ORDER
    const activeStep = getActiveStep(order.status)
    const isCancelled = order.status === 'CANCELLED'

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <FlatList
                data={order.items}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}

                ListHeaderComponent={
                    <View>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                                <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.title}>Commande #{order.id}</Text>
                                <Text style={styles.date}>{formatDate(order.created_at)}</Text>
                            </View>
                        </View>

                        {/* Badge statut */}
                        <View style={[styles.badge, isCancelled ? styles.badgeCancelled : styles.badgeActive]}>
                            <Ionicons
                                name={isCancelled ? 'close-circle-outline' : 'time-outline'}
                                size={15}
                                color={isCancelled ? theme.colors.danger : theme.colors.primary}
                            />
                            <Text style={[styles.badgeText, isCancelled && styles.badgeTextCancelled]}>
                                {isCancelled ? 'Commande annulée' : order.status === 'PAID' ? 'Livrée' : 'En cours'}
                            </Text>
                        </View>

                        {/* Étapes de livraison — masquées si annulée */}
                        {!isCancelled && (
                            <View style={styles.stepsCard}>
                                {STEPS.map((step, index) => {
                                    const done = index <= activeStep
                                    const isLast = index === STEPS.length - 1
                                    return (
                                        <View key={step.key}>
                                            <View style={styles.stepRow}>
                                                <View style={[styles.stepIcon, done && styles.stepIconDone]}>
                                                    <Ionicons
                                                        name={step.icon as any}
                                                        size={18}
                                                        color={done ? '#fff' : theme.colors.muted}
                                                    />
                                                </View>
                                                <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>
                                                    {step.label}
                                                </Text>
                                                {done && (
                                                    <Ionicons name='checkmark' size={16} color={theme.colors.success} />
                                                )}
                                            </View>
                                            {/* Ligne de connexion entre étapes */}
                                            {!isLast && (
                                                <View style={[styles.stepLine, index < activeStep && styles.stepLineDone]} />
                                            )}
                                        </View>
                                    )
                                })}
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>Articles commandés</Text>
                    </View>
                }

                renderItem={({ item }) => (
                    <View style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.post.title}</Text>
                            <Text style={styles.itemQty}>x{item.quantity}</Text>
                        </View>
                        <Text style={styles.itemPrice}>
                            {(item.unitPrice * item.quantity).toLocaleString()} F
                        </Text>
                    </View>
                )}

                ListFooterComponent={
                    <View>
                        {/* Total */}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{order.totalPrice.toLocaleString()} Fcfa</Text>
                        </View>

                        {/* Infos paiement */}
                        <View style={styles.paymentCard}>
                            <Text style={styles.paymentTitle}>Paiement</Text>
                            {order.payment ? (
                                <View style={styles.paymentRow}>
                                    <Text style={styles.paymentLabel}>Méthode</Text>
                                    <Text style={styles.paymentValue}>{order.payment.method}</Text>
                                </View>
                            ) : (
                                <Text style={styles.paymentPending}>En attente de paiement</Text>
                            )}
                        </View>
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
        scroll: {
            padding: 20,
            paddingBottom: 40,
            gap: 12,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            marginBottom: 16,
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
            fontSize: 22,
            fontWeight: '900',
            color: theme.colors.text,
        },
        date: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 2,
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 999,
            marginBottom: 20,
        },
        badgeActive: {
            backgroundColor: theme.isDark ? '#2A1A0D' : '#FFF3E8',
        },
        badgeCancelled: {
            backgroundColor: theme.isDark ? '#3A1F1F' : '#FFF1F1',
        },
        badgeText: {
            fontSize: 13,
            fontWeight: '700',
            color: theme.colors.primary,
        },
        badgeTextCancelled: {
            color: theme.colors.danger,
        },
        stepsCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 18,
            padding: 18,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 20,
        },
        stepRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        stepIcon: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
        },
        stepIconDone: {
            backgroundColor: theme.colors.primary,
        },
        stepLabel: {
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.muted,
        },
        stepLabelDone: {
            color: theme.colors.text,
            fontWeight: '700',
        },
        stepLine: {
            width: 2,
            height: 22,
            backgroundColor: theme.colors.border,
            marginLeft: 17,
            marginVertical: 4,
        },
        stepLineDone: {
            backgroundColor: theme.colors.primary,
        },
        sectionTitle: {
            fontSize: 17,
            fontWeight: '900',
            color: theme.colors.text,
            marginBottom: 8,
        },
        itemRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        itemInfo: {
            flex: 1,
        },
        itemTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.text,
        },
        itemQty: {
            fontSize: 12,
            color: theme.colors.muted,
            marginTop: 3,
        },
        itemPrice: {
            fontSize: 15,
            fontWeight: '800',
            color: theme.colors.text,
        },
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 4,
        },
        totalLabel: {
            fontSize: 15,
            fontWeight: '700',
            color: theme.colors.muted,
        },
        totalValue: {
            fontSize: 18,
            fontWeight: '900',
            color: theme.colors.text,
        },
        paymentCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginTop: 12,
            gap: 8,
        },
        paymentTitle: {
            fontSize: 15,
            fontWeight: '800',
            color: theme.colors.text,
        },
        paymentRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        paymentLabel: {
            fontSize: 13,
            color: theme.colors.muted,
        },
        paymentValue: {
            fontSize: 13,
            fontWeight: '700',
            color: theme.colors.text,
        },
        paymentPending: {
            fontSize: 13,
            color: theme.colors.muted,
            fontStyle: 'italic',
        },
    })
}
