import { useContext, useEffect, useState } from "react";
import Message from "../../../components/layout/message";
import { Context } from "..";
import "./style.scss"
import "./response.scss"
import ChatCard from "../../../components/layout/chatCard";
import StatusCard from "../../../components/statusCard";
import { BaseUrl } from "../../../components/Api/baseUrl";
import { useToasts } from "react-toast-notifications";
import { FormatDate } from "../../../components/formatDate";
import {ListEmoji}  from "../../../Data/Emoji";
function Chat() {
    const ctx = useContext(Context)
    const [showPopup,setShowPopup] = useState(true)
    const [index,setIndex] = useState(0);
    const [showEmoji,setShowEmoji] = useState(false)
    const [listFriend,setListFriend] = useState({
        active:0,
        list:[]
    });
    const { addToast } = useToasts();
    const [message,setMessage] = useState("")
    const [posi,setPosi] = useState(0);
    const [listMessage,setLisMessage] = useState([]);
    const [ava,setAva] = useState("")
    const [seen,setSeen] = useState("");
    function Position(e){
        var val = e.target.value;
        var position = val.slice(0,e.target.selectionStart).length;
        setPosi(position);
    }
    function JoinText(emoji){
        const element = document.getElementById("input-insert-chat")
        const str = element.value;
        let result = str.slice(0,posi)  + emoji + str.slice(posi) ;
        setMessage(result);
        document.getElementById("input-insert-chat").value = result;
    }
    async function SendChat(e){
        if(e.key === "Enter"){
            await ctx.socket.emit("join_room",listFriend.active.id);
            await ctx.socket.emit("send_message",{
                id_User_Send:ctx.user.id,
                id_User_Receive:listFriend.active.id,
                Message:message
            })
            document.getElementById("input-insert-chat").value = "";
            setMessage("");
            GetListMessage();
            setShowEmoji(false)
        }
    }
      const GetChatDetail= async () => {
        await BaseUrl.post("/user/getchat", {
          id_User_Owner:ctx.user.id,
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
            id_User_Owner:ctx.user.id,
          })
            .then(function (response) {
                setLisMessage(response.data)
                if(response.data.length > 0){
                    GetSeen(response.data)
                }
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
                if(item.Seen === false && item.id_User_Send !== ctx.user.id){count++}
            })
        }
        return count
    } 
    const GetSeen = (list) => {
        const listMessageFriend = [];
        list.map((item)=>{
            if(item.id_User_Send === ctx.user.id && item.Seen === true){
                return listMessageFriend.push(item)
            }
        })
        for (var item of list){
            if(item.id_User_Send === ctx.user.id && item.Seen === true){
                BaseUrl.post("/user/getava",{
                    id_User_Seen:item.id_User_Receive
                }).then(function(res){
                    setAva(res.data)
                }).catch(function (error) {
                    throw new Error(error)
                })
                break;
            }
        }
        if(listMessageFriend.length > 0){
            setSeen(listMessageFriend[listMessageFriend.length - 1].id_Message)
        }
    }
    const GetMessageNew = (id) => {
        const ListMessageFilter = listMessage.filter((item)=>{
            if(item.id_User_Send === id){
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
    const UpdateSeen = async (id) => {
        await ctx.socket.emit("join_room",id);
        await ctx.socket.emit("send_seen_message",{
            id_User_Send:ctx.user.id,
            id_User_Receive:id
        })
    }
    useEffect(()=>{
        const element = document.getElementById("chatbox-chat");
        listFriend.list.length > 0 && element.scrollTo(0, element.scrollHeight);
    },[listMessage])
    useEffect(()=>{
        ctx.socket.on("receive_friend_status", () => {
            GetChatDetail();
         });
         ctx.socket.on("receive_message", () => {
            GetListMessage();
        });
        ctx.socket.on("receive_seen_message",()=>{
            GetListMessage();
        })
    },[ctx.socket])
    useEffect(()=>{
        GetChatDetail();
        GetListMessage();
        const element = document.getElementById("chatbox-chat");
        listFriend.list.length > 0 && element.scrollTo(0, element.scrollHeight);
    },[])
    return (
    listFriend.list.length > 0 ? <>
        <div className="menu-chat" onClick={()=>setShowEmoji(false)}>
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
                            UpdateSeen(item.id)
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
            <div className="chatbox-chat" id = "chatbox-chat" onClick={()=>setShowEmoji(false)}>
                {listMessage.map((item,index)=>(
                    (item.id_User_Send === listFriend.active.id || item.id_User_Receive === listFriend.active.id) &&
                    <Message key={index} avatar = {listFriend.active.avatar} type = {item.id_User_Send === ctx.user.id ? "send" : "receive"} text = {item.Message} voice = {false} seen = {item.id_Message === seen ? true : false} avaSeen={ava}/>
                ))}
            </div>
            <div className="chatbox-insert">
                <div className="chatbox-insert-box">
                    <textarea className="chatbox-insert-box-input" id = "input-insert-chat" placeholder="Type a Message here..." spellCheck ={false} onInput = {(e)=>{setMessage(e.target.value);Position(e)}} onKeyUp = {SendChat} onClick={(e)=>{
                        UpdateSeen(listFriend.active.id);
                        GetListMessage(listFriend.active.id)
                    }} onKeyDown={(e)=>{
                     if(e.which === 13) {
                            e.preventDefault();
                            return false;
                        }
                    }}/>
                    <div className="chatbox-insert-box-emoji">
                        {showEmoji && <div className="chatbox-insert-box-emoji-list">
                            {ListEmoji.map((item)=>(
                                <div className="chatbox-insert-box-emoji-list-item" onClick={()=>JoinText(item)}>
                                    {item}
                                </div>
                            ))}
                            </div>
                        }
                        <img className="chatbox-insert-box-emoji-img" src="https://cdn-icons-png.flaticon.com/512/10263/10263472.png" alt="emoji" onClick={()=>setShowEmoji(!showEmoji)}/>
                    </div>
                </div>
            </div>
        </div>
        </> : <div className="no-friend">No Friend</div>
     );
}

export default Chat;