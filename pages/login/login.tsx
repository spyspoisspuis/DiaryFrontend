import React from 'react';
import style from './login.module.scss'
import {Layout,Empty, Button, Form, Input} from 'antd';
import { } from 'antd';

import { Header } from "../../components";

const { Content, Footer } = Layout;

const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

const Login = () => {


      return (
        <Layout className={style.layout}>
           <Header/>
          <Content className={style.content}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            
          </Content>
          <Footer style={{ textAlign: 'center' }}>หมาป่าหล่อเท่สุดคูล</Footer>
        </Layout>
      );
}


export default Login;
