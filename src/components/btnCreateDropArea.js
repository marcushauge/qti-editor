
function CreateDropArea(props) {
    return (
        <button className="sidebtn"onClick={() => {
            props.click()        
        }}
        style={{filter: props.clicked ? "brightness(80%)" : "brightness(100%)"}}>Create drop area</button>
    )
}

export default CreateDropArea