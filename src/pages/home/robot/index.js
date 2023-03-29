import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import { ResponseGPT } from "../../../components/apiChatGpt";
import Message from "../../../components/layout/message";
import { DataChat } from "../../../Data/testChat";
import "./style.scss"
import "./response.scss"

function Robot() {
    const {transcript,resetTranscript} = useSpeechRecognition();
    const [active,setActive] = useState(false);
    const [posi,setPosi] = useState(0);
    const [Chat,setChat] = useState("");
    function JoinText(){
        const element = document.getElementById("input-insert")
        const str = element.value;
        let result = str.slice(0,posi)  + transcript + str.slice(posi) ;
        setChat(result);
    }
    function textChange(e){
        var val = e.target.value;
        var position = val.slice(0,e.target.selectionStart).length;
        setChat(e.target.value);
        setPosi(position);
    }
    function Position(e){
        var val = e.target.value;
        var position = val.slice(0,e.target.selectionStart).length;
        setPosi(position);
    }
    function EnterChat(e){
        if(e.key==="Enter")
        {
            // ResponseGPT();
            console.log(e.target.value);
        }
    }
    function showMenu(){
        document.getElementById("home-menu").classList.toggle("showMenu");
    }
    return ( 
        <div className="robot">
            <header className="robot-header">
                <div className="robot-header-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/9183/9183113.png" alt="btn-menu" onClick={showMenu}/>
                </div>
                <img className="robot-header-img" src="https://cdn-icons-png.flaticon.com/512/3058/3058838.png" alt="img-robot"/>
                <label className="robot-header-label">Always active !</label>
            </header>
            <div className="robot-chat">
                {DataChat.map((item,index)=>(
                    <Message key={index} type = {item.type} text = {item.value} voice = {true}>
                        <img className="message-img-ava" src="https://cdn-icons-png.flaticon.com/512/3058/3058838.png" alt = "ava"/>
                    </Message>
                ))}
            </div>
            <div className="robot-insert">
                <div className="robot-insert-box">
                    <textarea className="robot-insert-box-input" id = "input-insert" placeholder="Type a Message here..." spellCheck = {false}
                     value={Chat}
                     onInput = {textChange}
                     onKeyUp = {(e)=>EnterChat(e)}
                     onClick = {(e)=>Position(e)}
                     />
                    <img className="robot-insert-box-voice" src="https://cdn-icons-png.flaticon.com/512/9499/9499020.png" alt="voice" onMouseUp={()=>SpeechRecognition.startListening({continuous:true,language:"vi-VI"})} onClick = {()=>{        resetTranscript();setActive(true)}}/>
                </div>
            </div>
            <div className={`robot-mic-on ${active === true && "show"}`} onClick = {(e)=>{
                SpeechRecognition.stopListening({continuous:true,language:"vi-VI"})
                if(e.target.id !== "btn-reset")
                {
                    JoinText();
                    setActive(false);
                }
                }}>
                <img className="robot-mic-on-img" src="https://cdn-icons-png.flaticon.com/512/9470/9470620.png" alt="img-mic"/>
                <button id="btn-reset" onClick={resetTranscript}>Reset</button>
                <p>{transcript}</p>
            </div>
        </div>
     );
}

export default Robot;