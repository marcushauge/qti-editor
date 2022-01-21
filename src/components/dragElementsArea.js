function DragElementsArea(props) {
    return (
        <div className="DragElementsArea">
          <button>Element1</button>
          <button>Element2</button>
          {props.dragElements.map((element, index) =>{
            return (<img src={element.src} width={element.width} height={element.height} alt={index} key={index}></img>)
          })}
        </div>
    )
}

export default DragElementsArea