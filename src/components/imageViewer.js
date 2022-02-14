import { useEffect, useRef, useState } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)
    const previewCanvasRef = useRef(null)

    const [previewCanvasSize, setPreviewCanvasSize] = useState([30, 15])
    const [newDragElement, setNewDragElement] = useState() //Preview element
    const [newArea, setNewArea] = useState([0, 0, 0, 0])
    const [selectedDropArea, setSelectedDropArea]  = useState(0)

    var startMouseX = 0
    var startMouseY = 0
    var stopMouseX = 0
    var stopMouseY = 0

    useEffect(() => {
        //Draw background image
        var ctx = canvasRef.current.getContext("2d")
        var img = new Image();
        img.onload = function() {
            ctx.setTransform(1, 0, 0, 1, 0, 0); //reset scale
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            //var s = Math.min(ctx.canvas.width/img.width, ctx.canvas.height/img.height); //Scale to fit canvas size
            //ctx.scale(s, s);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            //Clear the drop areas
            props.dropAreas.forEach(d => {
                ctx.clearRect(d.startX, d.startY, d.destinationX, d.destinationY)
            });
            //Clear erased areas
            props.erasedAreas.forEach(a => {
                ctx.clearRect(a.startX, a.startY, a.destinationX, a.destinationY)
            })
        }
        img.src = props.bgImg
    })


    function getMousePos(event) {
        var rect = canvasRef.current.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }

      function createSnippetPreview(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        setPreviewCanvasSize([dWidth, dHeight])
        let ctx = previewCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        let imgSource = new Image()
        
        imgSource.onload = () => {
          ctx.drawImage(imgSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          let newDragEl = {
            src: previewCanvasRef.current.toDataURL(),
            width: dWidth,
            height: dHeight
          }
          setNewDragElement(newDragEl)
          setNewArea([sx, sy, sWidth, sHeight])
        }
        imgSource.src = props.bgImg
      }
    
    return (
        //<img src={props.bgImg} alt="Image" width="600" height="600"></img>
        <div className="imageViewer">
            <div className="bgCanvasArea">
                <div className="bgCanvasDiv">
                    <canvas ref={canvasRef} width="1200" height="1200" 
                    onMouseDown={(event) => {
                        if(props.createDragElementPressed || props.removeAreaPressed) {
                            startMouseX = getMousePos(event).x
                            startMouseY = getMousePos(event).y
                        }
                    }}
                    onMouseUp={(event) => {
                        if(props.createDragElementPressed || props.removeAreaPressed) {
                            stopMouseX = getMousePos(event).x
                            stopMouseY = getMousePos(event).y
                            createSnippetPreview(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                        }
                        setSelectedDropArea(0)
                    }}
                    >
                    </canvas>
                </div>
                <div className="dropAreaDivs">
                    {props.dropAreas.map((dropArea) => <div className="dropAreaDiv" key={dropArea.id}
                    style={{left: dropArea.startX, top: dropArea.startY, width: dropArea.destinationX, height: dropArea.destinationY, 
                    pointerEvents: props.pressedButton != undefined ? "none" : "auto"}}
                    onClick={() => {setSelectedDropArea(dropArea.id)}}>{"GAP"+dropArea.id}</div>)}
                </div>
            </div>
            <div className="RightArea">
                <div className="PreviewSnippetArea">
                    <h4>Preview snippet</h4>
                    <canvas ref={previewCanvasRef} id="demo" width={previewCanvasSize[0]} height={previewCanvasSize[1]}
                    style={{width: previewCanvasSize[0], height: previewCanvasSize[1]}}></canvas>
                    <button className="sidebtn" style={{visibility: props.createDragElementPressed || props.removeAreaPressed ? "visible" : "hidden"}} onClick={() => {
                        if(!newDragElement) {
                            return
                        }

                        if(props.createDragElementPressed) {
                            //Create drag element and drop area
                            let dragId = props.addDragElement(newDragElement.src, newDragElement.width, newDragElement.height)
                            let dropId = props.addDropArea(newArea[0], newArea[1], newArea[2], newArea[3])
                            console.log("drag and drop ids: " + dragId + ", " + dropId)
                            props.addAnswerPair(dragId, dropId)
                        }
                        else if(props.removeAreaPressed) {
                            props.addErasedArea(newArea[0], newArea[1], newArea[2], newArea[3])
                        }

                        //Clear preview and new drag element state
                        setNewDragElement(null)
                        setPreviewCanvasSize([30, 15])
                        let ctx = previewCanvasRef.current.getContext("2d")
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                        //Un-toggle button
                        props.clearButtonHighlight()

                    }}>{props.pressedButton}</button>
                </div>
                <h4>Set drop area answer</h4>
                <select name="Drag element" disabled={selectedDropArea === 0} onChange={(e) => {
                    //Change answer pair
                    
                    }}>
                    {props.dragElements.map((dragElement) => <option key={dragElement.id} value={dragElement.id}>{"A"+dragElement.id}</option>)}
                </select>
                <button onClick={() => {console.log(props.pressedButton)}}>debug</button>
            </div>
        </div>
    )
}

export default ImageViewer