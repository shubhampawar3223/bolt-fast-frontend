import React,{useState,useRef,useEffect} from 'react';
import './ShowProgress.css';
import axios from 'axios';

export default function ShowProgress(props){
    let [arr,setArray] = useState([1,2,3,4,5,6,7]);   
    let mainRef = useRef();
    let [bars,setBars]= useState([]);
    let [date,setDate]= useState([]);
    let [month,setMonth]= useState([]);
    let [loading,setLoading]= useState(0);
    let [styles,setStyles] = useState([])

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
        let n = resp.data.data.sessions.length
        if(resp.data.data.sessions.length <=7)
        props.setSessions(()=>[...resp.data.data.sessions])
        else
        {
          let temp1 = resp.data.data.sessions.splice(-7); 
          props.setSessions(()=>[...temp1]) 
        }

        if(n!==0){
            let temp1=[]
            let temp2=[]
            let temp3=[]
            resp.data.data.sessions.map((e,i)=>{
                if(e.totalHours!==null){
                  temp1.push(e.totalHours);
                
                  temp2.push(e.tempStart[0]);
                  temp3.push(e.tempStart[1]);                                  
                }    
                
                setBars(()=>[...temp1]);
                setDate(()=>[...temp2]);  
                setMonth(()=>[...temp3])             
            }) 
        } 
        }
        setLoading(0);  
         },[])

      
    return(
       <div style={{position:"relative"}}>

           {
            loading ?
                <div className="d-flex justify-content-center mt-3">
                <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
                    <span class="sr-only">Loading...</span>  
                </div>
               :             
            <>
           <div  className="mt-3 ml-3" style={{position:"relative"}}>
           <p className="f1" style={{position:"relative",left:"50px"}}>Recent fasts</p>
           <p className="f2" style={{position:"relative",bottom:"20px",left:"50px"}}>Average: {props.currentStats==null? 0:props.currentStats.avg}h</p>
           </div>    
          <div useRef={mainRef} className="offset-1 col-10 row mainComponent" style={{marginTop:"3rem"}}>
          <span style={{position:"absolute",left:"-40px",bottom:"230px",fontSize:"10px",color:"#A3A3A3"}}>20</span>
          <span style={{position:"absolute",left:"-40px",bottom:"170px",fontSize:"10px",color:"#A3A3A3"}}>15</span>
          <span style={{position:"absolute",left:"-40px",bottom:"110px",fontSize:"10px",color:"#A3A3A3"}}>10</span>
          <span style={{position:"absolute",left:"-30px",bottom:"50px",fontSize:"10px",color:"#A3A3A3"}}>5</span>
               {
                   
                 arr.map((e,i)=>{
                     if(i<props.sessions.length ){
                      
                     if(props.sessions[i].totalHours!==null){   
                     if(i%2 ===0)    
                    var p ={width:"10px",height:((+props.sessions[i].totalHours===null? +bars[i]:+props.sessions[i].totalHours)*12)+"px",backgroundColor:"#5DD362",position:"absolute" ,bottom:"0px",borderRadius:"6px"}             
                     else 
                     var p ={width:"10px",height:((+props.sessions[i].totalHours===null? +bars[i]:+props.sessions[i].totalHours)*12)+"px",backgroundColor:"#A3A3A3",position:"absolute" ,bottom:"0px",borderRadius:"6px"}

                    return(
                        <>   
                    <div className="col   d-flex justify-content-center" style={{position:"relative",borderLeft:"1px solid #F0F0F0"}}>
                        <span style={p}></span> 
                        <span style={{position:"absolute",bottom:"-23px",fontSize:"10px",color:"#A3A3A3"}}>{( +props.sessions[i].tempStart[0])}/{+props.sessions[i].tempStart[1]}</span>
                    </div>
                    </>
                    )
                    
                     }
                     else{
                        
                        var p ={width:"10px",height:(((+new Date() - +new Date(props.sessions[i].startTime))/3600000)*12)+"px",backgroundColor:"#EDB98A",position:"absolute" ,bottom:"0px",borderRadius:"6px"}             
                         return(
                         <>
                        <div className="col   d-flex justify-content-center" style={{position:"relative",borderLeft:"1px solid #F0F0F0"}}>
                        <span style={p}></span> 
                        <span style={{position:"absolute",bottom:"-23px",fontSize:"10px",color:"#A3A3A3"}}>{( +props.sessions[i].tempStart[0])}/{+props.sessions[i].tempStart[1]}</span> 
                       </div>
                         </>
                         )
                     }
                    }
                    else{
                        return(
                            <div className="col d-flex justify-content-center" style={{position:"relative",borderLeft:"1px solid #F0F0F0"}}>
                                <span ></span> 
                            </div> 
                        )  
                    } 
                 } 
                 )
               }              
          </div>  
          </>
           }
       </div> 
    )
}
