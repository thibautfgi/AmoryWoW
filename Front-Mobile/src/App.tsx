import './App.css';
import router from "./config/router";
import { RouterProvider } from "react-router";
import { AuthProvider } from '../app/components/authProvider/authProvider'; // Ajustez le chemin

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;