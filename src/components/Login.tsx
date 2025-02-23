import { GrGoogle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { firestore, signInWithGoogle } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    const handleGoogleLogin = async (e: any) => {
        e.preventDefault();
        const user = await signInWithGoogle()
        if (user) {
            try {
                const docRef = doc(firestore, "users", `${user.uid}`);
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    updateDoc(doc(firestore, "users", `${user.uid}`), {
                        last_login: Date.now()
                    }).then(() => {
                        if (docSnap.data()?.interests.lengtb < 1) {
                            navigate("/interestsForm", { replace: true })
                        } else {
                            navigate("/", { replace: true })
                        }
                    }).catch(() => {
                        console.error("Error Logging In!")
                    })
                } else {
                    setDoc(doc(firestore, "users", `${user.uid}`), {
                        id: user.uid,
                        email: user.email,
                        name: user.displayName,
                        photoURL: user.photoURL,
                        account_created: Date.now(),
                        last_login: Date.now(),
                        interests: [],
                    }).then(() => {
                        navigate("/interestsForm", { replace: true })
                    }).catch(() => {
                        console.error("Error Signing Up!")
                    })
                }
            } catch (error) {
                console.error("Error getting user data:", error);
            }
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
