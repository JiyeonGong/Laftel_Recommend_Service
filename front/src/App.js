import './App.css';
import axios from 'axios';
import {motion} from 'framer-motion';

function selectData(){
  axios.post('/testData',["가","나","다"])
    .then(function (res){
        console.log(res)
    });
}

function App() {
  return (
    <div className="App">
      <header>
        <div>
          <button onClick={() =>selectData()}>조회</button>
        </div>
      </header>
      <motion.button className="button1"
              whileHover={{ scale: 3 }}
              whileTap={{ scale: 0.9 }}
      />
    </div>
  );
}

export default App;
