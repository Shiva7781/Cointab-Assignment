import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  let User = JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : false;
  // console.log("User:", User);

  let token = User ? User.accessToken : null;

  useEffect(() => {
    setLoggedIn(token);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={!loggedIn ? <Navigate to="/register" /> : <Home />}
          />
          <Route
            path="/register"
            element={loggedIn ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/login"
            element={loggedIn ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
