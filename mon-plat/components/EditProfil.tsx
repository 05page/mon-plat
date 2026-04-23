import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView, Modal, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native'

type Props = {
    visible: boolean
    user: { fullname: string; email: string; telephone: string }
    onClose: () => void
    onSave: (data: { fullname: string; email: string; telephone: string }) => void
}

export default function EditProfileModal({ visible, user, onClose, onSave }: Props) {
    const [fullname, setFullname] = useState(user.fullname)
    const [email, setEmail] = useState(user.email)
    const [telephone, setTelephone] = useState(user.telephone)

    return (
        <Modal visible={visible} transparent animationType='slide'>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.sheet}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Modifier le profil</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name='close' size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Champs */}
                    <View style={styles.fields}>
                        <View style={styles.field}>
                            <Text style={styles.label}>Nom complet</Text>
                            <TextInput
                                style={styles.input}
                                value={fullname}
                                onChangeText={setFullname}
                                placeholder='Votre nom'
                            />
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder='Votre email'
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Téléphone</Text>
                            <TextInput
                                style={styles.input}
                                value={telephone}
                                onChangeText={setTelephone}
                                placeholder='Votre numéro'
                                keyboardType='phone-pad'
                            />
                        </View>
                    </View>

                    {/* Boutons */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={() => {
                                onSave({ fullname, email, telephone })
                                onClose()
                            }}
                        >
                            <Text style={styles.saveText}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
    fields: { gap: 16 },
    field: { gap: 6 },
    label: { fontSize: 13, color: '#888', fontWeight: '500' },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1a1a1a',
        backgroundColor: '#fafafa',
    },
    actions: { flexDirection: 'row', gap: 12 },
    cancelBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    cancelText: { fontSize: 15, color: '#666', fontWeight: '600' },
    saveBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 25,
        backgroundColor: '#FF6B00',
        alignItems: 'center',
    },
    saveText: { fontSize: 15, color: '#fff', fontWeight: '600' },
})
