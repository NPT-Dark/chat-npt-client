import "./style.scss";
import "./response.scss"
import { useNavigate } from "react-router-dom";
import LayoutLoginRegister from "../../components/layout/layoutLoginRegister";
import { useState } from "react";
import { BaseUrl } from "../../components/Api/baseUrl";
import { useToasts } from "react-toast-notifications";
function Register() {
  const { addToast } = useToasts();
  document.title = "Chat NPT - Register";
  const goto = useNavigate();
  const [data,setData] = useState({
    firstname:"",
    lastname:"",
    username:"",
    password:"",
    gender:0,
    age:0,
    email:""
  })
  function InputData(e){
    setData({
      ...data,
      [e.target.name]:e.target.value
    })
  }
 async function Submit(e) {
    e.preventDefault();
    await BaseUrl.post("/user/signup",data).then(function () {   
      addToast("Register successfully !!", {
        appearance: 'success',
        autoDismiss: true,
      })   
      setTimeout(()=>goto("/"),2000)
    })
    .catch(function (error) {
      addToast(error.response.data, {
        appearance: 'error',
        autoDismiss: true,
      })
    });
  }
  return (
    <LayoutLoginRegister>
      <form className="register-form" onSubmit={Submit}>
        <nav className="register-form-title">register</nav>
        <input
          type="text"
          id="firstName"
          name="firstname"
          className="register-form-fullname"
          placeholder="firstname"
          spellCheck="false"
          minLength={3}
          title="No input number and min length is three !"
          required
          onInput={InputData}
        />
        <input
          type="text"
          id="lastName"
          className="register-form-fullname"
          placeholder="lastname"
          spellCheck="false"
          minLength={3}
          title="No input number and min length is three !"
          required
          name = "lastname"
          onInput={InputData}
        />
        <input
          type="text"
          id="username"
          className="register-form-username"
          placeholder="username"
          spellCheck="false"
          pattern="[A-Za-z0-9]{6,50}$"
          title="No input min length is six !"
          required
          name="username"
          onInput={InputData}
        />
        <input
          type="password"
          id="password"
          className="register-form-password"
          placeholder="password"
          pattern="[A-Za-z0-9]{6,50}$"
          title="No input min length is six !"
          spellCheck="false"
          required
          name="password"
          onInput={InputData}
        />
        <select className="register-form-gender decorated" defaultValue={""} required name="gender" onChange={InputData}>
            <option className="decorated" value={""} disabled hidden>Choose Gender...</option>
            <option value={1}>male</option>
            <option value={2}>female</option>
            <option value={3}>other</option>
        </select>
        <input
          type="number"
          id="age"
          className="register-form-email"
          placeholder="age"
          spellCheck="false"
          required
          name="age"
          min={10}
          max={100}
          title="No input number greater than one hundred and less than 10!"
          onInput={InputData}
        />
         <input
          type="email"
          id="email"
          className="register-form-email"
          placeholder="email"
          spellCheck="false"
          required
          name="email"
          pattern={`
          ([-!#-'*+/-9=?A-Z^-~]+(.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])`}
          onInput={InputData}
        />
        <button type="submit" className="register-form-button">
          register
        </button>
      </form>
    </LayoutLoginRegister>
  );
}

export default Register;
