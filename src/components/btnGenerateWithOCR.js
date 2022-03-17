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
            let imgSource = new Image()
            imgSource.onload = () => {
                const newestDropId = (props.dropAreas[props.dropAreas.length-1] === undefined) ? 0 : props.dropAreas[props.dropAreas.length-1].id
                let dropIdCounter = newestDropId
                const newestDragId = (props.dragElements[props.dragElements.length-1] === undefined) ? 0 : props.dragElements[props.dragElements.length-1].id
                let dragIdCounter = newestDragId
                console.log(words)
                for(let i = 1; i < words.length; i++) {
                    //If previous word ends with colon or IS a colon
                    if(words[i-1].text.charAt(words[i-1].text.length-1) === ":") {
                        dropIdCounter++
                        dragIdCounter++

                        //If inwanted character found, cut the element at that position
                        //BOUNDING BOX COORDINATES APPEAR TO OFTEN OVERLAP, MAKING THIS NOT POSSIBLE
                        let wordPixelsCut = 0
                        // for(let j = 0; j < words[i].symbols.length; j++) {
                        //     if(!words[i].symbols[j].text.match(/[a-z]/i)) {
                        //         console.log("WORD " + dragIdCounter + ": " + words[i].text + " UNWANTED: ", words[i].symbols[j].text)
                        //         console.log("BBOX wrong symbol: " + words[i].symbols[j].bbox.x0 + ", " + words[i].symbols[j].bbox.x1)
                        //         console.log("BBOX symbol before: " + words[i].symbols[j-1].bbox.x0 + ", " + words[i].symbols[j-1].bbox.x1)
                        //         console.log("BBOX word: " + words[i].bbox.x0 + ", " + words[i].bbox.x1)
                        //         wordPixelsCut = words[i].symbols[j].bbox.x0 - words[i].symbols[j-1].bbox.x1
                        //         break;
                        //     }
                        // }

                        let wordWidth = words[i].bbox.x1-words[i].bbox.x0-wordPixelsCut
                        let wordHeight = words[i].bbox.y1-words[i].bbox.y0
                        setFakeCanvasSize([wordWidth, wordHeight])
                        let ctx = fakeCanvasRef.current.getContext("2d")
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                        ctx.drawImage(imgSource, words[i].bbox.x0, words[i].bbox.y0, wordWidth, wordHeight, 0, 0, wordWidth, wordHeight)
                        let dragId = props.addDragElement(fakeCanvasRef.current.toDataURL(), wordWidth, wordHeight, dragIdCounter)
                        let dropId = props.addDropArea(words[i].bbox.x0, words[i].bbox.y0, wordWidth, wordHeight, dropIdCounter)
                        props.addAnswerPair(dragId, dropId)
                    }
                    else {
                        let wordWidth = words[i].bbox.x1-words[i].bbox.x0
                        let wordHeight = words[i].bbox.y1-words[i].bbox.y0
                        setFakeCanvasSize([wordWidth, wordHeight])
                        let ctx = fakeCanvasRef.current.getContext("2d")
                        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                        ctx.drawImage(imgSource, words[i].bbox.x0, words[i].bbox.y0, wordWidth, wordHeight, 0, 0, wordWidth, wordHeight)
                        props.addOcrWord(fakeCanvasRef.current.toDataURL(), words[i].bbox.x0, words[i].bbox.y0, wordWidth, wordHeight)
                    }
                }
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


    return (
        <div>
            <button className="sidebtn" onClick={() => {generateText()}}>{props.name}</button>
            <canvas ref={fakeCanvasRef} id="demo" width={fakeCanvasSize[0]} height={fakeCanvasSize[1]}
                    style={{ width: fakeCanvasSize[0], height: fakeCanvasSize[1], visibility: "hidden" }}
            ></canvas>
        </div>
        
    )
}
export default GenerateWithOCR