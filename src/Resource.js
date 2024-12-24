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

  if (message.toString().startsWith("004")) {
    return "Couldn't find user by username";
  }

  if (message.toString().startsWith("005")) {
    return "Error ending livestream session";
  }

  if (message.toString().startsWith("006")) {
    return "Couldn't find livestream session by Id";
  }

  if (message.toString().startsWith("008")) {
    return "Current Password is not correct !";
  }
  
  return null;
}