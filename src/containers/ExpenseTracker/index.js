import React, { useContext, useState, useEffect, useRef } from "react";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import { IconButton, Button } from "@material-ui/core";
import { FiPower } from "react-icons/fi";
import { makeStyles } from "@material-ui/core/styles";
import { useTx } from "../../context/TxContext";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
// import Chart from 'chart.js';
const useStyles = makeStyles((theme) => ({
  root: {},
  logoutBtn: {
    position: "absolute",
    top: "0",
    color: "#bd3333",
    fontSize: "30px",
    left: "10px",
  },
  ExpenseTrackerContainer: {
    alignSelf: "flex-start",
    padding: "30px 40px",
  },
  welcomeTxt: { marginBottom: "30px", fontWeight: "300" },
  summaryContainer: {
    position: "relative",
  },
  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
  },
  foregroundBox: {
    width: "300px",
    height: "150px",
    background: "rgba(148, 147, 152, 0.19)",
    backdropFilter: "blur(26px)",
    borderRadius: "20px",
    padding: "20px",
    // zIndex: 2,
    "& .balance-heading": {
      fontWeight: "200",
      marginBottom: "0px",
    },
    "& .balance-info": {
      fontWeight: "700",
    },
    balancContainer: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
    },
    "& .expenseItemsContainer": {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: "10px",
      "& .expenseItem": {
        marginRight: "40px",
        "& .expense-heading": {
          fontWeight: "200",
          marginBottom: "0px",
        },
      },
    },
  },

  backgroundBox: {
    width: "260px",
    height: "120px",
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
  const chartContainer = useRef(null);

  const [chartInstance, setChartInstance] = useState(null);
  const randomInt = () => Math.floor(Math.random() * (10 - 1 + 1)) + 1;

  const {
    getTransactions,
    updateTransaction,
    addTransaction,
    deleteTransaction,
    transactions,
  } = useTx();
  const chartConfig = {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  };

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chart(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);
  useEffect(() => {
    getTransactions(user.uid);
  }, []);
  useEffect(() => {
    console.log("YOUR TRANSACTIONS", "=>", transactions);
  }, [transactions]);
  const updateDataset = (datasetIndex, newData) => {
    chartInstance.data.datasets[datasetIndex].data = newData;
    chartInstance.update();
  };
  const onButtonClick = () => {
    const data = [
      randomInt(),
      randomInt(),
      randomInt(),
      randomInt(),
      randomInt(),
      randomInt(),
    ];
    updateDataset(0, data);
  };
  const handleSignOut = () => {
    signOut();
  };
  const handleAddTransaction = (e) => {
    e.preventDefault();
    addTransaction({ name: "Tx", amount: 10, userId: user.uid });
  };

  const handleUpdateTransaction = ({ name, amount, docId }) => {
    updateTransaction({
      name,
      amount,
      docId,
    });
  };
  const handleDeleteTransaction = (id) => {
    deleteTransaction(id);
  };

  return (
    <div className={classes.ExpenseTrackerContainer}>
      <div className={classes.topContainer}>
        <div>
          <h3 className={classes.welcomeTxt}>
            Hello, {user ? user.displayName : "user"}
          </h3>
          <div className={classes.summaryContainer}>
            <div className={classes.backgroundBox} />
            <div className={classes.foregroundBox}>
              <div className={classes.balancContainer}>
                <h4 className="balance-heading">Your balance</h4>
                <h2 className="balance-info">
                  <span>$</span>26100
                </h2>
              </div>
              <div className="expenseItemsContainer">
                <div className="expenseItem">
                  <h5 className="expense-heading">Income</h5>
                  <p className="expense-info">
                    <span>+</span> <span>$</span> 26100.12
                  </p>
                </div>
                <div className="expenseItem">
                  <h5 className="expense-heading">Expense</h5>
                  <p className="expense-info">
                    <span>-</span> <span>$</span> 2000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <canvas ref={chartContainer} />
        </div>
      </div>
      <button onClick={onButtonClick}>Randomize!</button>

      <div className={classes.bottomContainer}>
        <div className={classes.formContainer}>
          <button onClick={handleAddTransaction}>Add</button>
          <button onClick={handleUpdateTransaction}>Update</button>
          <button onClick={handleDeleteTransaction}>Delete</button>
        </div>
        <div className={classes.historyContainer}>
          <ul>
            {transactions.map((tx) => {
              const id = Object.keys(tx)[0];
              const value = Object.values(tx)[0];
              const { name, amount } = value;

              return (
                <>
                  <li key={id}>
                    {value.name} , {value.amount}{" "}
                  </li>
                  <span
                    onClick={() =>
                      handleUpdateTransaction({
                        name,
                        amount: amount + Math.random() * 100,
                        docId: id,
                      })
                    }
                  >
                    Edit
                  </span>
                  <span onClick={() => handleDeleteTransaction(id)}>
                    Delete
                  </span>
                </>
              );
            })}
          </ul>
        </div>
      </div>
      <IconButton className={classes.logoutBtn} onClick={() => handleSignOut()}>
        <FiPower />
      </IconButton>
    </div>
  );
};

export default ExpenseTracker;
