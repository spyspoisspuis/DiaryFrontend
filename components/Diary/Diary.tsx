import React,{useEffect,useState} from 'react';
import { Empty,Button,Tooltip,message} from 'antd';
import style from './Diary.module.scss'
import axios from "axios"
import { useRouter } from 'next/router';
interface DiaryProps {
    user: string;
    displayUser:string;
    week: string;
    theme: string;
}

interface DiaryData {
    writer: string;
    week: string;
    password: string;
    lock: boolean;
    header: string;
    context: string;
    footer: string;
    status: string;
  }

const Diary: React.FC<DiaryProps> = ({ user,displayUser,week,theme}) => {
    const router = useRouter();
    const [messageApi, contextHolder] = message.useMessage();

    const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
    const axiosInstance = axios.create({
        headers: {
          // Set the Authorization header with the token value
          Authorization: `Bearer ${token}`
        }
    });
    const [diary, SetDiary] = useState<DiaryData | null>(null); // Apply the DiaryData interface to the state variable
    const [isNoContent,SetIsNoContent] = useState(true);
    const [viewingYourself,SetViewing] = useState(true);
    useEffect(()=>{
        if (week == "not-select-week") {
            return
        }
        let url =  process.env.NEXT_PUBLIC_BACKEND_API +`/user/diary/get?write=${displayUser}&week=${week}`
        axiosInstance.get(url)
        .then(function (response) {
           if(response.status == 204) {
                SetIsNoContent(true);
           } else if (response.status == 200) {
                SetIsNoContent(false);
                SetDiary(response.data.Diary as DiaryData);
           }
        })
        .catch(function (error) {
            if (error.response.status == 401) {
                router.push({
                    pathname: "/login",
                });
            }
            else {
                messageApi.open({
                    type: 'error',
                    content: 'Error fetching for display diarys data. Contact HandsomeWolf.',
                  });
            } 
        }
        );
    },[displayUser, week]);

    useEffect(()=> {
        SetViewing(displayUser == user)
    },[displayUser])



    const addDiary = () => {
        router.push({
            pathname: "/addDiary",
            query: { week: week,action: "add" },
        });
    }

    const editContent = () => {
        router.push({
            pathname: "/addDiary",
            query: { week: week, action: "edit" },
        });
    }


    return (
        <>
        {contextHolder}
            { isNoContent && <div className={style.empty}>
                <div className={style.empty_container}>
                    {(week == "" || week == "not-select-week")&& <Empty description={<span>ไปเลือกสัปดาห์ที่มุมขวาบนก่อนนะคะ</span>} />}
                    {week != "" && isNoContent && viewingYourself &&
                        <Empty description={<span>ยังไม่ได้เขียนของสัปดาห์นี้นะ</span>} >
                            <Button type="primary" style={{backgroundColor:theme}} onClick={addDiary}>เขียนเลย</Button>
                        </Empty>
                    }
                    {week != "" &&  isNoContent && !viewingYourself &&
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>รอเจ้าตัวมาเขียนนะคะ</span>}/>
                    }
                </div>
            </div>}
            {diary && week != "" && !isNoContent &&
                <div className={style.container}>
                    <div className={style.diary_container}>
                        { diary.status == "draft" && 
                            <div className={style.draft_message}>
                                 <Tooltip title="The other one will not see this until you confirm; press edit button and edit then confirm">
                                        <span>Status:{diary.status}</span>
                                </Tooltip>
                                <Button onClick={editContent} type="default" style={{width:"60%",backgroundColor:theme,color:"white"}}>Edit</Button>
                        </div>}
                        { diary.status == "confirm" && 
                            <div className={style.draft_message}>
                                        <span>Status:{diary.status}</span>
                        </div>}
                        <div className={style.main_content}>
                            <div className={style.header}>{diary.header}</div>
                            
                            <div className={style.context}>
                                {diary.context}
                            </div>
                            <div className={style.footer}> {diary.footer} </div>
                        </div>
                        

                    </div>
                </div>
                
            }           
        </>
  );
}


export default Diary;
