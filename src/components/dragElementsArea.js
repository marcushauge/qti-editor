function DragElementsArea(props) {
    return (
        <div className="DragElementsArea">
          {props.dragElements.map((element, index) =>{
            return (
              <div key={element.id}>{"A"+element.id}
                <img src={element.src} width={element.width} height={element.height} style={{borderStyle: "dashed", borderWidth: "1px", cursor: "pointer"}} onClick={() => {
                  props.setSelectedDragElement(element.id)
                }} alt="Err"></img>
              </div>
            )
          })}
        </div>
    )
}

export default DragElementsArea