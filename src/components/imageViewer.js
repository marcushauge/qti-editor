import { useEffect, useRef } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)

    var startMouseX = 0
    var startMouseY = 0
    var stopMouseX = 0
    var stopMouseY = 0

    //Draw background image
    useEffect(() => {
        var ctx = canvasRef.current.getContext("2d")
        var img = new Image();
        img.onload = function() {
            ctx.setTransform(1, 0, 0, 1, 0, 0); //reset scale
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            //var s = Math.min(ctx.canvas.width/img.width, ctx.canvas.height/img.height); //Scale to fit canvas size
            //ctx.scale(s, s);
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        img.src = props.bgImg
    })

    function crop() {
        //Take square from image
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
        <div className="bgCanvasDiv">
            <canvas ref={canvasRef} width="1200" height="1200" 
            onMouseDown={(event) => {
                if(props.createDragElementPressed) {
                    startMouseX = getMousePos(event).x
                    startMouseY = getMousePos(event).y
                    console.log(startMouseX + " and " + startMouseY)
                }
            }}
            onMouseUp={(event) => {
                if(props.createDragElementPressed) {
                    stopMouseX = getMousePos(event).x
                    stopMouseY = getMousePos(event).y
                    console.log(stopMouseX + " and " + stopMouseY)

                    //slice it to crop?
                    props.slice(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                }
            }}>
            </canvas>
        </div>
    )
}

export default ImageViewer