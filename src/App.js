import React from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import Login from './views/login';
import Signup from './views/signup';
import OnlineAcademy from './views/onlineAcademy';
import AdminAcademy from "./views/admin";
import Profile from "./views/profile";
import Categories from './views/catogories';
import 'bootstrap/dist/css/bootstrap.min.css';
import UploadCourse from "./components/UploadCourse";

function App() {
	function PrivateRoute({ children, ...rest }) {
		const renderChildren = function ({ location }) {
			return localStorage.account_accessToken ? children : (
				<Redirect
					to={{
						pathname: '/home',
						state: { from: location }
					}}
				/>
			);
		}

		return (
			<Route {...rest} render={renderChildren} />
		);
	}

	return (
		<Router>
			<Switch>
				<Route exact path="/home">
					<OnlineAcademy />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<Route path="/signup">
					<Signup />
				</Route>
				<Route path="/admin">
					<AdminAcademy />
				</Route>
				{/* </Switch>{ <Route path="/profile">
					<Profile />
				</Route> }
				{ <Route path="/categories/:id" >
					<Categories />
				</Route> */}
				<Route path="/upload">
					<UploadCourse />
				</Route>
				<PrivateRoute path="/">
					<OnlineAcademy />
				</PrivateRoute>
			</Switch>
		</Router>

	);
}

export default App;
