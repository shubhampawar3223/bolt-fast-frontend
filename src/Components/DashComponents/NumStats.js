import React,{useState,useEffect} from 'react';
import './NumStats.css';
import axios from 'axios';

export default function NumStats(props){
     const [tFasts,setTFast] = useState(null); 
     const [avgFast,setAvg] = useState(null);
     const [long,setLong] = useState(null);
     const [lStreak,setLStreak] = useState(null); 
     const [streak,setStreak] = useState(null);
     const [loading,setLoading] = useState(0);

     useEffect(async()=>{
         setLoading(1);
        let url="https://boltf-backend.herokuapp.com/showdata/?email="+localStorage.getItem('email');
       let config={
        headers: {
            Authorisation:localStorage.getItem("Authorisation")
          }
        }
       let resp= await axios.get(url,config)       
        if(resp.status === 200){
        setTFast(props.sessions.length);
        setAvg(resp.data.data.stats.avg);
        setLong(resp.data.data.stats.longestFast);                     
        setLStreak(resp.data.data.stats.longestStreak);
        setStreak(resp.data.data.stats.streak);
        props.setCurrentStats(resp.data.data.stats) 

        setLoading(0);
        }
     },[])
    
    return(        
      <div className="row" >
         {
        loading ?           
            <div className="d-flex justify-content-center ">
              Loading....  
            </div>
           :
         <>
         
        <div className="col setContent">
            <div>
            <p className="text-center statsHead">Total Fasts</p>
            <p className="text-center statsVal">{props.currentStats===null? tFasts: props.currentStats.totalSessions}</p>
            </div>
        </div>
        <div className="col setContent">
            <div>
            <p className="text-center statsHead">7-fast avg.</p>
            <p className="text-center statsVal">{props.currentStats===null? avgFast: props.currentStats.avg}h</p>
            </div>
        </div>
        <div className="col setContent">
            <div>
            <p className="text-center statsHead">Longest Fast</p>
            <p className="text-center statsVal">{props.currentStats===null ?long:props.currentStats.longestFast}h</p>
            </div>
        </div>  
        <div className="col setContent">
            <div>
            <p className="text-center statsHead">Longest Streak</p>
            <p className="text-center statsVal">{props.currentStats===null?lStreak :props.currentStats.longestStreak}</p>
            </div>
        </div> 
        <div className="col setContent">
            <div>
            <p className="text-center statsHead">Current Streak</p>
            <p className="text-center statsVal">{props.currentStats===null? streak:props.currentStats.streak}</p>
            </div>
        </div>
        </>
         }
      </div>       
         
    )
}