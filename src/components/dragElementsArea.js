function DragElementsArea(props) {
    return (
        <div className="DragElementsArea">
          {props.dragElements.map((element, index) =>{
            return (
              <div key={element.id} style={{cursor: "pointer"}} onClick={() => {
                props.setSelectedDragElement(element.id)
              }}>{"A"+element.id} 
                <img src={element.src} width={element.width} height={element.height} style={{borderStyle: "dashed", borderWidth: "1px"}} alt="Err"></img>
              </div>
            )
          })}
        </div>
    )
}

export default DragElementsArea