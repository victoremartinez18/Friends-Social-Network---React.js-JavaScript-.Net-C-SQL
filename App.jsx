import React, { useState, useEffect } from "react";
import "./App.css";
import { Spinner } from "reactstrap";

import usersService from "./services/usersService";

import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Friends from "./components/friends/Friends";
import Login from "./components/user/Login";
import Register from "./components/user/Register";

import SiteNav from "./components/SiteNav";

function App() {
  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    image: "",
    isLoggedIn: false,
  });

  const [spinnerState, setSpinnerState] = useState({
    spinnerComponet: [<Spinner type="grow" color="light" className="my-auto" key={"key1"} />],
  });

  useEffect(() => {
    usersService.currentUser().then(onCurrentSuccess).catch(onCurrentError);
  }, []);

  const onCurrentSuccess = (response) => {
    const currentId = response.data.item.id;
    let currentUserData = {};

    usersService.getById(currentId).then((response) => {
      currentUserData = response.data.item;

      setCurrentUser((prevState) => {
        const newState = { ...prevState };

        newState.isLoggedIn = true;
        newState.firstName = currentUserData.firstName;
        newState.lastName = currentUserData.lastName;
        newState.image = currentUserData.avatarUrl;

        return newState;
      });
    });
  };

  const onCurrentError = (error) => {
    console.log(error);

    setSpinnerState((preState) => {
      const newSpinnerState = { ...preState };

      newSpinnerState.spinnerComponet = [];

      return newSpinnerState;
    });
  };

  return (
    <React.Fragment>
      <SiteNav user={currentUser} spinner={spinnerState.spinnerComponet}></SiteNav>

      <Routes>
        <Route path="/" element={<Home user={currentUser}></Home>}></Route>
        <Route path="/friends" element={<Friends></Friends>}></Route>
        <Route path="/friends/:id" element={<Friends></Friends>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
