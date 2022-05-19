import { useState, useEffect, useRef } from 'react'
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

function OCRSentencesInRectangles(props) {
    
    async function generateText() {
        props.showLoader()
        //Need to create a copy of the image from the props.bgImg URL as tesseract appears to delete or change it.
        let file = await fetch(props.bgImg).then(r => r.blob()).then(blobFile => new File([blobFile], "diagramFile", { type: "image/png" }))

        //Find rectangle(classes) positions
        var formData = new FormData();
        formData.append("diagramFile", file)
        const response = await fetch("http://127.0.0.1:5000/rectangles", {
        method: 'POST', 
        // mode: 'cors',
        // cache: 'no-cache',
        // credentials: 'same-origin',
        // headers: {
        //     "Content-Type": "multipart/form-data"
        //     //'Content-Type': 'application/json'
        //     //'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body: formData // body data type must match "Content-Type" header
        })
        const content = await response.json() //Array of {x, y, w, h} objects
        console.log("response: ", content)
        let imgSource = new Image() //Source image for canvas to draw from
        imgSource.onload = () => {
            //Starting IDs
            const newestDropId = (props.dropAreas[props.dropAreas.length-1] === undefined) ? 0 : props.dropAreas[props.dropAreas.length-1].id
            let dropIdCounter = newestDropId
            const newestDragId = (props.dragElements[props.dragElements.length-1] === undefined) ? 0 : props.dragElements[props.dragElements.length-1].id
            let dragIdCounter = newestDragId
            
            for(let i = 0; i < content.length; i++) {
                //Create a canvas and draw a retangle/class on it, then pass the canvas element to Tesseract
                let rectangleCanvas = document.createElement("canvas")
                rectangleCanvas.width = content[i].width
                rectangleCanvas.height = content[i].height
                let rectangleCtx = rectangleCanvas.getContext("2d")
                rectangleCtx.clearRect(0, 0, rectangleCtx.canvas.width, rectangleCtx.canvas.height)
                rectangleCtx.drawImage(imgSource, content[i].x, content[i].y, content[i].width, content[i].height, 0, 0, content[i].width, content[i].height)

                Tesseract.recognize(
                    rectangleCanvas,
                    'eng',
                    { logger: m => console.log(m) }
                  ).then(({ data }) => {
                    console.log(data);

                    //Create drag and drop for each line, as one line = one attribute/function
                    for(let j = 0; j < data.lines.length; j++) {
                        dropIdCounter++
                        dragIdCounter++

                        let width = data.lines[j].bbox.x1-data.lines[j].bbox.x0
                        let height = data.lines[j].bbox.y1-data.lines[j].bbox.y0

                        //Draw line on new canvas
                        let lineCanvas = document.createElement("canvas")
                        lineCanvas.width = width
                        lineCanvas.height = height
                        let lineCtx = lineCanvas.getContext("2d")
                        lineCtx.clearRect(0, 0, lineCtx.canvas.width, lineCtx.canvas.height)
                        lineCtx.drawImage(rectangleCanvas, data.lines[j].bbox.x0, data.lines[j].bbox.y0, width, height, 0, 0, width, height)
                        let dragId = props.addDragElement(lineCanvas.toDataURL(), width, height, dragIdCounter)
                        let lineX = content[i].x + data.lines[j].bbox.x0
                        let lineY = content[i].y + data.lines[j].bbox.y0
                        let dropId = props.addDropArea(lineX, lineY, width, height, dropIdCounter)
                        props.addAnswerPair(dragId, dropId)
                    }
                    if(i === content.length-1) props.hideLoader()
                    
                  })
                  
            }
        }
        imgSource.src = props.bgImg

    }


    return (
        <div>
            <button className="sidebtn" onClick={() => {
                generateText()
                props.addCompletedAutoTask("OCRDataTypes")
                props.addCompletedAutoTask("OCRSentences")
            }}
                disabled={props.completedAutoTasks.includes("OCRSentences")}
                style={{ textDecoration: props.completedAutoTasks.includes("OCRSentences") ? "line-through" : "" }}
            >{props.name}</button>
        </div>
        
    )
}
export default OCRSentencesInRectangles