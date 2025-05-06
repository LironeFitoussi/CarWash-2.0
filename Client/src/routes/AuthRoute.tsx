import SignInForm from "@/components/Organisms/SignInForm";
import SignUpForm from "@/components/Organisms/SignUpForm";
import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from "react-router-dom";
export default function AuthRoute() {
    const [isSignIn, setIsSignIn] = useState(true)
    const { isAuthenticated } = useAuth()
    const handleSwitchMode = () => {
        setIsSignIn(!isSignIn)
    }
    if (isAuthenticated) {
        return <Navigate to="/" />
    }
    return (
        <div className="h-screen">
            {isSignIn ? <SignInForm swithMode={handleSwitchMode}/> : <SignUpForm swithMode={handleSwitchMode}/>}
        </div>
    )
}
