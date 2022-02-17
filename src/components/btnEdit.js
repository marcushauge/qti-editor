function EditButton(props) {
    return (
        <button className="sidebtn" onClick={() => {props.click()}}
        style={{filter: props.clicked ? "brightness(80%)" : "brightness(100%)"}}>{props.name}</button>
    )
}
export default EditButton