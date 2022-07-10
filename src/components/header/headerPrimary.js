import React, { useContext, useState } from "react";
import "../../components/header/headerPrimary.css";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import PublishIcon from '@material-ui/icons/Publish';
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { NavDropdown } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import academyApppContext from '../../onlineAcademyAppContext';
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu";

function HeaderPrimary() {
	const history = useHistory();
	const logout = function () {
		localStorage.clear();
		history.push('/home');
	}

	const { store, dispatch } = useContext(academyApppContext);
	const changeViewProfile = function () {
		dispatch({
			type: 'changeMode',
			payload: {
				mode: 'profile'
			}
		})
	}

	const uploadCourseView = function () {
		dispatch({
			type: 'changeMode',
			payload: {
				mode: 'upload'
			}
		})
	}

	const defaultView = function () {
		dispatch({
			type: 'changeMode',
			payload: {
				mode: 'default'
			}
		})
	}

	function LoggedIn() {
		if (localStorage.account_email) {
			return (
				<React.Fragment>
					<div style={{ textDecoration: 'none' }}><div className="login button" onClick={changeViewProfile}>{localStorage.account_email}</div></div>
					<Link to="/" style={{ textDecoration: 'none' }}><div className="signup button" onClick={logout}>Sign Out</div></Link>
				</React.Fragment>);
		}
		return (
			<React.Fragment>
				<Link to="/login" style={{ textDecoration: 'none' }}><div className="login button">Log In</div></Link>
				<Link to="/signup" style={{ textDecoration: 'none' }}><div className="signup button">Sign Up</div></Link>
			</React.Fragment>);
	}
	// console.log('header',store);
	// const setLevel = new Set();
	// store.categories.map(item => setLevel.add(item.level));
	// console.log(setLevel);
	const level1 = store.categories ? store.categories.filter(i => i.level === 1) : [];
	const level2 = store.categories ? store.categories.filter(i => i.level === 2) : [];
	const categories1 = [];
	for (var i of level1) {
		var temp = [];
		for (var j of level2) {
			if (j.owned === i.id) {
				temp.push(j);
			}
		}
		var obb = {};
		obb.lv1 = i;
		obb.own = temp;
		categories1.push(obb);
	}

	const changeView = (keyword) => {
		dispatch({
			type: 'changeMode',
			payload: {
				mode: 'search',
				key: keyword
			}
		})
	}

	return (
		<div className="headerPrimary">
			<div className="left part">
				<div className="udemyLogo" onClick={defaultView} >
					<img src="..//logo.png" className="logo" alt="logo"></img>
				</div>
				{/* <div className="categoriesDiv">
          <span className="categories">Categories</span>
        </div> */}
				<NavDropdownMenu title="Categories" id="categories">
					{
						categories1 ? categories1.map(i => i.own.length > 0 ?
							<DropdownSubmenu key={i.lv1.id} title={i.lv1.title}>
								<NavDropdown.Item key={'all'} onClick={() => changeView(i.own.map(it => it.id))}>All courses</NavDropdown.Item>
								{i.own.map(j => <NavDropdown.Item key={j.id} onClick={() => changeView(j.id)}>{j.title}</NavDropdown.Item>)}
							</DropdownSubmenu>
							: <NavDropdown.Item key={i.lv1.id}>{i.lv1.title}</NavDropdown.Item>) : <NavDropdown.Item></NavDropdown.Item>
					}
				</NavDropdownMenu>

			</div>
			<div className="mid part">
				<div className="searchIcon">
					<SearchOutlinedIcon className="icon" />
				</div>
				<input className="searchBar" placeholder="Search for anything"></input>
			</div>
			<div className="right part">
				<div className="uploadDiv">
					<PublishIcon className="icon" onClick={uploadCourseView} />
				</div>
				<div className="cartDiv">
					<ShoppingCartOutlinedIcon className="icon" />
				</div>
				<LoggedIn />
			</div>
		</div>

		// <Navbar>
		//   <Navbar.Brand>
		//     <img src="..//logo.jpg" className="d-inline-block align-top" height="32" width="110" alt="logo"></img>
		//   </Navbar.Brand>
		//   <Nav>
		//     <NavDropdown title="Categories">
		//       {/* {store.categories.map(category =>
		//         <NavDropdown.Item>{category.title}</NavDropdown.Item>
		//       )} */}
		//       <NavDropdown.Item>1</NavDropdown.Item>

		//     </NavDropdown>
		//   </Nav>
		//   <Form inline className="ml-5 w-50 mr-auto">
		//       <FormControl type="text" placeholder="Search" className="w-100" />
		//   </Form>
		//   <Nav>
		//     <Button variant="light" className="ml-1"><PublishIcon className="icon" /></Button>
		//     <Button variant="light" className="mx-3"><ShoppingCartOutlinedIcon className="icon" /></Button>
		//     <ButtonGroup>
		//       <Button variant="outline-dark" className="px-3"><b>Log In</b></Button>
		//       <Button variant="outline-dark"><b>Sign Up</b></Button>
		//     </ButtonGroup>
		//   </Nav>
		// </Navbar>
	);
}
export default HeaderPrimary;
