import { useEffect, useRef, useState } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)
    // const previewCanvasRef = useRef(null)

    // const [previewCanvasSize, setPreviewCanvasSize] = useState([30, 15])
    // const [previewElement, setPreviewElement] = useState() //Preview element
    // const [newArea, setNewArea] = useState([0, 0, 0, 0])
    //const [selectedDropArea, setSelectedDropArea]  = useState(0)

    var startMouseX = 0
    var startMouseY = 0
    var stopMouseX = 0
    var stopMouseY = 0

    var isMouseDown = false

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
            //Draw bboxes
            props.bboxes.forEach(a => {
                ctx.strokeRect(a.startX, a.startY, a.destinationX, a.destinationY)
            })
        }
        img.src = props.bgImg
        console.log("imageviewer re-rendered")
    })

    function redrawWithMark(x, y, width, height) {
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
            ctx.setLineDash([6]);
            ctx.strokeRect(x, y, width, height)
        }
        img.src = props.bgImg
    }


    function getMousePos(event) {
        var rect = canvasRef.current.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }

    // function createSnippetPreview(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    //     setPreviewCanvasSize([dWidth, dHeight])
    //     let ctx = previewCanvasRef.current.getContext("2d")
    //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //     let imgSource = new Image()

    //     imgSource.onload = () => {
    //         ctx.drawImage(imgSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    //         let newDragEl = {
    //             src: previewCanvasRef.current.toDataURL(),
    //             width: dWidth,
    //             height: dHeight
    //         }
    //         setPreviewElement(newDragEl)
    //         setNewArea([sx, sy, sWidth, sHeight])
    //     }
    //     imgSource.src = props.bgImg
    // }

    // function performAction() {
    //     if(!previewElement) {
    //         return
    //     }
    //     //Do action depending on selected button
    //     if(props.pressedButton === "createDragElement") {
    //         let dragId = props.addDragElement(previewElement.src, previewElement.width, previewElement.height)
    //         let dropId = props.addDropArea(newArea[0], newArea[1], newArea[2], newArea[3])
    //         console.log("drag and drop ids: " + dragId + ", " + dropId)
    //         props.addAnswerPair(dragId, dropId)
    //     }
    //     else if(props.pressedButton === "removeArea") {
    //         props.addErasedArea(newArea[0], newArea[1], newArea[2], newArea[3])
    //     }
    //     else if(props.pressedButton === "createDropArea") {
    //         props.addDropArea(newArea[0], newArea[1], newArea[2], newArea[3])
    //     }
    //     else if(props.pressedButton === "createDistractor") {
    //         props.addDragElement(previewElement.src, previewElement.width, previewElement.height)
    //     }
    //     //Clear preview and new drag element state
    //     setPreviewElement(null)
    //     setPreviewCanvasSize([30, 15])
    //     let ctx = previewCanvasRef.current.getContext("2d")
    //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //     //Un-toggle button
    //     props.clearButtonHighlight()
    // }

      
    
    return (
        //<img src={props.bgImg} alt="Image" width="600" height="600"></img>
        <div className="imageViewer">
            <div className="bgCanvasArea">
                <div className="bgCanvasDiv">
                    <canvas ref={canvasRef} width="1200" height="1200" title="bgCanvas"
                    onMouseDown={(event) => {
                        if(props.pressedButton) {
                            isMouseDown = true
                            startMouseX = getMousePos(event).x
                            startMouseY = getMousePos(event).y
                        }
                    }}
                    onMouseUp={(event) => {
                        if(props.pressedButton) {
                            stopMouseX = getMousePos(event).x
                            stopMouseY = getMousePos(event).y
                            // createSnippetPreview(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                            props.setSnippetDimensionsState(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                            isMouseDown = false
                        }
                        //setSelectedDropArea(0)
                    }}
                    onMouseMove={(event) => {
                        if(isMouseDown) {
                            console.log("Mouse down on the move")
                            var ctx = canvasRef.current.getContext("2d")
                            redrawWithMark(startMouseX, startMouseY, getMousePos(event).x-startMouseX, getMousePos(event).y-startMouseY);
                        }
                    }}
                    >
                    </canvas>
                </div>
                <div className="dropAreaDivs">
                    {props.dropAreas.map((dropArea) => <div className="dropAreaDiv" key={dropArea.id}
                    style={{left: dropArea.startX, top: dropArea.startY, width: dropArea.destinationX, height: dropArea.destinationY, 
                    pointerEvents: props.pressedButton !== undefined ? "none" : "auto"}}
                    onClick={() => {
                        //setSelectedDropArea(dropArea.id)
                        props.setSelectedDropArea(dropArea.id)
                        }}>{"GAP"+dropArea.id}</div>)}
                </div>
            </div>



            {/* <div className="RightArea">
                <div className="PreviewSnippetArea">
                    <h4>Preview snippet</h4>
                    <canvas ref={previewCanvasRef} id="demo" width={previewCanvasSize[0]} height={previewCanvasSize[1]}
                    style={{width: previewCanvasSize[0], height: previewCanvasSize[1]}}></canvas>
                    <button className="sidebtn" style={{visibility: props.pressedButton ? "visible" : "hidden"}} onClick={() => {performAction()}}
                    >{props.pressedButton}</button>
                </div>
                <div className="SetAnswerArea">
                    <h4>Set drop area answer</h4>
                    <select name="Drag element" disabled={selectedDropArea === 0} onChange={(e) => {
                        //Handle existing answer pair
                        if(props.answerPairs.find(pair => pair.dropId === selectedDropArea)) {
                            props.setAnswerPair(parseInt(e.target.value), selectedDropArea) //TODO: handle empty? for setting the GAP to have no answer?
                        }
                        else { //Handle when drop area does not already have an answer pair
                            props.addAnswerPair(parseInt(e.target.value), selectedDropArea)
                        }
                        }}>
                        {!Boolean(props.answerPairs.find(pair => pair.dropId === selectedDropArea)) ? <option>empty</option> : null} 
                        {props.dragElements.map((dragElement) => <option key={dragElement.id} value={dragElement.id}
                        selected={Boolean(props.answerPairs.find(pair => pair.dragId === dragElement.id && pair.dropId === selectedDropArea))}
                        >{"A"+dragElement.id}</option>)}
                    </select>
                    <button onClick={() => {console.log(props.pressedButton)}}>debug</button>
                </div>
                <div className="SetMarkingSizeArea">
                    <h4>Set marking size</h4>
                </div>
            </div> */}
        </div>
    )
}

export default ImageViewer