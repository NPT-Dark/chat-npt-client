import { useCallback, useContext, useState } from "react";
import { BaseUrl } from "../../../components/Api/baseUrl";
import ItemFriend from "../../../components/layout/itemFriend";
import { useToasts } from "react-toast-notifications";
import "./style.scss";
import { useEffect } from "react";
import Loading from "../../../components/layout/loading";
import { Gender } from "../../../components/textGender";
import { SocketIO } from "../../..";
import { UserDetails } from "..";
function Friends() {
  const { addToast } = useToasts();
  const [data, setData] = useState("");
  const [user, setUser] = useState([]);
  const [load, setLoad] = useState(false);
  const [select,setSelect] = useState("find")
  const socketIO = useContext(SocketIO);
  const userdt = useContext(UserDetails);
  function InputSearch(e) {
    setData(e.target.value);
  }
  const findFriends = async () => {
    setLoad(true);
    await BaseUrl.post("/user/finduser", {
      firstName: data.split(" ")[0] || "",
      lastName: data.split(" ")[1] || "",
      id: userdt.id,
      type:select
    })
      .then(function (response) {
        setUser(response.data);
        setLoad(false);
      })
      .catch(function (error) {
        addToast(error.response.data, {
          appearance: "info",
          autoDismiss: true,
        });
        setUser([]);
        setLoad(false);
      });
  };
  //Socket IO
  async function AddFriends(id, firstName, lastName) {
    await socketIO.emit("join_room", id);
    await socketIO.emit("send_invitation", {
      id_User_Send: userdt.id,
      id_User_Recieve: id,
    });
    await findFriends();
    addToast(
      `You have sent a friend request to ${firstName + " " + lastName}`,
      {
        appearance: "info",
        autoDismiss: true,
      }
    );
  }
  async function CancelFriend(id,type) {
    await socketIO.emit("join_room", id);
    await socketIO.emit("send_cancel_invitation", {
      id_User_Recieve: type === "cancel" ? id : userdt.id,
      id_User_Send: type === "cancel" ? userdt.id : id,
    });
    await findFriends();
    addToast(`Cancel successfull !`, {
      appearance: "info",
      autoDismiss: true,
    });
  }
  async function AcceptFriend(id_Add){
    await socketIO.emit("join_room", id_Add);
    await socketIO.emit("accept_invitation",{
      id_User_Owner:userdt.id,
      id_User_Add:id_Add,
    });
    await findFriends();
    addToast(`Accept successfull !`, {
      appearance: "info",
      autoDismiss: true,
    });
  }
  async function Unfriend(id_Unfriend){
    await socketIO.emit("join_room", id_Unfriend);
    await socketIO.emit("send_unfriend",{
      id_User_Owner:userdt.id,
      id_User_Unfriend:id_Unfriend,
    });
    await findFriends();
    addToast(`Unfriend successfull !`, {
      appearance: "info",
      autoDismiss: true,
    });
  }
  
  const SocketResponse = useCallback(()=>{
    socketIO.on("receive_cancel_invitation", async() => {
      await findFriends();
    });
    socketIO.on("receive_accept_invitation", async() => {
      await findFriends();
    });
    socketIO.on("receive_invitation", async() => {
      await findFriends();
    });
    socketIO.on("receive_unfriend", async(data) => {
      findFriends();
    });
  },[socketIO])
  useEffect(() => {
    SocketResponse()
  }, [SocketResponse]);
  useEffect(()=>{
    findFriends()
  },[select])
  return (
    <>
      {load && <Loading />}
      <div className="friend">
        <div className="friend-header">
          <div className="friend-header-search">
            <input
              type="text"
              className="friend-header-search-input"
              placeholder="Search"
              onInput={InputSearch}
              onKeyUp={(e) => {
                e.key === "Enter" && findFriends();
              }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/6268/6268690.png"
              className="friend-header-search-btn"
              alt="btn-search"
              onClick={findFriends}
            />
          </div>
          <div className="friend-header-option">
            <select onChange={(e)=>setSelect(e.target.value)}>
              <option value={"find"}>Find friend</option>
              <option value={"recieve"}>Friend request</option>
              <option value={"send"}>Send friend</option>
              <option value={"friend"}>My friend</option>
            </select>
          </div>
        </div>
        <div className="friend-content">
          {user.map((item, index) => (
            <ItemFriend
              key={index}
              img={item.avatar}
              name={item.firstName + " " + item.lastName}
              age={item.age}
              gender={Gender(item.gender)}
              email={item.email}
            >
              {item.status === "send" ? (
                <button
                  className="item-friend-btn-cancel"
                  onClick={() => CancelFriend(item.id,"cancel")}
                >
                  Cancel
                </button>
              ) : item.status === "recieve" ? (
                <div className="item-friend-btn">
                  <button className="item-friend-btn-accept" onClick={()=>AcceptFriend(item.id)}>Accept</button>
                  <button className="item-friend-btn-deny" onClick={() => CancelFriend(item.id,"deny")}>Deny</button>
                </div>
              ) : (
                item.status === "friend" ? <div className="item-friend-btn">
                  <p>My Friend !</p>
                  <button className="item-friend-btn-unfriend" onClick={()=>Unfriend(item.id)}>UnFriend</button>
                </div> :
                <button
                  onClick={() =>
                    AddFriends(item.id, item.firstName, item.lastName)
                  }
                >
                  Add
                </button>
              )}
            </ItemFriend>
          ))}
        </div>
      </div>
    </>
  );
}

export default Friends;
