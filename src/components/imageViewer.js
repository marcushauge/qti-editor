import { useEffect, useRef, useState } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)
    const previewCanvasRef = useRef(null)
    const [previewCanvasSize, setPreviewCanvasSize] = useState([30, 15])
    const [newDragElement, setNewDragElement] = useState() //Preview element
    const [newDropArea, setNewDropArea] = useState([0, 0, 0, 0])

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
            //Then clear the drop areas
            props.dropAreas.forEach(d => {
                ctx.clearRect(d.startX, d.startY, d.destinationX, d.destinationY)
            });
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
          setNewDropArea([sx, sy, sWidth, sHeight])
        }
        imgSource.src = props.bgImg
      }
    
    return (
        //<img src={props.bgImg} alt="Image" width="600" height="600"></img>
        <div className="imageViewer">
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
                        createSnippetPreview(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                    }
                }}>
                </canvas>
            </div>
            <div className="PreviewSnippetArea">
                <h4>Preview snippet</h4>
                <canvas ref={previewCanvasRef} id="demo" width={previewCanvasSize[0]} height={previewCanvasSize[1]} style={{width: previewCanvasSize[0], height: previewCanvasSize[1]}}></canvas>
                <button className="sidebtn" style={{visibility: props.createDragElementPressed? "visible" : "hidden"}} onClick={() => {
                    if(!newDragElement) {
                        return
                    }
                    //Add it
                    props.addDragElement(newDragElement.src, newDragElement.width, newDragElement.height)
                    //Add the new drop area
                    props.addDropArea(newDropArea[0], newDropArea[1], newDropArea[2], newDropArea[3])
                    //Clear preview and new drag element state
                    setNewDragElement(null)
                    setPreviewCanvasSize([30, 15])
                    let ctx = previewCanvasRef.current.getContext("2d")
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    //Un-toggle create drag element button
                    props.switchCreateDragElement()
                }}>Create</button>
            </div>
        </div>
    )
}

export default ImageViewer