import './App.css';
import UploadImage from "./components/btnUploadImage.js";
import ImageViewer from './components/imageViewer';
import React, { useEffect, useState } from 'react';
import DragElementsArea from './components/dragElementsArea';
import ExportQTI from './components/btnExportQTI';
import EditButton from './components/btnEdit';
import PreviewSnippet from './components/previewSnippet';
import SetAnswer from './components/setAnswer';
import OCRDataTypes from './components/btnOCRDataTypes';
import OCRSentences from './components/btnOCRSentences';

function App() {

  const [bgImg, setBgImg] = useState()
  const [dragElements, setDragElements] = useState([])
  const [dropAreas, setDropAreas] = useState([])
  const [erasedAreas, setErasedAreas] = useState([])
  const [answerPairs, setAnswerPairs] = useState([])
  const [snippetDimensions, setSnippetDimensions] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [buttonHighlighting, setButtonHighlighting] = useState({createDragElement: false, removeArea: false, createDropArea: false, createDistractor: false, createWord: false})
  const [selectedDropArea, setSelectedDropArea]  = useState(0)

  const [ocrWords, setOcrWords] = useState([])


  useEffect(() => {
  })

  //For highlighting button and enabling marking feature
  function switchButtonHighlight(button) {
    let newState = {...buttonHighlighting}
    //On second click
    if(buttonHighlighting[button] === true) {
      newState[button] = false
    }
    else if(button === "clear") {
      Object.keys(newState).forEach(v => newState[v] = false)
    }
    else {
      Object.keys(newState).forEach(v => newState[v] = false)
      newState[button] = true
    }
    setButtonHighlighting(newState)
  }

  function addDragElement(imgSrc, width, height, manualNewId) {
    let newId = 0
    if(manualNewId === undefined) {
      newId = (dragElements[dragElements.length-1] === undefined) ? 1 : dragElements[dragElements.length-1].id+1
    }
    else {
      newId = manualNewId
    }
    let newDataId = (dragElements[dragElements.length-1] === undefined) ? 100000000 : dragElements[dragElements.length-1].dataId+1
    let newDragEl = {
      src: imgSrc,
      width: width,
      height: height,
      id: newId,
      dataId: newDataId
    }
    setDragElements(dragElements => [...dragElements, newDragEl])
    //console.log("Drag element added", newDragEl)
    return newId
  }

  function addDropArea(sx, sy, dx, dy, manualNewId) {
    let newId = 0
    if(manualNewId === undefined) {
      newId = (dropAreas[dropAreas.length-1] === undefined) ? 1 : dropAreas[dropAreas.length-1].id+1
    }
    else {
      newId = manualNewId
    }
    let newDropArea = {
      startX: sx,
      startY: sy,
      destinationX: dx,
      destinationY: dy,
      id: newId
    }
    setDropAreas(dropAreas => [...dropAreas, newDropArea])
    //console.log("Drop area added", newDropArea)
    return newId
  }

  function addErasedArea(sx, sy, dx, dy) {
    let newErasedArea = {
      startX: sx,
      startY: sy,
      destinationX: dx,
      destinationY: dy,
    }
    setErasedAreas(erasedAreas => [...erasedAreas, newErasedArea])
    console.log(erasedAreas)
  }

  function addAnswerPair(dragId, dropId) {
    let newAnserPair = {dragId: dragId, dropId: dropId}
    setAnswerPairs(answerPairs => [...answerPairs, newAnserPair])
  }

  function setAnswerPair(dragId, dropId) {
    //Find pair with this dropId
    let pairs = [...answerPairs]
    console.log(pairs)
    for(let pair of pairs) {
      if(pair.dropId === dropId) {
        pair.dragId = dragId
      }
    }
    setAnswerPairs(pairs)
  }

  function setSnippetDimensionsState(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    setSnippetDimensions([sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight])
  }

  function addOcrWord(imgSrc, x, y, width, height) {
    let newOcrWord = {
      src: imgSrc,
      x: x,
      y: y,
      width: width,
      height: height
    }
    setOcrWords(ocrWords => [...ocrWords, newOcrWord])
  }


  return (
    <div className="App" style={{cursor: (Object.keys(buttonHighlighting).find((i) => buttonHighlighting[i] === true)) ? "crosshair" : "default"}}>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <EditButton name="Create drag element" click={() => {switchButtonHighlight("createDragElement")}} clicked={buttonHighlighting.createDragElement}></EditButton>
        <EditButton name="Remove area" clicked={buttonHighlighting.removeArea} click={() => {switchButtonHighlight("removeArea")}}></EditButton>
        <EditButton name="Create drop area" clicked={buttonHighlighting.createDropArea} click={() => {switchButtonHighlight("createDropArea")}}></EditButton>
        {/* <CreateDistractor clicked={buttonHighlighting.createDistractor} click={() => {switchButtonHighlight("createDistractor")}}></CreateDistractor> */}
        <EditButton name="Create distractor" clicked={buttonHighlighting.createDistractor} click={() => {switchButtonHighlight("createDistractor")}}></EditButton>
        <div className="SidemenuOCR">
          <p id="SideP">OCR</p>
          <div className="SidemenuOCRButtons">
            <OCRDataTypes name="Detect data types"
            bgImg={bgImg} 
            addDragElement={(imgSrc, width, height, manualNewId) => addDragElement(imgSrc, width, height, manualNewId)}
            addDropArea={(sx, sy, dx, dy, manualNewId) => addDropArea(sx, sy, dx, dy, manualNewId)}
            addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
            dropAreas={dropAreas}
            dragElements={dragElements}
            addOcrWord={(imgSrc, x, y, width, height) => addOcrWord(imgSrc, x, y, width, height)}
            ></OCRDataTypes>
            <OCRSentences name="Detect attributes/functions"
            bgImg={bgImg} 
            addDragElement={(imgSrc, width, height, manualNewId) => addDragElement(imgSrc, width, height, manualNewId)}
            addDropArea={(sx, sy, dx, dy, manualNewId) => addDropArea(sx, sy, dx, dy, manualNewId)}
            addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
            dropAreas={dropAreas}
            dragElements={dragElements}
            addOcrWord={(imgSrc, x, y, width, height) => addOcrWord(imgSrc, x, y, width, height)}
            ></OCRSentences>

            <button onClick={ async () => {

              let data={txt: "asd"}
              const response = await fetch("http://127.0.0.1:5000/rectangles", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                //body: JSON.stringify(data) // body data type must match "Content-Type" header
              })
              const content = await response.json()
              console.log("response: ", content)

            }}>Backend</button>
            {/* <EditButton name="Choose OCR words" clicked={buttonHighlighting.createWord} click={() => {switchButtonHighlight("createWord")}}></EditButton> */}
          </div>
        </div>

        <ExportQTI dropAreas={dropAreas} dragElements={dragElements} answerPairs={answerPairs} bgImg={bgImg} erasedAreas={erasedAreas}></ExportQTI>
      </div>

      <div className="MainArea">
        <ImageViewer bgImg={bgImg}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        clearButtonHighlight={() => {switchButtonHighlight("clear")}}
        dropAreas={dropAreas}
        dragElements={dragElements}
        addDropArea={(sx, sy, dx, dy) => addDropArea(sx, sy, dx, dy)}
        addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
        // addErasedArea={(sx, sy, dx, dy) => {addErasedArea(sx, sy, dx, dy)}}
        pressedButton={Object.keys(buttonHighlighting).find((i) => buttonHighlighting[i] === true)}
        erasedAreas={erasedAreas}
        setAnswerPair={(dragId, dropId) => {setAnswerPair(dragId, dropId)}}
        answerPairs={answerPairs}
        setSnippetDimensionsState={(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) => {setSnippetDimensionsState(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)}}
        setSelectedDropArea={(id) => {setSelectedDropArea(id)}}
        ocrWords={ocrWords}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements}></DragElementsArea>
      </div>

      <div className="RightArea">
        <PreviewSnippet
        snippetDimensions={snippetDimensions}
        bgImg={bgImg}
        pressedButton={Object.keys(buttonHighlighting).find((i) => buttonHighlighting[i] === true)}
        clearButtonHighlight={() => {switchButtonHighlight("clear")}}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        addDropArea={(sx, sy, dx, dy) => addDropArea(sx, sy, dx, dy)}
        addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
        addErasedArea={(sx, sy, dx, dy) => {addErasedArea(sx, sy, dx, dy)}}
        >
        </PreviewSnippet>

        <SetAnswer selectedDropArea={selectedDropArea}
        addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
        setAnswerPair={(dragId, dropId) => {setAnswerPair(dragId, dropId)}}
        answerPairs={answerPairs}
        dragElements={dragElements}
        ></SetAnswer>

        <div className="SetMarkingSizeArea">
          {/* <h4>TODO Set marking size</h4> */}
        </div>

      </div>

    </div>
  );
}

export default App;
