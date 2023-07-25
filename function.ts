import axios from "axios";
import {AUEYUSERNAME,AUEYDISPLAYNAME, TESTDISPLAYNAME,AUEYCOLORTHEME,TESTCOLORTHEME, SPYUSERNAME, SPYDISPLAYNAME, SPYCOLORTHEME} from '@/constant'
import dayjs from 'dayjs'; // Import dayjs

export const GetUsernameDisplayNameAndThemeFromToken = (): Promise<{ userDisplayName: string; colorTheme: string; username:string } | undefined> => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  const axiosInstance = axios.create({
      headers: {
        // Set the Authorization header with the token value
        Authorization: `Bearer ${token}`
      }
  });
  if (typeof localStorage !== 'undefined') {
    let userDisplayName = '';
    let username = '';
    let colorTheme = '';
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(process.env.NEXT_PUBLIC_BACKEND_API + `/user/username`)
        .then(function (response) {
          username = response.data.username;

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

          resolve({ userDisplayName, colorTheme,username });
        })
        .catch(function (error) {
          if (error.status == 401){
            userDisplayName="401"
          }
          // return error 401
          resolve({ userDisplayName, colorTheme,username });
        });
    });
  }

  return Promise.resolve(undefined);
};

export const GetThemeFromUsername = (username: string): Promise<{ theme: string }> => {
  return new Promise((resolve) => {
    let theme = TESTCOLORTHEME; // Default theme
    if (username === AUEYUSERNAME) {
      theme = AUEYCOLORTHEME;
    } else if (username === SPYUSERNAME) {
      theme = SPYCOLORTHEME;
    }
    resolve({ theme });
  });
};


export const getStartOfWeek = (date: Date): Promise<{ startOfWeek: dayjs.Dayjs }> => {
  return new Promise((resolve) => {
    const currentDay = date.getDay(); // Get the day of the week (0: Sunday, 1: Monday, ..., 6: Saturday)

    // Calculate the difference in days to reach Sunday (0 - currentDay)
    const diffToSunday = 0 - currentDay;
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() + diffToSunday);

    resolve({ startOfWeek: dayjs(startOfWeek) });
  });
};


export const parseWeekStringToDate = (weekString: string): Date => {
  const [yearString, weekStringWithoutOrdinal] = weekString.split('-');
  const year = parseInt(yearString, 10);
  const week = parseInt(weekStringWithoutOrdinal, 10);

  const firstDayOfYear = new Date(year, 0, 1);
  const dayOffset = firstDayOfYear.getDay() === 0 ? 1 : 8 - firstDayOfYear.getDay();

  const targetDate = new Date(year, 0, dayOffset + (week - 1) * 7);

  return targetDate;
};
