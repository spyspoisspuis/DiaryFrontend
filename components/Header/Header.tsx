import React, {useState,useEffect} from 'react';
import style from './Header.module.scss'
import { Layout ,Avatar,Dropdown,Menu} from 'antd';
import type { MenuProps } from 'antd';
import {UserOutlined,DownOutlined} from '@ant-design/icons'
import {GetDisplayNameAndThemeFromToken} from '@/function'
import axios from "axios";
import { useRouter } from "next/router";
import Clock from '../Clock/Clock'

const { Header} = Layout;


const WebHeader = () => {
    const router = useRouter();

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    const [user,SetUser] = useState('');
    const [theme,SetTheme] = useState('');

    const axiosInstance = axios.create({
        headers: {
          // Set the Authorization header with the token value
          Authorization: `Bearer ${token}`
        }
    });

    const GetDisplayNameAndTheme = async () => {
        const result =await GetDisplayNameAndThemeFromToken();
        if (result !== undefined) {
            const {userDisplayName,colorTheme} = result;
            SetUser(userDisplayName);
            SetTheme(colorTheme);
        }
    }

    useEffect(() => {
        GetDisplayNameAndTheme();
      }, [])

    const Logout = () => {
        axiosInstance.post((process.env.NEXT_PUBLIC_BACKEND_API+`/user/logout`))
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
    
    const items: MenuProps['items'] = [
        {
          key: '1',
          label: (
            <p onClick={Logout}>Logout</p>
          ),
        },
    ];
  
  
    return (
        <Header className={style.header} style={{ backgroundColor: theme }}>
        <div className={style.clock}>
          {user && <Clock user={user}/>}
        </div>
  
        {/* User display with the class 'user_display' */}
        <div className={style.user_display}>
          {/* Avatar component with the class 'ant-avatar' */}
          <div className={style.ant_avatar}>
            <Avatar size="large" icon={<UserOutlined /> } />
          </div>
  
          {/* User name element with the class 'user-name' */}
          <span className={style.user_name}>{user && `${user}`}</span>
  
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </Header>
    );
}


export default WebHeader;
