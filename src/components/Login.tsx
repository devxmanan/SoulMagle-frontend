import { GrGoogle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Login = () => {
const navigate = useNavigate();
    const handleGoogleLogin = (e: any) => {
        e.preventDefault();
        navigate("/home", {replace: true})
    };

    return (
        <div className="landing-page">
            <div className="content">
                <h1>Welcome to Soulmagle</h1>
                <p>Discover your perfect match based on preferences.</p>
                    <button onClick={handleGoogleLogin} className="googleLogin" type="submit"><GrGoogle/>Continue with Google</button>
            </div>
        </div>
    );
};

export default Login;
