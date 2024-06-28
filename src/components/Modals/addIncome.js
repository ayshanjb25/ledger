import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const AddIncomeModal = ({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (user) {
        const customerCollection = collection(
          db,
          `users/${user.uid}/customers`
        );
        const customerSnapshot = await getDocs(customerCollection);
        const customerList = customerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      }
    };
    fetchCustomers();
  }, [user]);

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Income"
      visible={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "Income");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the income amount!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please select the income date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Please select a category!",
            },
          ]}
        >
          <Select className="select-input-2">
            <Select.Option value="Salary">Salary</Select.Option>
            <Select.Option value="Freelance">Freelance</Select.Option>
            <Select.Option value="Investment">Investment</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Customer"
          name="customerId"
          rules={[
            {
              required: true,
              message: "Please select a customer!",
            },
          ]}
        >
          <Select className="select-input-2">
            {customers.map((customer) => (
              <Select.Option key={customer.id} value={customer.id}>
                {customer.name} - {customer.business}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" className="btn btn-blue" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddIncomeModal;
