
function RemoveArea(props) {
    return (
        <button className="sidebtn" onClick={() => {
            props.click()        
        }}
        style={{filter: props.clicked ? "brightness(80%)" : "brightness(100%)"}}>Remove area</button>
    )
}

export default RemoveArea