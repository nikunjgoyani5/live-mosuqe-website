"use client";
import Cookies from "js-cookie";

// set cookie
export const setCookie = (name: string, value: string, days = 7) => {
  Cookies.set(name, value, { expires: days, sameSite: "strict" });
};

// get cookie
export const getCookie = (name: string) => {
  return Cookies.get(name);
};

// remove cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
