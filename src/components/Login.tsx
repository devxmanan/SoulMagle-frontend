import { GrGoogle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase";

const Login = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = async (e: any) => {
        e.preventDefault();
        const user = await signInWithGoogle();
        if (user) {
            navigate("/", { replace: true })
        }
    };

    return (
        <div className="landing-page">
            <div className="content">
                <h1>Welcome to Soulmagle</h1>
                <p>Discover your perfect match based on preferences.</p>
                <button onClick={handleGoogleLogin} className="googleLogin" type="submit"><GrGoogle />Continue with Google</button>
            </div>
        </div>
    );
};

export default Login;
