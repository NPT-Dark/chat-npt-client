import { useCallback, useContext, useEffect, useState } from "react";
import Message from "../../../components/layout/message";
import { UserDetails } from "..";
import "./style.scss"
import "./response.scss"
import ChatCard from "../../../components/layout/chatCard";
import StatusCard from "../../../components/statusCard";
import { SocketIO } from "../../..";
import Loading from "../../../components/layout/loading";
import { BaseUrl } from "../../../components/Api/baseUrl";
import { useToasts } from "react-toast-notifications";
function Chat() {
    const socketIO = useContext(SocketIO)
    const [contact,setContact] = useState("")
    const [showPopup,setShowPopup] = useState(true)
    const userdt = useContext(UserDetails);
    const [load, setLoad] = useState(false);
    const [listFriend,setListFriend] = useState([]);
    const { addToast } = useToasts();
    const [message,setMessage] = useState("")
    const [listMessage,setLisMessage] = useState([]);
    async function SendChat(e){
        if(e.key === "Enter"){
            await socketIO.emit("join_room",contact.id);
            await socketIO.emit("send_message",{
                id_User_Send:userdt.id,
                id_User_Receive:contact.id,
                Message:message
            })
            document.getElementById("input-insert").value = "";
            setMessage("");
        }
    }
      const GetChatDetail= async () => {
        await BaseUrl.post("/user/getchat", {
          id_User_Owner:userdt.id,
        })
          .then(function (response) {
            setListFriend(response.data)
            if(contact === ""){
                console.log("aaaa");
                setContact(response.data[0])
            }
          })
          .catch(function (error) {
            addToast(error.response.data, {
              appearance: "info",
              autoDismiss: true,
            });
          });
    };
    const GetListMessage = async () => {
        await BaseUrl.post("/user/getmessage", {
            id_User_Owner:userdt.id,
          })
            .then(function (response) {
                setLisMessage(response.data)
                const element = document.getElementById("chatbox-chat");
                element.scrollTo(0, element.scrollHeight);
            })
            .catch(function (error) {
                addToast(error, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
    }
    const SocketResponse = useCallback(async()=>{
        socketIO.on("receive_friend_status", async() => {
           await GetChatDetail();
        });
        socketIO.on("receive_message", async() => {
            await GetListMessage();
        });
    },[socketIO])
    useEffect(()=>{
        SocketResponse()
    },[SocketResponse])
    useEffect(()=>{
        GetChatDetail();
        GetListMessage();
    },[])
    return (
        <>
        <div className="menu-chat">
            <div className="menu-chat-header">
                <div className="menu-chat-header-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/9183/9183113.png" alt="btn-menu" onClick={()=>document.getElementById("home-menu").classList.toggle("showMenu")}/>
                </div>
                <div className="menu-chat-header-title">
                    Messages
                    <p className="menu-chat-header-title-count-new">5</p>
                </div>
            </div> 
            <div className="menu-chat-search">
                <input type="text" className="menu-chat-search-input" placeholder="Search"/>
                <img src="https://cdn-icons-png.flaticon.com/512/6268/6268690.png" className="menu-chat-search-btn" alt="btn-search"/>
            </div>
            <div className="menu-chat-card">
                {/* {CardChat.map((item)=>(
                    <ChatCard active={`${item.id === contact.id && "active"}`} status = {item.status} name =  {item.name} message = {item.message} time = {item.time} count = {item.count} image = {item.image} click = {()=>ChatBox(item)}/>
                ))} */}
                {listFriend.map((item)=>(
                       <ChatCard active={`${item.id === contact.id && "active"}`} status = {item.status} name =  {item.firstName + " " + item.lastName} image = {item.avatar} click = {()=>{
                            setContact(item);
                            setShowPopup(true);
                            GetListMessage(item.id)
                       }}/>
                ))}
            </div>
        </div> 
        <div className={`chatbox ${showPopup && 'activeChatBoxResponse'}`}>
            <header className="chatbox-header">
                <img className="chatbox-header-img" src={contact.avatar} alt="img-chatbox"/>
                <label className="chatbox-header-label">
                    <label className="chatbox-header-label-name">{contact.firstName + " " + contact.lastName}</label>
                    <label className="chatbox-header-label-status" style={{color:`${StatusCard(contact.status).color}`}}>{StatusCard(contact.status).text}</label>
                </label>
                <img className="chatbox-header-btn-back" src="https://cdn-icons-png.flaticon.com/512/3925/3925153.png"  alt="img-back" onClick={()=>setShowPopup(false)}/>
            </header>
            <div className="chatbox-chat" id = "chatbox-chat">
                {listMessage.map((item,index)=>(
                    (item.id_User_Send === contact.id || item.id_User_Receive === contact.id) &&
                    <Message key={index} avatar = {contact.avatar} type = {item.id_User_Send === userdt.id ? "send" : "receive"} text = {item.Message} voice = {false}/>
                ))}
            </div>
            <div className="chatbox-insert">
                <div className="chatbox-insert-box">
                    <textarea className="chatbox-insert-box-input" id = "input-insert" placeholder="Type a Message here..." spellCheck ={false} onInput = {(e)=>setMessage(e.target.value)} onKeyUp = {SendChat}/>
                    <img className="chatbox-insert-box-voice" src="https://cdn-icons-png.flaticon.com/512/9499/9499020.png" alt="voice"/>
                </div>
            </div>
        </div>
        </>
     );
}

export default Chat;