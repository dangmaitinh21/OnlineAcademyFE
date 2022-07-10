import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { axiosInstance, parseJwt } from '../utils';
import Popup from "reactjs-popup";
import swal from 'sweetalert';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button
} from 'react-bootstrap';

export default function Signup(props) {
    const { register, handleSubmit, watch, errors } = useForm();
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: '/home' } };
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState();
    const onSubmit = async function (data) {
        if (data.password != null && data.password === data.confirmPassword) {
            try {
                data.type = parseInt(data.type);
                delete data.confirmPassword;
                const res = await axiosInstance.post('/users', data);
                if (res.status === 201) {
                    setOpen(true);
                    const res = await axiosInstance.post('/auth', data);
                    if (res.data.authenticated) {
                        setAccount(res.data);
                        localStorage.account_accessToken = res.data.accessToken;
                        localStorage.account_ID = parseJwt(res.data.accessToken).userId;
                        localStorage.account_email = data.email;
                        //axiosInstance.defaults.headers.post['x-access-token'] = res.data.accessToken;
                    }
                    else {
                        alert('Invalid login.');
                    }
                } else {
                    alert('Invalid login.');
                }
            } catch (err) {
                if(err.response.status === 400) {
                    swal({
                        title: "Signup failed",
                        text: "Email already exists, please choose another email!",
                        icon: "error",
                        button: "OK",                    
                    })
                } else {
                    
                }
            }
        }
    }
    const onSubmitOTPConfirm = async function (data) {
        if (data.otp != null) {
            try {
                console.log(data);
                var acc = {otp:data.otp};
                console.log(acc);
                const res = await axiosInstance.post('/users/otp/validate', acc, {headers: {'x-access-token': localStorage.account_accessToken}});
                if (res.status === 200) {
                    swal({
                        title: "Account is active",
                        text: "You can purchase course",
                        icon: "success",
                        button: "Go Home"
                    }).then((value) => {
                        if (value) {
                            cancelButton_Clicked();
                        }
                    });
                } else {
                    swal({
                        title: "Invalid Code",
                        text: "Please try again",
                        icon: "warning",
                        button: "OK",
                        dangerMode: false,
                        timer: 1000
                    }).then((value) => {
                        if (value) {
                            setOpen(true);
                        }
                    });
                }
            } catch (err) {
                console.log(err.response.data);
                swal({
                    title: "Invalid Code",
                    text: "Please try again",
                    icon: "warning",
                    buttons:false,
                    timer:1000
                });
            }
        }
    }

    const cancelButton_Clicked = function () {
        history.push("/home");
    }

    return (
        <Container>
            <Row>
                {/* <Col><Button variant="danger" size="lg" onClick={cancelButton_Clicked}>Back</Button></Col> */}
                <Col></Col>
                <Col xs={6} className="mt-4">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Card>
                            <Card.Body>
                                <Card.Title as="h3"><center>Sign Up</center></Card.Title>
                                <hr></hr>
                                <Form.Group controlId="formBasicFullName">
                                    <Form.Label>Fullname</Form.Label>
                                    <Form.Control type="text" name="fullname" placeholder="Enter fullname" ref={register} required/>
                                </Form.Group>

                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Enter email" ref={register} required />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Password" ref={register} required />
                                </Form.Group>

                                <Form.Group controlId="formBasicConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" ref={register} required />
                                </Form.Group>

                                <Form.Group controlId="formBasicType">
                                    <Form.Label>Account Type</Form.Label>
                                    <Form.Control as="select" name="type" ref={register} required >
                                        <option value="1">Student</option>
                                    </Form.Control>
                                </Form.Group>      
                            </Card.Body>
                            <Card.Footer>
                                <Button className="float-right py-2" variant="primary" type="submit">Sign up</Button>
                                <Button className="float-right mr-3 py-2" variant="danger" onClick={cancelButton_Clicked}>Cancel</Button>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col>
                    <Popup open={open} position="right center">
                        <div>
                            <a className="close" onClick={() => setOpen(false)}></a>
                            <Form onSubmit={handleSubmit(onSubmitOTPConfirm)}>
                                <Form.Group controlId="formBasicOTP">
                                    <Form.Label>Please confirm code to active account</Form.Label>
                                    <Form.Control type="text" name="otp" placeholder="Enter Confirm Code" ref={register} required autoFocus />
                                </Form.Group>
                                <Button variant="primary" type="submit">Confirm</Button>
                                <Button variant="secondary" onClick={cancelButton_Clicked}>Later</Button>
                            </Form>
                        </div>
                    </Popup>
                </Col>
            </Row>
        </Container>
    )
}