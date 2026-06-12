import { API_URL } from '@/constants/api'
import { useAuth } from '@/context/AuthContext'
import { useAppTheme } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    KeyboardAvoidingView, Platform, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

// Catégories proposées au vendeur pour classer son plat
const FOOD_TYPES = ['Burger', 'Pizza', 'Poulet', 'Grillade', 'Salade', 'Pâtisserie', 'Boisson', 'Autre']

type Form = {
    title: string
    type: string
    content: string
    price: string      // string pour le TextInput, converti en number à l'envoi
    quantie: string    // idem
}

export default function AddDish() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const { token } = useAuth()

    const [form, setForm] = useState<Form>({
        title: '',
        type: '',
        content: '',
        price: '',
        quantie: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (field: keyof Form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    // Valide le formulaire et envoie la requête POST /foods/addPlat
    // price et quantie sont des strings dans le form (TextInput) → on les convertit en number
    const handleSubmit = async () => {
        if (!form.title || !form.type || !form.content || !form.price || !form.quantie) {
            Toast.show({ type: 'error', text1: 'Champs manquants', text2: 'Tous les champs sont requis' })
            return
        }

        const price = Number(form.price)
        const quantie = Number(form.quantie)

        if (isNaN(price) || price <= 0) {
            Toast.show({ type: 'error', text1: 'Prix invalide', text2: 'Le prix doit être un nombre positif' })
            return
        }
        if (isNaN(quantie) || quantie < 1) {
            Toast.show({ type: 'error', text1: 'Quantité invalide', text2: 'La quantité doit être au moins 1' })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/foods/addPlat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: form.title,
                    type: form.type,
                    content: form.content,
                    price,
                    quantie,
                })
            })
            const data = await response.json()
            if (!response.ok) {
                Toast.show({ type: 'error', text1: 'Erreur', text2: data.error || 'Ajout échoué' })
                return
            }
            Toast.show({ type: 'success', text1: 'Plat ajouté !', text2: form.title })
            router.back()
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erreur réseau', text2: 'Vérifie ta connexion' })
        } finally {
            setIsLoading(false)
        }
    }

    const isValid = form.title && form.type && form.content && form.price && form.quantie

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
                        <Text style={styles.title}>Nouveau plat</Text>
                    </View>

                    {/* Champ titre */}
                    <Text style={styles.label}>Nom du plat</Text>
                    <View style={styles.inputWrapper}>
                        <Ionicons name='restaurant-outline' size={18} color={theme.colors.muted} />
                        <TextInput
                            style={styles.input}
                            value={form.title}
                            onChangeText={(v) => handleChange('title', v)}
                            placeholder='Ex : Poulet braisé + attiéké'
                            placeholderTextColor={theme.colors.muted}
                        />
                    </View>

                    {/* Sélecteur de catégorie */}
                    <Text style={styles.label}>Catégorie</Text>
                    <View style={styles.typesGrid}>
                        {FOOD_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[styles.typeChip, form.type === type && styles.typeChipActive]}
                                onPress={() => handleChange('type', type)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.typeText, form.type === type && styles.typeTextActive]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <View style={[styles.inputWrapper, styles.textareaWrapper]}>
                        <TextInput
                            style={[styles.input, styles.textarea]}
                            value={form.content}
                            onChangeText={(v) => handleChange('content', v)}
                            placeholder='Décris les ingrédients, le mode de préparation…'
                            placeholderTextColor={theme.colors.muted}
                            multiline
                            numberOfLines={3}
                            textAlignVertical='top'
                        />
                    </View>

                    {/* Prix et quantité côte à côte */}
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Prix (Fcfa)</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name='cash-outline' size={18} color={theme.colors.muted} />
                                <TextInput
                                    style={styles.input}
                                    value={form.price}
                                    onChangeText={(v) => handleChange('price', v.replace(/[^0-9]/g, ''))}
                                    placeholder='Ex : 5000'
                                    placeholderTextColor={theme.colors.muted}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Quantité</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name='cube-outline' size={18} color={theme.colors.muted} />
                                <TextInput
                                    style={styles.input}
                                    value={form.quantie}
                                    onChangeText={(v) => handleChange('quantie', v.replace(/[^0-9]/g, ''))}
                                    placeholder='Ex : 10'
                                    placeholderTextColor={theme.colors.muted}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                    </View>

                    {/* Bouton soumettre */}
                    <TouchableOpacity
                        style={[styles.submitBtn, (!isValid || isLoading) && styles.submitBtnDisabled]}
                        activeOpacity={0.85}
                        disabled={!isValid || isLoading}
                        onPress={handleSubmit}
                    >
                        <Ionicons name='checkmark-circle-outline' size={20} color='#fff' />
                        <Text style={styles.submitText}>
                            {isLoading ? 'Ajout en cours…' : 'Ajouter au catalogue'}
                        </Text>
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
            fontSize: 24,
            fontWeight: '900',
            color: theme.colors.text,
        },
        label: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 8,
            marginTop: 16,
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
        textareaWrapper: {
            alignItems: 'flex-start',
            paddingTop: 12,
        },
        input: {
            flex: 1,
            fontSize: 15,
            color: theme.colors.text,
        },
        textarea: {
            minHeight: 80,
        },
        typesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        typeChip: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
        },
        typeChipActive: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        typeText: {
            fontSize: 13,
            fontWeight: '700',
            color: theme.colors.text,
        },
        typeTextActive: {
            color: '#fff',
        },
        row: {
            flexDirection: 'row',
            gap: 12,
        },
        submitBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 54,
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            marginTop: 32,
        },
        submitBtnDisabled: {
            opacity: 0.4,
        },
        submitText: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 15,
        },
    })
}
