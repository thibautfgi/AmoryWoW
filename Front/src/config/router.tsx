import {
  createBrowserRouter,
  RouteObject,
} from "react-router";

import AppContainer from "../components/communs/appContainer/appContainer";
import HomePage from "../components/page/home/homePage";
import BattleNetAuth from "../components/communs/battleNetAuth/battleNetAuth";

let router = createBrowserRouter([
  {
    path: "/",
    Component: BattleNetAuth,
    children: [
      {
        path: "/",
        Component: HomePage,
      }
    ],
  },
]);

export default router;