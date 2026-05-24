import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useRouter } from 'expo-router'
import { useAppTheme } from '@/constants/theme'

const OTP_LENGTH = 6

export default function Otp() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''))

    // Une ref par case pour gérer le focus automatique
    const inputRefs = useRef<(TextInput | null)[]>([])

    function handleChange(value: string, index: number) {
        const cleaned = value.replace(/[^0-9]/g, '')
        const newDigits = [...digits]

        if (cleaned.length > 1) {
            // Gère le cas où on colle plusieurs chiffres d'un coup
            const chars = cleaned.slice(0, OTP_LENGTH - index).split('')
            chars.forEach((char, i) => { newDigits[index + i] = char })
            setDigits(newDigits)
            const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1)
            inputRefs.current[nextIndex]?.focus()
            return
        }

        newDigits[index] = cleaned
        setDigits(newDigits)

        // Avance automatiquement à la case suivante
        if (cleaned && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    function handleKeyPress(key: string, index: number) {
        // Revient à la case précédente sur backspace si la case est vide
        if (key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = () => {
        const code = digits.join('')
        if (code.length < OTP_LENGTH) {
            Toast.show({ type: 'error', text1: 'Code incomplet', text2: `Saisis les ${OTP_LENGTH} chiffres` })
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

                <View style={styles.logoCircle}>
                    <Image style={styles.img} source={require('../../assets/images/bg.png')} />
                </View>

                <Text style={styles.title}>Vérification</Text>
                <Text style={styles.subtitle}>
                    Entre le code à {OTP_LENGTH} chiffres reçu par email pour activer ton compte.
                </Text>

                {/* Cases OTP individuelles */}
                <View style={styles.otpRow}>
                    {digits.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref }}
                            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                            value={digit}
                            onChangeText={(val) => handleChange(val, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <Button
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    loading={isLoading}
                    disabled={isLoading || digits.join('').length < OTP_LENGTH}
                    onPress={handleSubmit}
                >
                    Valider le code
                </Button>

                {/* Renvoyer le code */}
                <View style={styles.resendRow}>
                    <Text style={styles.resendText}>{"Tu n'as pas reçu de code ? "}</Text>
                    <TouchableOpacity>
                        <Text style={styles.resendLink}>Renvoyer</Text>
                    </TouchableOpacity>
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
        alignItems: 'center',
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
    },
    img: {
        width: 38,
        height: 38,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.muted,
        textAlign: 'center',
        marginBottom: 36,
        lineHeight: 22,
        paddingHorizontal: 8,
    },
    otpRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 32,
    },
    otpBox: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.text,
    },
    otpBoxFilled: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.isDark ? '#2A1A0D' : '#FFF6EE',
    },
    button: {
        width: '100%',
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    resendRow: {
        flexDirection: 'row',
        marginTop: 24,
    },
    resendText: {
        fontSize: 14,
        color: theme.colors.muted,
    },
    resendLink: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '700',
    },
})
