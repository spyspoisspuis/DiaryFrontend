import React,{useEffect,useState} from 'react';
import style from './home.module.scss'
import { Layout,DatePicker} from 'antd';
import { Header,SelectUserNote,Diary } from "../../components";
import axios from "axios"
import { useRouter } from "next/router";
import type { DatePickerProps } from 'antd';
import {GetUsernameDisplayNameAndThemeFromToken,getStartOfWeek} from '@/function'
import dayjs from 'dayjs'

const {  Content, Footer } = Layout;

const Home = () => {
  const router = useRouter();
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
    
  const [userDisplay,SetUserDisplay] = useState('');
  const [username,SetUsername] = useState('');
  const [theme,SetTheme] = useState('');
  const [week,SetWeek] = useState("not-select-week");
  const [startOfWeek,SetStartOfWeek] = useState<dayjs.Dayjs>(dayjs());;
  const [userDisplayNote,SetUserDisplayNote] = useState('');

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
            SetUserDisplayNote(username);
            SetUsername(username);
            SetTheme(colorTheme);
          }

      }
  }

  useEffect(() => {
      GetDisplayNameAndTheme();
      FetchCurrentWeek();
    }, [])

  const selectWeek: DatePickerProps['onChange'] = (date, dateString) => {
    SetWeek(dateString);
  };

  const ChangeUserNote = (key:string) => {
    SetUserDisplayNote(key);
  }

  const FetchCurrentWeek = async() => {
    try {
      // Call the function and handle the promise resolution using `async/await`
      const response = await getStartOfWeek(new Date());
      SetStartOfWeek(response.startOfWeek); // Access the dayjs object
      const weekValues = response.startOfWeek;
      const formattedWeek = weekValues.format('YYYY-wo');
      SetWeek(formattedWeek);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
  // Get the start and end dates of the present week


    
  return (
    <Layout className={style.layout}>
      <Header user={userDisplay} theme={theme}/>

      <Content className={style.content}>
        <div className={style.header_rows}>
          <SelectUserNote defaultKey={username} theme={theme} ChangeUserNote={ChangeUserNote}/>
          <DatePicker 
              onChange={selectWeek} 
              className={style.week_picker} 
              size="middle" 
              picker="week" 
              defaultValue={startOfWeek}/>
        </div>
        <div className={style.diary}>
          { userDisplayNote && <Diary week={week} displayUser={userDisplayNote} theme={theme} user={username}/>}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>หมาป่าหล่อเท่สุดคูล</Footer>
    </Layout>
  );
}


export default Home;
