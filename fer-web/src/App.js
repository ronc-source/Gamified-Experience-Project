import Navbar from './Navbar';
import Home from './Home';
import Service from './Service';
import History from './History';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';



function App() {
  return (
    <Router>
      <div className = "App">
        <Navbar />
        
        <div className="content">
          <Switch>
            <Route exact path = "/" component = {Home}/> 

            <Route exact path = "/home" component = {Home}/>

            <Route exact path = "/service" component = {Service}/>

            <Route exact path = "/history" component = {History}/>

          </Switch>
        </div>

      </div>

    </Router>
  );
}

export default App;
