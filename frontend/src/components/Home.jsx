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
      <div className="showDataStyle">
        <p>{User ? User.email : "Not Available"}</p>

        <button type="" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
