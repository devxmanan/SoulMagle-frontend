import { useEffect, useState } from "react"
// import { Link } from "react-router-dom";
import { Outlet, useNavigate } from "react-router-dom";
import { initialUserValue, User, UserProvider } from "./contexts/UserContext";

import "./App.css"


export const App = () => {
  const [user, setUser] = useState<User>(initialUserValue);
  const [userLog, setUserLog] = useState(false);
  const navigate = useNavigate();

  const setUserLogged = (value: boolean) => {
    setUserLog(value);
  }
  const getUserData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const dataRes = await res.json();
      console.log(dataRes)
      if (dataRes.success) {
        setUserLog(true);
        setUser(dataRes.data);
      } else {
        navigate("/login", { replace: true })
        console.error(dataRes.message)
      }
    } catch (error: any) {
      navigate("/login", { replace: true })
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (userLog && user.interests.length < 1) {
      navigate("/interestsForm", { replace: true })
    }
  }, [user, userLog])

  useEffect(() => {
    getUserData();
  }, [])



  return (
    <UserProvider value={{ user, setUserLogged, userLog }}>
      <Outlet />
    </UserProvider>
  )
}
