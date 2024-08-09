import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

interface User {
    userId: string;
    email: string;
    characterName: string | null;
}

interface AuthContextProps {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);1

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);
    const value = {
        user, 
        setUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
