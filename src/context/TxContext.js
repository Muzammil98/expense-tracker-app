import React, { useEffect, useState, createContext, useContext } from "react";
import { auth, firebase, db } from "../utils/firebase";

export const TxContext = createContext();

export const useTx = () => {
  return useContext(TxContext);
};

export const TxProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const getTransactions = async (userId) => {
    const collectionRef = db.collection("transactions");
    const documents = await collectionRef.where("userId", "==", userId).get();

    if (!documents) {
      console.log("No document exists for user " + userId);
      return;
    }
    let arr = [];
    documents.forEach((doc) => {
      const docId = doc.id;
      arr.unshift({ [docId]: doc.data() });
    });
    setTransactions(arr);
    console.log("Fetch documents for user: ", userId);
  };
  const addTransaction = async ({ name, amount, userId }) => {
    const data = { name, amount, userId };
    const collectionRef = db.collection("transactions");

    const res = await collectionRef.add(data);
    console.log("Added document with ID: ", res.id);


    setTransactions((prevState) => [...prevState, { [res.id]: data }]);
  };

  const updateTransaction = async ({ name, amount, docId }) => {
    const data = { name, amount };

    const res = await db.collection("transactions").doc(docId.toString());
    const newDoc = await res.update({ name, amount });

    let newTxDoc = Object.values(
      transactions.find((doc) => Object.keys(doc) == docId)
    )[0];
    newTxDoc.name = name;
    newTxDoc.amount = amount;

    let arr = transactions.filter((tx) => Object.keys(tx) != docId);
    arr.unshift({ [docId]: newTxDoc });

    setTransactions(arr);

    console.log("Updated document with ID: ", docId);
  };

  const deleteTransaction = async (docId) => {
    const res = await db.collection("transactions").doc(docId).delete();

    setTransactions((prevState) =>
      prevState.filter((doc) => Object.keys(doc) != docId)
    );
    console.log("Deleted document: ", docId);
  };
  const value = {
    transactions,
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };

  return <TxContext.Provider value={value}>{children}</TxContext.Provider>;
};
