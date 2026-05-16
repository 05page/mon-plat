import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView, Modal, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native'

type Props = {
    visible: boolean
    totalPrice: number
    onClose: () => void
    onConfirm: (pin: string) => void
}

export default function MobileMoneyModal({ visible, totalPrice, onClose, onConfirm }: Props) {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const [pin, setPin] = useState('')
    const [pinVisible, setPinVisible] = useState(false)

    function handleConfirm() {
        if (pin.length !== 4) return
        onConfirm(pin)
        setPin('')
    }

    function handleClose() {
        setPin('')
        onClose()
    }

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.sheetWrapper}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.sheet}>

                        {/* Bouton X */}
                        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                            <Ionicons name='close' size={20} color={theme.colors.text} />
                        </TouchableOpacity>

                        {/* En-tête */}
                        <Text style={styles.title}>Paiement Mobile Money</Text>
                        <Text style={styles.subtitle}>Confirmez avec votre PIN wallet</Text>

                        {/* Montant */}
                        <View style={styles.amountBox}>
                            <Text style={styles.amountLabel}>Montant à payer</Text>
                            <Text style={styles.amountValue}>{totalPrice.toLocaleString()} Fcfa</Text>
                        </View>

                        {/* Champ PIN */}
                        <Text style={styles.label}>Code PIN (4 chiffres)</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={pin}
                                onChangeText={(v) => setPin(v.replace(/[^0-9]/g, '').slice(0, 4))}
                                placeholder='• • • •'
                                placeholderTextColor={theme.colors.muted}
                                keyboardType='number-pad'
                                maxLength={4}
                                secureTextEntry={!pinVisible}
                            />
                            {/* Toggle visibilité PIN */}
                            <TouchableOpacity onPress={() => setPinVisible(!pinVisible)}>
                                <Ionicons
                                    name={pinVisible ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={theme.colors.muted}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Bouton confirmer — désactivé si PIN incomplet */}
                        <TouchableOpacity
                            style={[styles.confirmBtn, pin.length !== 4 && styles.confirmBtnDisabled]}
                            onPress={handleConfirm}
                            activeOpacity={0.85}
                            disabled={pin.length !== 4}
                        >
                            <Text style={styles.confirmBtnText}>Confirmer le paiement</Text>
                        </TouchableOpacity>

                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    )
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
        },
        sheetWrapper: {
            width: '100%',
        },
        sheet: {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            paddingTop: 36,
        },
        closeBtn: {
            position: 'absolute',
            top: -20,
            left: '50%',
            marginLeft: -20,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 4,
        },
        title: {
            fontSize: 18,
            fontWeight: '800',
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 13,
            color: theme.colors.muted,
            textAlign: 'center',
            marginBottom: 20,
        },
        amountBox: {
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 20,
        },
        amountLabel: {
            fontSize: 12,
            color: theme.colors.muted,
            fontWeight: '600',
            marginBottom: 4,
        },
        amountValue: {
            fontSize: 26,
            fontWeight: '900',
            color: theme.colors.text,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
            marginBottom: 24,
            gap: 12,
        },
        input: {
            flex: 1,
            fontSize: 20,
            fontWeight: '800',
            color: theme.colors.text,
            letterSpacing: 8,
        },
        confirmBtn: {
            height: 52,
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        confirmBtnDisabled: {
            opacity: 0.4,
        },
        confirmBtnText: {
            color: '#fff',
            fontWeight: '700',
            fontSize: 15,
        },
    })
}
