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
  const [mouseCoordinates, setMouseCoordinates] = useState([]) //xy start and xy stop
  const [previewCanvasSize, setPreviewCanvasSize] = useState([30, 15])
  const [dragElements, setDragElements] = useState([])
  const [newDragElement, setNewDragElement] = useState()

  const canvasRef = useRef(null)

  //For highlighting button and enabling marking feature
  function switchCreateDragElement() {
    setCreateDragElementPressed(createDragElementPressed => !createDragElementPressed)
  }

  function setMouseCoordinatesState(coordinates) {
    setMouseCoordinates(coordinates)
  }

  function addDragElement(imgSrc, width, height) {
    let newDragEl = {
      src: imgSrc,
      width: width,
      height: height
    }
    setDragElements(dragElements => [...dragElements, newDragEl])
  }

  function drawPreviewSnippet(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    setPreviewCanvasSize([dWidth, dHeight])
    let ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let imgSource = new Image()
    console.log("Drawing preview snippet with dimensions:")
    console.log(dWidth + " * "  + dHeight)
    imgSource.onload = () => {
      ctx.drawImage(imgSource, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      let newDragEl = {
        src: canvasRef.current.toDataURL(),
        width: dWidth,
        height: dHeight
      }
      setNewDragElement(newDragEl)
    }
    imgSource.src = bgImg
    
  }



  return (
    <div className="App" style={{cursor: createDragElementPressed? "crosshair" : "default"}}>
      <p>Hei</p>

      <div className="Sidemenu">
        <UploadImage setBgImg={(img) => {setBgImg(img)}}></UploadImage>
        <CreateDragElement click={() => {switchCreateDragElement()}} clicked={createDragElementPressed} id="createDragElementBtn"></CreateDragElement>
        <RemoveArea></RemoveArea>
        <CreateDropArea></CreateDropArea>
        <CreateDistractor></CreateDistractor>
      </div>

      <div className="MainArea">
        <ImageViewer bgImg={bgImg} createDragElementPressed={createDragElementPressed}
        setMouseCoordinates={setMouseCoordinatesState}
        slice={(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) => {drawPreviewSnippet(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)}}
        addDragElement={(imgSrc, width, height) => addDragElement(imgSrc, width, height)}
        switchCreateDragElement={() => {switchCreateDragElement()}}
        ></ImageViewer>

        <DragElementsArea dragElements={dragElements}></DragElementsArea>

      </div>

      {/* <div className="PreviewSnippetArea">
        <h3>Preview snippet</h3>
        <canvas ref={canvasRef} id="demo" width={previewCanvasSize[0]} height={previewCanvasSize[1]} style={{width: previewCanvasSize[0], height: previewCanvasSize[1]}}></canvas>
        <button style={{visibility: createDragElementPressed? "visible" : "hidden"}} onClick={() => {
          if(!newDragElement) {
            return
          }
          setDragElements(dragElements => [...dragElements, newDragElement])
          //Clear preview and new drag element state
          setNewDragElement(null)
          setPreviewCanvasSize([30, 15])
          let ctx = canvasRef.current.getContext("2d")
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
          //Un-toggle create drag element button
          switchCreateDragElement()
        }}>Create</button>
      </div> */}


    </div>
  );
}

export default App;
