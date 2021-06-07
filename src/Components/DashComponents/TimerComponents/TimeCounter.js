import React,{useState,useEffect,useRef} from 'react';
import "./TimeCounter.css";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TimeKeeper from 'react-timekeeper';
import axios from 'axios';
import ReviewsBar from './ReviewsBar'; 

export default function TimeCounter(props){
  const {
    buttonLabel,
    className
  } = props;
    
    const [sc,setSc] = useState(0);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [hour,setHour] = useState(0);
    const [min,setMin] = useState(0);
    const [sec,setSec] = useState(0);
    const [end,setEnd] = useState(0);
    // const [tempStart,setTempStart] = useState(0);
    // const [tempEnd,setTempEnd] = useState(0)
    const [loading,setLoading] = useState(0);
    const bt1 = useRef();
    const bt2 = useRef();
    const startEditRef = useRef();    
    const endEditRef = useRef();
    useEffect(()=>{

        let interval = setInterval(()=>{
              if(+new Date()<= +new Date(props.expectedEndTime)){    
                let [_hour,_min,_sec] = getDiference();
                   setHour(_hour);
                   setMin(_min);
                   setSec(_sec);           
                                 
                   let temp =Math.floor(((+new Date()-props.startTime) / ((+new Date(props.expectedEndTime)-props.startTime) ) ) *100);
                   setSc(temp);   
              }   
              else{
                     forceEnd();
                return () =>clearInterval(interval);               
                
              }
        },1000)  
    },[])

    const getDiference=()=>{
      let now = new Date();
      let diff = +now - +props.startTime;
      let _sec,_min,_hour;
      if(diff <=0){
         _sec =0;
         _min =0;
         _hour=0;            
      }
      else{
         _hour = Math.floor((diff / (1000 * 60 * 60)) % 24);
         _min=Math.floor((diff / 1000 / 60) % 60);
         _sec=Math.floor((diff / 1000) % 60)          
      }
      
      return [_hour,_min,_sec];
    
    }
    
    const forceEnd=()=>{
       setEnd(1);
       props.setTempEnd(()=>[...getDateFormat(new Date())]);
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

    const startEdit=(e)=>{
      e.preventDefault();
      bt1.current.style.display= "hidden";
      startEditRef.current.style.display = "block";
    }

    const endEdit=(e)=>{
      e.preventDefault();
      bt2.current.style.display= "hidden";
      endEditRef.current.style.display = "block"; 
    }
    
    const saveSession =async (e)=>{
      e.preventDefault();
      setLoading(1);
      let _ftime;
      {
        if(+props.tempEnd[3]>+props.tempStart[3])
         _ftime = +props.tempEnd[3] - +props.tempStart[3]
        else
        _ftime = (+props.tempEnd[3] - +props.tempStart[3])

    } 
      let temp =  props.sessions
      temp[temp.length-1].totalHours = _ftime;
      props.setSessions(()=>[...temp]);

      let stats = updateStats(_ftime); 
      props.setCurrentStats(stats);
      let url="https://boltf-backend.herokuapp.com/sessionComplete";
      let postData={
        email:localStorage.getItem("email"),  
        finalSession:{
           goal:props.fastGoal,
           startTime:props.startTime,
           expectedEndTime:props.expectedEndTime,
           time:props.time,
           tempStart:props.tempStart,
           tempEnd:props.tempEnd,
           totalHours:_ftime
          },
        stats:stats          
      }
      let config={
        headers: {
            Authorisation:localStorage.getItem("Authorisation")
          }
    } 
      await axios.post(url,postData,config) 
      setLoading(0);     
      props.setCurrentFast(0);
      toggle();
    }
    
    const updateStats=(eTime)=>{
  
      let l = props.sessions.length;
      var _hours=0; 
      var _streak;
      var _longestStreak = props.currentStats.longestStreak;
      var _longestFast = props.currentStats.longestFast;
      for(let i=0;i<l;i++){
         _hours = _hours + +props.sessions[i].totalHours;      
       }
       
       var _avg = ((_hours)/l).toFixed(2);

       
       if(props.sessions.length ===0 || props.sessions.length ===1){
        _streak =1;
        _longestStreak=1
       }
       else{
       if(
       +new Date(props.tempStart[2], props.tempStart[1], props.tempStart[0],props.tempStart[3],props.tempStart[4])-
       +new Date(props.sessions[l-2].tempEnd[2], props.sessions[l-2].tempEnd[1], props.sessions[l-2].tempEnd[0],props.sessions[l-2].tempEnd[3],props.sessions[l-2].tempEnd[4])
        <= 86400000 
       ){
         _streak= +props.currentStats.streak+1
         if(+props.currentStats.longestStreak < +_streak)
         _longestStreak= _streak;
       }
       else{
         
          if(+props.currentStats.longestStreak < +props.currentStats.streak)
          _longestStreak= +props.currentStats.streak
           _streak = 0;
       }
      }

       if(+eTime > +props.currentStats.longestFast)
           _longestFast = +eTime;


       return {
         totalSessions:l,
         avg:_avg,
         longestFast: _longestFast,
         longestStreak:_longestStreak, 
         streak:_streak
       }
    }


    return(
        <div className="main modalButton ">
         {
          end===0 ?
          <>
          <ReviewsBar score={sc} />
          <div style={{position: 'absolute',top:"100px"}}>           
          <p className="timer text-center mt-3">
        {hour<=9? "0"+hour: hour}:{min<=9? "0"+min: min}:{sec<=9? "0"+sec: sec}
        </p>
          <div className="d-flex justify-content-center">
           <button className="btn btn-warning btn-sm" onClick={forceEnd}>End</button>
           </div>
           </div>   
         </> 
          : 
          <>
           <p>Done</p>
           <Modal isOpen={modal} toggle={toggle} className={className}>
         <ModalHeader toggle={toggle}>Session Report</ModalHeader>
         <ModalBody>
         <div>

           <p><span className="rTopic">Fasting Goal:</span> {props.fastGoal}</p> 
           <div className="d-flex ">
             <div>
               
               <p> <span className="rTopic">Start Time:{props.tempStart[0]}/{props.tempStart[1]+1}/{props.tempStart[2]} {props.tempStart[3]}:{props.tempStart[4]} </span></p>
                 <button ref={bt1} onClick={startEdit}>Edit</button>
                
                 <div ref={startEditRef} style={{display:"none"}}>
                   
                 <TimeKeeper 
                 time={""+props.tempStart[props.tempStart.length-2] +":"+props.tempStart[props.tempStart.length-1]}              
                  onChange={(newTime)=>{
                    newTime = newTime.formatted24;
                    let _time = newTime.split(":");
                    let t1 = props.tempStart;
                    t1[t1.length-2] = _time[0];
                    t1[t1.length-1] = _time[1];
                    props.setTempStart(()=>[...t1]);
                   } }
                />  
                 </div>

             </div>
             <div>
             <p><span className="rTopic">End Time:{props.tempEnd[0]}/{props.tempEnd[1]+1}/{props.tempEnd[2]} {props.tempEnd[3]}:{props.tempEnd[4]}</span></p>
                 <button ref={bt2} onClick={endEdit}>Edit</button>
                 
                 <div ref={endEditRef} style={{display:"none"}}>
                 <TimeKeeper
                  time={""+props.tempEnd[props.tempEnd.length-2] +":"+props.tempEnd[props.tempEnd.length-1]}              
                  onChange={(newTime)=>{
                    newTime = newTime.formatted24;
                    let _time = newTime.split(":");
                    let t1 = props.tempEnd;
                    t1[t1.length-2] = _time[0];
                    t1[t1.length-1] = _time[1];
                    props.setTempEnd(()=>[...t1]);
                    
                  }}
                   />  
                  </div>  
             </div> 
          </div> 
          
          {
              (+props.tempEnd[3]>+props.tempStart[3])?
              <p> <span>Total Hours:</span>{+props.tempEnd[3] - +props.tempStart[3]} hours</p>
              :
              <p><span>Total Hours:</span>{+props.tempEnd[3] + (24-+props.tempStart[3])}hours</p>

          }
           
           </div>
   
           </ModalBody>
             <ModalFooter>
             <Button color="primary" onClick={saveSession} >Save</Button>
              </ModalFooter>
            </Modal> 
          </> 
        }
        </div>
    )
}