import { useEffect, useRef, useState } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)

    const [fixedMark, setFixedMark] = useState(null)

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
            //Draw fixed mark if clicked
            if(fixedMark !== null && props.markSize[2]) {
                ctx.setLineDash([6]);
                ctx.strokeRect(fixedMark[0], fixedMark[1], props.markSize[0], props.markSize[1])
            }
        }
        img.src = props.bgImg
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
    
    return (
        //<img src={props.bgImg} alt="Image" width="600" height="600"></img>
        <div className="imageViewer">
            <div className="bgCanvasArea">
                <div className="bgCanvasDiv">
                    <canvas ref={canvasRef} width="1200" height="1200" title="bgCanvas"
                    onMouseDown={(event) => {
                        if(props.pressedButton && !props.markSize[2]) {
                            isMouseDown = true
                            startMouseX = getMousePos(event).x
                            startMouseY = getMousePos(event).y
                        }
                        else if(props.pressedButton && props.markSize[2]) {
                            startMouseX = getMousePos(event).x
                            startMouseY = getMousePos(event).y
                            stopMouseX = startMouseX+props.markSize[0]
                            stopMouseY = startMouseY+props.markSize[1]
                            console.log("Setting snippetDimensionState in imageviewer: ")
                            console.log("props mark sizes: ", props.markSize)
                            console.log(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                            console.log(stopMouseX, stopMouseY)
                            setFixedMark([startMouseX, startMouseY])
                            props.setSnippetDimensionsState(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                        }
                    }}
                    onMouseUp={(event) => {
                        if(props.pressedButton && !props.markSize[2]) {
                            stopMouseX = getMousePos(event).x
                            stopMouseY = getMousePos(event).y
                            // createSnippetPreview(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                            props.setSnippetDimensionsState(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                            isMouseDown = false
                        }
                        //setSelectedDropArea(0)
                    }}
                    onMouseMove={(event) => {
                        if(isMouseDown && !props.markSize[2]) {
                            console.log("Mouse down on the move")
                            redrawWithMark(startMouseX, startMouseY, getMousePos(event).x-startMouseX, getMousePos(event).y-startMouseY);
                        }
                    }}
                    >
                    </canvas>
                    <div className="dropAreaDivs">
                        {props.dropAreas.map((dropArea) => <div className="dropAreaDiv" key={dropArea.id}
                            style={{
                                left: dropArea.startX, top: dropArea.startY, width: dropArea.destinationX, height: dropArea.destinationY,
                                pointerEvents: props.pressedButton !== undefined ? "none" : "auto"
                            }}
                            onClick={() => {
                                //setSelectedDropArea(dropArea.id)
                                props.setSelectedDropArea(dropArea.id)
                            }}>{dropArea.id}</div>)}
                    </div>
                    <div className="OCRAreaDivs">
                            {props.ocrWords.map((word) => <div
                            style={{
                                left: word.x, top: word.y, width: word.width, height: word.height,
                                pointerEvents: props.pressedButton !== undefined ? "none" : "auto",
                                cursor: "pointer", position: "absolute"
                            }}
                            onClick={() => {
                                console.log("Clicked on " + word.x + " " + word.y)
                                let dragId = props.addDragElement(word.src, word.width, word.height)
                                let dropId = props.addDropArea(word.x, word.y, word.width, word.height)
                                props.addAnswerPair(dragId, dropId)
                            }}></div>)}
                    </div>
                </div>
                
            </div>

        </div>
    )
}

export default ImageViewer