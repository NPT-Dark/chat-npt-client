import "./style.scss";
function Modal({ title, content, clickSure, clickCancel }) {
  return (
    <div className="box-gray-modal" onClick={clickCancel}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        <main>{content}</main>
        <div className="modal-btn">
          <button className="modal-btn-sure" onClick={clickSure}>
            Sure
          </button>
          <button className="modal-btn-cancel" onClick={clickCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
