import React,{useState,useEffect,useRef} from 'react';
import Navbar1 from './Navbar1';
import imgRegister from '../images/Register.jpeg';
import "./Register.css";

export default function Register(){
   const [loading,setLoading] = useState(0);
   const nameRef = useRef();
   const mobileRef = useRef();
   const emailRef = useRef();
   const passRef = useRef();

   const register= async(e)=>{
       e.preventDefault();
       setLoading(1);
       let name = nameRef.current.value; 
       let mobile = mobileRef.current.value;
       let email = emailRef.current.value;
       let pass = passRef.current.value;
       if(name.length === 0){
        alert("Please enter your name correctly.")  
        setLoading(0);
       }
       else if(mobile.length !==10){
        alert("Please enter verified mobile no.")
        setLoading(0);
       } 
       else if(email.length ===0){
        alert("Please enter valid email Id.")   
        setLoading(0);
       }
       else if(pass.length < 4){
        alert("Please enter valid password")   
        setLoading(0);
       }
       else{
        let url = "https://boltf-backend.herokuapp.com/register";
        let postData={
            userName:name,
            mobileNo:mobile,
            email:email,
            password:pass
        }
        console.log(postData);
        let resp =  await fetch(url,{
           method:"POST",
           mode:"cors",
           headers: {
            'Content-Type': 'application/json'
           },
           referrerPolicy: 'no-referrer',
           body: JSON.stringify(postData) 
        }) 
        if(resp.status === 200){
          alert("User Registration Successfull!!!. Please login to continue.");            
        }
        else if(resp.status === 400){
            alert("User already present.Please login."); 
        }
        setLoading(0);         
       }
   }

    return(
        <div>
            <Navbar1/>
            <div className="container">
                 <div className="row" style={{marginTop:"10%"}}>
                      <div className="col-8  d-flex justify-content-center">
                           <img className="img1" 
                            src={imgRegister}/>
                      </div>   
                      <div className="col-4 ">
                          <p className="text-center head1">Register</p>
                          <div className="form-group"> 
                              <input ref={nameRef} type="text" className="form-control mt-3 inp1" placeholder="Enter Your Name"/>
                              <input ref={mobileRef} type="text" className="form-control mt-4 inp1" placeholder="Enter Mobile No."/>
                              <input ref={emailRef} type="email" className="form-control mt-4 inp1" placeholder="Email ID"/>
                              <input ref={passRef} type="password" className="form-control mt-4 inp1" placeholder="Password"/>
                              <button className="btn btn-primary form-control mt-4" onClick={register}>Register</button>                                                       
                              <p className="text-center mt-4 bottom1">Already Registered!!<a href="/login"> Login Here</a></p>          
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