import { useContext, useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Message from "../../../components/layout/message";
import { CardChat, DataChat } from "../../../Data/testChat";
import "./style.scss"
import "./response.scss"
import ChatCard from "../../../components/layout/chatCard";
import StatusCard from "../../../components/statusCard";
// import { Mic } from "../../../components/layout/Mic";
import { SocketIO } from "../../..";
function Chat() {
    const {transcript,resetTranscript} = useSpeechRecognition();
    const socketIO = useContext(SocketIO)
    const [active,setActive] = useState(false);
    const [contact,setContact] = useState(CardChat[0])
    const [showPopup,setShowPopup] = useState(true)
    const [chat,setChat] = useState({
        id_Room:"123",
        id_User:"ef5b87bd-eb8a-4f7c-a62f-d41fe5768c11",
        message:""
    })
    function ChatBox(item){
        setContact(item);
        setShowPopup(true);
        socketIO.emit("join_room","123")
    }
    function showMenu(){
        document.getElementById("home-menu").classList.toggle("showMenu");
    }
    function InputChat(e){
        setChat({
            ...chat,
            message:e.target.value
        })
    }
    async function SendChat(e){
        if(e.key === "Enter"){
            await socketIO.emit("send_message",chat)
        }
    }
    useEffect(()=>{
        socketIO.on("receive_message",(data)=>{
            console.log(data);
        })
    },[socketIO])
    return (
        <>
        <div className="menu-chat">
            <div className="menu-chat-header">
                <div className="menu-chat-header-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/9183/9183113.png" alt="btn-menu" onClick={showMenu}/>
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
                {CardChat.map((item)=>(
                    <ChatCard active={`${item.id === contact.id && "active"}`} status = {item.status} name =  {item.name} message = {item.message} time = {item.time} count = {item.count} image = {item.image} click = {()=>ChatBox(item)}/>
                ))}
            </div>
        </div> 
        <div className={`chatbox ${showPopup && 'activeChatBoxResponse'}`}>
            <header className="chatbox-header">
                <img className="chatbox-header-img" src={contact.image} alt="img-chatbox"/>
                <label className="chatbox-header-label">
                    <label className="chatbox-header-label-name">{contact.name}</label>
                    <label className="chatbox-header-label-status" style={{color:`${StatusCard(contact.status).color}`}}>{StatusCard(contact.status).text}</label>
                </label>
                <img className="chatbox-header-btn-back" src="https://cdn-icons-png.flaticon.com/512/3925/3925153.png"  alt="img-back" onClick={()=>setShowPopup(false)}/>
            </header>
            <div className="chatbox-chat">
                {DataChat.map((item,index)=>(
                    <Message key={index} type = {item.type} text = {item.value}>
                        <img className="message-img-ava" src="https://cdn-icons-png.flaticon.com/512/3058/3058838.png" alt = "ava"/>
                    </Message>
                ))}
            </div>
            <div className="chatbox-insert">
                <div className="chatbox-insert-box">
                    <textarea className="chatbox-insert-box-input" id = "input-insert" placeholder="Type a Message here..." spellCheck ={false} onInput = {InputChat} onKeyUp = {SendChat}/>
                    <img className="chatbox-insert-box-voice" src="https://cdn-icons-png.flaticon.com/512/9499/9499020.png" alt="voice"/>
                </div>
            </div>
            <div className={`chatbox-mic-on ${active === true && "show"}`} onClick = {(e)=>{
                SpeechRecognition.stopListening({continuous:true,language:"vi-VI"})
                if(e.target.id !== "btn-reset")
                setActive(false);
                }}>
                <img className="chatbox-mic-on-img" src="https://cdn-icons-png.flaticon.com/512/9470/9470620.png" alt="img-mic"/>
                <button id="btn-reset" onClick={resetTranscript}>Reset</button>
                <p>{transcript}</p>
            </div>
        </div>
        </>
     );
}

export default Chat;