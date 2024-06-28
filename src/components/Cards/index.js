// import React from "react";
// import "./styles.css";
// import { Card, Row } from "antd";
// import Button from "../Button";
// import {
//   TransactionOutlined,
//   TeamOutlined,
//   FallOutlined,
//   RiseOutlined,
// } from "@ant-design/icons";

// const Cards = ({
//   income,
//   expense,
//   totalBalance,
//   showIncomeModal,
//   showExpenseModal,
//   showCustomerModal,
//   customerCount,
// }) => {
//   return (
//     <div>
//       <Row className="row">
//         {" "}
//         <Card className="card" bordered={true}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <div>
//               <h2>Current Balance</h2>
//               <p> LKR {totalBalance}</p>
//             </div>
//             <div>
//               <TransactionOutlined className="large-icon" />
//             </div>
//           </div>
//           <Button text="Reset Balance" blue={true} />
//         </Card>
//         <Card className="card" bordered={true}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <div>
//               <h2>Total Income</h2>
//               <p> LKR {income}</p>
//             </div>
//             <div>
//               <RiseOutlined className="large-icon" />
//             </div>
//           </div>
//           <Button text="Add Income" blue={true} onClick={showIncomeModal} />
//         </Card>
//         <Card className="card" bordered={true}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <div>
//               <h2>Total Expense</h2>
//               <p> LKR {expense}</p>
//             </div>
//             <div>
//               <FallOutlined className="large-icon" />
//             </div>
//           </div>
//           <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
//         </Card>
//         <Card className="card" bordered={true}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <div>
//               <h2>Total Customers</h2>
//               <p>{customerCount}</p>
//             </div>
//             <div>
//               <TeamOutlined className="large-icon" />
//             </div>
//           </div>
//           <Button text="Add Customer" blue={true} onClick={showCustomerModal} />
//         </Card>
//       </Row>
//     </div>
//   );
// };

// export default Cards;



import React from "react";
import "./styles.css";
import { Card, Row } from "antd";
import Button from "../Button";
import { TransactionOutlined, TeamOutlined, FallOutlined, RiseOutlined } from "@ant-design/icons";
import { Pie } from '@ant-design/charts';

const Cards = ({ income, expense, totalBalance, showIncomeModal, showExpenseModal, showCustomerModal, customerCount }) => {

  const createChartConfig = (data, title, value) => ({
    appendPadding: 10,
    data,
    angleField: 'value',
    // colorField: 'type',
    radius: 0.5,
    innerRadius: 0.6,
    label: {
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: {
        formatter: () => title,
      },
      content: {
        formatter: () => `LKR ${value}`,
      },
    },
  });

  const expenseConfig = createChartConfig([{ type: 'Expense', value: expense }], 'Expense', expense);
  const incomeConfig = createChartConfig([{ type: 'Income', value: income }], 'Income', income);
  const balanceConfig = createChartConfig([{ type: 'Balance', value: totalBalance }], 'Balance', totalBalance);
  const customerConfig = createChartConfig([{ type: 'Customers', value: customerCount }], 'Customers', customerCount);

  return (
    <div>
      <Row className="row">
        <Card className="card" bordered={true}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div>
              <h2>Current Balance</h2>
              <p>LKR {totalBalance}</p>
            </div>
            <div>
              <TransactionOutlined className="large-icon" />
            </div>
          </div>
         
          <Button text="Reset Balance" blue={true} />
        </Card>
        <Card className="card" bordered={true}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div>
              <h2>Total Income</h2>
              <p>LKR {income}</p>
            </div>
            <div>
              <RiseOutlined className="large-icon" />
            </div>
          </div>
          
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className="card" bordered={true}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div>
              <h2>Total Expense</h2>
              <p>LKR {expense}</p>
            </div>
            <div>
              <FallOutlined className="large-icon" />
            </div>
          </div>
        
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
        <Card className="card" bordered={true}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div>
              <h2>Total Customers</h2>
              <p>{customerCount}</p>
            </div>
            <div>
              <TeamOutlined className="large-icon" />
           
            </div>
          </div>
          
          <Button text="Add Customer" blue={true} onClick={showCustomerModal} />
        </Card>
      </Row>
    </div>
  );
};

export default Cards;


