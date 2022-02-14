function DragElementsArea(props) {
    return (
        <div className="DragElementsArea">
          {props.dragElements.map((element, index) =>{
            return (
              <div key={element.id}>{"A"+element.id}
                <img src={element.src} width={element.width} height={element.height}></img>
              </div>
            )
          })}
        </div>
    )
}

export default DragElementsArea