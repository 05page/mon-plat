import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Montants rapides prédéfinis
const QUICK_AMOUNTS = [5000, 10000, 25000, 50000]

export default function RechargeWallet() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [amount, setAmount] = useState('')
    const [pin, setPin] = useState('')
    const [pinVisible, setPinVisible] = useState(false)

    const isValid = Number(amount) > 0 && pin.length === 4

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.8}>
                            <Ionicons name='chevron-back' size={22} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Recharger</Text>
                    </View>

                    {/* Champ montant */}
                    <Text style={styles.label}>Montant (Fcfa)</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name='cash-outline' size={20} color={theme.colors.muted} />
                        <TextInput
                            style={styles.input}
                            value={amount}
                            onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, ''))}
                            placeholder='Ex : 10 000'
                            placeholderTextColor={theme.colors.muted}
                            keyboardType='number-pad'
                        />
                    </View>

                    {/* Montants rapides */}
                    <Text style={styles.subLabel}>Montant rapide</Text>
                    <View style={styles.quickRow}>
                        {QUICK_AMOUNTS.map((q) => (
                            <TouchableOpacity
                                key={q}
                                style={[styles.quickBtn, amount === String(q) && styles.quickBtnActive]}
                                onPress={() => setAmount(String(q))}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.quickText, amount === String(q) && styles.quickTextActive]}>
                                    {q.toLocaleString()} F
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Champ PIN */}
                    <Text style={styles.label}>Code PIN (4 chiffres)</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name='lock-closed-outline' size={20} color={theme.colors.muted} />
                        <TextInput
                            style={[styles.input, styles.pinInput]}
                            value={pin}
                            onChangeText={(v) => setPin(v.replace(/[^0-9]/g, '').slice(0, 4))}
                            placeholder='• • • •'
                            placeholderTextColor={theme.colors.muted}
                            keyboardType='number-pad'
                            maxLength={4}
                            secureTextEntry={!pinVisible}
                        />
                        <TouchableOpacity onPress={() => setPinVisible(!pinVisible)}>
                            <Ionicons
                                name={pinVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={theme.colors.muted}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Récapitulatif */}
                    {Number(amount) > 0 && (
                        <View style={styles.summary}>
                            <Ionicons name='information-circle-outline' size={18} color={theme.colors.muted} />
                            <Text style={styles.summaryText}>
                                Vous allez recharger <Text style={styles.summaryAmount}>{Number(amount).toLocaleString()} Fcfa</Text> sur votre wallet.
                            </Text>
                        </View>
                    )}

                    {/* Bouton confirmer */}
                    <TouchableOpacity
                        style={[styles.confirmBtn, !isValid && styles.confirmBtnDisabled]}
                        activeOpacity={0.85}
                        disabled={!isValid}
                        onPress={() => {
                            // TODO: POST /recharge-wallet { amount, pin }
                            console.log('Recharge :', { amount: Number(amount), pin })
                        }}
                    >
                        <Text style={styles.confirmText}>Confirmer la recharge</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
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
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            marginBottom: 28,
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
        label: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 8,
            marginTop: 20,
        },
        subLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.muted,
            marginBottom: 10,
            marginTop: 14,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: theme.colors.text,
        },
        pinInput: {
            letterSpacing: 8,
            fontWeight: '800',
        },
        quickRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        quickBtn: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
        },
        quickBtnActive: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        quickText: {
            fontSize: 13,
            fontWeight: '700',
            color: theme.colors.text,
        },
        quickTextActive: {
            color: '#fff',
        },
        summary: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 8,
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: 12,
            padding: 14,
            marginTop: 20,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        summaryText: {
            flex: 1,
            fontSize: 13,
            color: theme.colors.muted,
            lineHeight: 20,
        },
        summaryAmount: {
            color: theme.colors.text,
            fontWeight: '800',
        },
        confirmBtn: {
            height: 54,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 28,
        },
        confirmBtnDisabled: {
            opacity: 0.4,
        },
        confirmText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 15,
        },
    })
}
