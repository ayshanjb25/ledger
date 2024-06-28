import React from "react";
import { Button, Form, Input, Modal} from "antd";

const AddCustomerModal = ({
  isCustomerModalVisible,
  handleCustomerCancel,
  onFinish,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Customer"
      visible={isCustomerModalVisible}
      onCancel={handleCustomerCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "Customer");
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
              message: "Please input the customer's name!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Business"
          name="business"
          rules={[
            {
              required: true,
              message: "Please input the business name!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>

        
        <Form.Item>
          <Button type="primary" className="btn btn-blue" htmlType="submit">Add Customer</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;


{/* <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please select the customer date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[
            {
              required: true,
              message: "Please select a tag!",
            },
          ]}
        >
          <Select className="select-input-2">
            <Select.Option value="food">Salary</Select.Option>
            <Select.Option value="education">Freelance</Select.Option><Select.Option value="office">Investment</Select.Option>
            </Select> 
        </Form.Item> */}