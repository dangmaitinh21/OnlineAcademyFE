import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { axiosInstance, parseJwt } from '../utils';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import swal from 'sweetalert';

export default function Login(props) {
	const { register, handleSubmit, watch, errors } = useForm();
	const [validated, setValidated] = useState(false);
	const history = useHistory();
	const location = useLocation();
	const { from, toAdmin } = location.state || { from: { pathname: '/home' } || { toAdmin: { pathname: '/admin' } } };
	const onSubmit = async function (data) {
		try {
			const res = await axiosInstance.post('/auth', data);
			if (res.data.authenticated) {
				localStorage.account_accessToken = res.data.accessToken;
				localStorage.account_userID = parseJwt(res.data.accessToken).userId;
				localStorage.account_expToken = parseJwt(res.data.accessToken).exp;
				localStorage.account_refreshToken = res.data.refreshToken;
				localStorage.account_email = data.email;
				localStorage.account_type = res.data.type;
				// history.push(from.pathname);
				if (res.data.type === 3) {
					history.push("/admin");
				}
				else {
					history.replace(from);
				}
			} else {
				swal({
					title: "Invalid Login",
					text: "Please try again",
					icon: "warning",
					button: "OK"
				});
			}
		} catch (err) {
			console.log(err.response.data);
		}
	}

	const BackToHome_Clicked = function () {
		history.push("/home");
	}

	return (
		<Container>
			<Row>
				<Col></Col>
				<Col xs={6} className="mt-4">
					<Form onSubmit={handleSubmit(onSubmit)} validated={validated}>
						<Card>
							<Card.Body>
								<Card.Title as="h3"><center>Log In</center></Card.Title>
								<hr></hr>
								<Form.Group controlId="formBasicEmail">
									<Form.Label>Email:</Form.Label>
									<Form.Control type="email" name="email" placeholder="Enter email" ref={register} autoFocus  required/>
								</Form.Group>

								<Form.Group controlId="formBasicPassword">
									<Form.Label>Password</Form.Label>
									<Form.Control type="password" name="password" placeholder="Password" ref={register} required/>
								</Form.Group>

							</Card.Body>
							<Card.Footer>
								<Button className="float-right py-2" variant="primary" type="submit">Login</Button>
								<Button className="float-right mr-3 py-2" variant="danger" onClick={BackToHome_Clicked}>Cancel</Button>
							</Card.Footer>
						</Card>
					</Form>
				</Col>
				<Col></Col>
			</Row>

		</Container>
	)
}