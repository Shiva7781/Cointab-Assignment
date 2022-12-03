import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.clear();

    alert("Logged out!");
    navigate("/");
  };

  const User = JSON.parse(localStorage.getItem("user"));
  // console.log("User:", User);

  return (
    <div className="Home">
      <p>Email ID</p>
      <p>{User ? User.email : "Not Available"}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
