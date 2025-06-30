import { createBrowserRouter } from "react-router";

import AppContainer from "../components/communs/appContainer/appContainer";
import Connect from "../components/communs/connect/connect";
import Guard from "../guard/guard"; // Ajusté le chemin d'importation
import NotFound from "../components/page/not-found/not-found";
import Home from "../components/page/home/home";
import Armurerie from "../components/page/armurerie/armurerie";
import Bestiaire from "../components/page/bestiaire/bestiaire";
import Inventaire from "../components/page/inventaire/inventaire";

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
        path: "/connect",
        element: <Connect />,
      },
      {
        path: "/armurerie", // Route protégée
        element: <Guard />,
        children: [
          {
            index: true, // Rend ce composant par défaut sous /armurerie
            element: <Armurerie />, // Placeholder, remplacez par votre composant
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
        path: "/bestiaire", // Route protégée
        element: <Guard />,
        children: [
          {
            index: true,
            element: <Bestiaire />, // Placeholder
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