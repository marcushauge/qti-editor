import './App.css';
import UploadImage from "./components/btnUploadImage.js";
import ImageViewer from './components/imageViewer';
import React, { useEffect, useRef, useState } from 'react';
import DragElementsArea from './components/dragElementsArea';
import ExportQTI from './components/btnExportQTI';
import EditButton from './components/btnEdit';

//Old
import DragElement from './components/dragElement';
import CreateDragElement from './components/btnCreateDragElement';
import RemoveArea from './components/btnRemoveArea';
import CreateDropArea from './components/btnCreateDropArea';
import CreateDistractor from "./components/btnCreateDistractor";

function App() {

  const [bgImg, setBgImg] = useState()
  const [dragElements, setDragElements] = useState([])
  const [dropAreas, setDropAreas] = useState([])
  const [erasedAreas, setErasedAreas] = useState([])
  const [answerPairs, setAnswerPairs] = useState([])

  const [buttonHighlighting, setButtonHighlighting] = useState({createDragElement: false, removeArea: false, createDropArea: false, createDistractor: false})

  const canvasRef = useRef(null)

  useEffect(() => {
    console.log("App.js new state:  ----------")
    console.log("Answerpairs: ", answerPairs)
    console.log("-----------------------")
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

  function addDragElement(imgSrc, width, height) {
    let newId = (dragElements[dragElements.length-1] === undefined) ? 1 : dragElements[dragElements.length-1].id+1
    let newDataId = (dragElements[dragElements.length-1] === undefined) ? 100000000 : dragElements[dragElements.length-1].dataId+1
    let newDragEl = {
      src: imgSrc,
      width: width,
      height: height,
      id: newId,
      dataId: newDataId
    }
    setDragElements(dragElements => [...dragElements, newDragEl])
    return newId
  }

  function addDropArea(sx, sy, dx, dy) {
    let newId = (dropAreas[dropAreas.length-1] === undefined) ? 1 : dropAreas[dropAreas.length-1].id+1
    let newDropArea = {
      startX: sx,
      startY: sy,
      destinationX: dx,
      destinationY: dy,
      id: newId
    }
    setDropAreas(dropAreas => [...dropAreas, newDropArea])
    console.log("Drop area added")
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


  return (
    <div className="App" style={{cursor: (Object.keys(buttonHighlighting).find((i) => buttonHighlighting[i] === true)) ? "crosshair" : "default"}}>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <EditButton name="Create drag element" click={() => {switchButtonHighlight("createDragElement")}} clicked={buttonHighlighting.createDragElement}></EditButton>
        <EditButton name="Remove area" clicked={buttonHighlighting.removeArea} click={() => {switchButtonHighlight("removeArea")}}></EditButton>
        <EditButton name="Create drop area" clicked={buttonHighlighting.createDropArea} click={() => {switchButtonHighlight("createDropArea")}}></EditButton>
        {/* <CreateDistractor clicked={buttonHighlighting.createDistractor} click={() => {switchButtonHighlight("createDistractor")}}></CreateDistractor> */}
        <EditButton name="Create distractor" clicked={buttonHighlighting.createDistractor} click={() => {switchButtonHighlight("createDistractor")}}></EditButton>
        <ExportQTI dropAreas={dropAreas} dragElements={dragElements} answerPairs={answerPairs} bgImg={bgImg} erasedAreas={erasedAreas}></ExportQTI>
      </div>

      <div className="MainArea">
        <ImageViewer bgImg={bgImg} createDragElementPressed={buttonHighlighting.createDragElement}
        removeAreaPressed={buttonHighlighting.removeArea}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        clearButtonHighlight={() => {switchButtonHighlight("clear")}}
        dropAreas={dropAreas}
        dragElements={dragElements}
        addDropArea={(sx, sy, dx, dy) => addDropArea(sx, sy, dx, dy)}
        addAnswerPair={(dragId, dropId) => {addAnswerPair(dragId, dropId)}}
        addErasedArea={(sx, sy, dx, dy) => {addErasedArea(sx, sy, dx, dy)}}
        pressedButton={Object.keys(buttonHighlighting).find((i) => buttonHighlighting[i] === true)}
        erasedAreas={erasedAreas}
        setAnswerPair={(dragId, dropId) => {setAnswerPair(dragId, dropId)}}
        answerPairs={answerPairs}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements}></DragElementsArea>
      </div>

    </div>
  );
}

export default App;
