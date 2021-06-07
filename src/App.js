import React,{useState,useEffect} from 'react';
import {BrowserRouter as Router, Route, Redirect,Switch} from 'react-router-dom'; 
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';

const ProtectedRoute = ({component: Component, ...restProps})=>{
  return(
    <Route
       {...restProps}
       render = {
         (props)=>{
            if(localStorage.getItem('Authorisation')=== undefined || localStorage.getItem('Authorisation')=== null){
              return <Redirect to={`/login`}/>
            }                  
            else{
              return(
              <>
                  <Component {...props} />
              </>
              )
            }
         }
       }
    />
  )      
}

function App() {
  return (
    <Router>
        <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <ProtectedRoute exact path="/dashboard" component={Dashboard}/>     
        </Switch>     
    </Router>
  );
}

export default App;
