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

function App() {

  const [bgImg, setBgImg] = useState()
  const [createDragElementPressed, setCreateDragElementPressed] = useState(false)
  const [dragElements, setDragElements] = useState([])

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


  return (
    <div className="App" style={{cursor: createDragElementPressed? "crosshair" : "default"}}>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <CreateDragElement click={() => {switchCreateDragElement()}} clicked={createDragElementPressed} id="createDragElementBtn"></CreateDragElement>
        <RemoveArea></RemoveArea>
        <CreateDropArea></CreateDropArea>
        <CreateDistractor></CreateDistractor>
      </div>

      <div className="MainArea">
        <ImageViewer bgImg={bgImg} createDragElementPressed={createDragElementPressed}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        switchCreateDragElement={() => {switchCreateDragElement()}}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements}></DragElementsArea>
      </div>

    </div>
  );
}

export default App;
