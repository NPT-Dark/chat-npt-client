import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutLoginRegister from "../../components/layout/layoutLoginRegister";
import "./style.scss";
import "./response.scss";
import { BaseUrl } from "../../components/Api/baseUrl";
import { useToasts } from "react-toast-notifications";

function ChangePass() {
  const { addToast } = useToasts();
    const [user,setUser] = useState({username:"",password:""})
    const goto = useNavigate();
    function insertInput(event){
        const newUser = user;
        newUser[event.target.name] = event.target.value;
        setUser(newUser)
    }
    async function Submit(e) {
        e.preventDefault();
        BaseUrl.put("/user/update",user).then(function () {   
          addToast("Change password successfully !!", {
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
    function Back(){
        goto("/")
    }
    return ( 
        <LayoutLoginRegister>
        <form className="changepass-form" onSubmit={Submit}>
          <nav className="changepass-form-title">Change password</nav>
          <input
            type="text"
            id="username"
            name="username"
            className="changepass-form-username"
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
            className="changepass-form-password"
            placeholder="password"
            minLength={6}
            onInput = {insertInput}
            spellCheck="false"
            required
          />
          <input
            type="password"
            id="password"
            name = "newPassword"
            className="changepass-form-password"
            placeholder="New Password"
            minLength={6}
            onInput = {insertInput}
            spellCheck="false"
            required
          />
          <div className="changepass-form-sub">
            <div className="changepass-form-sub-register">
              <nav>Do not want to back login ?</nav>
              <nav onClick={Back}>Back</nav>
            </div>
          </div>
          <button type="submit" className="changepass-form-button">
            Change
          </button>
        </form>
      </LayoutLoginRegister>
     );
}

export default ChangePass;