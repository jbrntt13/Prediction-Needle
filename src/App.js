import React  from 'react';
import SimplePollDisplay from './simplePollDisplay';
import ReactSpeedometer from "react-d3-speedometer";
//cloudflared tunnel --url localhost:3000
function App() {
  return (
      <div>
        <SimplePollDisplay />
      </div>
  );
}


export default App;