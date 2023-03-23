import { useContext, useState } from "react";
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
  const socketIO = useContext(SocketIO);
  const userdt = useContext(UserDetails);
  function InputSearch(e) {
    setData(e.target.value);
  }
  useEffect(() => {
    setLoad(true);
    BaseUrl.post("/user/finduser", {
      firstName: "",
      lastName: "",
      id: userdt.id,
    })
      .then(function (response) {
        setUser(response.data);
        setLoad(false);
        console.log(response.data);
      })
      .catch(function (error) {
        addToast(error.response.data, {
          appearance: "info",
          autoDismiss: true,
        });
        setUser([]);
        setLoad(false);
      });
  }, [addToast, userdt.id]);
  async function findFriends() {
    console.log({
      firstName: data.split(" ")[0] || "",
      lastName: data.split(" ")[1] || "",
      id: userdt.id,
    });
    setLoad(true);
    BaseUrl.post("/user/finduser", {
      firstName: data.split(" ")[0] || "",
      lastName: data.split(" ")[1] || "",
      id: userdt.id,
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
  }
  async function AddFriends(id, firstName, lastName) {
    await socketIO.emit("join_room", id);
    await socketIO.emit("send_invitation", {
      id_User_Send: userdt.id,
      id_User_Recieve: id,
    });
    addToast(
      `You have sent a friend request to ${firstName + " " + lastName}`,
      {
        appearance: "info",
        autoDismiss: true,
      }
    );
    findFriends();
  }
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
            <select>
              <option>Find friend</option>
              <option>Friend request</option>
              <option>Send friend</option>
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
                <button className="item-friend-btn-cancel">Cancel</button>
              ) : item.status === "recieve" ? (
                <div className="item-friend-btn">
                  <button className="item-friend-btn-accept">Accept</button>
                  <button className="item-friend-btn-deny">Deny</button>
                </div>
              ) : (
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
