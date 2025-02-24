// Import environment variables from Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_ENDPOINT;
const GETUSERS_ENDPOINT = import.meta.env.VITE_ALLUSERS_ENDPOINT;
const USER_ENDPOINT = import.meta.env.VITE_USER_ENDPOINT;
const LOGOUT = import.meta.env.VITE_FETCH_DATA_ENDPOINT;
const WEBSOCKET_ENDPOINT = import.meta.env.VITE_WEBSOCKET_ENDPOINT;
const REFRESH_TOKEN_ENDPOINT = import.meta.env.VITE_REFRESHTOKEN_ENDPOINT;
const COURSES_ENDPOINT = import.meta.env.VITE_COURSES_ENDPOINT;
const COHORT_ENDPOINT = import.meta.env.VITE_COHORT_ENDPOINT
const APP_SERVER = import.meta.env.VITE_APP_SERVER
const CURRICULUM_ENDPOINT = import.meta.env.VITE_CURRICULUM_ENDPOINT
const TIMETABLE_ENDPOINT = import.meta.env.VITE_TIMETABLE_ENDPOINT
const ASSIGNMENT_ENDPOINT = import.meta.env.VITE_ASSIGNMENT_ENDPOINT
const PAYMENT_ENDPOINT = import.meta.env.VITE_PAYMENT_ENDPOINT
const REVIEW_ENDPOINT = import.meta.env.VITE_REVIEW_ENDPOINT
const CHATROOM_ENDPOINT = import.meta.env.VITE_CHATROOM_ENDPOINT
const ENQUIRY_ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT
const FEEDBACKS_ENDPOINT = import.meta.env.VITE_FEEDBACKS_ENDPOINT
const CODE_AUTHENTICATOR = import.meta.env.VITE_CODE_AUTHENTICATOR
const STORE_CODE = import.meta.env.VITE_STORE_CODE
const PASSWORD_LINK = import.meta.env.VITE_PASSWORD_LINK
const RESET_PASSWORD = import.meta.env.VITE_RESET_PASSWORD
const PAYSTACK_PAYMENT = import.meta.env.VITE_PAYSTACK_PAYMENT
const PAYSTACK_INIT = import.meta.env.VITE_PAYSTACK_INIT
const COURSE_RESOURCES = import.meta.env.VITE_COURSES_RESOURCES
const ANNOUNCEMENT = import.meta.env.VITE_COURSES_ANNOUNCEMENT 
const MARK_ATTENDANCE = import.meta.env.VITE_MARK_ATTENDANCE

const endpoints = {
  LOGIN: `${BASE_URL}${LOGIN_ENDPOINT}`,
  USER: `${BASE_URL}${USER_ENDPOINT}`,
  GET_USERS: `${BASE_URL}${GETUSERS_ENDPOINT}`,
  LOGOUT: `${BASE_URL}${LOGOUT}`,
  REFRESH_TOKEN: `${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`,
  WEBSOCKET_ENDPOINT: WEBSOCKET_ENDPOINT,
  COURSES: `${BASE_URL}${COURSES_ENDPOINT}`,
  COHORT: `${BASE_URL}${COHORT_ENDPOINT}`,
  CURRICULUM: `${BASE_URL}${CURRICULUM_ENDPOINT}`,
  TIMETABLE: `${BASE_URL}${TIMETABLE_ENDPOINT}`,
  ASSIGNMENT: `${BASE_URL}${ASSIGNMENT_ENDPOINT}`,
  PAYMENT: `${BASE_URL}${PAYMENT_ENDPOINT}`,
  REVIEW: `${BASE_URL}${REVIEW_ENDPOINT}`,
  CHATROOM: CHATROOM_ENDPOINT,
  REVIEW: `${BASE_URL}${REVIEW_ENDPOINT}`,
  ENQUIRIES: `${BASE_URL}${ENQUIRY_ENDPOINT}`,
  FEEDBACKS: `${BASE_URL}${FEEDBACKS_ENDPOINT}`,
  CODE_AUTH: `${BASE_URL}${CODE_AUTHENTICATOR}`,
  STORE_CODE: `${BASE_URL}${STORE_CODE}`,
  PASSWORD_LINK: `${BASE_URL}${PASSWORD_LINK}`,
  RESET_PASSWORD: `${BASE_URL}${RESET_PASSWORD}`,
  PAYSTACK_PAYMENT: `${BASE_URL}${PAYSTACK_PAYMENT}`,
  PAYSTACK_INIT: `${BASE_URL}${PAYSTACK_INIT}`,
  COURSE_RESOURCES: `${BASE_URL}${COURSE_RESOURCES}`,
  ANNOUNCEMENT: `${BASE_URL}${ANNOUNCEMENT}`,
  MARK_ATTENDANCE: `${BASE_URL}${MARK_ATTENDANCE}`,

};

export {endpoints};
