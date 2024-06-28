import { Popconfirm, Radio, Select, Table, Button} from "antd";
import { parse, unparse } from "papaparse";
import React, { useState } from "react";
import { toast } from "react-toastify";
import searchImg from "../../assets/search.svg";
import './styles.css'


const TransactionTable = ({ transactions, addTransaction, fetchTransactions, deleteTransaction }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
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
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
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


  return (
    <div className="table-container" >
      
      <div className="table">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "1rem", width: "100%"
          }}
        >
          <h2 style={{flex:1}}>Transaction History</h2>
          <div
        style={{
          flex:2,
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
          width:"100%"
        }}
      >
        <div className="input-flex" style={{flex:1}}>
          <img src={searchImg} width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search by Name"}
          />
        </div>
        <Select
          className="select-input"
          style={{flex:1}}
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="Income">Income</Option>
          <Option value="Expense">Expense</Option>
        </Select>
      
          <Radio.Group
            className="input-radio"
            style={{flex:2,display:"flex",flexDirection:'row'}}
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort By Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group></div>
          
        </div>

        <Table dataSource={sortedTransactions} columns={columns} rowKey={(record) => record.id} />
      </div>
    </div>
  );
};

export default TransactionTable;
