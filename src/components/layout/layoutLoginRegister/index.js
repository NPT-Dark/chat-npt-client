import "./style.scss"
import "./response.scss"
function LayoutLoginRegister({children}) {
    const iconRight = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const iconBottom = [1, 2, 3];
    return ( 
        <main className="login-register">
        <div className="login-register-icon-left"/>
        <div className="login-register-icon-right">
            {iconRight.map((item)=><div key={item} className="login-register-icon-right-round-stripe"/>)}
        </div>
        <div className="login-register-icon-bottom">
            {iconBottom.map((item)=><div key={item} className="login-register-icon-bottom-triangle"/>)}
        </div>
        {children}
    </main>
     );
}

export default LayoutLoginRegister;