import axios from "axios";
import {AUEYUSERNAME,AUEYDISPLAYNAME, TESTDISPLAYNAME,AUEYCOLORTHEME,TESTCOLORTHEME, SPYUSERNAME, SPYDISPLAYNAME, SPYCOLORTHEME} from '@/constant'



export const GetDisplayNameAndThemeFromToken = (): Promise<{ userDisplayName: string; colorTheme: string; } | undefined> => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;

  const axiosInstance = axios.create({
      headers: {
        // Set the Authorization header with the token value
        Authorization: `Bearer ${token}`
      }
  });
  if (typeof localStorage !== 'undefined') {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(process.env.NEXT_PUBLIC_BACKEND_API + `/user/username`)
        .then(function (response) {
          let userDisplayName = '';
          let colorTheme = '';

          if (response.data.username === AUEYUSERNAME) {
            userDisplayName = AUEYDISPLAYNAME;
            colorTheme = AUEYCOLORTHEME;
          } else if (response.data.username === SPYUSERNAME) {
            userDisplayName = SPYDISPLAYNAME;
            colorTheme = SPYCOLORTHEME;
          } else {
            userDisplayName = TESTDISPLAYNAME;
            colorTheme = TESTCOLORTHEME;
          }

          resolve({ userDisplayName, colorTheme });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  return Promise.resolve(undefined);
};
