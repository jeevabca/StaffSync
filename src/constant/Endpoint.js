const BASE_URL = "http://192.168.1.13:8080/api/";

export const ENDPOINT = {
  LOGIN: BASE_URL + "Login/LoginRequest",
  SIGNUP: BASE_URL + "Login/CreateUse",
  OTP: BASE_URL + "Login/LoginOtp",
  //Employee
  GET_ALL_EMPLOYEE: BASE_URL + "Employee/EmployeeGETALL",
  GET_EMPLOYEE_BY_ID: BASE_URL + "Employee/EmployeeGET",
  CREATE_EMPLOYEE: BASE_URL + "Employee/EmployeeCreate",
  UPDATE_EMPLOYEE: BASE_URL + "Employee/EmployeeUpdate",
  DELETE_EMPLOYEE: BASE_URL + "Employee/DeleteEmployee",
  PINCODE: BASE_URL + "Employee/Pincode?Pincode=",
};
