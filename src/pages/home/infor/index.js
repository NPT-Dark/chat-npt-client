import "./style.scss";
import "./response.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { BaseUrl } from "../../../components/Api/baseUrl";
import { useEffect } from "react";
import Loading from "../../../components/layout/loading";
import { useContext } from "react";
import { UserDetails } from "..";
function Infor() {
  const [data,setData] = useState(null)
  const goto = useNavigate();
  const { addToast } = useToasts();
  function showMenu() {
    document.getElementById("home-menu").classList.toggle("showMenu");
  }
  const userDetails = useContext(UserDetails)
  useEffect(()=>{
    setData(userDetails)
  },[userDetails])
  function LogOut(){
    addToast("You are leaving !", {
      appearance: 'info',
      autoDismiss: true,
    })
    localStorage.clear();
    setTimeout(()=>goto("/"),2000)
  }
  function ChangeAva(e){
    setData({
      ...data,
      avatar: e.target.value
    })
    BaseUrl.put("/user/update",{
      avatar:e.target.value,
      token:data.token
    })
  }
  return (
    <>
    {data == null && <Loading/>}
    <div className="info">
      <div className="info-menu">
        <img
          src={"https://cdn-icons-png.flaticon.com/512/9183/9183113.png"}
          alt="btn-menu"
          onClick={showMenu}
        />
      </div>
      <div className="info-edit">
        <img
          className="info-edit-ava"
          src={data != null ? (data.avatar != null ? data.avatar :"https://cdn-icons-png.flaticon.com/512/3237/3237472.png") : "https://cdn-icons-png.flaticon.com/512/3237/3237472.png"}
          alt="avatar"
        />
      </div>
      <button className="info-logout" onClick={LogOut}>Out</button>
      <p className="info-name">
        <h2 className="info-name-text">{data != null ? `${data.firstName + " " + data.lastName}` : "NoName"}</h2>
        <h2 className="info-name-text">{data != null ? `${data.firstName + " " + data.lastName}` : "NoName"}</h2>
      </p>
      <div className="info-choose-img">
      <select className="info-choose-img-select" defaultValue={""} required onChange={ChangeAva}
        value = {data != null ? data.avatar : ""}
      >
            <option className="decorated" value={""} disabled hidden>
              Choose Avatar...
            </option>
            <option value={"https://i.pinimg.com/736x/9f/14/e7/9f14e7adc6906e63d3168ccdf4fe399b.jpg"}>Luffy</option>
            <option value={"https://symbols.vn/wp-content/uploads/2021/12/Hinh-Zoro-cuoi-that-to.jpg"}>Zoro</option>
            <option value={"https://hosonhanvat.vn/wp-content/uploads/2020/03/300-1.png"}>Nami</option>
      </select>
      <label>Change Avatar</label>
      </div>
      <div className="info-input">
        <form className="info-input-form">
          <input
            className="info-input-form-fullname"
            type={"text"}
            placeholder="Firstname"
            readOnly = {true}
            value = {data != null ? "FirstName: "+data.firstName : ""}
          />
          <input
            className="info-input-form-fullname"
            type={"text"}
            placeholder="Lastname"
            readOnly = {true}
            value = {data != null ?  "LastName: "+data.lastName : ""}
          />
          <select className="info-input-form-gender" defaultValue={""} required disabled = {true} value = {data != null ? data.gender : ""}>
            <option className="decorated" value={""} disabled hidden>
              Choose Gender...
            </option>
            <option value={1}>Gender: male</option>
            <option value={2}>Gender: female</option>
            <option value={3}>Gender: other</option>
          </select>
          <input
            className="info-input-form-location"
            type={"text"}
            placeholder="Age"
            readOnly = {true}
            value = {data != null ? data.age + " years old" : ""}
          />
          <input
            className="info-input-form-username"
            type={"text"}
            placeholder="Username"
            readOnly = {true}
            value = {data != null ?  "UserName: "+data.userName : ""}
          />
          <input
            className="info-input-form-email"
            type={"email"}
            placeholder="Email"
            readOnly = {true}
            value = {data != null ?  "Email: "+data.email : ""}
          />
        </form>
      </div>
    </div></>
  );
}

export default Infor;
