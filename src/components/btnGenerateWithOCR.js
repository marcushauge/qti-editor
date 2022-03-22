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
          ).then(({ data }) => {
            let imgSource = new Image()
            imgSource.onload = () => {
                const newestDropId = (props.dropAreas[props.dropAreas.length-1] === undefined) ? 0 : props.dropAreas[props.dropAreas.length-1].id
                let dropIdCounter = newestDropId
                const newestDragId = (props.dragElements[props.dragElements.length-1] === undefined) ? 0 : props.dragElements[props.dragElements.length-1].id
                let dragIdCounter = newestDragId

                console.log("members")
                console.log(data)
                console.log("Lines******************************")
                console.log(data.lines)

                if(props.word === "data") {
                    var words = data.words
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
                        else { //Make each word clickable for user to add desired words as drag-drop elements
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
                else if(props.word === "members") {
                    for(let i = 0; i < data.lines.length; i++) {
                        console.log("*********LINE " + i + "***********")

                        //First find average distance, then above/below space or not
                        let distanceSum = 0
                        let distanceCount = 0
                        for(let j = 0; j < data.lines[i].words.length; j++) {
                            // if(j+1 < data.lines[i].words.length && data.lines[i].words[j+1].bbox.x0-data.lines[i].words[j].bbox.x1 < lowestWordDistance) {
                            //     lowestWordDistance = data.lines[i].words[j+1].bbox.x0-data.lines[i].words[j].bbox.x1
                            //     console.log("Lowest distance: " + data.lines[i].words[j+1].bbox.x0 + " - " + data.lines[i].words[j].bbox.x1)
                            // }
                            if(j+1 < data.lines[i].words.length) {
                                distanceSum += data.lines[i].words[j+1].bbox.x0-data.lines[i].words[j].bbox.x1
                                distanceCount++;
                            }
                        }
                        console.log("Distance sum: ", distanceSum)
                        let distanceAvg = distanceSum/distanceCount
                        console.log("Distance avg: ", distanceAvg)

                        //Go through each word, if next word is distant from prev, its another member
                        //Below avg = space
                        let sentenceStartIndex = 0
                        let prevWord = data.lines[i].words[0]
                        for(let j = 1; j < data.lines[i].words.length; j++) {
                            let wordDistance = data.lines[i].words[j].bbox.x0 - prevWord.bbox.x1
                            let sentence = null
                            if(wordDistance > distanceAvg) {
                                //console.log("Sentence: ", data.lines[i].words.slice(sentenceStartIndex, j))
                                sentence = data.lines[i].words.slice(sentenceStartIndex, j)
                                dropIdCounter++
                                dragIdCounter++
                                makeDragAndDropWithSentence(sentence, dragIdCounter, dropIdCounter, imgSource)

                                sentenceStartIndex = j
                            }
                            else if(j === data.lines[i].words.length-1) {
                                dropIdCounter++
                                dragIdCounter++
                                sentence = data.lines[i].words.slice(sentenceStartIndex, j+1)
                                makeDragAndDropWithSentence(sentence, dragIdCounter, dropIdCounter, imgSource)
                                //console.log("Last sentence: ", data.lines[i].words.slice(sentenceStartIndex, j+1))
                            }
                            prevWord = data.lines[i].words[j]
                        }
                    }
                }
            }
            imgSource.src = props.bgImg
          })

    }

    function makeDragAndDropWithSentence(sentenceWords, dragIdCounter, dropIdCounter, imgSource) {
        //Find dimensions
        let x0 = sentenceWords[0].bbox.x0
        let x1 = sentenceWords[sentenceWords.length-1].bbox.x1
        let width = x1-x0
        let y0 = sentenceWords[0].bbox.y0
        let y1 = sentenceWords[0].bbox.y1
        sentenceWords.forEach(word => { //Find y extremes
            if(word.bbox.y0 < y0) {
                y0 = word.bbox.y0
            }
            if(word.bbox.y1 > y1) {
                y1 = word.bbox.y1
            }
        });
        let height = y1-y0

        setFakeCanvasSize([width, height])
        let ctx = fakeCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(imgSource, x0, y0, width, height, 0, 0, width, height)

        let dragId = props.addDragElement(fakeCanvasRef.current.toDataURL(), width, height, dragIdCounter)
        let dropId = props.addDropArea(x0, y0, width, height, dropIdCounter)
        props.addAnswerPair(dragId, dropId)
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