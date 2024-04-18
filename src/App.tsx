import './App.css';
import { useState } from 'react';
import { values } from './values';

var currentValues: string[] = values;
var totalValuesInRound: number = values.length;
var nextValues: string[] = [];
var unselectedValues: string[] = [];
var round: number = 1;
var replacementIdx = 0;

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
  const [canEdit, setCanEdit] = useState(true);
  const [changingValue, setChangingValue] = useState(false);

  if (dark) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#3C4353");
    document.body.style.backgroundColor = "#3C4353"
  } else {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#FFF4E9");
    document.body.style.backgroundColor = "#FFF4E9"
  }

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
  const handleEdit = () => {
    setCanEdit(!canEdit);

    if (dark) {
      let elems = document.getElementsByClassName("Dark-Edit-Button");
      for(let i=0; i < elems.length; i++) {
        if (canEdit) {
          elems[i].classList.add("Fade-In")
        } else {
          elems[i].classList.remove("Fade-In")
        }
      }
    } else {
      let elems = document.getElementsByClassName("Light-Edit-Button");
      for(let i=0; i < elems.length; i++) {
        if (canEdit) {
          elems[i].classList.add("Fade-In")
        } else {
          elems[i].classList.remove("Fade-In")
        }
      }
    }
  }

  const handleChangeValues = (idx: number) => {
    replacementIdx = idx;
    setChangingValue(!changingValue);
    setCanEdit(!canEdit);
  }

  const handleNewValue = (value: string) => {
    nextValues[replacementIdx] = value;
    replacementIdx = 0;
    setChangingValue(!changingValue);
  } 

  var percentageDone = 1 - (currentValues.length / totalValuesInRound);
  if (foundValues) {
    return (
      <>
        {
          !changingValue ?
          <>
          <div className={dark ? "Dark-Button" : "Light-Button"} style={{ left: "15px", top: "15px", position: "absolute"}} onClick={() => setDark(!dark)}>
            {dark ? "Light Mode" : "Dark Mode"}
          </div>
          <div className={dark ? "Dark-Button" : "Light-Button"} style={{ right: "15px", top: "15px", position: "absolute"}} onClick={handleEdit}>
            {canEdit ? "Edit" : "Save"}
          </div>
          <div className={dark ? "App-Dark" : "App"}>
            <div className="Values-Wrapper">
              <ol className="Values-List">
                {
                  nextValues.map((value, idx) => {
                    return (
                      <div className="List-Wrapper" key={value}>
                        <li className={dark ? "List-Dark" : "List"} key="value">{value}</li>
                        <div 
                          className={dark ? "Dark-Edit-Button" : "Light-Edit-Button"} 
                          style={{ marginLeft: "20px", fontSize: 18, cursor: canEdit ?  "auto" : "pointer", opacity: canEdit ? 0 : 1}}
                          onClick={() => handleChangeValues(idx)}
                          >change</div>
                      </div>
                    )
                  })
                }
              </ol>
            </div>
          </div>
          </>
          :
          <div style={{padding: "10px 0 10px 0", display: "flex", flexDirection: "column", alignItems: "center"}}>
            {
            values2.map((value) => {
              if (nextValues.includes(value)) return <></>
              return (
                <span key={value} className={dark ? "Value Dark" : "Value Light"} onClick={() => handleNewValue(value)}>{value}</span>
              )
            })
            }
          </div>
        }

      </>
    );
  }
  return (
    <>
      <div className={dark ? "Dark-Button" : "Light-Button"} style={{ left: "15px", top: "15px", position: "absolute"}} onClick={() => setDark(!dark)}>
        {dark ? "Light Mode" : "Dark Mode"}
      </div>
      <div className={dark ? "App-Dark" : "App"}>
        <div className="Progress-Wrapper">
          <div className="Progress-Container">
            {
              dark ?
                <>
                  <div className={round > 1 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 1 ? "100%" : "50%" }}>1</div>
                  <div className={round > 2 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 2 ? "100%" : "50%" }}>2</div>
                  <div className={round > 3 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 3 ? "100%" : "50%" }}>3</div>
                  <div className={round > 4 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 4 ? "100%" : "50%" }}>4</div>
                  <div className={round > 5 ? "Round-Complete" : "Round-Dark"} style={{ opacity: round >= 5 ? "100%" : "50%" }}>5</div>
                </>
                :
                <>
                  <div className={round > 1 ? "Round-Complete" : "Round"} style={{ opacity: round >= 1 ? "100%" : "50%" }}>1</div>
                  <div className={round > 2 ? "Round-Complete" : "Round"} style={{ opacity: round >= 2 ? "100%" : "50%" }}>2</div>
                  <div className={round > 3 ? "Round-Complete" : "Round"} style={{ opacity: round >= 3 ? "100%" : "50%" }}>3</div>
                  <div className={round > 4 ? "Round-Complete" : "Round"} style={{ opacity: round >= 4 ? "100%" : "50%" }}>4</div>
                  <div className={round > 5 ? "Round-Complete" : "Round"} style={{ opacity: round >= 5 ? "100%" : "50%" }}>5</div>
                </>
            }

          </div>
          <div className="Progress-Bar">
            <div className="Inner-Bar" style={{ width: `${percentageDone * 100}%` }}></div>
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
            <p style={dark ? { color: "var(--black)" } : { color: "var(--white)" }}>a</p>
        }
      </div>
    </>
  );
}

