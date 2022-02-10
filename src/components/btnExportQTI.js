import item from "../qti_template/blankItem.xml"
import manifest from "../qti_template/blankManifest.xml"
import JSZip from "jszip";
import { useRef } from "react";
import aboxImg from "../qti_template/resources/ID_103871406.png"

function ExportQTI(props) {
    var itemDocString = null
    var manifestDocString = null

    const hiddenCanvasRef = useRef(null)

    const debugImgRef = useRef(null)
    const debugCanvasRef = useRef(null)

    const BGFILENAME = "background.png"

    function generateQtiItem(xmlString) {

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString,"text/xml");
        let interaction = xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0]
        let qtiNamespace = "http://www.imsglobal.org/xsd/imsqti_v2p2"

        //Create background element
        let newBgObject = xmlDoc.getElementsByTagName("object")[0]
        newBgObject.setAttribute("data", "resources/"+BGFILENAME)
        let img = new Image()
        img.src = props.bgImg
        newBgObject.setAttribute("width", String(img.width))



        //Create the drag elements
        for(let i = 0; i < props.dragElements.length; i++) {
            //gapImg
            //let newGapImg = xmlDoc.createElement("gapImg")
            let newGapImg = xmlDoc.createElementNS(qtiNamespace, "gapImg")
            newGapImg.setAttribute("identifier", "A"+String(i+2))
            newGapImg.setAttribute("matchMax", "0")
            newGapImg.setAttribute("matchMin", "0")
            //object - generate resource id for the drag elements
            let newGapImgObject = xmlDoc.createElementNS(qtiNamespace, "object")
            let resId = "resources/ID_" + String(100000000+i) + ".png"
            props.dragElements[i].id = resId.substring(10)
            newGapImgObject.setAttribute("data", resId)
            newGapImgObject.setAttribute("type", "image/png")
            newGapImgObject.setAttribute("objectLabel", "")
            newGapImgObject.setAttribute("width", props.dragElements[i].width) //These two are less than the original size, set by orgWidth..
            newGapImgObject.setAttribute("height", props.dragElements[i].height)
            newGapImgObject.setAttribute("inspera:orgWidth", props.dragElements[i].width)
            newGapImgObject.setAttribute("inspera:orgHeight", props.dragElements[i].height)
            newGapImgObject.setAttribute("inspera:logicalName", "asd")
            newGapImgObject.setAttribute("inspera:objectType", "content_image")
        
            newGapImg.appendChild(newGapImgObject)
            interaction.insertBefore(newGapImg, xmlDoc.getElementsByTagName("associableHotspot")[0])
            //interaction.appendChild(newGapImg)
        }
        //Create the drop areas
        for(let i = 0; i < props.dropAreas.length; i++) {
            let hotspot = xmlDoc.createElementNS(qtiNamespace, "associableHotspot")
            hotspot.setAttribute("identifier", "GAP"+String(i+2))
            hotspot.setAttribute("matchMax", "1")
            hotspot.setAttribute("shape", "rect")
            let coords = String(props.dropAreas[i].startX) + "," + String(props.dropAreas[i].startY) + 
            "," + String(props.dropAreas[i].destinationX+props.dropAreas[i].startX) + "," + String(props.dropAreas[i].destinationY+props.dropAreas[i].startY)
            hotspot.setAttribute("coords", coords)
            interaction.appendChild(hotspot)
        }

        //Create the correctResponse value elements and create mapping -> mapEntry elements
        let correctResponse = xmlDoc.getElementsByTagName("correctResponse")[0]
        let mapping = xmlDoc.getElementsByTagName("mapping")[0]
        for(let i = 0; i < props.dragElements.length; i++) {
            let pair = "A"+String(i+2)+" GAP"+String(i+2)
            let pairTextNode = xmlDoc.createTextNode(pair)
            let newValueElement = xmlDoc.createElementNS(qtiNamespace, "value")
            newValueElement.appendChild(pairTextNode)
            correctResponse.appendChild(newValueElement)

            let newMapEntry = xmlDoc.createElementNS(qtiNamespace, "mapEntry")
            newMapEntry.setAttribute("mapKey", pair)
            newMapEntry.setAttribute("mappedValue", "1")
            mapping.appendChild(newMapEntry)
        }


        //Set responseProcessing stuff
        

        itemDocString = new XMLSerializer().serializeToString(xmlDoc)
        console.log(xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0])
    }


    function generateQtiManifest(xmlString) {

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString,"text/xml");
        let resource = xmlDoc.getElementsByTagName("resource")[0]
        
        //Create the drag elements
        for(let i = 0; i < props.dragElements.length; i++) {
           let newFileTag = xmlDoc.createElement("file")
           console.log(newFileTag)
           newFileTag.setAttribute("href", "resources/" + props.dragElements[i].id)
           resource.appendChild(newFileTag)
        }
        //Create the drop areas
        for(let i = 0; i < props.dropAreas.length; i++) {
            
        }
        
        manifestDocString = new XMLSerializer().serializeToString(xmlDoc)
    }

    function getModifiedBackgroundImg() {

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

                //zip item and manifest
                var zip = new JSZip();
                zip.file("ID_99999999-item.xml", itemDocString)
                zip.file("imsmanifest.xml", manifestDocString)

                //zip other resources
                var img = zip.folder("resources")
                for(let i = 0; i < props.dragElements.length; i++) {
                    let base64Img = props.dragElements[i].src.replace(/^data:image\/(png|jpg);base64,/, "") //Data url to base64
                    img.file(props.dragElements[i].id, base64Img, {base64: true})
                }
                let base64bgImg = bg.replace(/^data:image\/(png|jpg);base64,/, "") //Data url to base64
                img.file(BGFILENAME, base64bgImg, {base64: true})

                let boxImgFile = await fetch(aboxImg)
                let boxImgUrl = await boxImgFile.url
                let base64BoxImg = boxImgUrl.replace(/^data:image\/(png|jpg);base64,/, "")
                img.file("ID_103871406.png", base64BoxImg, {base64: true})

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

        </div>
    )
}

export default ExportQTI