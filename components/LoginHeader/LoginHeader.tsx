import React from 'react';
import style from './LoginHeader.module.scss'
import { Layout} from 'antd';
import {BookFilled} from '@ant-design/icons'
const { Header} = Layout;


const LoginWebHeader = () => {

    return (
    <Header className={style.header}>
        <div>
            <BookFilled style={{color: "white",fontSize: "20px"}}/>
            &nbsp; 
        </div>
        <div>
            คิดถึงนะคะ
        </div>
    </Header>

    );
}


export default LoginWebHeader;
