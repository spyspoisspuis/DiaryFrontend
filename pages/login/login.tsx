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
    const onLogin = (values: any) => {
        console.log(process.env.NEXT_PUBLIC_BACKEND_API);
        axios.post(process.env.NEXT_PUBLIC_BACKEND_API+`/login`, {
            Username: values.username,
            Password: values.password
          }, { withCredentials: true })
            .then(function (response) {
                const storeAuthToken = response.data.token;
                localStorage.setItem('authToken',storeAuthToken);
                if (response.data.username == AUEYUSERNAME) {
                    localStorage.setItem('user',AUEYDISPLAYNAME)
                    localStorage.setItem('theme',AUEYCOLORTHEME)

                } else if (response.data.username == SPYUSERNAME){
                    localStorage.setItem('user',SPYDISPLAYNAME)
                    localStorage.setItem('theme',SPYCOLORTHEME)
                }else {
                    localStorage.setItem('user',TESTDISPLAYNAME)
                    localStorage.setItem('theme',TESTCOLORTHEME)

                }
                router.push({
                    pathname: "/home"
                });
            })
            .catch(function (error) {
                alert(error);
            });
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
