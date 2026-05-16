import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CreateWallet() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [pin, setPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [pinVisible, setPinVisible] = useState(false)
    const [confirmPinVisible, setConfirmPinVisible] = useState(false)

    const pinsMatch = pin === confirmPin && confirmPin.length === 4
    const isValid = pin.length === 4 && pinsMatch

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
                        <Text style={styles.title}>Wallet</Text>
                    </View>

                    {/* Illustration info */}
                    <View style={styles.infoCard}>
                        <Ionicons name='wallet-outline' size={32} color={theme.colors.primary} />
                        <Text style={styles.infoTitle}>Votre wallet sécurisé</Text>
                        <Text style={styles.infoText}>
                            Créez votre wallet pour payer vos commandes directement depuis l'application. Choisissez un code PIN à 4 chiffres que vous seul connaissez.
                        </Text>
                    </View>

                    {/* Champ PIN */}
                    <Text style={styles.label}>Code PIN</Text>
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

                    {/* Champ confirmation PIN */}
                    <Text style={styles.label}>Confirmer le PIN</Text>
                    <View style={[
                        styles.inputWrapper,
                        confirmPin.length === 4 && !pinsMatch && styles.inputError
                    ]}>
                        <Ionicons name='lock-closed-outline' size={20} color={theme.colors.muted} />
                        <TextInput
                            style={[styles.input, styles.pinInput]}
                            value={confirmPin}
                            onChangeText={(v) => setConfirmPin(v.replace(/[^0-9]/g, '').slice(0, 4))}
                            placeholder='• • • •'
                            placeholderTextColor={theme.colors.muted}
                            keyboardType='number-pad'
                            maxLength={4}
                            secureTextEntry={!confirmPinVisible}
                        />
                        <TouchableOpacity onPress={() => setConfirmPinVisible(!confirmPinVisible)}>
                            <Ionicons
                                name={confirmPinVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={theme.colors.muted}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Message erreur PIN */}
                    {confirmPin.length === 4 && !pinsMatch && (
                        <Text style={styles.errorText}>Les codes PIN ne correspondent pas</Text>
                    )}

                    {/* Bouton créer */}
                    <TouchableOpacity
                        style={[styles.confirmBtn, !isValid && styles.confirmBtnDisabled]}
                        activeOpacity={0.85}
                        disabled={!isValid}
                        onPress={() => {
                            // TODO: POST /create-wallet { pin, confirmPin }
                            console.log('Création wallet avec PIN :', pin)
                        }}
                    >
                        <Text style={styles.confirmText}>Créer mon wallet</Text>
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
        infoCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 18,
            padding: 20,
            alignItems: 'center',
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 8,
        },
        infoTitle: {
            fontSize: 17,
            fontWeight: '800',
            color: theme.colors.text,
        },
        infoText: {
            fontSize: 13,
            color: theme.colors.muted,
            textAlign: 'center',
            lineHeight: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 8,
            marginTop: 20,
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
        inputError: {
            borderColor: theme.colors.danger,
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
        errorText: {
            fontSize: 12,
            color: theme.colors.danger,
            marginTop: 6,
            fontWeight: '600',
        },
        confirmBtn: {
            height: 54,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 32,
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
