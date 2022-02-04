import item from "../qti_template/blankItem.xml"
import manifest from "../qti_template/imsmanifest.xml"
import JSZip from "jszip";
import { useRef } from "react";

function ExportQTI(props) {
    var itemDocString = null
    var manifestDocString = null

    const hiddenCanvasRef = useRef(null)

    const debugImgRef = useRef(null)
    const debugCanvasRef = useRef(null)

    function generateQtiItem(xmlString) {

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString,"text/xml");
        let interaction = xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0]

        //Create the drag elements
        for(let i = 0; i < props.dragElements.length; i++) {
            //gapImg
            let newGapImg = xmlDoc.createElement("gapImg")
            newGapImg.setAttribute("identifier", "A"+String(i+1))
            newGapImg.setAttribute("matchMax", "0")
            newGapImg.setAttribute("matchMin", "0")
            //object - generate resource id for the drag elements
            let newGapImgObject = xmlDoc.createElement("object")
            let resId = "resources/ID_" + String(100000000+i) + ".png"
            props.dragElements[i].id = resId.substring(10)
            newGapImgObject.setAttribute("data", resId)
            newGapImgObject.setAttribute("type", "image/png")
            newGapImgObject.setAttribute("objectLabel", "")
            newGapImgObject.setAttribute("widt", props.dragElements[i].width) //These two are less than the original size, set by orgWidth..
            newGapImgObject.setAttribute("height", props.dragElements[i].height)
            newGapImgObject.setAttribute("inspera:orgWidth", props.dragElements[i].width)
            newGapImgObject.setAttribute("inspera:orgHeight", props.dragElements[i].height)
            newGapImgObject.setAttribute("inspera:logicalName", "asd")
            newGapImgObject.setAttribute("inspera:objectType", "content_image")
        
            newGapImg.appendChild(newGapImgObject)
            interaction.appendChild(newGapImg)
        }
        //Create the drop areas
        for(let i = 0; i < props.dropAreas.length; i++) {
            let hotspot = xmlDoc.createElement("associableHotspot")
            hotspot.setAttribute("identifier", "GAP"+String(i+1))
            hotspot.setAttribute("matchMax", "1")
            hotspot.setAttribute("shape", "rect")
            let coords =String(props.dropAreas[i].startX) + "," + String(props.dropAreas[i].startY) + "," + String(props.dropAreas[i].destinationX) + "," + String(props.dropAreas[i].destinationY)
            hotspot.setAttribute("coords", coords)
            interaction.appendChild(hotspot)
        }
        

        itemDocString = new XMLSerializer().serializeToString(xmlDoc)
        //console.log(itemDocString)

        // console.log("------------NEW-------------")
        // console.log(xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0])
    }


    function generateQtiManifest(xmlString) {

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString,"text/xml");
        let resource = xmlDoc.getElementsByTagName("resource")[0]
        

        //Create the drag elements
        for(let i = 0; i < props.dragElements.length; i++) {
           
        }
        //Create the drop areas
        for(let i = 0; i < props.dropAreas.length; i++) {
            
        }
        
        // manifestDocString = new XMLSerializer().serializeToString(xmlDoc)
        // console.log(manifestDocString)

    }

    function getModifiedBackgroundImg() {

        //DEBUGGING - still only part of the bg img
        // console.log(props.bgImg) //blob
        // console.log(typeof(props.bgImg)) //string
        // let newBlob = new Blob([props.bgImg], {type : 'image/png'})
        // var reader = new FileReader();
        // reader.readAsDataURL(newBlob); 
        // reader.onloadend = function() {
        //     var base64data = reader.result;
        //     console.log("bg blob is now base64:")
        //     console.log(base64data); //This one is empty
        // }

        // debugImgRef.current.src = props.bgImg //This works
        // //So lets try to draw on canvas instead of img:
        // let debugCtx = debugCanvasRef.current.getContext("2d")
        // let bg = new Image()
        // bg.onload = () => {
        //     debugCtx.drawImage(bg, 0, 0, bg.width, bg.height)
        // }
        // bg.src = props.bgImg
        // //IT worked!
        


        return new Promise((resolve, reject) => {
            var ctx = hiddenCanvasRef.current.getContext("2d")
            let img = new Image()
            img.onload = () => {
                //Setup canvas
                console.log("BG DIMENSIONS: " + img.width + ", " + img.height) //CORRECT
                hiddenCanvasRef.current.width = img.width
                hiddenCanvasRef.current.height = img.height
                hiddenCanvasRef.current.style.width = img.width
                hiddenCanvasRef.current.style.height = img.height
                //ctx.setTransform(1, 0, 0, 1, 0, 0); //reset scale
                //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                ctx.drawImage(img, 0, 0, img.width, img.height);
                //clear the drop areas
                props.dropAreas.forEach(d => {
                    ctx.clearRect(d.startX, d.startY, d.destinationX, d.destinationY)
                });
                hiddenCanvasRef.current.toDataURL()
                resolve(hiddenCanvasRef.current.toDataURL())
            }
            img.onerror = reject
            img.src = props.bgImg
        })

        // //Get img size
        // let width = 0
        // let height = 0
        // let i = new Image(); 
        // i.onload = function(){
        //     width = i.width
        //     height = i.height
        // }
        // i.src = props.bgImg

        // var ctx = hiddenCanvas.current.getContext("2d")
        // var img = new Image();
        // img.onload = function() {
        //     ctx.setTransform(1, 0, 0, 1, 0, 0); //reset scale
        //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        //     ctx.drawImage(img, 0, 0, img.width, img.height);
        //     //clear the drop areas
        //     props.dropAreas.forEach(d => {
        //         ctx.clearRect(d.startX, d.startY, d.destinationX, d.destinationY)
        //     });
        // }
        // img.src = props.bgImg
    }


    return (
        <div>
            <button className="sidebtn" id="exportbtn" onClick={async () => {

                //Background image
                let bg = await getModifiedBackgroundImg()

                //Item file
                let i = await fetch(item)
                let it = await i.text()
                generateQtiItem(it)
                
                //manifest file
                let m = await fetch(manifest)
                let mt = await m.text()
                generateQtiManifest(mt)

                //zip item
                var zip = new JSZip();
                zip.file("ID_99999999-item.xml", itemDocString);

                //zip other resources
                var img = zip.folder("resources")
                for(let i = 0; i < props.dragElements.length; i++) {
                    let base64Img = props.dragElements[i].src.replace(/^data:image\/(png|jpg);base64,/, "") //Data url to base64
                    img.file(props.dragElements[i].id, base64Img, {base64: true})
                }
                let base64bgImg = bg.replace(/^data:image\/(png|jpg);base64,/, "") //Data url to base64
                img.file("background.png", base64bgImg, {base64: true})

                //Download
                zip.generateAsync({type:"blob"}).then(function(content) {
                    //console.log(content)
                    let link = document.createElement("a")
                    link.download = "QTI"
                    link.href = URL.createObjectURL(content)
                    document.body.appendChild(link);
                    link.click()
                    document.body.removeChild(link);
                    // in case the Blob uses a lot of memory
                    setTimeout(() => URL.revokeObjectURL(link.href), 7000)
                });
            }}>Export QTI</button>

            <button className="sidebtn" onClick={async () => { //Print original file
                let i = await fetch(item)
                let it = await i.text()
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(it,"text/xml");
                console.log("------------ORIGINAL-------------")
                console.log(xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0])
            }}>log original qti</button>

            <canvas ref={hiddenCanvasRef} width="400" height="400"  style={{display: "none"}}></canvas>
            
            {/*DEBUGGING */}
            {/* <img ref={debugImgRef}></img>
            <canvas ref={debugCanvasRef} width="600" height="600"></canvas> */}

        </div>
    )
}

export default ExportQTI