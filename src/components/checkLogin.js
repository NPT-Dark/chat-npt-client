import { BaseUrl } from "./Api/baseUrl";

export const CheckLogin = async () => {
  var check = false;
  await BaseUrl.post("/user/getuser", {
    token: localStorage.getItem("token"),
  })
    .then(function () {
      check = true;
    })
    .catch(function () {
      check = false;
    });
  return check;
};
