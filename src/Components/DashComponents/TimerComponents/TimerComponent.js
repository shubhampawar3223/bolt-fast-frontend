import React,{useState,useEffect,useRef} from 'react';
import './TimerComponent.css';
import TimeCounter from './TimeCounter';
import ConfigureSession from './ConfigureSession';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TimeKeeper from 'react-timekeeper';
import axios from 'axios';

export default function TimerComponent(props){
    const {
        buttonLabel,
        className
      } = props;
        const [modal, setModal] = useState(false);
        const toggle = () => setModal(!modal);
    const [startTime,setStartTime] = useState(null);
    const [expectedEndTime,setExpectedEndTime] =useState(null);
    const [fastGoal,setFastGoal] =useState(null);
    const [tempStart,setTempStart] = useState(null);
    const [tempEnd,setTempEnd] = useState(null);
    const [cChange,setCChange] = useState(null);
    const [gChange,setGChange] = useState(null);
    const [loading,setLoading] = useState(0);
    const [time, setTime] = useState('00:00')
    const goalRef = useRef();
         
     
    useEffect(async()=>{
        setLoading(1);
        // props.setItemsLoading(1);
       let url="https://boltf-backend.herokuapp.com/showdata/?email="+localStorage.getItem('email');
       let config={
        headers: {
            Authorisation:localStorage.getItem("Authorisation")
          }
        }

       let resp= await axios.get(url,config)
       
       if(resp.status === 200){
        if(resp.data.data.sessions.length <=7)
        props.setSessions(()=>[...resp.data.data.sessions])
        else
        {
          let temp1 = resp.data.data.sessions.splice(-7); 
          props.setSessions(()=>[...temp1]) 
        } 
           let n= resp.data.data.sessions.length;
           if(resp.data.data.isActiveSession===true){
            setFastGoal(resp.data.data.sessions[n-1].goal);
            setExpectedEndTime(resp.data.data.sessions[n-1].expectedEndTime);
            setStartTime(Date.parse(resp.data.data.sessions[n-1].startTime));
            setTempStart(()=>[...resp.data.data.sessions[n-1].tempStart]);
            setTempEnd(()=>[...resp.data.data.sessions[n-1].tempEnd]);
            setTime(resp.data.data.sessions[n-1].time);
            // props.setCurrentStats(resp.data.data.stats); 

            props.setCurrentFast(1);
          }         
       }
        // props.setItemsLoading(0);
        setLoading(0);
    },[])

    const saveChanges=async(e)=>{
 
        e.preventDefault();
      let curr = new Date();
        let year = curr.getFullYear();
        let month = curr.getMonth();
        let day = curr.getDate();
        let temp = time.split(":");  
 
        let _start = new Date(year, month, day,temp[0],temp[1]);
        setTempStart(()=>[day,month,year,temp[0],temp[1]]);
        let temp2 = goalRef.current.value.split(":");
        let n1 = +_start;
        let endl1 =  n1 +((+temp2[0])* 3600000);  
        
        let _end = new Date(endl1) 
        setTempEnd(()=>[...getDateFormat(_end)]);   
        setStartTime(_start);
        setFastGoal(goalRef.current.value);
        setExpectedEndTime(_end);  
        let postData={
          email:localStorage.getItem("email"),  
          updatedSession:{
             goal:goalRef.current.value,
             startTime:_start,
             expectedEndTime:_end,
             time:props.time,
             tempStart:[day,month,year,temp[0],temp[1]],
             tempEnd:[...getDateFormat(_end)],
             totalHours:null
            }
        }
        let url="https://boltf-backend.herokuapp.com/changeValues";
        let config={
          headers: {
              Authorisation:localStorage.getItem("Authorisation")
            }
      } 
        await axios.post(url,postData,config) 
        setLoading(false);
        toggle();
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
        <div>
           
           {
            loading ?
            <div className="d-flex justify-content-center mt-3">
              <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
              <span class="sr-only">Loading...</span>  
            </div>
            :             
        <div className="timerc">
             {
                 props.currentFast===0?
                 <div>
                     <ConfigureSession
                         setStartTime={setStartTime}
                         fastGoal={fastGoal}
                         setFastGoal= {setFastGoal}
                         setExpectedEndTime = {setExpectedEndTime}
                         setCurrentFast={props.setCurrentFast}
                         setTempStart ={setTempStart}
                         setTempEnd ={setTempEnd}
                         time={time}
                         setTime = {setTime}
                         sessions = {props.sessions}
                         setSessions = {props.setSessions}
                     /> 
                 </div>    
                 :
                 <div>
                     <p className="text-center f4" style={{position:"relative",top:"30px"}}>{fastGoal} <span className="edit"><i class="fa fa-pencil-square-o" onClick={toggle} aria-hidden="true"></i> </span></p> 
                    <div style={{position:"relative",top:"-80px"}}>
                     <TimeCounter
                        startTime={startTime}
                        setStartTime = {setStartTime}
                        setFastGoal={setFastGoal}
                        expectedEndTime={expectedEndTime}
                        setExpectedEndTime = {setExpectedEndTime} 
                        fastGoal={fastGoal}
                        setFastGoal={setFastGoal}
                        setCurrentFast={props.setCurrentFast}
                        tempStart= {tempStart}
                        setTempStart={setTempStart}
                        tempEnd ={tempEnd}
                        time={time}
                        setTempEnd ={setTempEnd}
                        setSessions = {props.setSessions}
                        sessions = {props.sessions}
                        setCurrentStats = {props.setCurrentStats}
                        currentStats={props.currentStats}
                    />
                    </div>
                    <div style={{position:"relative",top:"-100px"}}> 
                    <div style={{marginTop:"10%"}}>   
                    <div className="date-heading d-flex justify-content-evenly ">
                         <span className="f4">STARTED</span>
                         <span className="f4">FAST ENDING</span>
                    </div>
                    <div className="d-flex justify-content-evenly ">
                         <span className="f4">{tempStart[0]}/{tempStart[1]+1}/{tempStart[2]} {tempStart[3]}:{tempStart[4]} <i class="fa fa-pencil-square-o edit1" onClick={toggle} aria-hidden="true"></i> </span>
                         <span className="f4">{tempEnd[0]}/{tempEnd[1]+1}/{tempEnd[2]} {tempEnd[3]}:{tempEnd[4]} </span>
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

                    <div>  
        <Modal isOpen={modal} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle}>Edit Session</ModalHeader>
          <ModalBody>
        <div> 
       <label>Select Fasting Goal:</label> 
      <select  ref={goalRef} name="fasting_goals"  style={{marginLeft:"3%"}}>
      <option value="16:8">16:8TRF</option>
      <option value="18:9">18:9TRF</option>
      <option value="20:4">20:4TRF</option>
      </select>
       </div>
        <div className="mt-5">
      <p>Select Start Time Of Fasting:</p>   
      <div className="d-flex justify-content-center">
      <TimeKeeper
         time={""+tempStart[tempStart.length-2] +":"+tempStart[tempStart.length-1]}              
        onChange={(newTime)=>{
            newTime = newTime.formatted24;
            setTime(newTime);
        } }
       />  
       </div>
        </div>       
       </ModalBody>
        <ModalFooter>
         <Button color="primary" onClick={saveChanges}>Confirm</Button>{' '}
         <Button color="secondary" onClick={toggle}>Cancel</Button>
         </ModalFooter>
         </Modal>
         </div>

                   </div> 
                 </div>                                 
                    
             }                
        </div>
         }
        </div>
    )
}
