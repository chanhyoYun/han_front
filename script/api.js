import { BACK_BASE_URL, FRONT_BASE_URL } from "./conf.js";

export async function signupApi(data) {
  // 회원가입 api
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    method: "POST",
    body: data,
  });
  const responseJson = await response.json();
  console.log(responseJson);
}

export async function loginApi(data) {
  // 로그인 api
  const response = await fetch(`${BACK_BASE_URL}/users/`, {
    method: "POST",
    body: data,
  });
  const responseJson = await response.json();
  console.log(responseJson);
}

export async function getQuizApi(data) {
  // 퀴즈 가져오기 api
  const response = await fetch(`${BACK_BASE_URL}`)
  const responseJson = await response.json();
  
  return responseJson
}