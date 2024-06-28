import { Line, Pie } from '@ant-design/charts';
import React from 'react';

const Chart = ({ sortedTransactions }) => {
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const spendingData = sortedTransactions
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      category: transaction.category,
      amount: transaction.amount,
    }));

  const finalSpendings = spendingData.reduce((acc, obj) => {
    const key = obj.category;
    if (!acc[key]) {
      acc[key] = { category: obj.category, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  const config = {
    data: data,
    width: 500,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
  };

  const spendingConfig = {
    data: Object.values(finalSpendings),
    width: 500,
    angleField: 'amount',
    colorField: 'category',
  };

  return (
    <div className='charts-wrapper'>
      <div>
        <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
        <Line {...config} />
      </div>
      <div>
        <h2>Your Spending</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
};
   
export default Chart;
