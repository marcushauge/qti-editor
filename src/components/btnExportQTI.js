import item from "../qti_template/blankItem.xml"
import manifest from "../qti_template/imsmanifest.xml"
import JSZip from "jszip";

function ExportQTI(props) {
    var itemDocString = null

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
        console.log(itemDocString)

        console.log("------------NEW-------------")
        console.log(xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0])
    }


    function generateQtiManifest() {

    }


    return (
        <div>
            <button className="sidebtn" id="exportbtn" onClick={async () => {
                //Item file
                let i = await fetch(item)
                let it = await i.text()
                generateQtiItem(it)
                
                //manifest file
                let m = await fetch(manifest)
                let mt = await m.text()
                generateQtiManifest(mt)
            }}>Export QTI</button>

            <button className="sidebtn" onClick={async () => { //Print original file
                let i = await fetch(item)
                let it = await i.text()
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(it,"text/xml");
                console.log("------------ORIGINAL-------------")
                console.log(xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0])
            }}>log original qti</button>

            <button className="sidebtn" onClick={async () => {
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
                zip.file("Hello.xml", itemDocString);

                //zip resources
                var img = zip.folder("resources")
                for(let i = 0; i < props.dragElements.length; i++) {
                    let base64Img = props.dragElements[i].src.replace(/^data:image\/(png|jpg);base64,/, "");
                    img.file(props.dragElements[i].id, base64Img, {base64: true});
                }

                //Download
                zip.generateAsync({type:"blob"}).then(function(content) {
                    console.log(content)
                    let link = document.createElement("a");
                    link.download = "QTI"
                    link.href = URL.createObjectURL(content);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    // in case the Blob uses a lot of memory
                    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
                });

            }}>Download</button>
        </div>
    )
}

export default ExportQTI