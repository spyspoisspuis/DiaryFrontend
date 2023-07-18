import React from 'react';
import style from './Header.module.scss'
import { Layout ,Avatar,Dropdown,Menu} from 'antd';
import {BookFilled,UserOutlined,DownOutlined} from '@ant-design/icons'
import { AUEYCOLORTHEME,AUEYDISPLAYNAME } from '@/constant';
import axios from "axios";
import { useRouter } from "next/router";

const { Header} = Layout;


const WebHeader = () => {
    const router = useRouter();

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    const user = typeof localStorage !== "undefined" ? localStorage.getItem("user") : "";
    const theme = typeof localStorage !== "undefined" ? localStorage.getItem("theme") : "";  
    const colorTheme = theme !== null ? theme : "#10239e"

    const axiosInstance = axios.create({
        headers: {
          // Set the Authorization header with the token value
          Authorization: `Bearer ${token}`
        }
    });

    
    const Logout = () => {
        axiosInstance.post((process.env.NEXT_PUBLIC_BACKEND_API+`/logout`))
        .then(function (response) {
            localStorage.clear();
            router.push({
                pathname: "/login",
            });
        })
        .catch(function (error) {
            alert(error);
        });
    };
    
    const menu = (
        <Menu>
          <Menu.Item onClick={Logout} key="Logout">Logout</Menu.Item>
        </Menu>
    );
  
  
    return (
    <Header className={style.header} style={{backgroundColor:colorTheme}} >
        <div>
            <BookFilled style={{color: "white",fontSize: "20px"}}/>
            &nbsp; 
        </div>
        <div className={style.user_display}>
            <Avatar size="large" icon={<UserOutlined />} />
            <Dropdown overlay={menu}>
                <a onClick={(e) => e.preventDefault()}>
                    {user} <DownOutlined />
                </a>
            </Dropdown>
        </div>
    </Header>
    );
}


export default WebHeader;
