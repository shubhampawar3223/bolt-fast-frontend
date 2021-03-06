import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';

export default function Navbar1 (props){
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const toggle = () => setIsOpen(!isOpen);
  
  const logout = (e)=>{
    e.preventDefault();
    localStorage.removeItem("Authorisation");
    history.push("/");
  }

  return (
    <div>
      <Navbar color="white" light expand="md">
        <NavbarBrand href="/" style={{marginLeft:"2rem",color:"#4A49BE"}}><svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M4.83166 7.09747C7.10854 5.2732 9.94019 4.28126 12.8577 4.28591C15.8936 4.28591 18.6837 5.33739 20.8838 7.09747L22.9596 5.02166L24.9797 7.04176L22.9039 9.11757C24.415 11.0093 25.3613 13.2892 25.6338 15.695C25.9063 18.1008 25.494 20.5346 24.4444 22.7164C23.3948 24.8982 21.7504 26.7393 19.7006 28.0279C17.6509 29.3164 15.2789 30 12.8577 30C10.4366 30 8.06464 29.3164 6.01484 28.0279C3.96505 26.7393 2.32073 24.8982 1.2711 22.7164C0.221469 20.5346 -0.190806 18.1008 0.0817185 15.695C0.354243 13.2892 1.30049 11.0093 2.81157 9.11757L0.735756 7.04318L2.75585 5.02309L4.83166 7.0989V7.09747ZM12.8577 27.1441C14.171 27.1441 15.4714 26.8854 16.6848 26.3829C17.8981 25.8803 19.0005 25.1437 19.9291 24.215C20.8578 23.2864 21.5944 22.184 22.097 20.9707C22.5995 19.7574 22.8582 18.4569 22.8582 17.1437C22.8582 15.8304 22.5995 14.53 22.097 13.3166C21.5944 12.1033 20.8578 11.0009 19.9291 10.0723C19.0005 9.14363 17.8981 8.407 16.6848 7.90443C15.4714 7.40186 14.171 7.14319 12.8577 7.14319C10.2055 7.14319 7.6618 8.19681 5.78635 10.0723C3.9109 11.9477 2.85728 14.4914 2.85728 17.1437C2.85728 19.7959 3.9109 22.3396 5.78635 24.215C7.6618 26.0905 10.2055 27.1441 12.8577 27.1441ZM14.2864 15.715H18.5723L11.4291 25.0012V18.5723H7.1432L14.2864 9.279V15.715ZM7.1432 0H18.5723V2.85728H7.1432V0Z" fill="#4A49BE"/></svg> <em>BOLT FASTING</em></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>           
          </Nav>
        </Collapse>
        {
          localStorage.getItem("Authorisation") === null ?          
          <>
         <a href="/login"><button className="btn  btn-md" style={{marginRight:"1rem",backgroundColor:"rgba(163, 163, 163, 0.25)"}}>Login </button></a>
         <a href="/register"> <button className="btn  btn-md" style={{marginRight:"1rem",backgroundColor:"rgba(163, 163, 163, 0.25)"}}>Register</button></a>
          </>
          :
          <>
          
          <button className="btn  btn-sm" style={{marginRight:"3rem",backgroundColor:"rgba(163, 163, 163, 0.25)"}} onClick={logout}>Logout</button>
          </>
        }  
      </Navbar>
    </div>
  );
}

 