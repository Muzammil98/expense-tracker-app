import React, { useContext,useRef } from "react";
import {
  auth,
  googleSignInPopup,
  signOut,
  githubSignInPopup,
} from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";
import ExpenseTracker from "../containers/ExpenseTracker";
import Login from "../containers/Login";


import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  appFrameContainer: {
    color: "inherit",
    background: "#302C42",
    boxShadow:
      "0px 0px 200px #0D0F1D, inset 0px 0px 200px rgba(35, 27, 27, 0.7)",
    borderRadius: "20px",
    display: "grid",
    placeItems: "center",
    width: "60vw",
    height: "80vh",
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
      height: "100vh",
      background: "transparent",
      boxShadow: "none",
    },
    zIndex: 0,
    opacity: "0.999",
  },
  appFrameContainer2: {
    color: "inherit",
    background: "#302C42",
    boxShadow:
      "0px 0px 200px #0D0F1D, inset 0px 0px 200px rgba(35, 27, 27, 0.7)",
    borderRadius: "20px",

    width: "60vw",
    height: "80vh",
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
      height: "100vh",
      background: "transparent",
      boxShadow: "none",
    },
    zIndex: 0,
    opacity: "0.999",
  },
}));

const AppFrame = () => {
 
  const { user, setUser } = useContext(AuthContext);
  const classes = useStyles();

  if (user) {
    return (
      <div className={classes.appFrameContainer2}>
        <ExpenseTracker />
      </div>
    );
  }
  return (
    <div className={classes.appFrameContainer}>
      <Login />
    </div>
  );
};

export default AppFrame;
