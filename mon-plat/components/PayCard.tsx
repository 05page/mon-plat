import { Ionicons } from '@expo/vector-icons'
import { useAppTheme } from '@/constants/theme'
import MobileMoneyModal from '@/components/MobileMoneyModal'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView, Modal, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native'
import { useRouter } from 'expo-router'

type Props = {
    visible: boolean
    totalPrice: number
    user: { fullname: string; email: string; telephone: string; adress: string }
    onClose: () => void
    onPayDelivery: (data: { adress: string; telephone: string }) => void
}

export default function PayCard({ visible, totalPrice, user, onClose, onPayDelivery }: Props) {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const [adress, setAdress] = useState(user.adress)
    const [number, setNumber] = useState(user.telephone)
    const [showMobileMoney, setShowMobileMoney] = useState(false)
    const router = useRouter()

    function handlePayDelivery() {
        onPayDelivery({ adress, telephone: number })
        router.push('/(foods)/command')
    }

    return (
        <>
            <Modal visible={visible} transparent animationType='slide'>
                {/* Fond semi-transparent — cliquer dessus ferme le modal */}
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.sheetWrapper}
                    >
                        {/* stopPropagation : empêche le clic sur le panel de fermer le modal */}
                        <TouchableOpacity activeOpacity={1} style={styles.sheet}>

                            {/* Bouton X centré en haut du panel, positionné en absolu */}
                            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                                <Ionicons name='close' size={20} color={theme.colors.text} />
                            </TouchableOpacity>

                            {/* Champ adresse */}
                            <Text style={styles.label}>Adresse de livraison</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={adress}
                                    onChangeText={setAdress}
                                    placeholder='Votre adresse'
                                    placeholderTextColor={theme.colors.muted}
                                />
                            </View>

                            {/* Champ téléphone */}
                            <Text style={styles.label}>Numéro de contact</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={number}
                                    onChangeText={setNumber}
                                    placeholder='Votre numéro'
                                    placeholderTextColor={theme.colors.muted}
                                    keyboardType='phone-pad'
                                />
                            </View>

                            {/* Boutons de paiement */}
                            <View style={styles.btnRow}>
                                <TouchableOpacity
                                    style={styles.btnOutline}
                                    onPress={() => setShowMobileMoney(true)}
                                >
                                    <Text style={styles.btnOutlineText}>Mobile Money</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnFill} onPress={handlePayDelivery}>
                                    <Text style={styles.btnFillText}>Payer à la livraison</Text>
                                </TouchableOpacity>
                            </View>

                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal>

            {/* Modal Mobile Money — s'ouvre par-dessus PayCard */}
            <MobileMoneyModal
                visible={showMobileMoney}
                totalPrice={totalPrice}
                onClose={() => setShowMobileMoney(false)}
                onConfirm={(pin) => {
                    setShowMobileMoney(false)
                    console.log('PIN soumis :', pin)
                }}
            />
        </>
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
            alignSelf: 'center',
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
        label: {
            fontSize: 15,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
            marginTop: 16,
        },
        inputWrapper: {
            backgroundColor: theme.colors.surfaceAlt,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        input: {
            fontSize: 15,
            color: theme.colors.text,
        },
        btnRow: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 28,
            marginBottom: 8,
        },
        btnOutline: {
            flex: 1,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
        },
        btnOutlineText: {
            color: theme.colors.text,
            fontWeight: '600',
            fontSize: 14,
        },
        btnFill: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
        },
        btnFillText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 14,
        },
    })
}
