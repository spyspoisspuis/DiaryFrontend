import React from 'react';
import style from './login.module.scss'
import {Layout, Button, Form, Input} from 'antd';
import axios from "axios";
import { useRouter } from "next/router";
import { LoginWebHeader } from "../../components";
import {AUEYUSERNAME,AUEYDISPLAYNAME, TESTDISPLAYNAME,AUEYCOLORTHEME,TESTCOLORTHEME, SPYUSERNAME, SPYDISPLAYNAME, SPYCOLORTHEME} from '../../constant'

const { Content, Footer } = Layout;

const Login = () => {
    const router = useRouter();
    const onLogin = async (values: any) => {
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_BACKEND_API + `/login`,
            {
              Username: values.username,
              Password: values.password,
            },
            { withCredentials: true }
          );
      
          const storeAuthToken = response.data.token;
          localStorage.setItem('authToken', storeAuthToken);
      
          // Pass the userDisplayName and colorTheme as query parameters
          router.push({
            pathname: '/home',
          });
        } catch (error) {
          alert(error);
        }
    };
      
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout className={style.layout}>
            <LoginWebHeader/>
            <Content className={style.content}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onLogin}
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
