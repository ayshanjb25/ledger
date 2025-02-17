import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import Header from "../components/Header";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import EditTransactionsTable from "../components/TransactionsTableEdit";

const Transactions = () => {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortKey, setSortKey] = useState("");

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const addTransaction = async (transaction, many) => {
    //Add the doc
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID:", docRef.id);

      if (!many) toast.success("Transaction Added!");

      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
    } catch (e) {
      console.error("Error adding document:", e);

      if (!many) toast.error("Couldn't add transaction");
    }
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      category: values.category,
      name: values.name,
      customerId: values.customerId,
    };
    // Check if customerId is not undefined
    if (!newTransaction.customerId) {
      toast.error("Customer ID is required!");
      return;
    }
    // setTransactions([...transactions,newTransaction]);
    // setIsExpenseModalVisible(false);
    // setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
    // calculateBalance();
  };

  useEffect(() => {
    //Get all docs from a collection
    fetchTransactions();
    fetchCustomers();
  }, [user]);

  const fetchTransactions = async (fetchedCustomers = []) => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        const transactionData = doc.data();
        console.log("Fetched Transaction:", transactionData); // Add this line for debugging
        transactionArray.push({ id: doc.id, ...transactionData });
      });

      // Add customer names to transactions
      const transactionsWithCustomerNames = transactionArray.map(
        (transaction) => {
          const customer = fetchedCustomers.find(
            (cust) => cust.id === transaction.customerId
          );
          return {
            ...transaction,
            customerName: customer
              ? `${customer.name} - ${customer.business}`
              : "Unknown",
          };
        }
      );

      setTransactions(transactionsWithCustomerNames);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   if (user) {
  //     fetchCustomers();
  //   }
  // }, [user]);

  const fetchCustomers = async () => {
    if (user) {
      const customerCollection = collection(db, `users/${user.uid}/customers`);
      const customerSnapshot = await getDocs(customerCollection);
      const customerList = customerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList);
      toast.success("Customers Fetched!");
      fetchTransactions(customerList);
    }
  };
  const getCurrentUser = () => {
    return auth.currentUser; // Assuming `auth` is your Firebase Auth instance
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const user = getCurrentUser();
      if (user) {
        const transactionRef = doc(
          db,
          `users/${user.uid}/transactions/${transactionId}`
        );
        // const transactionRef = doc(db, "transactions",id);

        console.log(transactionRef);
        await deleteDoc(transactionRef);
        toast.success("Transaction deleted successfully");
        fetchTransactions();
      } else {
        toast.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex", flexDirection: "row" }}>     
        <Navbar />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <h2 className="greeting">Transactions</h2>
              <p className="subtext">
                Access and manage your transactions efficently.
              </p>

              <EditTransactionsTable
                transactions={transactions}
                addTransaction={addTransaction}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                showIncomeModal={showIncomeModal}
                showExpenseModal={showExpenseModal}
              />

              <AddIncomeModal
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFinish={onFinish}
              />
              <AddExpenseModal
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFinish={onFinish}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
