import './App.css';

const values: Array<string> = ["left", "right"]

function App() {
  return (
    <div className="App">
      <div className="Cards-Container">
        {
          values.map((value) => {
            return(
              <Card name={value} />
            )
          })
        }
      </div>
    </div>
  );
}

function Card(props: { name: string }) {
  return (
    <div className="Card" onClick={() => console.log(`${props.name} pressed`)}>
      <p className="Card-Body">{props.name}</p>
    </div>
  )
}

export default App;
