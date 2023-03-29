import { useCallback, useEffect, useState } from "react";
import "./style.scss";
import "./response.scss"
import { itemMenu } from "../../Data/MenuHome";
import { useNavigate } from "react-router-dom";
import { CheckLogin } from "../../components/checkLogin";
import { useContext } from "react";
import { SocketIO } from "../..";
import { BaseUrl } from "../../components/Api/baseUrl";
import { createContext } from "react";
import { useToasts } from "react-toast-notifications";
export const UserDetails = createContext()
function Home() {
 document.title = "Chat NPT - Home";
  const goto = useNavigate();
  const [active, setActive] = useState(itemMenu[0]);
  const [data,setData] = useState()
  const socketIO = useContext(SocketIO)
  const { addToast } = useToasts();
  const RequestSocket = useCallback(()=>{
    socketIO.on("receive_invitation", (data) => {
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
    socketIO.on("receive_accept_invitation", (data) => {
      addToast(data, {
        appearance: "info",
        autoDismiss: true,
      });
    });
    socketIO.on("receive_unfriend", (data) => {
      addToast(data, {
        appearance: "info",
        autoDismiss: true,
      });
    });
  },[socketIO])
  useEffect(()=>{
    var checkToken = false;
    async function Check(){
      checkToken = await CheckLogin();
      if(checkToken === false)goto("/")
      else if(checkToken === true){
        async function GetUser(){
          await BaseUrl.post("/user/getuser",{
            token:localStorage.getItem("token")
          }).then(function (response) {   
            setData(response.data)
            window.addEventListener('beforeunload', function (e) {
              socketIO.emit("update_status", {
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
  },[goto,socketIO])
  useEffect(()=>{
    RequestSocket();
  },[RequestSocket])
  function ActiveItem(item) {
    goto(`/home${item.link}`);
    setActive(item);
  }
  function closeMenu(){
      document.getElementById("home-menu").classList.toggle("showMenu");
  }
  return (
    <UserDetails.Provider value={data}>
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
              }`}
              onClick={() => {
                ActiveItem(item);
                closeMenu();
              }}
            >
              <img key={"img" + index} src={item.url} alt="img-item" />
              <div
                key={"title" + index}
                className={`home-menu-item-title ${
                  item.id === active.id && "active-title"
                }`}
              >
                <label key={"name" + index}>{item.name}</label>
              </div>
            </nav>
          </>
        ))}
      </div>
      <div className="home-page">{active.page}</div>
    </main>
    </UserDetails.Provider>
  );
}

export default Home;
