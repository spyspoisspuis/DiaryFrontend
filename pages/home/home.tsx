import React,{useEffect} from 'react';
import style from './home.module.scss'
import { Layout, Empty} from 'antd';
import { Header } from "../../components";
import axios from "axios"
import { useRouter } from "next/router";

const {  Content, Footer } = Layout;


const Home = () => {
  const router = useRouter();
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;

  useEffect(() => {
    if (token == null) {
      router.push({
        pathname: "/login"
      });
    }
  },[])


  // const axiosInstance = axios.create({
  //   headers: {
  //     // Set the Authorization header with the token value
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

    
  return (
    <Layout className={style.layout}>
      <Header/>

      <Content className={style.content}>
          <Empty/>
        
      </Content>
      <Footer style={{ textAlign: 'center' }}>หมาป่าหล่อเท่สุดคูล</Footer>
    </Layout>
  );
}


export default Home;
