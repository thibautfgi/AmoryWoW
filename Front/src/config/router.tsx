import { createBrowserRouter } from "react-router";

import AppContainer from "../components/communs/appContainer/appContainer";
import AuthProvider from "../components/communs/authProvider/authProvider"; // Contexte global
import Guard from "../guard/guard";
import NotFound from "../components/page/not-found/not-found";
import Home from "../components/page/home/home";
import Armurerie from "../components/page/armurerie/armurerie";
import Admin from "../components/page/admin/admin";
import Inventaire from "../components/page/inventaire/inventaire";
import Connect from "../components/communs/connect/connect"; // Nouvel import

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppContainer />, // Rendre AppContainer comme élément par défaut
    children: [
      {
        index: true, // Route par défaut pour /
        element: <Home />, // Page d'accueil
      },
      {
        path: "/connect", // Route pour la page de connexion/déconnexion
        element: <Connect />, // Interface UI basée sur le contexte
      },
      {
        path: "/armurerie", // Route protégée
        element: <Guard />,
        children: [
          {
            index: true, // Rend ce composant par défaut sous /armurerie
            element: <Armurerie />, // Placeholder
          },
        ],
      },
      {
        path: "/inventaire", // Route protégée
        element: <Guard />,
        children: [
          {
            index: true,
            element: <Inventaire />,
          },
        ],
      },
      {
        path: "/admin", // Route protégée
        element: <Guard />,
        children: [
          {
            index: true,
            element: <Admin />, // Placeholder
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />, // Route de secours pour 404
      },
    ],
  },
]);

export default router;