import "./style.scss";
import "./response.scss";
import { useSpeechSynthesis } from "react-speech-kit";
function Message({ avatar, type, text, voice,seen,avaSeen }) {
  const { speak, voices } = useSpeechSynthesis();

  return (
    <div className={`message message-${type}`}>
      <div className={`message-content`}>
        <div className={`message-box message-box-${type}`}>
          {type === "receive" && (
            <img
              className="message-box-img-ava"
              src={`${
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/3058/3058838.png"
              } `}
              alt="ava"
            />
          )}
          <div className={`message-box-text message-box-text-${type}`}>
            {text}
            {voice === true && (
              <img
                className="message-box-text-img-sound"
                src="https://cdn-icons-png.flaticon.com/512/3155/3155343.png"
                alt="sound"
                onClick={() => speak({ text: text, voice: voices[3] })}
              />
            )}
          </div>
        </div>
        {(type === "send" && seen === true) && (
          <img
            className="message-content-seen"
            src={avaSeen}
            alt="seen"
          />
        )}
      </div>
    </div>
  );
}
export default Message;
