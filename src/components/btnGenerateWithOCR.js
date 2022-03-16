import { useState, useEffect, useRef } from 'react'
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

function GenerateWithOCR(props) {

    const fakeCanvasRef = useRef(null)

    const [fakeCanvasSize, setFakeCanvasSize] = useState([30, 15])
    
    async function generateText() { 
        //Need to create a copy of the image from the props.bgImg URL as tesseract appears to delete or change it.
        let file = await fetch(props.bgImg).then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))

        Tesseract.recognize(
            file,
            'eng',
            { logger: m => console.log(m) }
          ).then(({ data: { words } }) => {
            //console.log(words);
            // createDragAndDrop(words[0].bbox.x0, words[0].bbox.y0, words[0].bbox.x1-words[0].bbox.x0, words[0].bbox.y1-words[0].bbox.y0, 0, 0, words[0].bbox.x1-words[0].bbox.x0, words[0].bbox.y1-words[0].bbox.y0)
            // createDragAndDrop(words[1].bbox.x0, words[1].bbox.y0, words[1].bbox.x1-words[1].bbox.x0, words[1].bbox.y1-words[1].bbox.y0, 0, 0, words[1].bbox.x1-words[1].bbox.x0, words[1].bbox.y1-words[1].bbox.y0)

            // words.forEach(word => {
            //     // props.testAddBbox(word.bbox.x0, word.bbox.y0, word.bbox.x1, word.bbox.y1)
            //     // console.log(word.bbox)
            //     //createDragAndDrop(word.bbox.x0, word.bbox.y0, word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0, 0, 0, word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0)
            // })
            let imgSource = new Image()
            imgSource.onload = () => {
                const newestDropId = (props.dropAreas[props.dropAreas.length-1] === undefined) ? 0 : props.dropAreas[props.dropAreas.length-1].id
                let dropIdCounter = newestDropId
                const newestDragId = (props.dragElements[props.dragElements.length-1] === undefined) ? 0 : props.dragElements[props.dragElements.length-1].id
                let dragIdCounter = newestDropId
                words.forEach(word => {
                    dropIdCounter++
                    dragIdCounter++
                    setFakeCanvasSize([word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0])
                    let ctx = fakeCanvasRef.current.getContext("2d")
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                    ctx.drawImage(imgSource, word.bbox.x0, word.bbox.y0, word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0, 0, 0, word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0)
                    let dragId = props.addDragElement(fakeCanvasRef.current.toDataURL(), word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0, dragIdCounter)
                    let dropId = props.addDropArea(word.bbox.x0, word.bbox.y0, word.bbox.x1-word.bbox.x0, word.bbox.y1-word.bbox.y0, dropIdCounter)
                    props.addAnswerPair(dragId, dropId)
                })
            }
            imgSource.src = props.bgImg
          })

        // const worker = createWorker({
        //     logger: m => console.log(m)
        //   });
          
        //   (async () => {
        //     await worker.load();
        //     await worker.loadLanguage('eng');
        //     await worker.initialize('eng');
        //     const { data: { words } } = await worker.recognize(bg)
        //     // const result = await worker.recognize(bg)
        //     // console.log(result.data.hocr);
        //     // console.log(result.data.words);
        //     // console.log(result.data.words[0].bbox.x0)
        //     console.log(words)
        //     console.log(words[0].bbox.x0)
        //     props.testAddBbox(words[0].bbox.x0, words[0].bbox.y0, words[0].bbox.x1, words[0].bbox.y1)
        //     //setSomeState(words)
        //     console.log("BG after: ", bg)
        //     await worker.terminate();
        //   })();
    }

    function createDragAndDrop(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        setFakeCanvasSize([dWidth, dHeight])
        let ctx = fakeCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        let imgSource = new Image()

        imgSource.onload = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.drawImage(imgSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            let newDragEl = {
                src: fakeCanvasRef.current.toDataURL(),
                width: dWidth,
                height: dHeight
            }
            //setPreviewElement(newDragEl)
            let dragId = props.addDragElement(newDragEl.src, newDragEl.width, newDragEl.height)
            //setNewArea([sx, sy, sWidth, sHeight])
            let dropId = props.addDropArea(sx, sy, sWidth, sHeight)
            console.log("drag and drop ids: " + dragId + ", " + dropId)
            props.addAnswerPair(dragId, dropId)
        }
        imgSource.src = props.bgImg
    }

    return (
        <div>
            <button className="sidebtn" onClick={() => {generateText()}}>Generate With OCR</button>
            <canvas ref={fakeCanvasRef} id="demo" width={fakeCanvasSize[0]} height={fakeCanvasSize[1]}
                    style={{ width: fakeCanvasSize[0], height: fakeCanvasSize[1], visibility: "hidden" }}
            ></canvas>
        </div>
        
    )
}
export default GenerateWithOCR