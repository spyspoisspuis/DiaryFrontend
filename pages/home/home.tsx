import React from 'react';
import style from './home.module.scss'
import { Breadcrumb, Layout, theme ,Avatar, Space,Empty} from 'antd';
import {BookFilled,UserOutlined} from '@ant-design/icons'
const { Header, Content, Footer } = Layout;


const Home = () => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    
      return (
        <Layout className={style.layout}>
          <Header className={style.header}>
            <div className={style.right_header}>
                <BookFilled style={{color: "white",fontSize: "20px"}}/>
                &nbsp; แมวเหมียว
            </div>
            <div>
                <Avatar size="large" icon={<UserOutlined />} />
                แมวเหมียวโรคจิต
            </div>

          </Header>
          <Content className={style.content}>
              <Empty/>
              {/* <div  style={{ background: colorBgContainer }}> */}
            
          </Content>
          <Footer style={{ textAlign: 'center' }}>หมาป่าหล่อเท่สุดคูล</Footer>
        </Layout>
      );
}


export default Home;
