import React,{useState,useEffect} from 'react';
import Navbar1 from './Navbar1';
import TimerComponent from './DashComponents/TimerComponents/TimerComponent';
import NumStats from './DashComponents/NumStats';
import './Dashboard.css';
import ShowProgress from './DashComponents/ShowProgress';

export default function Dashboard(){
    const [currentFast,setCurrentFast] = useState(0);
    const [sessions,setSessions] = useState([]);
    const [itemsLoading,setItemsLoading] = useState(0);
    const [currentStats,setCurrentStats] = useState(null);
    return(
        <div style={{backgroundColor:"#E5E5E5",height:"100vh"}}>
            <Navbar1/>
            <div className="container">
                <div className="mt-4 row ">
                    
                     <div className="col-4 processing"> 
                         <TimerComponent
                            currentFast = {currentFast}
                            setCurrentFast = {setCurrentFast} 
                            setSessions= {setSessions}
                            setCurrentStats = {setCurrentStats}
                            currentStats={currentStats}
                            sessions = {sessions}
                            setItemsLoading = {setItemsLoading}
                            setSessions = {setSessions}
                         />
                     </div>
                     <div className="col-8 showProgress">
                         <ShowProgress
                          currentStats={currentStats}
                          setSessions= {setSessions}
                          sessions = {sessions}
                         />
                     </div>  
                </div>

                <div className="row mt-5 lower-component" >
                      <NumStats
                         sessions= {sessions}
                         itemsLoading={itemsLoading}
                         currentStats={currentStats}                   
                         setCurrentStats = {setCurrentStats}  
                      />                  
                </div>
            </div>
        </div>
    )
}