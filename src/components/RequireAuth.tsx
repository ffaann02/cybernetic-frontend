import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const RequireAuth = () => {
    const { user, setUser } = useAuth()
    const { getItem } = useLocalStorage()
    const location = useLocation() // Correct way to get the location object from react-router-dom
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true)

    const authUser = () => {
        const localStorageUser = getItem('CYBERNETIC_USER')
        const userId = localStorageUser?.userId
        const email = localStorageUser?.email
        const characterName = localStorageUser?.characterName

        if (!userId && !email) {
            setUser(null)
            setIsAuthLoading(false)
            return
        }

        setUser({ 
            userId: userId, 
            email: email,
            characterName: characterName,
        })
        setIsAuthLoading(false)
        return 
    }

    useEffect(() => {
        authUser()
    }, [])

    if (isAuthLoading) {
        // Render loading animation
        return <div>Loading...</div>
    }

    if (!user && isAuthLoading === false) {
        // Redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />
}

export default RequireAuth
