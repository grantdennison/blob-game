import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, options) => {
  try {
    const cookieValue = value; // Convert the value object to a JSON string
    // console.log(`Setting cookie: ${name} = ${cookieValue}`); // Log the cookie being set
    cookies.set(name, cookieValue, options);
  } catch (error) {
    // console.error("Failed to set cookie", error);
  }
};

export const getCookie = (name) => {
  const cookieValue = cookies.get(name);
  // console.log(`Retrieved cookie: ${name} = ${cookieValue}`); // Log the cookie being retrieved
  try {
    return cookieValue ? cookieValue : null;
  } catch (error) {
    // console.error("Failed to parse cookie value", error);
    return null;
  }
};

export const removeCookie = (name, options) => {
  cookies.remove(name, options);
};
