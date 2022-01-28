import { useEffect, useRef, useState } from "react"

function ImageViewer(props) {
    const canvasRef = useRef(null)
    const fakeCanvasRef = useRef(null)
    const previewCanvasRef = useRef(null)
    const [fakeCanvasSize, setFakeCanvasSize] = useState([30, 15])
    const [previewCanvasSize, setPreviewCanvasSize] = useState([30, 15])
    const [newDragElement, setNewDragElement] = useState()

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


    function getMousePos(event) {
        var rect = canvasRef.current.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }

    function createDragElementFromSnippet(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        setFakeCanvasSize([dWidth, dHeight])
        let ctx = fakeCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        let imgSource = new Image()

        imgSource.onload = () => {
          ctx.drawImage(imgSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          props.addDragElement(fakeCanvasRef.current.toDataURL(), dWidth, dHeight)
        }

        imgSource.src = props.bgImg
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

                        //slice it to crop?
                        // props.slice(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                        // createDragElementFromSnippet(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                        createSnippetPreview(startMouseX, startMouseY, stopMouseX-startMouseX, stopMouseY-startMouseY, 0, 0, stopMouseX-startMouseX, stopMouseY-startMouseY)
                    }
                }}>
                </canvas>
                <canvas ref={fakeCanvasRef} style={{visibility: "hidden"}} width={fakeCanvasSize[0]} height={fakeCanvasSize[1]}></canvas>
            </div>
            <div className="PreviewSnippetArea">
                <h3>Preview snippet</h3>
                <canvas ref={previewCanvasRef} id="demo" width={previewCanvasSize[0]} height={previewCanvasSize[1]} style={{width: previewCanvasSize[0], height: previewCanvasSize[1]}}></canvas>
                <button style={{visibility: props.createDragElementPressed? "visible" : "hidden"}} onClick={() => {
                    if(!newDragElement) {
                        return
                    }
                    props.addDragElement(newDragElement.src, newDragElement.width, newDragElement.height)
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