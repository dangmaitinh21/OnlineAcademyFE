import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { axiosInstance } from '../utils';
import swal from 'sweetalert';
import {
    Row,
    Col,
    Card,
    Form,
    Button,
    Container,
    Modal,
    Accordion, AccordionContext
} from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import academyApppContext from '../onlineAcademyAppContext';
import Course from '../components/homeContent/Course';
import { FaRegGrinSquintTears } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';

export default function Profile(props) {
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: '/' } };
    const [isActive, setIsActive] = useState();
    const [disablePassword, setDisablePassword] = useState(true);
    const [changeForm, setChangeForm] = useState(false);
    const { store, dispatch } = useContext(academyApppContext);
    const [showModalNew, setShowModalNew] = useState(false);
    const handleShowModelNew = () => setShowModalNew(true);
    const handleCloseModalNew = () => setShowModalNew(false);
    const [currentCourseUpdate, setCurrentCourseUpdate] = useState({});
    var [addMoreUpload, setAddMoreUpload] = useState(0);
    var [outlineArray, setOutlineArray] = useState([]);


    useEffect(function () {
        async function loadDataUser() {
            try {
                const res = await axiosInstance.get('/users/' + localStorage.account_userID, { headers: { 'x-access-token': localStorage.account_accessToken } });
                if (res.status === 200) {
                    delete res.data.password;
                    res.data.watchlistJS = res.data.watchlist ? JSON.parse(res.data.watchlist).course : [];
                    dispatch({
                        type: 'setAccount',
                        payload: {
                            account: res.data,
                            query: '',
                        }
                    });
                }
            } catch (err) {
                if (err.response.status === 403) {
                    setIsActive(true);
                }
            }
        }
        async function loadDataPayment() {
            const res = await axiosInstance.get('/transaction/user/' + localStorage.account_userID, { headers: { 'x-access-token': localStorage.account_accessToken } });
            if (res.status === 200) {
                dispatch({
                    type: 'setPayment',
                    payload: {
                        payment: res.data,
                        query: '',
                    }
                });
            }
        }
        async function loadDataTeacherCourse() {
            const res = await axiosInstance.get('/courses/teacher/' + localStorage.account_userID, { headers: { 'x-access-token': localStorage.account_accessToken } });
            if (res.status === 200) {
                dispatch({
                    type: 'setTeacherCourse',
                    payload: {
                        teacherCourse: res.data,
                        query: '',
                    }
                });
            }
        }
        dispatch({
            type: 'initLocalFile',
            payload: []
        });
        loadDataUser();
        loadDataPayment();
        if (store && localStorage.account_type != 1) {
            loadDataTeacherCourse();
        }

    }, [changeForm]);

    const onSubmit = async function (data) {
        if (data) {
            if (data.switchPass) {
                if (data.password && data.password === data.confirmPassword) {
                    try {
                        delete data.confirmPassword;
                        delete data.switchPass;
                        const res = await axiosInstance.put('/users/' + store.account.id, data, { headers: { 'x-access-token': localStorage.account_accessToken } });
                        if (res.status === 200) {
                            swal({
                                title: "Profile Saved",
                                icon: "success",
                                button: "OK"
                            });
                            setChangeForm(true);
                        } else {
                            swal({
                                title: "Not Save Profile",
                                icon: "warning",
                                button: "OK",
                            });
                        }
                    } catch (err) {
                        console.log(err.response.data);
                        swal({
                            title: "Not Save Profile",
                            icon: "warning",
                            button: "OK",
                        });
                    }
                } else {
                    swal({
                        title: "Not Save Profile",
                        text: "Confirm password wrong",
                        icon: "warning",
                        button: "OK",
                    });
                }
            } else {
                try {
                    delete data.confirmPassword;
                    delete data.switchPass;
                    const res = await axiosInstance.put('/users/' + store.account.id, data, { headers: { 'x-access-token': localStorage.account_accessToken } });
                    if (res.status === 200) {
                        swal({
                            title: "Profile Saved",
                            icon: "success",
                            button: "OK"
                        });
                        setChangeForm(true);
                    } else {
                        swal({
                            title: "Not Save Profile",
                            icon: "warning",
                            button: "OK",
                        });
                    }
                } catch (err) {
                    console.log(err.response.data);
                    swal({
                        title: "Not Save Profile",
                        icon: "warning",
                        button: "OK",
                    });
                }
            }
        } else {
            swal({
                title: "Not Save Profile",
                icon: "warning",
                button: "OK",
            });
        }
    }
    const delWhiteList = async function (id) {
        try {
            const res = await axiosInstance.delete('/users/delete/watchlist/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
            if (res.status === 200) {
                swal({
                    title: "Removed Course",
                    icon: "success",
                    button: "OK"
                });
                setChangeForm(true);
            }
        } catch (err) {
            console.log(err.response.data);
            swal({
                title: "Not Remove",
                icon: "warning",
                button: "OK",
            });
        }

    }

    const changePassword = function () {
        disablePassword === true ? setDisablePassword(false) : setDisablePassword(true);
    }

    const logout = function () {
        localStorage.clear();
        history.push('/login');
        window.location.reload();
    }

    const onSubmitOTPConfirm = async function (data) {
        if (data.otp != null) {
            try {
                var acc = { otp: data.otp };
                const res = await axiosInstance.post('/users/otp/validate', acc, { headers: { 'x-access-token': localStorage.account_accessToken } });
                if (res.status === 200) {
                    swal({
                        title: "Account is active",
                        text: "You can purchase course after login",
                        icon: "success",
                        button: "OK",
                    }).then((value) => {
                        if (value) {
                            logout();
                        }
                    });
                    //setChangeForm(true);
                } else {
                    swal({
                        title: "Invalid Code",
                        text: "Please try again",
                        icon: "warning",
                        button: "OK",
                        dangerMode: false,
                        timer: 1000
                    });
                }
            } catch (err) {
                console.log(err.response.data);
                swal({
                    title: "Invalid Code",
                    text: "Please try again",
                    icon: "warning",
                    buttons: false,
                    timer: 1000
                });
            }
        }
    }

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };

    const thumbStyle = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    };

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const imgStyle = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };
    const ContextAwareToggle = function ({ children, eventKey, callback }) {
        const currentEventKey = useContext(AccordionContext);
        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
        const isCurrentEventKey = currentEventKey === eventKey;
        return (
            <Card.Header

                style={{ backgroundColor: isCurrentEventKey ? '#cc0000' : '', color: isCurrentEventKey ? 'white' : '' }}
                onClick={decoratedOnClick}
            >
                {children}
            </Card.Header>
        )
    }
    const changeView = function (mode) {
        async function initCoursesList() {
            const res = await axiosInstance.get("/courses");
            if (res.status === 200) {
                dispatch({
                    type: 'initCoursesList',
                    payload: {
                        courses: res.data,
                        query: '',
                        mode: 'default'
                    }
                });
            }
        }
        initCoursesList();
        dispatch({
            type: 'changeMode',
            payload: {
                mode
            }
        })
    }
    const updateCourse = function (course) {
        handleShowModelNew();
        setOutlineArray(JSON.parse(course.outline).data);
        setCurrentCourseUpdate(course);
    }
    function thumb(id) {
        if (store.localFiles && store.localFiles.length && store.localFiles.filter(f => f.userId === localStorage.account_userID)[id]) {
            return (
                <div style={thumbStyle} key={store.localFiles.filter(f => f.userId === localStorage.account_userID)[id].name}>
                    <div style={thumbInner}>
                        <video
                            src={store.localFiles.filter(f => f.userId === localStorage.account_userID)[id].preview}
                            style={imgStyle}
                        />
                    </div>
                </div>
            )
        }
        return null;
    }
    const VideoUploadForm = (props) => {
        const [state, setState] = useState({ files: [] });
        var [value, setValue] = useState('');
        if (store.localFiles && store.localFiles.length > 0 && value !== '') {
            if (store.localFiles[props.count] !== undefined) {
                store.localFiles[props.count].outline = value;
            }
        } else if (store.localFiles && store.localFiles.length > 0 && value === '') {
            if (store.localFiles[props.count] !== undefined && store.localFiles[props.count].outline !== '') {
                setValue(store.localFiles[props.count].outline);
            }
        }

        const { getRootProps, getInputProps, open } = useDropzone({
            accept: 'video/*',
            noClick: true,
            noKeyboard: true,
            multiple: false,
            onDrop: (acceptedFiles) => {
                setState((oldState) => ({
                    files: [...oldState.files, acceptedFiles.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file),
                        userId: localStorage.account_userID,
                        outline: value
                    })).map(file => dispatch({
                        type: 'addLocalFile',
                        payload: file
                    }))]
                }));
            }
        });

        return (
            <Card>
                <Card.Body>
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here or open the dialog</p>
                        <Button type="button" variant="outline-dark" onClick={open}>
                            Open File Dialog
                </Button>
                    </div>
                    <aside style={thumbsContainer}>
                        {thumb(props.count)}
                    </aside>
                    <b>Outline</b>
                    <ReactQuill theme="snow" value={value} onChange={setValue} required />
                </Card.Body>
            </Card>
        )
    }

    const uploadOldCourse = async (form) => {
        const body = new FormData();
        var outline = [];
        store.localFiles.forEach(file => (body.append("videos", file), outline.push(file.outline)));

        body.append("metadata", JSON.stringify({
            categoryId: form.category,
            outline: outline,
            title: form.title,
            descriptionShort: form.descriptionShort,
            descriptionLong: form.descriptionLong,
            isCompleted: form.isCompleted,
        }));


        const res = await axiosInstance.put("/courses/" + currentCourseUpdate.id, body, { headers: { 'x-access-token': localStorage.account_accessToken } });
        if (res.status === 200) {
            swal({
                title: "Course uploaded",
                text: "Course uploaded",
                icon: "success",
            });
            setAddMoreUpload(0);
            changeView("default")
            dispatch({
                type: 'clearLocalFiles'
            })
        }
    }

    return (
        <>
            <Row>
                <Col>
                    {
                        isActive ?
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h3"><center>Active Account</center></Card.Title>
                                </Card.Header>
                                <Card.Body >
                                    <Form onSubmit={handleSubmit(onSubmitOTPConfirm)}>
                                        <Form.Group controlId="formBasicOTP">
                                            <Form.Label>Please confirm code in mail or contact admin to active account </Form.Label>
                                            <Form.Control type="text" name="otp" placeholder="Enter Confirm Code" ref={register} required autoFocus />
                                        </Form.Group>
                                        <Button id="otp" variant="primary" type="submit">Confirm</Button>
                                    </Form>
                                </Card.Body>
                                <Card.Footer>

                                </Card.Footer>
                            </Card> : ""
                    }

                </Col>
            </Row>
            {store.account ? store.account.type === 1 ?
                <Row>
                    <Col xs={6} className="mt-1">
                        <Form onSubmit={handleSubmit(onSubmit)} >
                            <Card style={{ height: 700 }}>
                                <Card.Header>
                                    <Card.Title as="h3"><center>Profile</center></Card.Title>
                                </Card.Header>
                                <Card.Body style={{ overflowY: 'auto' }}>
                                    <Form.Group controlId="formBasicFullName">
                                        <Form.Label>Fullname</Form.Label>
                                        <Form.Control type="text" name="fullname" defaultValue={store.account ? store.account.fullname : ""} placeholder="Enter fullname" ref={register} required />
                                    </Form.Group>
                                    <br></br>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" defaultValue={store.account ? store.account.email : ""} placeholder="Enter email" ref={register} required readOnly />
                                    </Form.Group>

                                    <Form.Check type="switch" name="switchPass" id="custom-switch" label="Change password" onChange={changePassword} ref={register} />
                                    <br></br>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control type="password" name="password" placeholder="Password" ref={register} disabled={disablePassword} />
                                    </Form.Group>
                                    <br></br>
                                    <Form.Group controlId="formBasicConfirmPassword">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" ref={register} disabled={disablePassword} />
                                    </Form.Group>
                                    <br></br>
                                    <Button id="saveProfile" className="float-right py-2" variant="primary" type="submit" size="lg">Save</Button>
                                </Card.Body> 
                            </Card>
                        </Form>
                    </Col>
                    <Col xs={6} className="mt-1" >
                        <Card style={{ height: 700 }}>
                            <Card.Header>
                                <Card.Title as="h3"><center>My Courses</center></Card.Title>
                            </Card.Header>

                            <Card.Body style={{ height: 750, overflowX: 'auto', overflowY: 'hidden' }}>
                                <Container fluid>
                                    <Row className="row flex-row flex-nowrap" >
                                        {store.payment ? store.payment.map(item =>
                                            store.courses ? store.courses.map(i => i.id === item.courseId ?
                                                <Col sm={5} style={{ height: 'auto' }}>
                                                    <Course course={i} />
                                                    <b style={{ position: 'absolute', bottom: 0, fontSize: 20 }}>{i.isCompleted ? <center style={{ color: 'green' }}>completed</center> : <center style={{ color: 'blue' }}>processing...</center>}</b>
                                                </Col>
                                                : "") : "") : ""
                                        }
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row> : "" : ""}
            {store.account ? store.account.type === 1 ?
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h3"><center>My Favourite Courses</center></Card.Title>
                            </Card.Header>
                            <Card.Body style={{ overflowY: 'hidden' }}>
                                <Container fluid>
                                    <Row className="row flex-row flex-nowrap" style={{ height: 640, overflowX: 'auto' }}>
                                        {store.account ? store.courses ? store.courses.filter(it => store.account ? store.account.watchlistJS.includes(it.id) : "").map(item =>
                                            <Col sm={2}>
                                                <Course course={item} />
                                                <Button variant="danger" style={{ width: '100%' }} onClick={() => delWhiteList(item.id)}>Delete</Button>
                                            </Col>
                                        ) : [] : ""}
                                    </Row>
                                </Container>
                            </Card.Body>
                            <Card.Footer>

                            </Card.Footer>
                        </Card>
                    </Col>
                </Row> : "" : ""}
            {
                store.account ? store.account.type === 2 ?
                    <Row>
                        <Col xs={6} className="mt-1">
                            <Form onSubmit={handleSubmit(onSubmit)} >
                                <Card style={{ height: 750 }}>
                                    <Card.Header>
                                        <Card.Title as="h3"><center>Profile</center></Card.Title>
                                    </Card.Header>
                                    <Card.Body style={{ overflowY: 'auto' }}>
                                        <Form.Group controlId="formBasicFullName">
                                            <Form.Label>Fullname</Form.Label>
                                            <Form.Control type="text" name="fullname" defaultValue={store.account ? store.account.fullname : ""} placeholder="Enter fullname" ref={register} required />
                                        </Form.Group>
                                        <br></br>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" name="email" defaultValue={store.account ? store.account.email : ""} placeholder="Enter email" ref={register} required readOnly />
                                        </Form.Group>

                                        <Form.Check type="switch" name="switchPass" id="custom-switch" label="Change password" onChange={changePassword} ref={register} />
                                        <br></br>
                                        <Form.Group controlId="formBasicPassword">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control type="password" name="password" placeholder="Password" ref={register} disabled={disablePassword} />
                                        </Form.Group>
                                        <br></br>
                                        <Form.Group controlId="formBasicConfirmPassword">
                                            <Form.Label>Confirm New Password</Form.Label>
                                            <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" ref={register} disabled={disablePassword} />
                                        </Form.Group>
                                        <br></br>
                                        <Button id="saveProfile" className="float-right py-2" variant="primary" type="submit" size="lg">Save</Button>
                                    </Card.Body>

                                </Card>
                            </Form>
                        </Col>
                        <Col xs={6} className="mt-1" >
                            <Card style={{ height: 750 }}>
                                <Card.Header>
                                    <Card.Title as="h3"><center>My Courses</center></Card.Title>
                                </Card.Header>

                                <Card.Body style={{ height: 'auto', overflowX: 'auto', overflowY: 'hidden' }}>
                                    <Container fluid>
                                        <Row className="row flex-row flex-nowrap" >
                                            {store.teacherCourse ? store.teacherCourse.map(item =>
                                                <Col sm={5} style={{ height: 'auto' }}>
                                                    <Course course={item} />
                                                    <b style={{ position: 'absolute', bottom: 35, fontSize: 20 }}>{item.isCompleted ? <center style={{ color: 'green' }}>completed</center> : <center style={{ color: 'blue' }}>processing...</center>}</b>
                                                    <Button variant="warning" style={{ width: '100%' }} onClick={() => updateCourse(item)}>Update</Button>
                                                </Col>
                                            ) : ""
                                            }
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Modal show={showModalNew} onHide={handleCloseModalNew} dialogClassName="modal-90w" >
                                <Modal.Header closeButton>
                                    <Modal.Title>Update Course</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>


                                    <Row>
                                        <Col xs={6} className="mt-4">
                                            <Form onSubmit={handleSubmit(uploadOldCourse)}>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title as="h3"><center>Course upload</center></Card.Title>
                                                        <hr></hr>
                                                        <Form.Group controlId="title">
                                                            <Form.Label>Title</Form.Label>
                                                            <Form.Control type="text" defaultValue={currentCourseUpdate.title == null ? "" : currentCourseUpdate.title} name="title" placeholder="Course title" ref={register} required />
                                                        </Form.Group>

                                                        <Form.Group controlId="descriptionShort">
                                                            <Form.Label>Description Short</Form.Label>
                                                            <Form.Control type="text" defaultValue={currentCourseUpdate.descriptionShort == null ? "" : currentCourseUpdate.descriptionShort} name="descriptionShort" placeholder="Course description short" ref={register} required />
                                                        </Form.Group>

                                                        <Form.Group controlId="descriptionLong">
                                                            <Form.Label>Description Long</Form.Label>
                                                            <Form.Control type="text" defaultValue={currentCourseUpdate.descriptionLong == null ? "" : currentCourseUpdate.descriptionLong} name="descriptionLong" placeholder="Course description long" ref={register} required />
                                                        </Form.Group>

                                                        <Form.Group controlId="category">
                                                            <Form.Label>Category</Form.Label>
                                                            <Form.Control as="select" defaultValue={currentCourseUpdate.categoryId == null ? "" : currentCourseUpdate.categoryId} name="category" ref={register} required >
                                                                {store.categories.map(c => <option key={c.id} value={c.id}> {c.title}</option>)}
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Check type="switch" defaultChecked={currentCourseUpdate.isCompleted == null ? "" : currentCourseUpdate.isCompleted} name="isCompleted" id={currentCourseUpdate.id} label="Complete Course" ref={register} />
                                                    </Card.Body>
                                                    <Card.Footer>
                                                        <Button className="float-right py-2" variant="primary" type="submit">Upload</Button>
                                                    </Card.Footer>
                                                </Card>
                                            </Form>
                                        </Col>
                                        <Col xs={6} className="mt-4">
                                            <Accordion>
                                                {outlineArray.map((i, index) =>
                                                (<Card key={'supp' + index} className="mb-0">
                                                    <ContextAwareToggle eventKey={index + 1}><h4 dangerouslySetInnerHTML={{ __html: i.content }} /></ContextAwareToggle>

                                                    <Accordion.Collapse eventKey={index + 1}>
                                                        <Card.Body>
                                                            <video width="100%" height="400px" controls>
                                                                <source src={"http://localhost:3001/resources/" + i.uploadDir + i.uploadFilename} type="video/mp4" autoPlay={false} />
                                                            </video>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>))
                                                }
                                            </Accordion>
                                            {[...Array(addMoreUpload)].map((_, i) => <VideoUploadForm key={'update' + i} count={i} />)}
                                            <div style={{textAlign: 'center'}}>
                                                <Button variant="outline-dark" className="button my-3" onClick={() => setAddMoreUpload(addMoreUpload + 1)}>Add more outline</Button>
                                            </div>
                                        </Col>
                                    </Row>


                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModalNew}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                    : "" : ""
            }
        </>
    )
}
