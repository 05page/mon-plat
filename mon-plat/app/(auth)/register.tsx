import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { RegisterForm } from '@/types/auth'
import { Button, TextInput, SegmentedButtons } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { useAppTheme } from '@/constants/theme'

export default function Register() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState<RegisterForm>({
        fullname: '',
        email: '',
        telephone: '',
        password: '',
        verify_password: '',
        role: 'CLIENT',
    })

    const handleChange = (field: keyof RegisterForm, value: string) => {
        setForm({ ...form, [field]: value })
    }

    const handleSubmit = () => {
        if (!form.email || !form.fullname || !form.password || !form.role || !form.telephone || !form.verify_password) {
            Toast.show({
                type: 'error',
                text1: 'Champs manquants',
                text2: 'Tous les champs sont requis',
            })
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.push('/(auth)/otp')
        }, 3000)
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Zone branding */}
                <View style={styles.brandingBlock}>
                    <View style={styles.logoCircle}>
                        <Image style={styles.img} source={require('../../assets/images/bg.png')} />
                    </View>
                    <Text style={styles.tagline}>La food de chez nous, livrée chez toi</Text>
                </View>

                {/* Formulaire */}
                <Text style={styles.formTitle}>Créer un compte</Text>

                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Nom complet"
                    value={form.fullname}
                    onChangeText={(val) => handleChange('fullname', val)}
                />
                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Email"
                    value={form.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={(val) => handleChange('email', val)}
                />
                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Téléphone"
                    value={form.telephone}
                    keyboardType="phone-pad"
                    onChangeText={(val) => handleChange('telephone', val)}
                />
                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Mot de passe"
                    value={form.password}
                    secureTextEntry
                    onChangeText={(val) => handleChange('password', val)}
                />
                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Confirmation mot de passe"
                    value={form.verify_password}
                    secureTextEntry
                    onChangeText={(val) => handleChange('verify_password', val)}
                />
                <SegmentedButtons
                    value={form.role}
                    onValueChange={(val) => handleChange('role', val)}
                    theme={{
                        colors: {
                            secondaryContainer: theme.colors.surfaceAlt,
                            onSecondaryContainer: theme.colors.text,
                            outline: theme.colors.border,
                            onSurface: theme.colors.text,
                        },
                    }}
                    buttons={[
                        { value: 'CLIENT', label: 'Client' },
                        { value: 'SELLER', label: 'Vendeur' },
                    ]}
                />
                <Button
                    loading={isLoading}
                    disabled={isLoading}
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    style={styles.button}
                    onPress={handleSubmit}
                >
                    {"S'inscrire"}
                </Button>

                {/* Lien login */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Déjà un compte ? </Text>
                    <Link href="/(auth)/login" style={styles.footerLink}>
                        Se connecter
                    </Link>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const inputTheme = (theme: ReturnType<typeof useAppTheme>) => ({
    roundness: 16,
    colors: {
        background: theme.colors.surface,
        onSurfaceVariant: theme.colors.muted,
        onSurface: theme.colors.text,
        outline: theme.colors.border,
        primary: theme.colors.primary,
    },
})

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    container: {
        paddingHorizontal: 24,
        paddingVertical: 32,
        flexGrow: 1,
    },

    brandingBlock: {
        alignItems: 'center',
        marginBottom: 32,
    },

    img:{
        width: 35,
        height: 35
    },

    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },

    logoText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    appName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 6,
    },

    tagline: {
        fontSize: 13,
        color: theme.colors.muted,
        textAlign: 'center',
    },

    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 20,
    },

    input: {
        marginBottom: 16,
    },

    button: {
        marginTop: 16,
        borderRadius: 12,
        paddingVertical: 4,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },

    footerText: {
        color: theme.colors.muted,
        fontSize: 14,
    },

    footerLink: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
})
