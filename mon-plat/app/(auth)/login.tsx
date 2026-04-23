import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper'
import { Link } from 'expo-router'
import Toast from 'react-native-toast-message'
import { LoginForm } from '@/types/auth'

export default function Login() {
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
                        theme={{ roundness: 16 }}
                        mode="outlined"
                        label="Email"
                        value={form.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(val) => handleChange('email', val)}
                    />
                    <TextInput
                        style={styles.input}
                        theme={{ roundness: 16 }}
                        mode="outlined"
                        label="Mot de passe"
                        value={form.password}
                        secureTextEntry
                        onChangeText={(val) => handleChange('password', val)}
                    />

                    <Button
                        mode="contained"
                        buttonColor="#FF6B00"
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
                        S'inscrire
                    </Link>
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor: '#FF6B00',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        // Ombre portée pour donner du relief au logo
        shadowColor: '#FF6B00',
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
        color: '#687076',
        textAlign: 'center',
    },

    formBlock: {
        marginBottom: 24,
    },

    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
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
        color: '#687076',
        fontSize: 14,
    },

    footerLink: {
        color: '#FF6B00',
        fontSize: 14,
        fontWeight: '600',
    },
})
