import StatusCard from "../../statusCard";
import "./style.scss"
import "./response.scss"
function ChatCard({image,active,status,name,message,time,count,click}) {
    return ( 
        <div className={`chat-card ${active}`} onClick = {()=>typeof click === "function" && click()}>
            <img className="chat-card-img" src={image} alt = "card-img"/>
            <div className="chat-card-info">
                <p className={`chat-card-info-name ${status}`}>
                    {name}
                    <p style={{background:`${StatusCard(status).color}`}}/>
                </p>
                <p className="chat-card-info-message">{message}</p>
            </div>
            <div className="chat-card-status">
                <p className="chat-card-status-time">{time}</p>
                {count > 0 && <p className="chat-card-status-count">{count}</p>}
            </div>
        </div>
     );
}

export default ChatCard;