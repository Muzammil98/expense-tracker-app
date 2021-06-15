import React, { useContext, useState, useEffect, useRef } from "react";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import { IconButton, Button, TextField, InputLabel } from "@material-ui/core";
import { FiPower } from "react-icons/fi";
import { makeStyles } from "@material-ui/core/styles";
import { useTx } from "../../context/TxContext";
import { Chart, registerables } from "chart.js";
// BsTrash MdClose GrEdit from "react-icons"
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
  headings: { marginBottom: "10px", fontWeight: "300" },
  summaryContainer: {
    position: "relative",
  },
  topContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .chart": {
      [theme.breakpoints.up("sm")]: {
        width: "250px !important",
        height: "250px !important",
      },
      // width: "200px !important",
      // height: "200px !important",
      display: "none !important",
    },
  },
  bottomContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
    flexDirection: "column",
  },
  foregroundBox: {
    [theme.breakpoints.up("sm")]: {
      width: "300px",
      height: "150px",
    },
    width: "250px",
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
    [theme.breakpoints.up("sm")]: {
      background: "#6953f7c7",
      width: "260px",
      height: "120px",
    },
    width: "250px",
    height: "120px",
    background: "#6953f769",
    backdropFilter: "blur(7px)",
    borderRadius: "20px",
    transform: "rotate(-8.69deg)",
    left: "10px",
    position: "absolute",
    top: "-20px",
  },
  inputField: {
    "& input": { fontSize: "12px", color: "white" },

    "& ::placeholder": {
      color: "white",
      fontSize: "12px",
    },
    "& .MuiInput-underline:before": {
      borderColor: "gray",
    },
    "& .MuiFormHelperText-root": {
      color: "darkgray",
      fontSize: "10px",
    },
  },
  inputGroup: { marginBottom: "20px" },
  inputLabel: {
    color: "white",
    fontWeight: "200",
    fontSize: "12px",
    marginBottom: "3px",
  },
}));
const ExpenseTracker = () => {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [chartInstance, setChartInstance] = useState(null);
  const [buttonEdit, setButtonEdit] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [balance, setBalance] = useState("");

  const classes = useStyles();
  const { user, signOut } = useAuth();
  const chartContainer = useRef(null);

  const randomInt = () => Math.floor(Math.random() * (10 - 1 + 1)) + 1;

  const {
    getTransactions,
    updateTransaction,
    addTransaction,
    deleteTransaction,
    transactions,
  } = useTx();
  const chartConfig = {
    type: "pie",
    data: {
      labels: ["Income", "Expense", "Balance"],
      datasets: [
        {
          label: "# of Votes",
          data: [20000, 15000, 5000],
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",

            "rgba(255, 206, 86, 0.2)",
            // "rgba(75, 192, 192, 0.2)",
            // "rgba(153, 102, 255, 0.2)",
            // "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",

            "rgba(255, 206, 86, 1)",
            // "rgba(75, 192, 192, 1)",
            // "rgba(153, 102, 255, 1)",
            // "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
          hoverOffset: 15,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        // legend: {
        //   position: 'left',
        // },
        legend: false,
        // tooltip: false,
      },
      layout: {
        padding: 20,
      },
    },
  };

  useEffect(() => {
    // if (chartContainer && chartContainer.current) {
    const newChartInstance = new Chart(chartContainer.current, chartConfig);
    setChartInstance(newChartInstance);
    // }
    return () => {
      newChartInstance.destroy();
    };
  }, [chartContainer]);
  useEffect(() => {
    getTransactions(user.uid);
  }, []);

  useEffect(() => {
    let income = 0,
      expense = 0,
      balance = 0;
    transactions.map((tx) => {
      const id = Object.keys(tx)[0];
      const value = Object.values(tx)[0];
      const { name, amount } = value;
      if (amount > 0) {
        income += amount;
      }
      if (amount < 0) {
        expense += amount;
      }
    });
    balance = income - Math.abs(expense);
    setIncome(income.toString());
    setExpense(Math.abs(expense).toString());
    setBalance(balance.toString());
    console.log("INCOME::", income, "EXPENSE::", expense, "BALACNE::", balance);
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

  const handleUpdateTransaction = () => {
    updateTransaction({
      name,
      amount,
      docId: transactionId,
    });
    setName("");
    setAmount("");
    setButtonEdit(false);
  };
  const handleDeleteTransaction = (id) => {
    deleteTransaction(id);
  };

  const handleNumberChange = (e) => {
    const re = /^[-]{0,1}[0-9]*$/;

    console.log("handleNumberChange", re.test(e.target.value), e.target.value);
    if (re.test(e.target.value)) {
      setAmount(e.target.value);
    }
  };
  const handleSubmit = () => {
    if (!name || name === null || !amount || amount === null) {
      return;
    }
    addTransaction({ name, amount: parseInt(amount), userId: user.uid });
    setName("");
    setAmount("");
  };
  const handleEdit = ({ name, amount, docId }) => {
    setName(name.toString());
    setAmount(amount.toString());
    setTransactionId(docId);
    setButtonEdit(true);
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
                  <span>$</span>{balance}
                </h2>
              </div>
              <div className="expenseItemsContainer">
                <div className="expenseItem">
                  <h5 className="expense-heading">Income</h5>
                  <p className="expense-info">
                    <span>+</span> <span>$</span> {income}
                  </p>
                </div>
                <div className="expenseItem">
                  <h5 className="expense-heading">Expense</h5>
                  <p className="expense-info">
                    <span>-</span> <span>$</span> {expense}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <canvas className="chart" ref={chartContainer} />
        </div>
      </div>
      {/* <button onClick={onButtonClick}>Randomize!</button> */}

      <div className={classes.bottomContainer}>
        <div className={classes.formContainer}>
          <h3 className={classes.headings}>Add Transaction</h3>
          <div className={classes.inputGroup}>
            <InputLabel className={classes.inputLabel}>Name</InputLabel>
            <TextField
              name="name"
              type="text"
              className={classes.inputField}
              placeholder="Income"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={classes.inputGroup}>
            <InputLabel className={classes.inputLabel}>Amount</InputLabel>
            <TextField
              name="amount"
              onChange={handleNumberChange}
              value={amount}
              className={classes.inputField}
              placeholder="0"
              helperText="Some important text"
              required
            />
          </div>
          {buttonEdit ? (
            <Button
              variant="contained"
              style={{ background: "#dede4e" }}
              onClick={() => handleUpdateTransaction()}
            >
              Update
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          )}
          {/* <button onClick={handleAddTransaction}>Add</button>
          <button onClick={handleUpdateTransaction}>Update</button>
          <button onClick={handleDeleteTransaction}>Delete</button> */}
        </div>
        <div className={classes.historyContainer}>
          <h3 className={classes.headings}>History</h3>

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
                  {buttonEdit && transactionId === id ? (
                    <span
                      onClick={() => {
                        setButtonEdit(false);
                        setName("");
                        setAmount("");
                      }}
                    >
                      Cancel
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        handleEdit({
                          name,
                          amount,
                          docId: id,
                        });
                      }}
                    >
                      Edit
                    </span>
                  )}
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
