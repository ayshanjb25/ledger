import { Popconfirm, Radio, Select, Table } from "antd";
import { doc, setDoc } from "firebase/firestore";
import { parse, unparse } from "papaparse";
import React, { useState } from "react";
import { toast } from "react-toastify";
import searchImg from "../../assets/search.svg";
import { auth, db } from "../../firebase";
import Button from "../Button";
import UpdateIncomeModal from "../Modals/updateIncome";
import "../TransactionsTable/styles.css";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";


const EditTransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
  deleteTransaction,
  showIncomeModal,
  showExpenseModal,
}) => {
  const [search, setSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const { Option } = Select;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type, record) => (
        <span style={{ color: record.type === "Expense" ? "red" : "green" }}>
           {record.type === "Expense" ? (
            <ArrowDownOutlined  style={{ color: "red", marginRight: 4 }} />
          ) : (
            <ArrowUpOutlined  style={{ color: "green", marginRight: 4 }} />
          )}{type}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "20px" }}>
          <Popconfirm
            title="Are you sure to delete this transaction?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button text="Delete" blue={false}/>
          </Popconfirm>
          <Popconfirm
            title="Are you sure to update this transaction?"
            onConfirm={() => handleUpdate(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button text="Update" blue={true} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    item.customerName.toLowerCase().includes(customerSearch.toLowerCase()) &&
    item.type.includes(typeFilter)
  );

  

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey == "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const handleDelete = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      toast.success("Transaction deleted successfully");
      fetchTransactions();
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleUpdate = (record) => {
    setInitialValues(record);
    setTransactionType(record.type);
    setIsIncomeModalVisible(true);
  };

  const exportCSV = () => {
    var csv = unparse({
      fields: ["name", "type", "category", "date", "customerName", "amount"],
      data: transactions,
    });

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var csvURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCSV = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvData = e.target.result;
        const { data } = parse(csvData, { header: true });

        for (const transaction of data) {
          const newTransaction = {
            ...transaction,
            amount: parseFloat(transaction.amount),
          };
          await addTransaction(newTransaction, true);
        }

        toast.success("Transactions added successfully");
        fetchTransactions();
      } catch (error) {
        toast.error(error.message);
      }
    };

    reader.readAsText(file);
    event.target.value = null; // Reset file input
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
    setInitialValues(null);
  };

  const onFinish = async (values, transactionId) => {
    if (transactionId) {
      // Update existing transaction
      try {
        const user = auth.currentUser;
        if (user) {
          const transactionRef = doc(db, `users/${user.uid}/transactions/${transactionId}`);
          await setDoc(transactionRef, {
            type: transactionType,
            date: values.date.format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            category: values.category,
            name: values.name,
            customerId: values.customerId,
          }, { merge: true });
          toast.success("Transaction updated successfully!");
          fetchTransactions();
        }
      } catch (error) {
        toast.error("Failed to update transaction");
        console.error("Error updating document:", error);
      }
    } else {
      // Add new transaction (existing logic)
    }
    setIsIncomeModalVisible(false);
    setInitialValues(null);
  };
  

  return (
    <div className="table-container">
      <div className="search-filter">
        <div className="input-flex">
          <img src={searchImg} width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search by Name"}
          />
        </div><div className="input-flex">
          <img src={searchImg} width="16" />
          <input
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder={"Search by Customer"}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="Income">Income</Option>
          <Option value="Expense">Expense</Option>
        </Select>
        <Button
          text="Add Income"
          blue={true}
          onClick={showIncomeModal}
        />
        <Button
          text="Add Expense"
          blue={true}
          onClick={showExpenseModal}/>
      </div>
      <div className="table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort By Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import to CSV
            </label>
            <input
              onChange={importCSV}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          rowKey={(record) => record.id}
          // rowClassName={(record) =>
          //   record.type === "expense" ? "expense-row" : "income-row"
          // }
        />
        <UpdateIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
          initialValues={initialValues}
          transactionType={transactionType}
        />
      </div>
    </div>
  );
};

export default EditTransactionsTable;
