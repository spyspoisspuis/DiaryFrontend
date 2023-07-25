import React,{useEffect} from 'react';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';

import { Select  } from 'antd';
import type {MenuProps } from 'antd';
import {AUEYUSERNAME,SPYUSERNAME} from '@/constant'

interface SelectuserNoteProps {
    defaultKey: string;
    theme: string;
    ChangeUserNote: (key:string)=>void;
}
const SelectUserNoteDropdown: React.FC<SelectuserNoteProps> = ({ defaultKey,theme,ChangeUserNote}) => {
    
  // Dynamically set the CSS Variables based on the theme
  React.useEffect(() => {
    document.documentElement.style.setProperty('--tab-bar-background-color', theme);
  }, [theme]);

 
  const handleChange = (key: string) => {
      ChangeUserNote(key)
  };

  const items: MenuProps['items'] = [
    {
      key: SPYUSERNAME,
      label: (
        <>
          <ManOutlined/>
          <p onClick={()=> ChangeUserNote(SPYUSERNAME)}>Spy</p>
        </>
      ),
    },
    {
        key: AUEYUSERNAME,
        label: (
          <>
            <WomanOutlined />
            <p onClick={()=> ChangeUserNote(AUEYUSERNAME)}>AerngAuey</p>
          </>
        ),
      },
];

  return (
    <>
      {defaultKey && 
      <Select
        defaultValue={defaultKey}
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: SPYUSERNAME, label: 'Spy' },
          { value: AUEYUSERNAME, label: 'Auey' },

        ]}
    /> }
    
    </>
  );
}


export default SelectUserNoteDropdown;
