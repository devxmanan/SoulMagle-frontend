import { GrGoogle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase";
import useUser from "../contexts/UserContext";

const Login = () => {
    const navigate = useNavigate();
    const { userLog, setUserLogged } = useUser();
    const handleGoogleLogin = async (e: any) => {
        e.preventDefault();
        const user = await signInWithGoogle()
        if (user) {
            const idToken = await user.getIdToken();
            // Send this token to server
            if (user) {

                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/social-auth`, {
                    method: 'POST',
                    credentials: "include" as const,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idToken }),
                });

                const res = await response.json();
                if (res.success) {
                    setUserLogged(true);
                } else {
                    setUserLogged(false)
                }
            } else {
                console.log('Error signing in with Google');
            }
        }

    };

    if (userLog) {
        navigate("/interestsForm", { replace: true })
    }

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
