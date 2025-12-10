"use client";
import Cookies from "js-cookie";

// set cookie
export const setCookie = (name: string, value: string, days = 7) => {
  Cookies.set(name, value, {
    expires: days,
    sameSite: "none",
    secure: true,
    domain:
      process.env.NODE_ENV === "production" ? ".livemosque.live" : undefined,
  });
};

// get cookie
export const getCookie = (name: string) => {
  return Cookies.get(name);
};

// remove cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name);
};
