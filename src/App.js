import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Root from "./pages/Root/Root";
import Home from "./pages/Home/Home";
import Gameplay from "./pages/Gameplay/Gameplay";
import Login from "./pages/Login/Login";
import Marketplace from "./pages/Marketplace/Marketplace";
import { Provider, useDispatch } from "react-redux";
import "react-multi-carousel/lib/styles.css";
import { auth } from "./firebase/config";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { uiStateActions } from "./state/uiStateSlice";
import { MarketPlaceActions } from "./state/MarketPlaceSlice";
import localforage from "localforage";
import { gameplayActions } from "./state/gameplaySlice";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "play", element: <Gameplay /> },
        { path: "marketplace", element: <Marketplace /> },
      ],
    },
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user);
      if (user) {
        dispatch(
          uiStateActions.updateCurrentUser({ uid: user.uid, email: user.email })
        );
        dispatch(uiStateActions.toggleLoggedIn(true));
        const colorSchemeData = await localforage.getItem(user.uid + '_colours');
        const backgroundData = await localforage.getItem(user.uid + '_background');
        const highScoreData = await localforage.getItem(user.uid + '_highScore');
        dispatch(MarketPlaceActions.pickScheme(colorSchemeData))
        dispatch(MarketPlaceActions.pickBackground(backgroundData))
        dispatch(gameplayActions.setInitialAccountHighScore(highScoreData))


      } else {
        dispatch(uiStateActions.updateCurrentUser(null));
        dispatch(uiStateActions.toggleLoggedIn(false));
      }
    });

    return () => unsubscribe();
  }, []);



  return <RouterProvider router={router} />;
}

export default App;