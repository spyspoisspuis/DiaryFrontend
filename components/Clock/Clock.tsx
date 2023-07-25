import React, {useState,useEffect} from 'react';
import {Dropdown,message} from 'antd';
import type { MenuProps } from 'antd';
import moment from 'moment-timezone';
import {AUEYUSERNAME,AUEYDISPLAYNAME, TESTDISPLAYNAME,AUEYCOLORTHEME,TESTCOLORTHEME, SPYUSERNAME, SPYDISPLAYNAME, SPYCOLORTHEME} from '@/constant'
import axios from "axios";

interface ClockProps {
    user: string;
}

const Clock: React.FC<ClockProps> = ({ user }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const[ isSetDefaultTimeZone,SetIsSetDefaultTimeZone] = useState(false);
    const [selectTimeZone,SetSelectTimeZone] = useState('DEFAULT');

    const [BKKDisplay, setBKKDisplay] = useState('');

    const [BNEDisplay, setBNEDisplay] = useState('');

    const SetDefaultTimeZone = ({bkkDisplay,bneDisplay} : { bkkDisplay: string; bneDisplay: string }) => {
        if (isSetDefaultTimeZone){
            return
        }
        if (user == AUEYDISPLAYNAME) {
            SetSelectTimeZone(bkkDisplay);
        } else if (user == SPYDISPLAYNAME) {
            SetSelectTimeZone(bneDisplay);
        } else {
            SetSelectTimeZone("Choose Time zone")
        }
        SetIsSetDefaultTimeZone(true)
    }
    const fetchWorldTimeAPI = async (timezone:string) => {
        try {
            const requestURL = 'http://worldtimeapi.org/api/timezone/' + timezone
            const response = await axios.get(requestURL);
            const data = await response.data;
            const dateTimeString = data.datetime;
            const dateTimeObject = moment(dateTimeString).tz(timezone);
            const time = dateTimeObject.format('HH:mm');
            const dayOfWeek = dateTimeObject.format('ddd');
            return {time, dayOfWeek}
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Error fetching date and time. Contact HandsomeWolf',
              });
        }
    }

    const fetchDateTime = async () => {

        try {
            const BKKresult = await fetchWorldTimeAPI("Asia/Bangkok");
            let bkkDisplay = ""
            if (BKKresult) {
                const { time, dayOfWeek } = BKKresult;
                bkkDisplay = "BKK "+dayOfWeek+" "+time
                setBKKDisplay(bkkDisplay)
            }
            const BNEresult = await fetchWorldTimeAPI("Australia/Brisbane");
            let bneDisplay = ""

            if (BNEresult) {
                const { time, dayOfWeek } = BNEresult;
                bneDisplay = "BNE "+dayOfWeek+" "+time
                setBNEDisplay(bneDisplay)
            }

            SetDefaultTimeZone({bkkDisplay,bneDisplay});
        
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: 'Error fetching date and time. Contact HandsomeWolf',
              });
        }
    };



    useEffect(() => {
        fetchDateTime();

        const interval = setInterval(fetchDateTime, 50000);
        
        return () => clearInterval(interval);


      }, [])

    const items: MenuProps['items'] = [
        {
          key: 'BKK',
          label: (
            <p onClick={()=> handleTimeZoneClick(BKKDisplay)}>{BKKDisplay}</p>
          ),
        },
        {
            key: 'QLN',
            label: (
              <p onClick={()=> handleTimeZoneClick(BNEDisplay)}>{BNEDisplay}</p>
            ),
          },
    ];
  
  
    const handleTimeZoneClick = (display:string) => {
        SetSelectTimeZone(display);
    };

    return (
        <>
            {selectTimeZone !== "DEFAULT" && <Dropdown menu={{items}}>
                <a onClick={(e) => e.preventDefault()}>
                    {selectTimeZone}
                </a>
            </Dropdown>}
        </>
    );
}


export default Clock;
