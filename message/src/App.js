
import React, {useState} from 'react';
import axios from 'axios';
import {BrowserRouter, Route, Routes} from 'react-router-dom';


import Main from './components/Main';
import NotFound from './components/NotFound';
import Login from './components/Login';
import Header from './components/Header';
import Room from './components/Room';
import Room_admin from './components/Room_admin';
import Super from './components/Super';
import Super_admin from './components/Super_admin';
import Super_room from './components/Super_room';
const App = () => {
//  let [room_code,setRoom] = useState({code:"hi"});
//  let [state, setStates] = useState({state:"logout"});
  return(
    <BrowserRouter>
      <div className="App">
        <Header  / >
        <Routes>
            <Route exact path="/" element={ <Login />}></Route>
            <Route exact path="/main" element={ <Main />}></Route>
            <Route exact path="/room" element={ <Room />}></Route>
            <Route exact path="/room_admin" element={ <Room_admin />}></Route>
            <Route exact path="/super_user" element={ <Super />}></Route>

            <Route exact path="/super_admin" element={ <Super_admin />}></Route>
            <Route exact path="/super_room" element={ <Super_room />}></Route>

            <Route exact path="*" element={<NotFound />}></Route>
        </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
