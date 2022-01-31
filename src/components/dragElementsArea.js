function DragElementsArea(props) {
    return (
        <div className="DragElementsArea">
          {props.dragElements.map((element, index) =>{
            return (<img src={element.src} width={element.width} height={element.height} alt={index} key={index}></img>)
          })}
        </div>
    )
}

export default DragElementsArea