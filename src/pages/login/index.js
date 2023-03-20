import "./style.scss";
import "./response.scss";
import { useNavigate } from "react-router-dom";
import LayoutLoginRegister from "../../components/layout/layoutLoginRegister";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import { BaseUrl } from "../../components/Api/baseUrl";
import { useEffect } from "react";
function Login() {
  document.title = "Chat NPT - Login";
  const goto = useNavigate();
  const { addToast } = useToasts();
  const [user,setUser] = useState({username:"",password:""})
  useEffect(()=>{
    async function CheckToken(){
      if(localStorage.getItem("token") != null)
      {
        await BaseUrl.post("/user/signin",{
          token:localStorage.getItem("token")
        }).then(function () {   
          goto("/home")
        })
        .catch(function (error) {
            throw new Error(error.message)
        });
      }
    }
    CheckToken();
  },[goto])
  async function Submit(e) {
    e.preventDefault();
    await BaseUrl.post("/user/signin",user).then(function (response) {
      addToast("Login successfully !!", {
        appearance: 'success',
        autoDismiss: true,
      })      
      localStorage.setItem("token",response.data)
      setTimeout(()=>goto("/home"),2000)
    })
    .catch(function (error) {
      addToast(error.response.data, {
        appearance: 'error',
        autoDismiss: true,
      })
    });
  }
  function Register(){
    goto("/register");
  }
  function GoChangePass(){
    goto("/changepass");
  }
  function insertInput(event){
    const newUser = user;
    newUser[event.target.name] = event.target.value;
    setUser(newUser)
  }
  return (
    <LayoutLoginRegister>
      <form className="login-form" onSubmit={Submit}>
        <nav className="login-form-title">login</nav>
        <input
          type="text"
          id="username"
          name="username"
          className="login-form-username"
          placeholder="username"
          spellCheck="false"
          minLength={10}
          onInput = {insertInput}
          required
        />
        <input
          type="password"
          id="password"
          name = "password"
          className="login-form-password"
          placeholder="password"
          minLength={6}
          onInput = {insertInput}
          spellCheck="false"
          required
        />
        <div className="login-form-sub">
        <nav className="login-form-sub-changepass" onClick={GoChangePass}>Change password</nav>
          <div className="login-form-sub-register">
            <nav>Do not have an account ?</nav>
            <nav onClick={Register}>Register</nav>
          </div>
        </div>
        <button type="submit" className="login-form-button">
          login
        </button>
      </form>
    </LayoutLoginRegister>
  );
}
export default Login;
