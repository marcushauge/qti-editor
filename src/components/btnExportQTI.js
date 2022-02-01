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

        let newGapImg = xmlDoc.createElement("gapImg")
        let newGapImgObject = xmlDoc.createElement("object")
        newGapImg.appendChild(newGapImgObject)
        newGapImg.setAttribute("attr", "HEISANN")
        xmlDoc.getElementsByTagName("graphicGapMatchInteraction")[0].appendChild(newGapImg)

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
            <button className="sidebtn" onClick={async () => {
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