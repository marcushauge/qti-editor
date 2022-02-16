
function CreateDistractor(props) {
    return (
        <button className="sidebtn" onClick={() => {props.click()}} 
        style={{filter: props.clicked ? "brightness(80%)" : "brightness(100%)"}}
        >Create distractor</button>
    )
}

export default CreateDistractor