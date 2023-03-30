import { useCallback, useContext, useEffect, useState } from "react";
import Message from "../../../components/layout/message";
import { UserDetails } from "..";
import "./style.scss"
import "./response.scss"
import ChatCard from "../../../components/layout/chatCard";
import StatusCard from "../../../components/statusCard";
import { SocketIO } from "../../..";
import { BaseUrl } from "../../../components/Api/baseUrl";
import { useToasts } from "react-toast-notifications";
import { FormatDate } from "../../../components/formatDate";
function Chat() {
    const socketIO = useContext(SocketIO)
    const [showPopup,setShowPopup] = useState(true)
    const userdt = useContext(UserDetails);
    const [index,setIndex] = useState(0)
    const [listFriend,setListFriend] = useState({
        active:0,
        list:[]
    });
    const { addToast } = useToasts();
    const [message,setMessage] = useState("")
    const [listMessage,setLisMessage] = useState([]);
    async function SendChat(e){
        if(e.key === "Enter"){
            await socketIO.emit("join_room",listFriend.active.id);
            await socketIO.emit("send_message",{
                id_User_Send:userdt.id,
                id_User_Receive:listFriend.active.id,
                Message:message
            })
            document.getElementById("input-insert").value = "";
            setMessage("");
            GetListMessage();
        }
    }
      const GetChatDetail= async () => {
        await BaseUrl.post("/user/getchat", {
          id_User_Owner:userdt.id,
        })
          .then(function (response) {
            setListFriend({
                active:response.data[index],
                list:response.data
            })
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
            })
            .catch(function (error) {
                addToast(error, {
                    appearance: "error",
                    autoDismiss: true,
                });
            })
    }
    const GetFullNew = () => {
        var count = 0;
        if(listMessage.length > 0){
            listMessage.filter((item)=>{
                if(item.Seen === false){count++}
            })
        }
        return count
    } 
    const GetMessageNew = (id) => {
        const ListMessageFilter = listMessage.filter((item)=>{
        if(item.id_User_Send === id || item.id_User_Receive === id){
            return item
        }
        })
        var couter = 0;
        ListMessageFilter.filter((item)=>{
            if(item.Seen === false){couter++}
        })
        if(ListMessageFilter.length > 0){
            var TimeMessage = new Date(ListMessageFilter[ListMessageFilter.length-1].createdAt);
            return {
                message:ListMessageFilter[ListMessageFilter.length-1].Message,
                date:FormatDate(TimeMessage.toLocaleDateString()),
                time:TimeMessage.toLocaleTimeString(),
                count:couter
            }
        }
        return{
            message:"",
            time:""
        }
    }
    useEffect(()=>{
        const element = document.getElementById("chatbox-chat");
        element.scrollTo(0, element.scrollHeight);
        console.log("aaaa");
    },[listMessage])
    useEffect(()=>{
        socketIO.on("receive_friend_status", () => {
            GetChatDetail();
         });
         socketIO.on("receive_message", () => {
            GetListMessage();
        });
    },[socketIO])
    useEffect(()=>{
        GetChatDetail();
        GetListMessage();
        GetMessageNew(listFriend.active.id);
        const element = document.getElementById("chatbox-chat");
        element.scrollTo(0, element.scrollHeight);
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
                    <p className="menu-chat-header-title-count-new">{GetFullNew()}</p>
                </div>
            </div> 
            <div className="menu-chat-card">
                {listFriend.list.map((item,index)=>(
                       <ChatCard active={`${item.id === listFriend.active.id && "active"}`} status = {item.status} name =  {item.firstName + " " + item.lastName} image = {item.avatar} message = {GetMessageNew(item.id).message} date = {GetMessageNew(item.id).date} time = {GetMessageNew(item.id).time} count = {GetMessageNew(item.id).count} click = {()=>{
                            setListFriend({
                                ...listFriend,
                                active:item
                            })
                            setIndex(index)
                            setShowPopup(true);
                            GetListMessage(item.id)
                       }}/>
                ))}
            </div>
        </div> 
        <div className={`chatbox ${showPopup && 'activeChatBoxResponse'}`}>
            <header className="chatbox-header">
                <img className="chatbox-header-img" src={listFriend.active.avatar} alt="img-chatbox"/>
                <label className="chatbox-header-label">
                    <label className="chatbox-header-label-name">{listFriend.active.firstName + " " + listFriend.active.lastName}</label>
                    <label className="chatbox-header-label-status" style={{color:`${StatusCard(listFriend.active.status).color}`}}>{StatusCard(listFriend.active.status).text}</label>
                </label>
                <img className="chatbox-header-btn-back" src="https://cdn-icons-png.flaticon.com/512/3925/3925153.png"  alt="img-back" onClick={()=>setShowPopup(false)}/>
            </header>
            <div className="chatbox-chat" id = "chatbox-chat">
                {listMessage.map((item,index)=>(
                    (item.id_User_Send === listFriend.active.id || item.id_User_Receive === listFriend.active.id) &&
                    <Message key={index} avatar = {listFriend.active.avatar} type = {item.id_User_Send === userdt.id ? "send" : "receive"} text = {item.Message} voice = {false}/>
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