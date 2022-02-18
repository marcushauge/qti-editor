function SetAnswer(props) {
    return (
        <div className="SetAnswerArea">
            <h4>Set drop area answer</h4>
            <select name="Drag element" disabled={props.selectedDropArea === 0} onChange={(e) => {
                //Handle existing answer pair
                if (props.answerPairs.find(pair => pair.dropId === props.selectedDropArea)) {
                    props.setAnswerPair(parseInt(e.target.value), props.selectedDropArea) //TODO: handle empty? for setting the GAP to have no answer?
                }
                else { //Handle when drop area does not already have an answer pair
                    props.addAnswerPair(parseInt(e.target.value), props.selectedDropArea)
                }
            }}>
                {!Boolean(props.answerPairs.find(pair => pair.dropId === props.selectedDropArea)) ? <option>empty</option> : null}
                {props.dragElements.map((dragElement) => <option key={dragElement.id} value={dragElement.id}
                    selected={Boolean(props.answerPairs.find(pair => pair.dragId === dragElement.id && pair.dropId === props.selectedDropArea))}
                >{"A" + dragElement.id}</option>)}
            </select>
        </div>
    )
}

export default SetAnswer