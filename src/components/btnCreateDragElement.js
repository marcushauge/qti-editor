
function CreateDragElement(props) {
    return (
        <button className="sidebtn" onClick={() => {
            
            props.click()
            
            

            //On mouse release
            //props.drawProp()
        }} style={{filter: props.clicked ? "brightness(80%)" : "brightness(100%)"}}>Create drag element</button>
    )
}

export default CreateDragElement