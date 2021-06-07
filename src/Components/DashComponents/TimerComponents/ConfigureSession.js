import React,{useRef,useState} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TimeKeeper from 'react-timekeeper';
import "./TimeCounter.css";
import axios from 'axios';

export default function ConfigureSession(props){
    const {
        buttonLabel,
        className
      } = props;
    
    const goalRef = useRef();  
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [start,setStart] = useState(null)
    const [loading,setLoading] = useState(0);
    const setTimes =(_time)=>{
      props.setTime(_time.formatted24)
      // setStart(time.formatted24)
    }
    
    const saveSession =async(e)=>{
        e.preventDefault();
        toggle();
        let curr = new Date();
        let year = curr.getFullYear();
        let month = curr.getMonth();
        let day = curr.getDate();
        let temp = props.time.split(":");  

        let _start = new Date(year, month, day,temp[0],temp[1]);
        if(temp[0].length===1){
          temp[0] = "0"+temp[0];  
        }
        if(temp[1].length===1){
          temp[1] = "0"+temp[1];  
        }
        props.setTempStart(()=>[day,month,year,temp[0],temp[1]]);
        let temp2 = goalRef.current.value.split(":");
        let n1 = +_start;
        let endl1 =  n1 +((+temp2[0])* 3600000);  
        if(endl1< +new Date()){
           alert("Invalid Session.Please try for another time.") 
        }
        else{
    
        let _end = new Date(endl1) 
        props.setTempEnd(()=> [...getDateFormat(_end)]);   
    
        props.setStartTime(_start);
        props.setFastGoal(goalRef.current.value);
        props.setExpectedEndTime(_end);  
        props.setCurrentFast(1);
        let url="https://boltf-backend.herokuapp.com/createSession";
        let postData={
          email:localStorage.getItem("email"),  
          session:{
             goal:goalRef.current.value,
             startTime:_start,
             expectedEndTime:_end,
             time:props.time,
             tempStart:[day,month,year,temp[0],temp[1]],
             tempEnd:[...getDateFormat(_end)],
             totalHours:null
            }
        }
        if(props.sessions.length===7){
          let temp1 = [...props.sessions]
          temp1.shift();
        props.setSessions(()=>[...temp1,postData.session]);
        }
        else{
          props.setSessions(()=>[...props.sessions,postData.session]);
        }
        let config={
          headers: {
              Authorisation:localStorage.getItem("Authorisation")
            }
      } 
        await axios.post(url,postData,config) 
        setLoading(false);
        toggle();
        }
    }
    
    const getDateFormat=(t)=>{
      let _date = t.getDate();
      let _month = t.getMonth();
      let _year = t.getFullYear();
      let _hours = t.getHours();
      if(_hours<9) 
      _hours="0"+_hours
      let _min = t.getMinutes();
      if(_min<9) 
      _min="0"+_min
      return [_date,_month,_year,_hours,_min] ;                
    }


   return(
     <div  className="block "> 
      <div className="d-flex justify-content-center">          
    <button   onClick={toggle} className=" btn btn-info btn-lg " style={{marginTop:"40%"}}>
    Start A New Session
    </button> 
     </div>
<Modal isOpen={modal} toggle={toggle} className={className}>
<ModalHeader toggle={toggle}>Session Configuration</ModalHeader>
<ModalBody>
<div>
<label>Select Fasting Goal:</label> 
<select  ref={goalRef} name="fasting_goals" style={{marginLeft:"3%"}}>
  <option value="16:8">16:8TRF</option>
  <option value="18:9">18:9TRF</option>
  <option value="20:4">20:4TRF</option>
</select>
</div>
 <div className="mt-5">
  <p>Select Start Time Of Fasting:</p>   
  <div className="d-flex justify-content-center">
   <TimeKeeper
      time={props.time}              
      onChange={(newTime)=>setTimes(newTime) }
    />  
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
</ModalBody>
<ModalFooter>
<Button color="primary" onClick={saveSession}>Start</Button>{' '}
<Button color="secondary" onClick={toggle}>Cancel</Button>
</ModalFooter>
</Modal>
   </div>
   )
}