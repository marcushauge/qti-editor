import item from "../qti_template/blankItem.xml"
import manifest from "../qti_template/imsmanifest.xml"

function ExportQTI(props) {

    function generateQtiItem(xmlString) {
        // //create document and root element with its attributes
        // var doc = document.implementation.createDocument("http://www.imsglobal.org/xsd/imsqti_v2p2", "assessmentItem", null)
        // const pi = doc.createProcessingInstruction('xml', 'version="1.0" encoding="UTF-8"');
        // doc.insertBefore(pi, doc.firstChild);
        // //doc.documentElement.setAttribute("xsi", "http://www.w3.org/2001/XMLSchema-instance")
        // //doc.documentElement.setAttributeNS("http://www.imsglobal.org/xsd/imsqti_v2p2", "xsi", "http://www.w3.org/2001/XMLSchema-instance")
        // doc.documentElement.setAttribute("xmlns:inspera", "http://www.inspera.no/qti")

        // var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body')
        // body.setAttribute('id', 'abc')
        // doc.documentElement.appendChild(body)

        // console.log(new XMLSerializer().serializeToString(doc));




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
            //object
            let newGapImgObject = xmlDoc.createElement("object")
            let res = "resources/ID_103871406.png"
            newGapImgObject.setAttribute("data", res)
            newGapImgObject.setAttribute("type", "image/png")
            newGapImgObject.setAttribute("objectLabel", "")
            newGapImgObject.setAttribute("widt", props.dragElements[i].width) //These two are less than the original size, set by orgWidth..
            newGapImgObject.setAttribute("height", props.dragElements[i].height)
            newGapImgObject.setAttribute("inspera:orgWidth", props.dragElements[i].width)
            newGapImgObject.setAttribute("inspera:orgHeight", props.dragElements[i].height)
            newGapImgObject.setAttribute("inspera:logicalName", "HEHE")
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



        console.log("------------NEW-------------")
        console.log(xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0])
        console.log("------------STATE-------------")
        console.log(props.dragElements)
        console.log(props.dropAreas)
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
        </div>
    )
}

export default ExportQTI