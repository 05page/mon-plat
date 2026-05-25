import React, { createContext, useContext, useState } from 'react'
import { User } from '@/types/auth'

type AuthContextType = {
    user: User | null
    token: string | null
    /** Appelé après login réussi : stocke le JWT */
    login: (token: string) => void
    /** Vide le user et le token (déconnexion) */
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const login = (token: string) => {
        setToken(token)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

/** Hook pour accéder au contexte auth depuis n'importe quel écran */
export const useAuth = () => useContext(AuthContext)
