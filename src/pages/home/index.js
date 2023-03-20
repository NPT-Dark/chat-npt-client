import { useState } from "react";
import "./style.scss";
import "./response.scss"
import { itemMenu } from "../../Data/MenuHome";
import { useNavigate } from "react-router-dom";
function Home() {
 document.title = "Chat NPT - Home";
  const goto = useNavigate();
  const [active, setActive] = useState(itemMenu[0]);
  function ActiveItem(item) {
    goto(`/home${item.link}`);
    setActive(item);
  }
  function closeMenu(){
      document.getElementById("home-menu").classList.toggle("showMenu");
  }
  return (
    <main className="home">
      <div className="home-menu" id = "home-menu">
        <nav className="home-menu-item close">
          <img src="https://cdn-icons-png.flaticon.com/512/5369/5369422.png" alt="img-close" onClick={closeMenu}/>
        </nav>
        {itemMenu.map((item, index) => (
          <>
            <nav
              key={"item" + index}
              className={`home-menu-item ${
                item.id === active.id && "active-item"
              }`}
              onClick={() => {
                ActiveItem(item);
                closeMenu();
              }}
            >
              <img key={"img" + index} src={item.url} alt="img-item" />
              <div
                key={"title" + index}
                className={`home-menu-item-title ${
                  item.id === active.id && "active-title"
                }`}
              >
                <label key={"name" + index}>{item.name}</label>
              </div>
            </nav>
          </>
        ))}
      </div>
      <div className="home-page">{active.page}</div>
    </main>
  );
}

export default Home;
