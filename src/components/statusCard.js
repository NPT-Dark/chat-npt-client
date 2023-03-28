function StatusCard(status) {
    var item = {
        color:"#7F8487",
        text:"offline"
    }
    switch (status) {
        case 0:
            item = {
                color:"#7F8487",
                text:"offline"
            }
            break;
        case 1:
            item = {
                color:"#7DCE13",
                text:"online"
            }
            break;
        default:
            break;
    }
    return ( item );
}

export default StatusCard;