import React,{useState,useEffect,useRef} from 'react';
import Navbar1 from './Navbar1';
import {useHistory} from 'react-router-dom';
import imgLogin from '../images/Login.jpeg'
import './Register.css';


export default function Login(){
    const [loading,setLoading] = useState(0);
    const emailRef = useRef();
    const passRef = useRef();
    const history = useHistory();

    const login = async(e) =>{
      e.preventDefault();
      setLoading(1);
      let email = emailRef.current.value;
      let pass = passRef.current.value; 
      if(email.length ===0){
        alert("Please enter valid email Id.")
        setLoading(0); 
      }       
      else if(pass.length <4){
        alert("Please enter valid password.")
        setLoading(0);
      }
      else{
         let url = "https://boltf-backend.herokuapp.com/login";
         let postData={
             email:email,
             password:pass
         }
         let resp = await fetch(url,{
             method:"POST",
             mode:"cors",
             headers: {
                'Content-Type': 'application/json'
               },
               referrerPolicy: 'no-referrer',
               body: JSON.stringify(postData)  
         })
         if(resp.status === 200){
           let response = await resp.json();
           localStorage.setItem('Authorisation',response.token);
           localStorage.setItem('email',email);
           history.push("/dashboard");
         }
         else if(resp.status === 400){
           alert("Incorrect password.Please try again.");   
         }
         else if(resp.status === 404){
            alert("User doesn't exist. Register first!!");
        }
      }
    }

    return(
        <div>
            <Navbar1/>
            <div className="container">
                 <div className="row" style={{marginTop:"10%"}}>
                      <div className="col-8  d-flex justify-content-center">
                           <img className="img2" src={imgLogin}/>
                      </div>   
                      <div className="col-4 ">
                          <p className="text-center head1">Login</p>
                          <div className="form-group"> 
                              <input ref={emailRef} type="email" className="form-control mt-4 inp1" placeholder="Email ID"/>
                              <input ref={passRef} type="password" className="form-control mt-4 inp1" placeholder="Password"/>
                              <button className="btn btn-primary form-control mt-4" onClick={login}>Login</button>                                                       <p className="text-center mt-4 bottom1">New user!!<a href="/register">Register Here</a></p>          
                          </div>
                      </div>
                 </div>

                 {
             loading ?
             <div className="d-flex justify-content-center mt-3">
               <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
               <span class="sr-only">Loading...</span>  
             </div>
             :null      
           }
            </div>
        </div>
    )
}