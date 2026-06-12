import { useState } from "react";
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/constants/theme";

type Props = {
    onRefresh: () => void
}

export default function RefreshComponent({ onRefresh }: Props){
    const theme = useAppTheme()
    const [refresh, setRefresh] = useState(false)

    const handleRefresh = () => {
        setRefresh(true)
        onRefresh()
        setTimeout(() => setRefresh(false), 1000)
    }

    return(
        <View style={styles.content}>
            <TouchableOpacity
                style={[styles.btn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                onPress={handleRefresh}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="refresh"
                    size={20}
                    // Change de couleur pendant le refresh pour donner un retour visuel
                    color={refresh ? theme.colors.primary : theme.colors.muted}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    btn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    }
})