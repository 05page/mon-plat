import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper'
import { Link, useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { LoginForm } from '@/types/auth'
import { useAppTheme } from '@/constants/theme'

export default function Login() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    })

    const handleChange = (field: keyof LoginForm, value: string) => {
        setForm({ ...form, [field]: value })
    }

    const handleSubmit = () => {
        if (!form.email || !form.password) {
            Toast.show({
                type: 'error',
                text1: 'Champs manquants',
                text2: 'Email et mot de passe requis',
            })
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            router.replace('/(foods)')
        }, 3000)
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>

                {/* Zone branding */}
                <View style={styles.brandingBlock}>
                    <View style={styles.logoCircle}>
                        <Image style={styles.img} source={require('../../assets/images/bg.png')} />
                    </View>
                    <Text style={styles.tagline}>La food de chez nous, livrée chez toi</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.formBlock}>
                    <Text style={styles.formTitle}>Connexion</Text>

                    <TextInput
                        style={styles.input}
                        theme={{
                            roundness: 16,
                            colors: {
                                background: theme.colors.surface,
                                onSurfaceVariant: theme.colors.muted,
                                onSurface: theme.colors.text,
                                outline: theme.colors.border,
                                primary: theme.colors.primary,
                            },
                        }}
                        mode="outlined"
                        label="Email"
                        value={form.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(val) => handleChange('email', val)}
                    />
                    <TextInput
                        style={styles.input}
                        theme={{
                            roundness: 16,
                            colors: {
                                background: theme.colors.surface,
                                onSurfaceVariant: theme.colors.muted,
                                onSurface: theme.colors.text,
                                outline: theme.colors.border,
                                primary: theme.colors.primary,
                            },
                        }}
                        mode="outlined"
                        label="Mot de passe"
                        value={form.password}
                        secureTextEntry
                        onChangeText={(val) => handleChange('password', val)}
                    />

                    <Button
                        mode="contained"
                        buttonColor={theme.colors.primary}
                        style={styles.button}
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={handleSubmit}
                    >
                        Se connecter
                    </Button>
                </View>

                {/* Lien register */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Pas encore de compte ? </Text>
                    <Link href="/(auth)/register" style={styles.footerLink}>
                        {"S'inscrire"}
                    </Link>
                </View>

            </View>
        </SafeAreaView>
    )
}

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

    img:{
        width: 35,
        height: 35
    },

    brandingBlock: {
        alignItems: 'center',
        marginBottom: 48,
    },

    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        // Ombre portée pour donner du relief au logo
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

    tagline: {
        fontSize: 13,
        color: theme.colors.muted,
        textAlign: 'center',
    },

    formBlock: {
        marginBottom: 24,
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
        marginTop: 8,
        borderRadius: 12,
        paddingVertical: 4,
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
        fontWeight: '600',
    },
})
