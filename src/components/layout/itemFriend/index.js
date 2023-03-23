import "./style.scss";
function ItemFriend({ img, name, age, gender, email,key,children }) {
  return (
    <div key={`item-friend-${key}`} className="item-friend">
      <img key={`item-friend-img-${key}`}  src={img} alt="avatar" />
      <div key={`item-friend-detail-${key}`}  className="item-friend-detail">
        <nav key={`item-friend-name-${key}`} >Name : {name}</nav>
        <nav key={`item-friend-age-${key}`} >Age : {age}</nav>
        <nav key={`item-friend-gender-${key}`} >Gender : {gender}</nav>
        <nav key={`item-friend-email-${key}`} >Email : {email}</nav>
        {children}
      </div>
    </div>
  );
}

export default ItemFriend;
