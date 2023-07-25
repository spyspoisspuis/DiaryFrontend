import React,{useEffect} from 'react';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import {AUEYUSERNAME,SPYUSERNAME} from '@/constant'

interface SelectuserNoteProps {
    defaultKey: string;
    theme: string;
    ChangeUserNote: (key:string)=>void;
}
const SelectUserNoteTab: React.FC<SelectuserNoteProps> = ({ defaultKey,theme,ChangeUserNote}) => {
    
  // Dynamically set the CSS Variables based on the theme
  React.useEffect(() => {
    document.documentElement.style.setProperty('--tab-bar-background-color', theme);
  }, [theme]);

  const items: TabsProps['items'] = [
        {
          key: SPYUSERNAME,
          label: (
            <span>
              <ManOutlined />
              Spy
            </span>
          ),

        },
        {
          key: AUEYUSERNAME,
          label: (
            <span>
              <WomanOutlined />
              AerngAuey
            </span>
          ),
        },
        
  ];
  const onChange = (key: string) => {
      ChangeUserNote(key)
  };


  return (
    <>
      {defaultKey && <Tabs defaultActiveKey={defaultKey}  items={items} onChange={onChange} />}
    </>
  );
}


export default SelectUserNoteTab;
