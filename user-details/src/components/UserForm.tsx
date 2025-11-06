import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { User } from 'container/shared';
import { useNavigate } from 'react-router-dom';

type Props = { user: User; onSave: (u: User) => void };

const UserForm: React.FC<Props> = ({ user, onSave }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (vals: any) => {
    const updated: User = {
      ...user,
      name: vals.name,
      email: vals.email,
      phone: vals.phone,
      website: vals.website,
      company: { ...user.company, name: vals.company },
      address: { ...user.address, city: vals.city },
    };

    const previousData = { ...user };
    setLoading(true);
    try {
      onSave(updated);
      message.success('Updated successfully');
      navigate('/');
    } catch (error) {
      onSave(previousData);
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        website: user.website,
        company: user.company.name,
        city: user.address.city,
      }}
      onFinish={onFinish}
    >
      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Name required' }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Invalid email' }, { required: true }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Website" name="website">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="Company" name="company">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item label="City" name="city">
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="mt-20">
        <Button onClick={handleCancel} className="mr-20" disabled={loading}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" disabled={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
