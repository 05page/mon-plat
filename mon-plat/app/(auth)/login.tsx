import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper'
import { Link, useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { LoginForm, User } from '@/types/auth'
import { useAppTheme } from '@/constants/theme'
import { useAuth } from "@/context/AuthContext"
import { API_URL } from "@/constants/api"

export default function Login() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' })

    const handleChange = (field: keyof LoginForm, value: string) => {
        setForm({ ...form, [field]: value })
    }

    const handleSubmit = async () => {
        if (!form.email || !form.password) {
            Toast.show({ type: 'error', text1: 'Champs manquants', text2: 'Email et mot de passe requis' })
            return
        }
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                Toast.show({ type: 'error', text1: 'Erreur', text2: data.message || 'Connexion échouée' })
                return
            }

            // Connexion réussie → sauvegarder le token et rediriger
            login(data.token)
            Toast.show({ type: 'success', text1: 'Bienvenue', text2: 'Connexion réussie' })
            router.push('/(foods)')

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Erreur réseau', text2: 'Vérifie ta connexion' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* Branding */}
                <View style={styles.brandingBlock}>
                    <View style={styles.logoCircle}>
                        <Image style={styles.img} source={require('../../assets/images/bg.png')} />
                    </View>
                    <Text style={styles.tagline}>La food de chez nous, livrée chez toi</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.formBlock}>
                    <Text style={styles.formTitle}>Connexion</Text>
                    <Text style={styles.formSubtitle}>Content de te revoir 👋</Text>

                    <TextInput
                        style={styles.input}
                        theme={inputTheme(theme)}
                        mode="outlined"
                        label="Email"
                        value={form.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="email-outline" color={theme.colors.muted} />}
                        onChangeText={(val) => handleChange('email', val)}
                    />
                    <TextInput
                        style={styles.input}
                        theme={inputTheme(theme)}
                        mode="outlined"
                        label="Mot de passe"
                        value={form.password}
                        secureTextEntry={!showPassword}
                        left={<TextInput.Icon icon="lock-outline" color={theme.colors.muted} />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                color={theme.colors.muted}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        onChangeText={(val) => handleChange('password', val)}
                    />

                    <Button
                        mode="contained"
                        buttonColor={theme.colors.primary}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={handleSubmit}
                    >
                        Se connecter
                    </Button>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Pas encore de compte ? </Text>
                    <Link href="/(auth)/register" style={styles.footerLink}>{"S'inscrire"}</Link>
                </View>

            </View>
        </SafeAreaView>
    )
}

const inputTheme = (theme: ReturnType<typeof useAppTheme>) => ({
    roundness: 14,
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
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    img: {
        width: 38,
        height: 38,
    },
    brandingBlock: {
        alignItems: 'center',
        marginBottom: 44,
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
    tagline: {
        fontSize: 13,
        color: theme.colors.muted,
        textAlign: 'center',
    },
    formBlock: {
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
        textAlign: "center",
        marginBottom: 4,
    },
    formSubtitle: {
        fontSize: 14,
        color: theme.colors.muted,
        marginBottom: 24,
        textAlign: "center"
    },
    input: {
        marginBottom: 14,
        backgroundColor: theme.colors.surface,
    },
    button: {
        marginTop: 8,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        color: theme.colors.muted,
        fontSize: 14,
    },
    footerLink: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '700',
    },
})
