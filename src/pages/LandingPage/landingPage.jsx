import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./landingPage.module.css"


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
            {isAuthenticated ? <Navbar/> : <Link to="/login" className={styles.botonLogin}>Sign In</Link>}
            <h1>This is the landing Page</h1>
        </>
    );
}