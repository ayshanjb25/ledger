import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import Cards from "../components/Cards";
import Header from "../components/Header";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { auth, db } from "../firebase";
import AddCustomerModal from "../components/Modals/addCustomer";
import TransactionTable from "../components/TransactionsTable";
import Chart from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import Navbar from "../components/Navbar";
import { Divider } from "antd";

const Dashboard = () => {       
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [income, setIncome] = useState(0);const [expense, setExpense] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [userName, setUserName] =useState('')
  
  const [sortKey, setSortKey] = useState("");

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showCustomerModal = () => {
    console.log("showCustomerModal called");
    setIsCustomerModalVisible(true);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };
  const handleCustomerCancel = () => {
    setIsCustomerModalVisible(false);
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
      calculateBalance();
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

 

  const addCustomer = async (customer) => {
    //Add the doc
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/customers`),
        customer
      );
      console.log("Document written with ID:", docRef.id);

      toast.success("Customer Added!");
      let newArr = customers;
      newArr.push(customer);
      setCustomers(newArr);
    } catch (e) {
      console.error("Error adding document:", e);

      toast.error("Couldn't add customer");
    }
  };

  const onCustomerFinish = (values) => {
    const newCustomer = {
      // type: type,
      name: values.name,
      business: values.business,
    };
    // setCustomers([...Customers,newCustomer]);
    // setIsExpenseModalVisible(false);
    // setIsIncomeModalVisible(false);
    addCustomer(newCustomer);
    // calculateBalance();
  };

  useEffect(() => {
    //Get all docs from a collection
    fetchTransactions();
    fetchCustomers();
    fetchUserName();
  },[user]);


  const fetchUserName = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name);
      }
    }
  };
  
  const fetchTransactions = async (fetchedCustomers = []) => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({ id: doc.id, ...doc.data() });
      });
  
      // Add customer names to transactions
      const transactionsWithCustomerNames = transactionArray.map((transaction) => {
        const customer = fetchedCustomers.find((cust) => cust.id === transaction.customerId);
        return { 
          ...transaction, 
          customerName: customer ? `${customer.name} - ${customer.business}` : "Unknown",
        };
      });
  
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
  useEffect(() => {
    //Get all docs from a collection
    calculateBalance();
  },[transactions]);

  const calculateBalance = ()=>{
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction)=>{
      if(transaction.type === 'Income'){
        incomeTotal += transaction.amount;
      }else{
        expensesTotal += transaction.amount
      }
    });
    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }

  const fetchCustomers = async () => {
    if (user) {
      const customerCollection = collection(db, `users/${user.uid}/customers`);
      const customerSnapshot = await getDocs(customerCollection);
      const customerList = customerSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomers(customerList);
      setCustomerCount(customerList.length); // Set customer count
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
        const transactionRef = doc(db, `users/${user.uid}/transactions/${transactionId}`);
        // const transactionRef = doc(db, "transactions",id);

        console.log(transactionRef)
        await deleteDoc(transactionRef);
        toast.success("Transaction deleted successfully");
        fetchTransactions();
      }else {
        toast.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };
  let sortedTransactions = transactions.sort((a, b) => {
  
      return new Date(a.date) - new Date(b.date);});
  

  return (
    <div>
      <Header />
      <div style={{display:"flex", flexDirection:"row"}}>
      <Navbar/>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <div style={{display:"flex", flexDirection:"column", width:"100%"}}>
        <h2 className='greeting'>Welcome Back , <span>{userName}</span>👋</h2>
        <p className='subtext'>Access and manage your account and transactions efficently.</p>
          <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          customerCount={customerCount}
            showIncomeModal={showIncomeModal}
            showExpenseModal={showExpenseModal}
            showCustomerModal={showCustomerModal}
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
          <AddCustomerModal
            isCustomerModalVisible={isCustomerModalVisible}
            handleCustomerCancel={handleCustomerCancel}
            onFinish={onCustomerFinish}
          />
           <Divider style={{marginRight:"4rem", marginLeft:"2rem"}}/>
          
          {transactions && transactions.length!= 0 ? <Chart sortedTransactions={sortedTransactions}/> :<NoTransactions/>}
          <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} deleteTransaction={deleteTransaction}/>
          </div> </>
      )}</div>
    </div>
  );
};

export default Dashboard;
