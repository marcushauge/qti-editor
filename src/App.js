import './App.css';
import UploadImage from "./components/btnUploadImage.js";
import CreateDragElement from './components/btnCreateDragElement';
import RemoveArea from './components/btnRemoveArea';
import CreateDropArea from './components/btnCreateDropArea';
import CreateDistractor from "./components/btnCreateDistractor";
import ImageViewer from './components/imageViewer';
import React, { useRef, useState } from 'react';

function App() {

  const [bgImg, setBgImg] = useState()
  const [createDragElementPressed, setCreateDragElementPressed] = useState(false)
  const [mouseCoordinates, setMouseCoordinates] = useState([]) //xy start and xy stop

  const canvasRef = useRef(null)

  //For highlighting button and enabling marking feature
  function switchCreateDragElement() {
    setCreateDragElementPressed(createDragElementPressed => !createDragElementPressed)
  }

  function setMouseCoordinatesState(coordinates) {
    setMouseCoordinates(coordinates)
  }

  function drawCrop(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    console.log(bgImg)
    let ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let imgSource = new Image()
    imgSource.onload = () => {
      console.log("loaded")
      ctx.drawImage(imgSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    }
    imgSource.src = bgImg
  }

  return (
    <div className="App" style={{cursor: createDragElementPressed? "crosshair" : "default"}}>
      <p>Hei</p>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <CreateDragElement click={() => {switchCreateDragElement()}} drawCrop={() => {drawCrop()}} clicked={createDragElementPressed} id="createDragElementBtn"></CreateDragElement>
        <RemoveArea></RemoveArea>
        <CreateDropArea></CreateDropArea>
        <CreateDistractor></CreateDistractor>
      </div>

      <div className="ImageArea">
        <ImageViewer bgImg={bgImg} createDragElementPressed={createDragElementPressed}
        setMouseCoordinates={setMouseCoordinatesState}
        slice={(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) => {drawCrop(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)}}
        >
        </ImageViewer>

        <div className="DragElementsArea">
          <button>Element1</button>
          <button>Element2</button>
        </div>

      </div>

      <div className="CropArea">
        <p>Cropping</p>
        <canvas ref={canvasRef} id="demo" width="300" height="300"></canvas>
      </div>


    </div>
  );
}

export default App;
