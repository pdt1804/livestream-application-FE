export const BASE_URL = "http://127.0.0.1:8080"

export const checkError = (message) => {
  if (message.toString().startsWith("001")) {
    return "Username or Password are not correct";
  }

  if (message.toString().startsWith("002")) {
    return "Username already existed";
  }

  if (message.toString().startsWith("003")) {
    return "Invalid year of birth";
  }

  return null;
}