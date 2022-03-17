import { useEffect, useRef, useState } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)

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
                    <div className="dropAreaDivs">
                        {props.dropAreas.map((dropArea) => <div className="dropAreaDiv" key={dropArea.id}
                        style={{left: dropArea.startX, top: dropArea.startY, width: dropArea.destinationX, height: dropArea.destinationY, 
                        pointerEvents: props.pressedButton !== undefined ? "none" : "auto"}}
                        onClick={() => {
                            //setSelectedDropArea(dropArea.id)
                            props.setSelectedDropArea(dropArea.id)
                            }}>{dropArea.id}</div>)}
                    </div>
                </div>
                
            </div>

        </div>
    )
}

export default ImageViewer