import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fBase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing...."}
      <footer>&copy; {new Date().getFullYear()} Switter</footer>
    </>
  );
}

export default App;
