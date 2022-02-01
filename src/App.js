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
  const [createDragElementPressed, setCreateDragElementPressed] = useState(false)
  const [dragElements, setDragElements] = useState([])
  const [dropAreas, setDropAreas] = useState([])

  const canvasRef = useRef(null)

  //For highlighting button and enabling marking feature
  function switchCreateDragElement() {
    setCreateDragElementPressed(createDragElementPressed => !createDragElementPressed)
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
    //console.log(dropAreas)
  }


  return (
    <div className="App" style={{cursor: createDragElementPressed? "crosshair" : "default"}}>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <CreateDragElement click={() => {switchCreateDragElement()}} clicked={createDragElementPressed} id="createDragElementBtn"></CreateDragElement>
        <RemoveArea></RemoveArea>
        <CreateDropArea></CreateDropArea>
        <CreateDistractor></CreateDistractor>
        <ExportQTI></ExportQTI>
      </div>

      <div className="MainArea">
        <ImageViewer bgImg={bgImg} createDragElementPressed={createDragElementPressed}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        switchCreateDragElement={() => {switchCreateDragElement()}}
        dropAreas={dropAreas}
        addDropArea={(sx, sy, dx, dy) => {addDropArea(sx, sy, dx, dy)}}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements}></DragElementsArea>
      </div>

    </div>
  );
}

export default App;
