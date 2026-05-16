import { useAppTheme } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Command() {
    const theme = useAppTheme()
    const styles = createStyles(theme)
    const router = useRouter()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <View style={styles.bg}>
                    <Image source={require('@/assets/images/delivery.png')} style={styles.image} resizeMode='contain'/>
                </View>
                <View>
                    <Text style={styles.title}>Félicitation</Text>
                    <Text style={styles.description}>Votre commande a été enregistrée et est en cours de traitement</Text>
                </View>
                <View style={styles.btnCard}>
                    <TouchableOpacity style={styles.trackOrder} onPress={() => router.push('/(orders)/1')}>
                        <Text style={styles.trackOrderText}>Suivre ma commande</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.continueShopping} onPress={() => router.replace('/(foods)')}>
                        <Text style={styles.continueShoppingText}>Continuer mes achats</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
    return StyleSheet.create({
        container: {
            paddingHorizontal: 36,
            paddingTop: 116,
        },
        bg: {
            width: 303,
            height: 266,
        },
        image: {
            width: '100%',
            height: '100%',
        },
        title: {
            fontSize: 32,
            fontWeight: '900',
            textAlign: 'center',
            paddingHorizontal: 24,
            color: theme.colors.text,
        },
        description: {
            fontSize: 15,
            textAlign: 'center',
            color: theme.colors.muted,
            lineHeight: 22,
            marginTop: 8,
        },
        btnCard: {
            width: '100%',
            gap: 24,
            marginTop: 32,
        },
        trackOrder: {
            width: '100%',
            height: 52,
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        trackOrderText: {
            color: '#fff',
            fontWeight: '700',
            fontSize: 15,
        },
        continueShopping: {
            width: '100%',
            height: 52,
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        continueShoppingText: {
            color: theme.colors.primary,
            fontWeight: '700',
            fontSize: 15,
        },
    })
}