export default App;


const values2 = [
  'Acceptance',
  'Accomplishment',
  'Accountability',
  'Accuracy',
  'Achievement',
  'Adaptability',
  'Aesthetic',
  'Alertness',
  'Altruism',
  'Ambition',
  'Amusement',
  'Assertiveness',
  'Attentive',
  'Authenticity',
  'Awareness',
  'Balance',
  'Beauty',
  'Belonging',
  'Boldness',
  'Bravery',
  'Brilliance',
  'Calmness',
  'Candor',
  'Capable',
  'Careful',
  'Certainty',
  'Challenge',
  'Change',
  'Charity',
  'Cleanliness',
  'Clear',
  'Clever',
  'Comfort',
  'Commitment',
  'Common sense',
  'Communication',
  'Community',
  'Compassion',
  'Competence',
  'Concentration',
  'Confidence',
  'Connection',
  'Consciousness',
  'Consistency',
  'Contentment',
  'Contribution',
  'Control',
  'Conviction',
  'Cooperation',
  'Courage',
  'Courtesy',
  'Creation',
  'Creativity',
  'Credibility',
  'Curiosity',
  'Decisive',
  'Decisiveness',
  'Dedication',
  'Dependability',
  'Determination',
  'Development',
  'Devotion',
  'Dignity',
  'Diligence',
  'Discipline',
  'Discovery',
  'Diversity',
  'Drive',
  'Duty',
  'Effectiveness',
  'Efficiency',
  'Empathy',
  'Empower',
  'Endurance',
  'Energy',
  'Enjoyment',
  'Enthusiasm',
  'Equality',
  'Ethical',
  'Excellence',
  'Experience',
  'Exploration',
  'Expressive',
  'Fairness',
  'Family',
  'Famous',
  'Fearless',
  'Feelings',
  'Ferocious',
  'Fidelity',
  'Fitness',
  'Focus',
  'Foresight',
  'Fortitude',
  'Freedom',
  'Friendship',
  'Fun',
  'Generosity',
  'Genius',
  'Giving',
  'Goodness',
  'Grace',
  'Gratitude',
  'Greatness',
  'Growth',
  'Happiness',
  'Hard work',
  'Harmony',
  'Health',
  'Honesty',
  'Honor',
  'Hope',
  'Humanitarian',
  'Humility',
  'Humor',
  'Imagination',
  'Improvement',
  'Independence',
  'Individuality',
  'Influence',
  'Innovation',
  'Inquisitive',
  'Insightful',
  'Inspiring',
  'Integrity',
  'Intelligence',
  'Intensity',
  'Intentionality',
  'Intuitive',
  'Joy',
  'Justice',
  'Kindness',
  'Knowledge',
  'Lawful',
  'Leadership',
  'Learning',
  'Leisure',
  'Liberty',
  'Logic',
  'Love',
  'Loyalty',
  'Mastery',
  'Maturity',
  'Meaning',
  'Moderation',
  'Modesty',
  'Motivation',
  'Openness',
  'Optimism',
  'Order',
  'Organization',
  'Originality',
  'Passion',
  'Patience',
  'Peace',
  'Performance',
  'Persistence',
  'Persuasion',
  'Perfection',
  'Playfulness',
  'Pleasure',
  'Poise',
  'Potential',
  'Power',
  'Present',
  'Productivity',
  'Professionalism',
  'Progression',
  'Prosperity',
  'Purpose',
  'Quality',
  'Realistic',
  'Reason',
  'Recognition',
  'Recreation',
  'Reflective',
  'Reliability',
  'Respect',
  'Responsibility',
  'Restraint',
  'Results-oriented',
  'Reverence',
  'Rigor',
  'Risk',
  'Satisfaction',
  'Security',
  'Self-reliance',
  'Selfless',
  'Sensitivity',
  'Serenity',
  'Service',
  'Sharing',
  'Significance',
  'Silence',
  'Simplicity',
  'Sincerity',
  'Skill',
  'Skillfulness',
  'Smart',
  'Solitude',
  'Spirit',
  'Spirituality',
  'Spontaneous',
  'Stability',
  'Status',
  'Stewardship',
  'Strength',
  'Structure',
  'Success',
  'Support',
  'Surprise',
  'Sustainability',
  'Talent',
  'Teamwork',
  'Temperance',
  'Thankful',
  'Thorough',
  'Thoughtful',
  'Timeliness',
  'Tolerance',
  'Toughness',
  'Traditional',
  'Tranquility',
  'Transparency',
  'Trust',
  'Trustworthy',
  'Understanding',
  'Uniqueness',
  'Unity',
  'Valor',
  'Victory',
  'Vigor',
  'Vision',
  'Vitality',
  'Wealth',
  'Welcoming',
  'Winning',
  'Wittiness',
  'Wisdom',
  'Wonder'
]