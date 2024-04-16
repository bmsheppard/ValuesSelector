import './App.css';
import { useState } from 'react';
import { values } from './values';

var currentValues: string[] = values;
var totalValuesInRound: number = values.length;
var nextValues: string[] = [];
var unselectedValues: string[] = [];
var round: number = 1;

const retrieveValues = () => {
  for (let i = currentValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentValues[i], currentValues[j]] = [currentValues[j], currentValues[i]];
  }
  if (currentValues.length > 1) {
    let ret: string[] = [currentValues[0], currentValues[1]];
    currentValues = currentValues.splice(2);
    return ret;
  }
  // special case when there are 15 options and we need 7 left for final values
  else {
    let ret: string[] = [currentValues[0], nextValues[0]];
    currentValues = currentValues.splice(1);
    nextValues = nextValues.splice(1);
    return ret;
  }
}

let initialValues = retrieveValues()
function App() {
  const [currentChoices, setCurrentChoices] = useState(initialValues);
  const [foundValues, setFoundValues] = useState(false);
  const [canUndo, setCanUndo] = useState(true);
  const [dark, setDark] = useState(false);
  if (dark) { document.body.style.backgroundColor = "var(--black)" }

  const refreshCurrentChoices = () => {
    currentValues.push(currentChoices[0], currentChoices[1]);
    let nextSelection = retrieveValues();
    setCurrentChoices(nextSelection);
    setCanUndo(true);
    return
  }

  const undoSelection = () => {
    if (nextValues.length === 0) {
      setCanUndo(false);
      return
    }
    let prevSelected: string = nextValues.pop() as string
    let prevUnselected: string = unselectedValues.pop() as string
    currentValues.push(currentChoices[0], currentChoices[1], prevSelected, prevUnselected);
    let nextSelection = retrieveValues();
    setCurrentChoices(nextSelection);
    return
  }

  const updateSelections = (selectedValue: string) => {
    nextValues.push(selectedValue);
    
    if (selectedValue === currentChoices[0]) {
      unselectedValues.push(currentChoices[1])
    } else {
      unselectedValues.push(currentChoices[0])
    }
    if (currentValues.length === 0) {
      if (nextValues.length === 7) {
        setFoundValues(true);
        return
      } else {
        currentValues = nextValues;
        round += 1;
        totalValuesInRound = currentValues.length;
        nextValues = [];
        unselectedValues = [];
      }
    }
    let nextSelection = retrieveValues(); 
    setCurrentChoices(nextSelection);
    setCanUndo(true);
    return
  }
  var percentageDone = 1 - (currentValues.length / totalValuesInRound);
  if (foundValues) {
    return (
      <div className={dark ? "App-Dark" : "App"}>
        <div className={dark ? "Dark-Button" : "Light-Button"} onClick={() => setDark(!dark)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </div>
        <div className="Values-Wrapper">
          <ol className="Values-List">
            {
              nextValues.map((value) => {
                return (
                  <li className={dark ? "List-Dark" : "List"} key="value">{value}</li>
                )
              })
            }
          </ol>
        </div>
      </div>
    );
  }
  return (
    <div className={dark ? "App-Dark" : "App"}>
      <div className={dark ? "Dark-Button" : "Light-Button"} onClick={() => setDark(!dark)}>
        {dark ? "Light Mode" : "Dark Mode"}
      </div>
      <div className="Progress-Wrapper">
        <div className="Progress-Container">
          {
            dark ?
            <>
            <div className={round > 1 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 1 ? "100%" : "50%"}}>1</div>
            <div className={round > 2 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 2 ? "100%" : "50%"}}>2</div>
            <div className={round > 3 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 3 ? "100%" : "50%"}}>3</div>
            <div className={round > 4 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 4 ? "100%" : "50%"}}>4</div>
            <div className={round > 5 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 5 ? "100%" : "50%"}}>5</div>
            </>
            :
            <>
            <div className={round > 1 ? "Round-Complete" : "Round"} style={{ opacity: round >= 1 ? "100%" : "50%"}}>1</div>
            <div className={round > 2 ? "Round-Complete" : "Round"} style={{ opacity: round >= 2 ? "100%" : "50%"}}>2</div>
            <div className={round > 3 ? "Round-Complete" : "Round"} style={{ opacity: round >= 3 ? "100%" : "50%"}}>3</div>
            <div className={round > 4 ? "Round-Complete" : "Round"} style={{ opacity: round >= 4 ? "100%" : "50%"}}>4</div>
            <div className={round > 5 ? "Round-Complete" : "Round"} style={{ opacity: round >= 5 ? "100%" : "50%"}}>5</div>
            </>
          }

        </div>
        <div className="Progress-Bar">
          <div className="Inner-Bar" style={{width: `${percentageDone*100}%`}}></div>
        </div>
      </div>
      <div className="Cards-Container">
        {
          currentChoices.map((value: any) => {
            return (
              <div
                className={dark ? "Card-Dark" : "Card"}
                onClick={() => updateSelections(value)}
                key={value}
              >
                <p className="Card-Body">{value}</p>
              </div>
            )
          })
        }
      </div>
      <div className="Actions-Container">
        <div className={dark ? "Undo-Button-Dark" : "Undo-Button"} onClick={undoSelection}>Undo</div>
        <div className="Refresh-Button" onClick={refreshCurrentChoices}>Refresh</div>
      </div>
      {
        !canUndo ?
        <p className={dark ? "Help-Text-Dark" : "Help-Text"}>Cannot undo anymore</p> :
        <p style={dark ? {color: "var(--black)"} : {color: "var(--white)"}}>a</p>
      }
    </div>
  );
}

export default App;
