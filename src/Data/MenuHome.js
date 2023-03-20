import Chat from "../pages/home/chat";
import Infor from "../pages/home/infor";
import Robot from "../pages/home/robot";

export const itemMenu = [
    {
      id: 1,
      name: "information",
      url: "https://cdn-icons-png.flaticon.com/512/545/545775.png",
      link:"/infor",
      page:<Infor/>
    },
    {
      id: 2,
      name: "Robot",
      url: "https://cdn-icons-png.flaticon.com/512/1767/1767246.png",
      link:"/robot",
      page:<Robot/>
    },
    {
        id:3,
        name:"Chat",
        url:"https://cdn-icons-png.flaticon.com/512/7676/7676710.png",
        link:"/chat",
        page:<Chat/>
    }
  ]