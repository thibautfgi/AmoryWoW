import { createBrowserRouter } from "react-router";

import AppContainer from "../components/communs/appContainer/appContainer";
import Connect from "../components/communs/connect/Connect";
import { Guard, AdminGuard } from "../guard/guard";
import NotFound from "../components/page/not-found/not-found";
import Home from "../components/page/home/home";
import Armurerie from "../components/page/armurerie/armurerie";
import Admin from "../components/page/admin/admin";
import Inventaire from "../components/page/inventaire/inventaire";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppContainer />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/connect",
        element: <Connect />,
      },
      {
        path: "/armurerie",
        element: <Guard />,
        children: [
          {
            index: true,
            element: <Armurerie />,
          },
        ],
      },
      {
        path: "/inventaire",
        element: <Guard />,
        children: [
          {
            index: true,
            element: <Inventaire />,
          },
        ],
      },
      {
        path: "/admin",
        element: <AdminGuard />,
        children: [
          {
            index: true,
            element: <Admin />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;