import { useState, useEffect, useRef } from 'react'
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

function DragAndDropRectangles(props) {
    
    async function generateText() { 
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
        const rectangles = await response.json() //Array of {x, y, w, h} objects
        console.log("response: ", rectangles)
        let imgSource = new Image() //Source image for canvas to draw from
        imgSource.onload = () => {
            //Starting IDs
            const newestDropId = (props.dropAreas[props.dropAreas.length-1] === undefined) ? 0 : props.dropAreas[props.dropAreas.length-1].id
            let dropIdCounter = newestDropId
            const newestDragId = (props.dragElements[props.dragElements.length-1] === undefined) ? 0 : props.dragElements[props.dragElements.length-1].id
            let dragIdCounter = newestDragId
            
            for(let i = 0; i < rectangles.length; i++) {
                dropIdCounter++
                dragIdCounter++
                //Create a canvas and draw a retangle/class on it, then pass the canvas element to Tesseract
                let rectangleCanvas = document.createElement("canvas")
                rectangleCanvas.width = rectangles[i].width
                rectangleCanvas.height = rectangles[i].height
                let rectangleCtx = rectangleCanvas.getContext("2d")
                rectangleCtx.clearRect(0, 0, rectangleCtx.canvas.width, rectangleCtx.canvas.height)
                rectangleCtx.drawImage(imgSource, rectangles[i].x, rectangles[i].y, rectangles[i].width, rectangles[i].height, 0, 0, rectangles[i].width, rectangles[i].height)

                let dragId = props.addDragElement(rectangleCanvas.toDataURL(), rectangleCanvas.width, rectangleCanvas.height, dragIdCounter)
                let dropId = props.addDropArea(rectangles[i].x, rectangles[i].y, rectangleCanvas.width, rectangleCanvas.height, dropIdCounter)
                props.addAnswerPair(dragId, dropId)
            }
        }
        imgSource.src = props.bgImg

    }


    return (
        <div>
            <button className="sidebtn" onClick={() => {generateText()}}>{props.name}</button>
        </div>
        
    )
}
export default DragAndDropRectangles