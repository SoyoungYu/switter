import React, { useState } from "react";
import AppRouter from "components/Router";
import { auth } from "fBase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Switter</footer>
    </>
  );
}

export default App;
