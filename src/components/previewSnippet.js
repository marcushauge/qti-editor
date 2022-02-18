import { useEffect, useRef, useState } from "react"

function PreviewSnippet(props) {
    const previewCanvasRef = useRef(null)

    const [previewCanvasSize, setPreviewCanvasSize] = useState([30, 15])
    const [previewElement, setPreviewElement] = useState() //Preview element
    const [newArea, setNewArea] = useState([0, 0, 0, 0])


    useEffect(() => {
        console.log("UseEffect called")
        console.log("prevcansize: ", previewCanvasSize)
        if(!props.snippetDimensions.every(num => num === 0)) {
            createSnippetPreview(props.snippetDimensions[0], props.snippetDimensions[1], props.snippetDimensions[2], props.snippetDimensions[3], props.snippetDimensions[4], props.snippetDimensions[5], props.snippetDimensions[6], props.snippetDimensions[7])
        }
    }, [props.snippetDimensions])

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
            setPreviewElement(newDragEl)
            setNewArea([sx, sy, sWidth, sHeight])
        }
        imgSource.src = props.bgImg

    }

    function performAction() {
        if(!previewElement) {
            return
        }
        //Do action depending on selected button
        if(props.pressedButton === "createDragElement") {
            let dragId = props.addDragElement(previewElement.src, previewElement.width, previewElement.height)
            let dropId = props.addDropArea(newArea[0], newArea[1], newArea[2], newArea[3])
            console.log("drag and drop ids: " + dragId + ", " + dropId)
            props.addAnswerPair(dragId, dropId)
        }
        else if(props.pressedButton === "removeArea") {
            props.addErasedArea(newArea[0], newArea[1], newArea[2], newArea[3])
        }
        else if(props.pressedButton === "createDropArea") {
            props.addDropArea(newArea[0], newArea[1], newArea[2], newArea[3])
        }
        else if(props.pressedButton === "createDistractor") {
            props.addDragElement(previewElement.src, previewElement.width, previewElement.height)
        }
        //Clear preview and new drag element state
        setPreviewElement(null)
        setPreviewCanvasSize([30, 15])
        let ctx = previewCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        //Un-toggle button
        props.clearButtonHighlight()
    }

    return(
        <div>
            <div className="PreviewSnippetArea">
                <h4>Preview snippet</h4>
                <canvas ref={previewCanvasRef} id="demo" width={previewCanvasSize[0]} height={previewCanvasSize[1]}
                    style={{ width: previewCanvasSize[0], height: previewCanvasSize[1] }}></canvas>
                <button className="sidebtn" style={{ visibility: props.pressedButton ? "visible" : "hidden" }} onClick={() => { performAction() }}
                >{props.pressedButton}</button>
            </div>
        </div>
    )

}

export default PreviewSnippet