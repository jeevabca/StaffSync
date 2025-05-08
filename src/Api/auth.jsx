import axios from "axios";
import { ENDPOINT } from "../constant/Endpoint";

export const Userlogin = async (request) => {
try {
    let endpoint = ENDPOINT.LOGIN;
    let res = await axios.post(endpoint, request);
    return res;
  } catch (e) {
    console.log(e);
  }
};
export const OtpVerify = async (request) => {
  try {
    let endpoint = ENDPOINT.OTP;
    let res = await axios.post(endpoint, request);
    return res;
  } catch (e) {
    console.log(e);
  }
};
export const SignUp = async (request) => {
    let endpoint = ENDPOINT.SIGNUP;
    let res = await axios.post(endpoint, request);
    console.log("from auth",JSON.stringify(res.data));
    return res;
};


// ============================= Employee ==================================
export const Employeegetall = async () => {
  try {
    let endpoint = ENDPOINT.GET_ALL_EMPLOYEE;
    let res = await axios.post(endpoint);
    return res;
    
  } catch (error) {
    console.log(error);
    
  }
}

export const CreateEmployee = async (request) => {

  console.log("Create employee",JSON.stringify(request));
  
  try {
    let endpoint = ENDPOINT.CREATE_EMPLOYEE;
    let res = await axios.post(endpoint,request);
    console.log("from auth",res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const UpdateEmployee = async (request) => {

  console.log("update employee",JSON.stringify(request));
  
  try {
    let endpoint = ENDPOINT.UPDATE_EMPLOYEE;
    let res = await axios.post(endpoint,request);
    console.log("from auth",JSON.stringify(res.data));
    return res;
  } catch (error) {
    console.log(error);
    throw error; 
  }
}

export const DeleteEmployee = async (request) => {
  try {
    let endpoint = ENDPOINT.DELETE_EMPLOYEE;
    let res = await axios.post(endpoint,request)    
    return res
    
  } catch (error) {
    
  }
}

export const Pincode = async (pin) => {
  try {

    let endpoint = `${ENDPOINT.PINCODE}${pin}`;
    let res = await axios.post(endpoint)
    return res;
} catch (error) {
    console.log();
  }
}

// =============================== Leave =========================================

export const Leavegetall = async () => {
  try {
    let endpoint = ENDPOINT.LEAVE_GET_ALL;
    let res = await axios.post(endpoint);
    return res;

  } catch (error) {
    console.log(error);
  }
}

export const LeaveCreate = async (request) => {
  try {
    let endpoint = ENDPOINT.LEAVE_CREATE;
    let res = await axios.post(endpoint, request);
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const LeaveUpdate = async (request) => {
  try {
    let endpoint = ENDPOINT.LEAVE_UPDATE;
    let res = await axios.post(endpoint, request);
    return res;
  } catch (error) {
    console.log(error);
  }
} 