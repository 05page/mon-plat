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
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
            Toast.show({ type: 'error', text1: 'Champs manquants', text2: 'Tous les champs sont requis' })
            return
        }
        if (form.password !== form.verify_password) {
            Toast.show({ type: 'error', text1: 'Mots de passe', text2: 'Les mots de passe ne correspondent pas' })
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
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Branding */}
                <View style={styles.brandingBlock}>
                    <View style={styles.logoCircle}>
                        <Image style={styles.img} source={require('../../assets/images/bg.png')} />
                    </View>
                    <Text style={styles.tagline}>La food de chez nous, livrée chez toi</Text>
                </View>

                <Text style={styles.formTitle}>Créer un compte</Text>
                <Text style={styles.formSubtitle}>Rejoins la communauté mon-plat</Text>

                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Nom complet"
                    value={form.fullname}
                    left={<TextInput.Icon icon="account-outline" color={theme.colors.muted} />}
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
                    left={<TextInput.Icon icon="email-outline" color={theme.colors.muted} />}
                    onChangeText={(val) => handleChange('email', val)}
                />
                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Téléphone"
                    value={form.telephone}
                    keyboardType="phone-pad"
                    left={<TextInput.Icon icon="phone-outline" color={theme.colors.muted} />}
                    onChangeText={(val) => handleChange('telephone', val)}
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
                <TextInput
                    style={styles.input}
                    theme={inputTheme(theme)}
                    mode="outlined"
                    label="Confirmer le mot de passe"
                    value={form.verify_password}
                    secureTextEntry={!showConfirmPassword}
                    left={<TextInput.Icon icon="lock-check-outline" color={theme.colors.muted} />}
                    right={
                        <TextInput.Icon
                            icon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                            color={theme.colors.muted}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    }
                    onChangeText={(val) => handleChange('verify_password', val)}
                />

                <Text style={styles.roleLabel}>Je suis</Text>
                <SegmentedButtons
                    value={form.role}
                    onValueChange={(val) => handleChange('role', val)}
                    theme={{
                        colors: {
                            secondaryContainer: theme.colors.primary,
                            onSecondaryContainer: '#fff',
                            outline: theme.colors.border,
                            onSurface: theme.colors.text,
                        },
                    }}
                    buttons={[
                        { value: 'CLIENT', label: 'Client', icon: 'account-outline' },
                        { value: 'SELLER', label: 'Vendeur', icon: 'storefront-outline' },
                    ]}
                />

                <Button
                    loading={isLoading}
                    disabled={isLoading}
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    onPress={handleSubmit}
                >
                    {"S'inscrire"}
                </Button>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Déjà un compte ? </Text>
                    <Link href="/(auth)/login" style={styles.footerLink}>Se connecter</Link>
                </View>

            </ScrollView>
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
        paddingHorizontal: 24,
        paddingVertical: 32,
        flexGrow: 1,
    },
    brandingBlock: {
        alignItems: 'center',
        marginBottom: 32,
    },
    img: {
        width: 38,
        height: 38,
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
    formTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
        marginBottom: 4,
        textAlign: "center"
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
    roleLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 10,
        marginTop: 4,
    },
    button: {
        marginTop: 20,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 6,
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
        fontWeight: '700',
    },
})
