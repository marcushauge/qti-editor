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
import OCRSentencesInRectangles from './components/btnOCRSentencesInRectangles';
import DragAndDropRectangles from './components/btnDragAndDropRectangles';

function App() {

  const [bgImg, setBgImg] = useState()
  const [dragElements, setDragElements] = useState([])
  const [dropAreas, setDropAreas] = useState([])
  const [erasedAreas, setErasedAreas] = useState([])
  const [answerPairs, setAnswerPairs] = useState([])
  const [snippetDimensions, setSnippetDimensions] = useState([0, 0, 0, 0, 0, 0, 0, 0])
  const [buttonHighlighting, setButtonHighlighting] = useState({createDragElement: false, removeArea: false, createDropArea: false, createDistractor: false, createWord: false})
  const [selectedDropArea, setSelectedDropArea]  = useState(0)
  const [selectedDragElement, setSelectedDragElement]  = useState(0)
  const [ocrWords, setOcrWords] = useState([])

  const [markSize, setMarkSize] = useState([100, 30, false]) //Last element is fixed marking enabled/disabled


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
    let newAnswerPair = {dragId: dragId, dropId: dropId}
    setAnswerPairs(answerPairs => [...answerPairs, newAnswerPair])
  }

  function setAnswerPair(newDragId, dropId) { //Set a drop area's answer to a new answer
    //Find pair with this dropId
    let pairs = [...answerPairs]
    console.log(pairs)
    for(let pair of pairs) {
      if(pair.dropId === dropId) {
        pair.dragId = newDragId
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
          <p id="SideP">Auto detection</p>
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
            <OCRSentencesInRectangles name="Detect attributes/functions in classes"
            bgImg={bgImg} 
            addDragElement={(imgSrc, width, height, manualNewId) => addDragElement(imgSrc, width, height, manualNewId)}
            addDropArea={(sx, sy, dx, dy, manualNewId) => addDropArea(sx, sy, dx, dy, manualNewId)}
            addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
            dropAreas={dropAreas}
            dragElements={dragElements}
            addOcrWord={(imgSrc, x, y, width, height) => addOcrWord(imgSrc, x, y, width, height)}
            ></OCRSentencesInRectangles>
            <DragAndDropRectangles name="Make classes drag-and-drop"
            bgImg={bgImg} 
            addDragElement={(imgSrc, width, height, manualNewId) => addDragElement(imgSrc, width, height, manualNewId)}
            addDropArea={(sx, sy, dx, dy, manualNewId) => addDropArea(sx, sy, dx, dy, manualNewId)}
            addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
            dropAreas={dropAreas}
            dragElements={dragElements}
            addOcrWord={(imgSrc, x, y, width, height) => addOcrWord(imgSrc, x, y, width, height)}>
            </DragAndDropRectangles>

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
        setSelectedDropArea={(id) => {
          setSelectedDropArea(id)
          setSelectedDragElement(0)}}
        ocrWords={ocrWords}
        markSize={markSize}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements} setSelectedDragElement={(id) => {
          setSelectedDragElement(id)
          setSelectedDropArea(0)}}>
        </DragElementsArea>
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
        ></PreviewSnippet>

        <SetAnswer selectedDropArea={selectedDropArea}
        addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
        setAnswerPair={(dragId, dropId) => {setAnswerPair(dragId, dropId)}}
        answerPairs={answerPairs}
        dragElements={dragElements}
        ></SetAnswer>

        <div className="SetMarkingSizeArea">
          <p>Set fixed marking size</p>
          <label for="fixedMark">Enabled: </label>
          <input id="fixedMark" type="checkbox" onChange={event => {setMarkSize([markSize[0], markSize[1], !markSize[2],])}}></input><br/>
          <label for="markingWidth">Width: </label>
          <input type="number" id="markingWidth" style={{width: "40px"}} max="300" onChange={event => {
            setMarkSize([parseInt(event.target.value), markSize[1], markSize[2]])}} value={markSize[0]}></input><br></br>
          <label for="markingHeight">Height: </label>
          <input type="number" id="markingHeight" style={{width: "40px"}}max="300" onChange={event => {
            setMarkSize([markSize[0], parseInt(event.target.value), markSize[2]])}} value={markSize[1]}></input><br></br>
          <canvas width={markSize[0] && markSize[0]>-1 ? markSize[0] : 0} height={markSize[1] && markSize[1]>-1 ? markSize[1] : 0}
            style={{borderStyle: "dashed", borderWidth: "1px"}}>
          </canvas>
        </div>

        <button className="sidebtn" style={{marginTop: "10px", visibility: selectedDropArea !==0 ? "visible" : "hidden"}} onClick={() => {
          //Remove the drop area
          let dropId = selectedDropArea
          setDropAreas(dropAreas.filter(dropArea => dropArea.id !== dropId))
          //Remove all answer pairs with this gap ID
          setAnswerPairs(answerPairs.filter(pair => pair.dropId !== dropId))
          //Reset selectedDropArea state
          setSelectedDropArea(0)
        }}>Remove drop area</button>


        <button className="sidebtn" style={{marginTop: "10px", visibility: selectedDragElement !==0 ? "visible" : "hidden"}} onClick={() => {
          setDragElements(dragElements.filter(element => element.id !== selectedDragElement))
          setSelectedDragElement(0)
        }}>Remove drag element</button>






        <button onClick={() => {
          console.log("Drop areas: ", dropAreas)
          console.log("Drag elements: ", dragElements)
          console.log("Answer pairs: ", answerPairs)
        }}>React state</button>

      </div>

    </div>
  );
}

export default App;
