import { Link } from "react-router-dom";
import React from "react";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { useHistory } from 'react-router-dom';

export default function LoggedIn() {
    const history = useHistory();
    const logout = function () {
      localStorage.clear();
      history.push('/home');
    }
  
    if (localStorage.account_email) {
        return (
            <React.Fragment>
                <Link style={{ textDecoration: 'none' }}><div className="login button"><PersonIcon className="icon" /><p>{localStorage.account_email}</p></div></Link>
                <Link to="/" style={{ textDecoration: 'none' }}><div className="signup button" onClick={logout}><ExitToAppIcon className="icon" /><p>Sign Out</p></div></Link>
            </React.Fragment>);
    }
    return (
        <React.Fragment><Link to="/login" style={{ textDecoration: 'none' }}><div className="login button"><PersonIcon className="icon" /><p>Log In</p></div></Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}><div className="signup button"><PersonAddIcon className="icon" /><p>Sign Up</p></div></Link>
        </React.Fragment>);
}
