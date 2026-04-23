import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { OtpCode } from '@/types/auth'

export default function Otp() {
    const [isLoading, setIsLoading] = useState(false)
    const [otp, setOtp] = useState<OtpCode>({ code_otp: 0 })

    // On stocke la saisie en string, on convertit en number pour l'état
    const handleChange = (val: string) => {
        const parsed = parseInt(val, 10)
        setOtp({ code_otp: isNaN(parsed) ? 0 : parsed })
    }

    const handleSubmit = () => {
        if (!otp.code_otp) {
            Toast.show({
                type: 'error',
                text1: 'Code manquant',
                text2: 'Saisis le code reçu par email',
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

                {/* Logo */}
                <View style={styles.logoCircle}>
                    <Image style={styles.img} source={require('../../assets/images/bg.png')} />
                </View>

                {/* Texte explicatif */}
                <Text style={styles.title}>Vérification</Text>
                <Text style={styles.subtitle}>
                    Entre le code reçu par email pour activer ton compte.
                </Text>

                {/* Champ OTP */}
                <TextInput
                    style={styles.input}
                    theme={{ roundness: 16 }}
                    mode="outlined"
                    label="Code OTP"
                    value={otp.code_otp ? String(otp.code_otp) : ''}
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={handleChange}
                />

                <Button
                    mode="contained"
                    buttonColor="#FF6B00"
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                    onPress={handleSubmit}
                >
                    Valider
                </Button>

                {/* Lien pour renvoyer le code */}
                <Text style={styles.resend}>
                    Tu n'as pas reçu de code ?{' '}
                    <Text style={styles.resendLink}>Renvoyer</Text>
                </Text>

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
        alignItems: 'center',
    },

    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B00',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },

    img:{
        width: 35,
        height: 35
    },

    logoText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: 14,
        color: '#687076',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },

    input: {
        width: '100%',
        marginBottom: 16,
    },

    button: {
        width: '100%',
        borderRadius: 12,
        paddingVertical: 4,
        marginTop: 8,
    },

    resend: {
        marginTop: 24,
        fontSize: 14,
        color: '#687076',
    },

    resendLink: {
        color: '#FF6B00',
        fontWeight: '600',
    },
})
