import { User } from '@/types/auth';
import { useAppTheme } from '@/constants/theme'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Fausses adresses
const MOCK_ADDRESSES = [
    { id: 1, label: 'Domicile', address: 'Yopougon Sicogi 3, Abidjan' },
    { id: 2, label: 'Bureau', address: 'Plateau, Rue des Jardins, Abidjan' },
    { id: 3, label: 'Famille', address: 'Cocody Angré 8ème tranche, Abidjan' },
]

// Faux utilisateur
const MOCK_USER: User = {
    fullname: "Jean Kouassi",
    email: "jean.kouassi@gmail.com",
    telephone: "+225 07 00 00 00",
    role: "client"
}

type CommandCardProps = {
    onSelect?: (address: string) => void
}

export default function CommandCard({ onSelect }: CommandCardProps) {
    const theme = useAppTheme()
    const styles = createStyles(theme)

    return (
        <View style={styles.container}>

            {/* Infos utilisateur */}
            <View style={styles.userSection}>
                <View style={styles.userAvatar}>
                    <Text style={styles.userInitial}>
                        {MOCK_USER.fullname.charAt(0)}
                    </Text>
                </View>
                <View>
                    <Text style={styles.userName}>{MOCK_USER.fullname}</Text>
                    <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
                    <Text style={styles.userPhone}>{MOCK_USER.telephone}</Text>
                </View>
            </View>

            {/* Séparateur */}
            <View style={styles.separator} />

            {/* Adresses */}
            <Text style={styles.sectionTitle}>Adresses de livraison</Text>
            {MOCK_ADDRESSES.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.addressRow}
                    onPress={() => onSelect?.(item.address)}
                >
                    <View style={styles.addressIcon}>
                        <Ionicons name='location-outline' size={18} color={theme.colors.primary} />
                    </View>
                    <View style={styles.addressInfo}>
                        <Text style={styles.addressLabel}>{item.label}</Text>
                        <Text style={styles.addressText}>{item.address}</Text>
                    </View>
                    <Ionicons name='chevron-forward' size={16} color="#ccc" />
                </TouchableOpacity>
            ))}
        </View>
    )
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        margin: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },

    // User
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInitial: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    userName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
    userEmail: { fontSize: 13, color: theme.colors.muted, marginTop: 2 },
    userPhone: { fontSize: 13, color: theme.colors.muted, marginTop: 1 },

    // Séparateur
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: 16,
    },

    // Adresses
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.muted,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    addressIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addressInfo: { flex: 1 },
    addressLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    addressText: { fontSize: 13, color: theme.colors.muted, marginTop: 2 },
})
