import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";


export default function LandingPage(){

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
        <div className="min-h-screen bg-hm-bg flex items-center justify-center text-hm-gold font-mono text-sm">
            Verificando sesión...
        </div>
        );
    }

    return(
        <>
            {isAuthenticated ? <Navbar/> : <button >Login</button>}
            <h1>This is the landing Page</h1>
        </>
    );
}