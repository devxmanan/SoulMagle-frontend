import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login.tsx'
import Lobby from './components/Lobby.tsx'
import InterestForm from './components/interestsForm.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: "",
                element: <Lobby />
            },
            {
                path: "interestsForm",
                element: <InterestForm />
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}></RouterProvider>,
)
