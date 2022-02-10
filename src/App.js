import './App.css';
import UploadImage from "./components/btnUploadImage.js";
import CreateDragElement from './components/btnCreateDragElement';
import RemoveArea from './components/btnRemoveArea';
import CreateDropArea from './components/btnCreateDropArea';
import CreateDistractor from "./components/btnCreateDistractor";
import ImageViewer from './components/imageViewer';
import React, { useRef, useState } from 'react';
import DragElementsArea from './components/dragElementsArea';
import DragElement from './components/dragElement';
import ExportQTI from './components/btnExportQTI';

function App() {

  const [bgImg, setBgImg] = useState()
  const [dragElements, setDragElements] = useState([])
  const [dropAreas, setDropAreas] = useState([])
  const [erasedAreas, setErasedAreas] = useState([])

  const [buttonHighlighting, setButtonHighlighting] = useState({createDragElement: false, removeArea: false})

  const canvasRef = useRef(null)

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
    let newDragEl = {
      src: imgSrc,
      width: width,
      height: height
    }
    setDragElements(dragElements => [...dragElements, newDragEl])
  }

  function addDropArea(sx, sy, dx, dy) {
    let newDropArea = {
      startX: sx,
      startY: sy,
      destinationX: dx,
      destinationY: dy,
    }
    setDropAreas(dropAreas => [...dropAreas, newDropArea])
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


  return (
    <div className="App" style={{cursor: buttonHighlighting.createDragElement || buttonHighlighting.removeArea ? "crosshair" : "default"}}>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <CreateDragElement click={() => {switchButtonHighlight("createDragElement")}} clicked={buttonHighlighting.createDragElement}></CreateDragElement>
        <RemoveArea clicked={buttonHighlighting.removeArea} click={() => {switchButtonHighlight("removeArea")}}></RemoveArea>
        <CreateDropArea></CreateDropArea>
        <CreateDistractor></CreateDistractor>
        <ExportQTI dropAreas={dropAreas} dragElements={dragElements} bgImg={bgImg} erasedAreas={erasedAreas}></ExportQTI>
      </div>

      <div className="MainArea">
        <ImageViewer bgImg={bgImg} createDragElementPressed={buttonHighlighting.createDragElement}
        removeAreaPressed={buttonHighlighting.removeArea}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        clearButtonHighlight={() => {switchButtonHighlight("clear")}}
        dropAreas={dropAreas}
        addDropArea={(sx, sy, dx, dy) => {addDropArea(sx, sy, dx, dy)}}
        addErasedArea={(sx, sy, dx, dy) => {addErasedArea(sx, sy, dx, dy)}}
        pressedButton={Object.keys(buttonHighlighting).find((i) => buttonHighlighting[i] === true)}
        erasedAreas={erasedAreas}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements}></DragElementsArea>
      </div>

    </div>
  );
}

export default App;
