import { createContext, useContext, useState, ReactNode, useLayoutEffect } from 'react';

interface User {
    email: string;
    id: string;
    name: string;
    role: 'driver' | 'dispatcher';
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const initialState: User | null = null;

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(initialState);

    useLayoutEffect(()=>{
        let user = localStorage.getItem("user");
        if(user) setUserState(JSON.parse(user));
    },[])

    const setUser = (user: User) => {
        setUserState(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const clearUser = () => {
        setUserState(null);
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
