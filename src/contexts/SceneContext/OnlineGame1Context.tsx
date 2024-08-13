import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface OnlineGame1ContextValue {
    players: any[];
    setPlayers: (players: any[]) => void;
}

// Create the context
const OnlineGame1Context = createContext<OnlineGame1ContextValue | undefined>(undefined);

// Create a custom hook to access the context value
const useOnlineGame1Context = (): OnlineGame1ContextValue => {
    const context = useContext(OnlineGame1Context);
    if (!context) {
        throw new Error('useOnlineGame1Context must be used within an OnlineGame1ContextProvider');
    }
    return context;
};

// Create a provider component
const OnlineGame1ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [players, setPlayers] = useState([]);

    const value = {
        players,
        setPlayers,
    };

    return (
        <OnlineGame1Context.Provider value={value}>
            {children}
        </OnlineGame1Context.Provider>
    );
};

// Export the context, the custom hook, and the provider component
export { OnlineGame1Context, useOnlineGame1Context, OnlineGame1ContextProvider };