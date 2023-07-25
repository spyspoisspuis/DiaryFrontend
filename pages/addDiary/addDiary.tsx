import React,{useEffect,useState} from 'react';
import style from './addDiary.module.scss'
import { Layout,Result,Button} from 'antd';
import { Header,AddDiaryForm } from "../../components";
import axios from "axios"
import { useRouter } from "next/router";
import type { DatePickerProps } from 'antd';
import {GetUsernameDisplayNameAndThemeFromToken} from '@/function'
import dayjs from 'dayjs'; // Import dayjs


const {  Content, Footer } = Layout;

const AddDiary = () => {
  const router = useRouter();
  const { query } = router;

  const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
    
  const [userDisplay,SetUserDisplay] = useState('');
  const [username,SetUsername] = useState('');
  const [theme,SetTheme] = useState('');
  const [success,SetSuccess] = useState(false);

  const axiosInstance = axios.create({
      headers: {
        // Set the Authorization header with the token value
        Authorization: `Bearer ${token}`
      }
  });

  const GetDisplayNameAndTheme = async () => {
      const result = await GetUsernameDisplayNameAndThemeFromToken();
      if (result !== undefined) {
          const {userDisplayName,colorTheme,username} = result;
          if (userDisplayName == "401") {
            router.push({
              pathname: "/login"
            })
          } else {
            SetUserDisplay(userDisplayName);
            SetUsername(username);
            SetTheme(colorTheme);
          }

      }
  }

  const isSuccessAdd = () => {
    SetSuccess(true);
  }
  
  const BackToHomePage = () => {
    router.push({
      pathname:"/"
    });
  }

  useEffect(() => {
      GetDisplayNameAndTheme();
    }, [])


  return (
    <Layout className={style.layout}>
      <Header user={userDisplay} theme={theme}/>

      <Content className={style.content}>
        {!success && username && <AddDiaryForm username={username} success={isSuccessAdd} />}
        {success && <Result
          status="success"
          title={`Successfully Add Diary on ${query.week}`}
          extra={[
            <Button type="primary" key="console" style={{backgroundColor:theme}} onClick={BackToHomePage}>
              Back to home page
            </Button>,
          ]}
        />}
      </Content>
      <Footer style={{ textAlign: 'center' }}>หมาป่าหล่อเท่สุดคูล</Footer>
    </Layout>
  );
}


export default AddDiary;