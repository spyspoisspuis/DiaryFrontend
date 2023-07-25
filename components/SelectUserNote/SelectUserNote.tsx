import React,{useEffect,useState} from 'react';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import style from './SelectuserNote.module.scss'
import {SelectUserNoteTab,SelectUserNoteDropdown} from '..'
import type { TabsProps,MenuProps } from 'antd';
import {AUEYUSERNAME,SPYUSERNAME} from '@/constant'

interface SelectuserNoteProps {
    defaultKey: string;
    theme: string;
    ChangeUserNote: (key:string)=>void;
}
const SelectUserNote: React.FC<SelectuserNoteProps> = ({ defaultKey,theme,ChangeUserNote}) => {
    
  // Dynamically set the CSS Variables based on the theme
  React.useEffect(() => {
    document.documentElement.style.setProperty('--tab-bar-background-color', theme);
  }, [theme]);


  return (
    <>
      {defaultKey && 
        <div className={style.tabItem}>
          <SelectUserNoteTab  defaultKey={defaultKey} theme={theme} ChangeUserNote={ChangeUserNote} />
        </div>
      }
      {defaultKey && 
        <div className={style.dropdownItem}>
          <SelectUserNoteDropdown  defaultKey={defaultKey} theme={theme} ChangeUserNote={ChangeUserNote} />
        </div>
      }
    </>
  );
}


export default SelectUserNote;
