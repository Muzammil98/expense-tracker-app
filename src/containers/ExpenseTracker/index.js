import React, { useContext } from "react";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import { IconButton, Button } from "@material-ui/core";
import { FiPower } from "react-icons/fi";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {},
  logoutBtn: {
    position: "absolute",
    top: "0",
    color: "#bd3333",
    fontSize: "30px",
    left: "10px",
  },
  welcomeTxt: { marginBottom: "10px", fontWeight: "300" },
  summaryContainer: {
    position: "relative",
  },
  foregroundBox: {
    width: "350px",
    height: "180px",
    background: "rgba(148, 147, 152, 0.19)",
    backdropFilter: "blur(26px)",
    borderRadius: "20px",
    // zIndex: 2,
    "& .balance-heading":{
      fontweight: "200",
    }
  },

  backgroundBox: {
    width: "324px",
    height: "168px",
    [theme.breakpoints.up("sm")]: {
      background: "#6953f7c7",
    },
    background: "#6953f769",
    backdropFilter: "blur(7px)",
    borderRadius: "20px",
    transform: "rotate(-8.69deg)",
    left: "10px",
    position: "absolute",
    top: "-20px",
  },
}));
const ExpenseTracker = () => {
  const classes = useStyles();
  const { user, signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className={classes.ExpenseTrackerContainer}>
      <h3 className={classes.welcomeTxt}>
        Hello, {user ? user.displayName : "user"}
      </h3>
      <div className={classes.summaryContainer}>
        <div className={classes.backgroundBox} />
        <div className={classes.foregroundBox}>
          <h4 className="balance-heading">Your balance</h4>
          <h2 className="balance-info">
            <span>$</span>26100
          </h2>
          <div className={classes.expenseItemsContainer}>
            <div className={classes.expenseItem}>
              <h6 className="expense-heading">Income</h6>
              <p className="expense-info">
                <span>+</span> <span>$</span> 26100.12
              </p>
            </div>
            <div className={classes.expenseItem}>
              <h6 className="expense-heading">Expense</h6>
              <p className="expense-info">
                <span>-</span> <span>$</span> 2000
              </p>
            </div>
          </div>
        </div>
      </div>
      <IconButton className={classes.logoutBtn} onClick={() => handleSignOut()}>
        <FiPower />
      </IconButton>
    </div>
  );
};

export default ExpenseTracker;
