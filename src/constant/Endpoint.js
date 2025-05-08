const BASE_URL = "http://192.168.0.121:8080/api/";

export const ENDPOINT = {
  LOGIN: BASE_URL + "Login/LoginRequest",
  SIGNUP: BASE_URL + "Login/CreateUser",
  OTP: BASE_URL + "Login/LoginOtp",
  //Employee
  GET_ALL_EMPLOYEE: BASE_URL + "Employee/EmployeeGETALL",
  GET_EMPLOYEE_BY_ID: BASE_URL + "Employee/EmployeeGET",
  CREATE_EMPLOYEE: BASE_URL + "Employee/EmployeeCreate",
  UPDATE_EMPLOYEE: BASE_URL + "Employee/EmployeeUpdate",
  DELETE_EMPLOYEE: BASE_URL + "Employee/DeleteEmployee",
  PINCODE: BASE_URL + "Employee/Pincode?Pincode=",
  //Leave
  LEAVE_GET_ALL: BASE_URL + "Leave/LeaveGETALL",
  LEAVE_CREATE: BASE_URL + "Leave/leaveCreate",
  LEAVE_UPDATE: BASE_URL + "Leave/LeaveUpdate",
  LEAVE_DELETE: BASE_URL + "Leave/DeletLeave",
  EMPLOYEE_LEAVE_DETAILS: BASE_URL + "Leave/EmployeeLeavesDetatils",
};
