import { useEffect, useState } from "react"
// import { Link } from "react-router-dom";
import { auth, firestore } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Outlet, useNavigate } from "react-router-dom";
import { initialUserValue, User, UserProvider } from "./contexts/UserContext";
import { doc, onSnapshot } from "firebase/firestore";
import "./App.css"


export const App = () => {
  const [user, setUser] = useState<User>(initialUserValue);
  const [userLog, setUserLog] = useState(false);
  const navigate = useNavigate();

  const getUserData = (id: string) => {
    try {
      onSnapshot(doc(firestore, "users", `${id}`), (doc) => {
        const data = doc.data();
        setUser({
          id: data?.id || "",
          name: data?.name || "",
          email: data?.email || "",
          photoURL: data?.photoURL || "",
          interests: data?.interests || []
        })
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (userLog && user.interests.length < 1) {
      navigate("/interestsForm", { replace: true })
    }
  }, [user])
  console.log(user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setUserLog(true)
        getUserData(user.uid);
      } else {
        setUserLog(false);
        navigate("/login", { replace: true })
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <UserProvider value={{ user: user, userLog: userLog }}>
      <Outlet />
    </UserProvider>
  )
}
