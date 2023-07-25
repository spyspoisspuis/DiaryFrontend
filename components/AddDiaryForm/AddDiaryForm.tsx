import React, {useState,useEffect,useMemo} from 'react';
import style from './AddDiaryForm.module.scss'
import {getStartOfWeek,parseWeekStringToDate} from '@/function'
import dayjs from 'dayjs'
import isoWeek from "dayjs/plugin/isoWeek";
import {useRouter} from 'next/router';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from 'antd';
import axios from "axios";
import type {DatePickerProps} from 'antd'

interface AddDiaryFormProps {
  username: string,
  success: ()=>void;
}

const { Option } = Select;
dayjs.extend(isoWeek);

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 12, // Adjust the offset to align the button with the label column
    },
  },

};

const AddDiaryForm: React.FC<AddDiaryFormProps> = ({username,success}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const router = useRouter();
    const { query } = router;
    // const [selectedDate, setSelectedDate] = useState(parseWeekStringToDate(defaultWeek));

    const [startOfWeek,SetStartOfWeek] = useState<dayjs.Dayjs>(dayjs());
    const [isClientDataFetched, setIsClientDataFetched] = useState(false); // New state variable
    const [content,SetContent] = useState<any>(null);
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("authToken") : null;
    
    const axiosInstance = axios.create({
      headers: {
        // Set the Authorization header with the token value
        Authorization: `Bearer ${token}`
      }
    });

    const [form] = Form.useForm();


    useEffect(() => {
      if ( query.week !== undefined && query.action !== undefined) {
        // If query.week is defined, convert and set the startOfWeek state
        if (query.week == "") {
          FetchCurrentWeek();
        } else {
          SetStartOfWeek(dayjs(parseWeekStringToDate(query.week as string)));
        }

        if (query.action == "edit") {
          let url =  process.env.NEXT_PUBLIC_BACKEND_API +`/user/diary/get?writer=${username}&week=${query.week}`
          axiosInstance.get(url)
          .then(function (response) {
            SetContent(response.data);
            setIsClientDataFetched(true);
          })        
          .catch(function (error) {
            if (error.code == 401) {
                router.push({
                    pathname: "/login",
                });
            }
            else {
              messageApi.open({
                type: 'error',
                content: 'Error fetching diary data for editing. Contact HandsomeWolf',
              });
            } 
          });
        } else {
          setIsClientDataFetched(true);
        }
      } 
    }, [query.week]); 

    const initialValues = useMemo(() => {
      console.log("init value")
      if(!isClientDataFetched) return
      if (content && query.action === "edit") {
        // If content is available and action is "edit", set form values from content
        return {
          writer: content.Diary.writer,
          week: startOfWeek,
          header: content.Diary.header,
          context: content.Diary.context,
          footer: content.Diary.footer,
          status: content.Diary.status,
        };
      } else {
        // If content is not available or action is not "edit", set default values
        return {
          writer: username,
          week: startOfWeek,
          header: '',
          context: '',
          footer: '',
          status: 'draft',
        };
      }
    }, [isClientDataFetched]);

    const FetchCurrentWeek = async() => {
      console.log("FETCH CURRENT")
      try {
        // Call the function and handle the promise resolution using `async/await`
        const response = await getStartOfWeek(new Date());
        SetStartOfWeek(response.startOfWeek); // Access the dayjs object
        form.setFieldsValue({  
          week: dayjs(response.startOfWeek),
        });
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: 'Error fetching current week. Contact HandsomeWolf',
        });
      } 
    }


    const onFinish = (values: any) => {
     
      const weekValues = values['week'];
      const formattedWeek = weekValues.format('YYYY-wo');
      let url = process.env.NEXT_PUBLIC_BACKEND_API + `/user/diary/`
      if (query.action == "edit") {
        url = url+"update"
      } else if (query.action == "add") {
        url = url+"add"
      }
      if (typeof localStorage !== "undefined") {
        return axiosInstance
          .post(url, {
            writer: values.writer,
            week: formattedWeek,
            header: values.header,
            context: values.context,
            footer: values.footer,
            status: values.status,
          })
          .then(function (response) {
            success();
          })
          .catch(function (error) {
            if (error.status === 401) {
              router.push({
                pathname:"/login"
              });
            } else {
              messageApi.open({
                type: 'error',
                content: 'Error add/edit diary data. Contact HandsomeWolf',
              });
            }
          });
      };
    }
    if (startOfWeek === null) {
      // Render a loading state while waiting for the client-side data to be available
      return <div>Loading...</div>;
    }

    const checkValidWeek: DatePickerProps['onChange'] = (date, dateString) => {
      let url =  process.env.NEXT_PUBLIC_BACKEND_API +`/user/diary/get?writer=${username}&week=${dateString}`
      axiosInstance.get(url)
      .then(function (response) {
        console.log(response);
        if (response.status == 200) {
          if (response.data.Diary.status == "confirm"){
            messageApi.open({
              type: 'warning',
              content: 'You had already write and confirm the content on this week',
            });
            form.setFieldsValue({  
              week: startOfWeek,
            });
          } else if (response.data.Diary.status == "draft"){
            SetContent(response.data);
            UpdateData();
          }
        } else if (response.status == 204) {
          SetFreshData(dateString);
        }
        
      })        
      .catch(function (error) {
        if (error.code == 401) {
            router.push({
                pathname: "/login",
            });
        }
        else {
          messageApi.open({
            type: 'error',
            content: 'Error fetching diary data when changing selected week. Contact HandsomeWolf',
          });
        } 
      });
    }

    const UpdateData = () => {
      SetStartOfWeek(dayjs(parseWeekStringToDate(content.Diary.week)));
      form.setFieldsValue({
        writer: content.Diary.writer,
        week: dayjs(parseWeekStringToDate(content.Diary.week)),
        header: content.Diary.header,
        context: content.Diary.context,
        footer: content.Diary.footer,
        status: content.Diary.status,
      });
    }

    const SetFreshData = (dateString:string) => {
      SetStartOfWeek(dayjs(parseWeekStringToDate(dateString)));
      form.setFieldsValue({
        writer: username,
        week: dayjs(parseWeekStringToDate(dateString)),
        header: "",
        context: "",
        footer: "",
        status: "",
      });
    }

  
    return (
      <>
      {contextHolder}
      {isClientDataFetched && initialValues && <div className={style.form}>
        <div className={style.form_content}>
          <Form
            {...formItemLayout}
            form={form}
            name="add-diary"
            onFinish={onFinish}
            initialValues={initialValues}
            style={{ width:" 60% "}}
            scrollToFirstError
          >
            <Form.Item
              name="writer"
              label="Writer"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="week"
              label="Week"
              rules={[{ type: 'object' as const,required: true, message: 'Please input week you want to add!', whitespace: true }]}
            >
              <DatePicker 
                  size="middle" 
                  picker="week" 
                  onChange={checkValidWeek}
                />
            </Form.Item>
        
            <Form.Item
              name="header"
              label="Header"
            >
              <Input.TextArea showCount maxLength={1000} />
            </Form.Item>

            <Form.Item
              name="context"
              label="Context"
            >
              <Input.TextArea showCount maxLength={5000} />
            </Form.Item>

            <Form.Item
              name="footer"
              label="Footer"
            >
              <Input.TextArea showCount maxLength={1000} />
            </Form.Item>
      
            <Form.Item
              name="status"
              label="Status"
              tooltip="The another one will not see your content until you confirm"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="select the status">
                <Option value="draft">
                  Draft
                </Option>
                <Option value="confirm">Confirm</Option>
              </Select>
            </Form.Item>
      
          
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                ยืนยัน
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>}
      </>
    );
}


export default AddDiaryForm;
