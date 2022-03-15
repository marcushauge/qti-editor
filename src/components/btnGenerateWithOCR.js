import { useState, useEffect } from 'react'
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';

function GenerateWithOCR(props) {

    const [someState, setSomeState] = useState(null)

    // useEffect(() => {
    //     console.log(someState)
    //     if(someState !== null) {
    //         props.testAddBbox(someState[0].bbox.x0, someState[0].bbox.y0, someState[0].bbox.x1, someState[0].bbox.y1)
    //     }
    //   }, [someState])
    

    async function generateText() {
        
        //Need to create a copy of the image from the props.bgImg URL as tesseract appears to delete or change it.
        let file = await fetch(props.bgImg).then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))

        Tesseract.recognize(
            file,
            'eng',
            { logger: m => console.log(m) }
          ).then(({ data: { words } }) => {
            console.log(words);
            //props.testAddBbox(words[0].bbox.x0, words[0].bbox.y0, words[0].bbox.x1, words[0].bbox.y1)
            //props.testAddBbox(words[1].bbox.x0, words[1].bbox.y0, words[1].bbox.x1, words[1].bbox.y1)
            words.forEach(word => {
                props.testAddBbox(word.bbox.x0, word.bbox.y0, word.bbox.x1, word.bbox.y1)
                console.log(word.bbox)
            })
          })

        // const worker = createWorker({
        //     logger: m => console.log(m)
        //   });
          
        //   (async () => {
        //     await worker.load();
        //     await worker.loadLanguage('eng');
        //     await worker.initialize('eng');
        //     const { data: { words } } = await worker.recognize(bg)
        //     // const result = await worker.recognize(bg)
        //     // console.log(result.data.hocr);
        //     // console.log(result.data.words);
        //     // console.log(result.data.words[0].bbox.x0)
        //     console.log(words)
        //     console.log(words[0].bbox.x0)
        //     props.testAddBbox(words[0].bbox.x0, words[0].bbox.y0, words[0].bbox.x1, words[0].bbox.y1)
        //     //setSomeState(words)
        //     console.log("BG after: ", bg)
        //     await worker.terminate();
        //   })();
    }

    return (
        <button className="sidebtn" onClick={() => {generateText()}}>Generate With OCR</button>
    )
}
export default GenerateWithOCR