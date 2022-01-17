import './App.css';
import UploadImage from "./components/btnUploadImage.js";
import CreateDragElement from './components/btnCreateDragElement';
import RemoveArea from './components/btnRemoveArea';
import CreateDropArea from './components/btnCreateDropArea';
import CreateDistractor from "./components/btnCreateDistractor";
import ImageViewer from './components/imageViewer';

function App() {
  return (
    <div className="App">
      <p>Hei</p>

      <div className="Sidemenu">
        <UploadImage id="sidebtn"></UploadImage>
        <CreateDragElement id="sidebtn"></CreateDragElement>
        <RemoveArea id="sidebtn"></RemoveArea>
        <CreateDropArea id="sidebtn"></CreateDropArea>
        <CreateDistractor id="sidebtn"></CreateDistractor>
      </div>

      <div className="ImageArea">
        <ImageViewer></ImageViewer>

        <div className="DragElementsArea">
          <button>Element1</button>
          <button>Element2</button>
        </div>

      </div>


    </div>
  );
}

export default App;
