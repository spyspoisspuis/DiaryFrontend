import React from 'react';
import style from './Header.module.scss'
import { Layout, theme ,Avatar} from 'antd';
import {BookFilled,UserOutlined} from '@ant-design/icons'
const { Header} = Layout;


const WebHeader = () => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    
      return (
        <Header className={style.header}>
            <div>
                <BookFilled style={{color: "white",fontSize: "20px"}}/>
                &nbsp; แมวเหมียว
            </div>
            <div>
                <Avatar size="large" icon={<UserOutlined />} />
                แมวเหมียวโรคจิต
            </div>
        </Header>

      );
}


export default WebHeader;
