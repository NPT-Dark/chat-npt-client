import { useCallback, useEffect, useState } from "react";
import "./style.scss";
import "./response.scss"
import { itemMenu } from "../../Data/MenuHome";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckLogin } from "../../components/checkLogin";
import { useContext } from "react";
import { BaseUrl } from "../../components/Api/baseUrl";
import { createContext } from "react";
import { useToasts } from "react-toast-notifications";
import { io } from "socket.io-client";
export const Context = createContext()
function Home() {
  document.title = "Chat NPT - Home";
  const goto = useNavigate();
  const [active, setActive] = useState(itemMenu[0]);
  const [data,setData] = useState()
  const [noti,setNoti] = useState([])
  const lc = useLocation()
  const [SocketIO,setSocketIO] = useState()
  useEffect(()=>{
    if(lc.state.connect === true)
      setSocketIO( io.connect("http://localhost:2401"))
  },[])
  const [showNoti,setShowNoti] = useState(false)
  const { addToast } = useToasts();
  const RequestSocket = useCallback((SocketIO)=>{
    SocketIO.on("receive_invitation", (data) => {
      addToast(
        `You received a friend request from ${
          data.user.firstName + " " + data.user.lastName
        }`,
        {
          appearance: "info",
          autoDismiss: true,
        }
      );
    });
    SocketIO.on("receive_accept_invitation", (data) => {
      addToast(data, {
        appearance: "info",
        autoDismiss: true,
      });
    });
    SocketIO.on("receive_unfriend", (data) => {
      addToast(data, {
        appearance: "info",
        autoDismiss: true,
      });
    });
  },[SocketIO])
  async function FindNotification(id){
    await BaseUrl.post("/user/getnotification",{
      id:id
    }).then(function (response) {   
      setNoti(response.data)
    })
    .catch(function (error) {
        throw new Error(error.message)
    });
  }
  useEffect(()=>{
    var checkToken = false;
    async function Check(){
      checkToken = await CheckLogin();
      if(checkToken === false)goto("/")
      else if(checkToken === true){
        async function GetUser(){
          await BaseUrl.post("/user/getuser",{
            token:localStorage.getItem("token")
          }).then(async function (response) {   
            setData(response.data)
            await FindNotification(response.data.id);
            SocketIO.on("receive_notification", async() => {
              await FindNotification(response.data.id)
            });
            SocketIO.emit("join_room",response.data.id)
            SocketIO.emit("update_status", {
              id_User_Owner: response.data.id,
              status: 1,
            });
            RequestSocket(SocketIO);
            window.addEventListener('beforeunload', function (e) {
              SocketIO.emit("update_status", {
                id_User_Owner: response.data.id,
                status: 0,
              });
              e.preventDefault();
              e.returnValue = '';
            });
          })
          .catch(function (error) {
              throw new Error(error.message)
          });
        }
        GetUser()
      }
    }
    Check()
  },[goto])
  function ActiveItem(item) {
    goto(`/home${item.link}`);
    setActive(item);
  }
  function closeMenu(){
      document.getElementById("home-menu").classList.toggle("showMenu");
  }
  function CountNoti(noti){
    var count = 0
    noti.filter(item=>{
      if(item.Seen === false){
        count++
      }
    })
    return count
  }
  async function UpdateNotification(){
    if(showNoti === false){
      await BaseUrl.post("/user/updatenotification",{
        id:data.id
      }).then(async function (response) { 
        setNoti(response.data)
      })
      .catch(function (error) {
          throw new Error(error.message)
      });
    }
    setShowNoti(!showNoti)
  }
  return (
    <Context.Provider value={{
      socket:SocketIO,
      user:data
    }}>
    <main className="home">
      <div className="home-menu" id = "home-menu">
        <nav className="home-menu-item close">
          <img src="https://cdn-icons-png.flaticon.com/512/5369/5369422.png" alt="img-close" onClick={closeMenu}/>
        </nav>
        {itemMenu.map((item, index) => (
          <>
            <nav
              key={"item" + index}
              className={`home-menu-item ${
                item.id === active.id && "active-item"
              } ${item.name === "Notification" && "box-notification"}`}
              onClick={() => {
                item.name !== "Notification" && ActiveItem(item);
                item.name !== "Notification" && closeMenu();
              }}
            >
              <img className={`${(item.name === "Notification" && CountNoti(noti) > 0) && "shake"}`} key={"img" + index} src={item.url} alt="img-item" onClick={()=>{
                item.name === "Notification" && UpdateNotification()
              }}/>
              {item.name === "Notification" && <label className="count-notification">{CountNoti(noti)}</label>}
              {(item.name === "Notification" && showNoti === true) && (
                  <div className="list-notification">
                    {noti.map((item)=>(
                      <nav>{item.Message}</nav>
                    ))}
                  </div>
                )}
              {item.name !== "Notification" && <div
                key={"title" + index}
                className={`home-menu-item-title ${
                  item.id === active.id && "active-title"
                }`}
              >
                <label key={"name" + index}>{item.name}</label>
              </div>}
            </nav>
          </>
        ))}
      </div>
      <div className="home-page">{active.page}</div>
    </main>
    </Context.Provider>
  );
}

export default Home;
