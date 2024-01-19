import {destroyCookie, parseCookies, setCookie} from "nookies";
import {COOKIES} from "@/utils/staticValues";


function setCookieValue(cName: string, cValue: string, expDays = 30) {
    const maxAge = expDays ? expDays * 24 * 60 * 60 * 1000 : null;
    setCookie(null, `${cName}`, cValue, {
        maxAge,
        path: "/",
    });
}

function removeCookie(cName: string) {
    const domain = process.env.NEXT_PUBLIC_CROSS_DOMAIN;
    destroyCookie(null, `${cName}`, {domain, path: "/"});

}

function setLoggedInUser() {
    setCookieValue(COOKIES.LOGGED_IN, 'true')
    window.location.reload();

}

function loggedOutUser() {
    removeCookie(COOKIES.LOGGED_IN);
    window.location.reload();
}

function isLoggedIn() {
    const cookies = parseCookies();
    return !!cookies[COOKIES.LOGGED_IN];
}

const Defaults = {
    setLoggedInUser,
    loggedOutUser,
    isLoggedIn
};

export default Defaults;
