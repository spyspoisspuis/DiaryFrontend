import React from 'react';
import style from './Header.module.scss'
import { Layout ,Avatar,Dropdown,Menu,message} from 'antd';
import type { MenuProps } from 'antd';
import {UserOutlined,DownOutlined} from '@ant-design/icons'
import { useRouter } from "next/router";
import Clock from '../Clock/Clock'
import axios from "axios"

const { Header} = Layout;

interface HeaderProps {
  user: string;
  theme: string;
}

const WebHeader: React.FC<HeaderProps> = ({ user,theme }) => {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    const axiosInstance = axios.create({
      headers: {
        // Set the Authorization header with the token value
        Authorization: `Bearer ${token}`
      }
    });
    
    const Logout = () => {
        axiosInstance.post((process.env.NEXT_PUBLIC_BACKEND_API+`/user/logout`))
        .then(function (response) {
            localStorage.clear();
            router.push({
                pathname: "/login",
            });
        })
        .catch(function (error) {
          messageApi.open({
            type: 'error',
            content: 'An error occurred when logout. Contact HandsomeWolf.',
          });
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

    const backHomePage = () => {
      router.push({
        pathname: "/home"
      })
    }
  
  
    return (
      <>
        {contextHolder}
        <Header className={style.header} style={{ backgroundColor: theme }}>
        <div className={style.clock}>
          {user && <Clock user={user}/>}
        </div>

        <div className={style.logo} onClick={backHomePage}>AuengAuey Rokjit</div>
  
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
      </>
    );
}


export default WebHeader;
