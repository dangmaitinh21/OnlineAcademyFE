import React, { useContext, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { Card, Row, Col, Button, Modal, Carousel, Form, Alert, Accordion, AccordionContext } from 'react-bootstrap';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import academyApppContext from '../../onlineAcademyAppContext';
import { axiosInstance, parseJwt } from '../../utils';
import swal from 'sweetalert';
import '../homeContent/Course.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';

export default function Course({ course }) {
	const { store, dispatch } = useContext(academyApppContext);
	const categoryTitle = store.categories ? store.categories.filter(category => category.id === course.categoryId)[0] : [];
	const { register, handleSubmit } = useForm();
	const [show, setShow] = useState(false);
	const [disableButton, setDisableButton] = useState(false);
	const [like, setLike] = useState(false);
	const [alertActive, setAlertActive] = useState(false);
	var outline = [];

	useEffect(function () {
		dispatch({
			type: 'initLocalFile',
			payload: []
		});
	}, []);

	if (course.outline) {
		outline = JSON.parse(course.outline).data;
	}
	var previewOutline = [];
	if (outline) {
		previewOutline = outline.slice(0, 2);
	}
	const addWhiteList = async function () {
		try {
			const res = await axiosInstance.post('/users/watchlist/' + course.id, {}, { headers: { 'x-access-token': localStorage.account_accessToken } });
		} catch (err) {
			if (err.response.status === 403) {
				swal({
					title: "Your account has not been activated",
					text: "Please activate your account with otp before using this feature!",
					icon: "warning",
					button: "OK",
				})
				setLike(false);
			} else {
				console.log(err.response.data);
			}
		}
	}

	const delWhiteList = async function () {
		try {
			const res = await axiosInstance.delete('/users/delete/watchlist/' + course.id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		} catch (err) {
			console.log(err.response.data);
		}
	}
	const handleClose = () => setShow(false);
	const handleShow = async () => {
		setShow(true);
		if (localStorage.account_accessToken) {
			try {
				const res = await axiosInstance.get('/transaction/user/' + localStorage.account_userID, { headers: { 'x-access-token': localStorage.account_accessToken } });
				if (res.status === 200) {
					for (var i of res.data) {
						if (i.courseId === course.id) {
							setDisableButton(true);
							break;
						}
					}
					store.accountInfo ? JSON.parse(store.accountInfo.watchlist) ? JSON.parse(store.accountInfo.watchlist).course.includes(course.id) ? setLike(true) : setLike(false) : setLike(false) : setLike(false);
				}
			} catch (err) {
				if (err.response.status === 403) {
					setAlertActive(true);
				} else {
					console.log(err);
				}
			}
		}
	}
	const sortList = store.courses ? store.courses.filter(i => i.categoryId === course.categoryId).sort((a, b) => a.participants < b.participants ? 1 : -1) : [];
	const courseRef = [];
	for (var i = 0; i < sortList.length; i++) {
		if (sortList[i].id !== course.id) {
			if (courseRef.length > 5) {
				break;
			}
			courseRef.push(sortList[i]);
		}
	}
	const feedbackList = store.feedback ? store.feedback.filter(i => i.courseId === course.id) : [];
	const addCourse = async function (courseId) {
		if (localStorage.account_accessToken) {
			let data = {}
			data.courseId = courseId;
			try {
				const res = await axiosInstance.post('/transaction', data, { headers: { 'x-access-token': localStorage.account_accessToken } });
				if (res.status === 201) {
					try {
						const res2 = await axiosInstance.put('/transaction/' + res.data.id + '/payment', data, { headers: { 'x-access-token': localStorage.account_accessToken } });
						if (res2.status === 200) {
							swal({
								title: "Purchase is successful!",
								icon: "success",
								button: "OK"
							});
							setDisableButton(true);
							const res1 = await axiosInstance.get("/courses");
							if (res1.status === 200) {
								dispatch({
									type: 'reloadCourses',
									payload: {
										courses: res1.data,
									}
								});
							}
							const res2 = await axiosInstance.get('/transaction/user/' + localStorage.account_userID, { headers: { 'x-access-token': localStorage.account_accessToken } });
							if (res2.status === 200) {
								dispatch({
									type: 'setPayment',
									payload: {
										payment: res2.data,
										query: '',
									}
								});
							}
						}
					} catch (err) {
						console.log(err.response.data)
					}
				}
			} catch (err) {
				if (err.response.status === 403) {
					swal({
						title: "Your account has not been activated",
						text: "Please activate your account with otp before using this feature!",
						icon: "warning",
						button: "OK",
					})
				} else {
					console.log(err.response.data);
				}
			}
		} else {
			swal({
				title: "Please login!",
				icon: "warning",
				button: "OK"
			});
		}
	}


	const onSubmit = async function (data) {
		if (data && localStorage.account_accessToken) {
			const dataToPost = {
				"courseId": parseInt(course.id),
				"userId": parseInt(localStorage.account_userID),
				"point": parseInt(data.point),
				"content": data.content
			}
			try {
				const addFeedback = await axiosInstance.post('/feedbacks', dataToPost, { headers: { 'x-access-token': localStorage.account_accessToken } });
				if (addFeedback.status === 201) {
					swal({
						title: "Feedback is successful!",
						text: "Your comment will be posted later",
						icon: "success",
						button: "OK"
					});
					const res = await axiosInstance.get('/feedbacks');

					if (res.status === 200) {
						dispatch({
							type: 'getFeedback',
							payload: {
								feedback: res.data,
							}
						});
						console.log(store.feedback);
						loadContent();
					}
					const res1 = await axiosInstance.get("/courses");
					if (res1.status === 200) {
						dispatch({
							type: 'reloadCourses',
							payload: {
								courses: res1.data,
							}
						});
					}

				}
			} catch (err) {
				if (err.response.status === 403) {
					swal({
						title: "Your account has not been activated",
						text: "Please activate your account with otp before using this feature!",
						icon: "warning",
						button: "OK",
					})
				} else {
					console.log(err.response.data);
				}
			}
		} else {
			swal({
				title: "Please login!",
				icon: "warning",
				button: "OK"
			});
		}
	}

	// const watchList = localStorage.account_accessToken ? store.teacher ? store.teacher.filter(i => i.id === +localStorage.account_userID)

	function loadContent() {
		return feedbackList.map(i =>
			store.teacher ? store.teacher.filter(j => j.id === i.userId).map(k => <Card.Text key={k.id}><b><i>{k.fullname} </i></b> : {i.content}</Card.Text>) : <Card.Text></Card.Text>)
	}

	// if(store.accountInfo){
	//   console.log(store.accountInfo.watchlist)
	// }
	function getFavourist() {
		if (store.accountInfo) {
			if (store.accountInfo.watchlist) {
				const watchListTemp = JSON.parse(store.accountInfo.watchlist).course;
				for (var i of watchListTemp) {
					if (i === course.id) {
						setLike(true);
						return;
					}
				}
			}
		}
	}

	const checkPurchase = () => {
		if (store.payment) {
			if (parseInt(localStorage.account_type) !== 1) {
				return true;
			}
			for (var i of store.payment) {
				if ((i.userId === store.accountInfo.id && i.courseId === course.id)) {
					return true;
				}
			}
		}
		return false;
	}
	//getFavourist();
	Date.prototype.getWeekNumber = function () {
		var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
		var dayNum = d.getUTCDay() || 7;
		d.setUTCDate(d.getUTCDate() + 4 - dayNum);
		var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
	};
	var hotCourses = [];

	if (store.courses != null) {
		let currWeek = new Date().getWeekNumber();
		const sortList = [].concat(store.courses.filter(it => (currWeek - new Date(it.createdDate).getWeekNumber() === 1) && (it.participants !== 0) && (it.reviewPoint >= 7)));
		const sortList2 = sortList ? sortList.sort((a, b) => a.participants < b.participants ? 1 : -1) : [];
		hotCourses = sortList2.splice(0, 3);
	}

	const likeClicked = function () {
		if (like) {
			delWhiteList();
			setLike(false);
		} else {
			addWhiteList();
			setLike(true);
		}
	}

	//const decoratedOnClick = useAccordionToggle(eventKey, onClick);
	const ContextAwareToggle = function ({ children, eventKey, callback }) {
		const currentEventKey = useContext(AccordionContext);
		const decoratedOnClick = useAccordionToggle(
			eventKey,
			() => callback && callback(eventKey),
		);
		const isCurrentEventKey = currentEventKey === eventKey;
		return (
			<Card.Header

				style={{ backgroundColor: isCurrentEventKey ? '#0066ff' : '', color: isCurrentEventKey ? 'white' : '' }}
				onClick={decoratedOnClick}
			>
				{children}
			</Card.Header>
		)
	}

	/*================================================== UPDATE COURSE ===============================================*/
	var [addMoreUpload, setAddMoreUpload] = useState(0);
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

		const res = await axiosInstance.put("/courses/" + course.id, body, { headers: { 'x-access-token': localStorage.account_accessToken } });
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
	/*==============================================================================================================*/

	return (
		<div>
			{(() => {
				if (course.sale) {
					if (hotCourses) {
						for (var i of hotCourses) {
							if (i.id === course.id) {
								return (
									<Card style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
										<Card.Img src={require('../../img/icon/hot.png').default} style={{ width: 70, zIndex: 1, position: 'absolute', right: 0 }}></Card.Img>
										<img src={require('../../img/icon/sale.png').default} style={{ width: 150, zIndex: 1, position: 'absolute', right: 2, top: '50%' }} />
										<img src={`${course.thumbnail}`} width="100%" height="150px" />
										<Card.Body style={{ height: 350 }}>
											<Card.Title as="h4" className="my-2"><center>{course.title}</center></Card.Title>
											<hr></hr>
											<Card.Text>Category: {categoryTitle ? categoryTitle.title ? categoryTitle.title : "" : ""}</Card.Text>
											{
												store.teacher ? store.teacher.filter(i => i.id === course.teacherId).map(j =>
													<Card.Text key={j.id}>Teacher: {j.fullname}</Card.Text>
												) : <Card.Text></Card.Text>
											}
											<Card.Text>Review Point: {course.reviewPoint}</Card.Text>
											<Card.Text>Reviews: {course.reviews}</Card.Text>

											<Card.Text>Price: {course.price}</Card.Text>
											<Card.Text>{course.descriptionShort}</Card.Text>
											<br></br>
										</Card.Body>
										<Card.Footer style={{ borderTop: 'none' }}>
											<center>
												<Button variant="primary" size="lg" onClick={handleShow}>Detail</Button>
											</center>
										</Card.Footer>
									</Card>
								)
							}
						}
					}
					return (
						<Card style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
							<img src={`${course.thumbnail}`} width="100%" height="150px" />
							<Card.Body style={{ height: 350 }}>
								<img src={require('../../img/icon/sale.png').default} style={{ width: 150, zIndex: 1, position: 'absolute', right: 2, top: '50%' }} />
								<Card.Title as="h4" className="my-2"><center>{course.title}</center></Card.Title>
								<hr></hr>
								<Card.Text>Category: {categoryTitle ? categoryTitle.title ? categoryTitle.title : "" : ""}</Card.Text>
								{
									store.teacher ? store.teacher.filter(i => i.id === course.teacherId).map(j =>
										<Card.Text key={j.id}>Teacher: {j.fullname}</Card.Text>
									) : <Card.Text></Card.Text>
								}

								<Card.Text>Review Point: {course.reviewPoint}</Card.Text>
								<Card.Text>Reviews: {course.reviews}</Card.Text>
								<Card.Text>Price: {course.price}</Card.Text>
								<Card.Text>Sale: {course.sale}</Card.Text>
								<Card.Text>{course.descriptionShort}</Card.Text>
								<br></br>
							</Card.Body>
							<Card.Footer style={{ borderTop: 'none' }}>
								<center>
									<Button variant="primary" size="lg" onClick={handleShow}>Detail</Button>
								</center>
							</Card.Footer>
						</Card>
					)

				} else {
					if (hotCourses) {
						for (var i of hotCourses) {
							if (i.id === course.id) {
								return (
									<Card style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
										<Card.Img src={require('../../img/icon/hot.png').default} style={{ width: 70, zIndex: 1, position: 'absolute', right: 0 }}></Card.Img>
										<img src={`${course.thumbnail}`} width="100%" height="150px" />
										<Card.Body style={{ height: 350 }}>
											<Card.Title as="h4" className="my-2"><center>{course.title}</center></Card.Title>
											<hr></hr>
											<Card.Text>Category: {categoryTitle ? categoryTitle.title ? categoryTitle.title : "" : ""}</Card.Text>
											{
												store.teacher ? store.teacher.filter(i => i.id === course.teacherId).map(j =>
													<Card.Text key={j.id}>Teacher: {j.fullname}</Card.Text>
												) : <Card.Text></Card.Text>
											}
											<Card.Text>Review Point: {course.reviewPoint}</Card.Text>
											<Card.Text>Reviews: {course.reviews}</Card.Text>

											<Card.Text>Price: {course.price}</Card.Text>
											<Card.Text>{course.descriptionShort}</Card.Text>
											<br></br>
										</Card.Body>
										<Card.Footer style={{ borderTop: 'none' }}>
											<center>
												<Button variant="primary" size="lg" onClick={handleShow}>Detail</Button>
											</center>
										</Card.Footer>
									</Card>
								)
							}
						}
					}
					return (
						<Card style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
							<img src={`${course.thumbnail}`} width="100%" height="150px" />
							<Card.Body style={{ height: 350 }}>
								<Card.Title as="h4" className="my-2"><center>{course.title}</center></Card.Title>
								<hr></hr>
								<Card.Text>Category: {categoryTitle ? categoryTitle.title ? categoryTitle.title : "" : ""}</Card.Text>
								{
									store.teacher ? store.teacher.filter(i => i.id === course.teacherId).map(j =>
										<Card.Text key={j.id}>Teacher: {j.fullname}</Card.Text>
									) : <Card.Text></Card.Text>
								}
								<Card.Text>Review Point: {course.reviewPoint}</Card.Text>
								<Card.Text>Reviews: {course.reviews}</Card.Text>

								<Card.Text>Price: {course.price}</Card.Text>
								<Card.Text>{course.descriptionShort}</Card.Text>
								<br></br>
							</Card.Body>
							<Card.Footer style={{ borderTop: 'none' }}>
								<center>
									<Button variant="primary" size="lg" onClick={handleShow}>Detail</Button>
								</center>
							</Card.Footer>
						</Card>
					)
				}
			})()}

			<Modal show={show} onHide={handleClose} dialogClassName="modal-90w" scrollable="true">
				<Modal.Header closeButton>
					<Modal.Title>{course.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Alert variant="danger" show={alertActive} onClose={() => setAlertActive(false)} dismissible>
						<Alert.Heading>Your Account Is Not Active!</Alert.Heading>
						<p>
							Your account is not active by otp code, please get it in your mail
							and confirm in your profile!
                    </p>
					</Alert>
					<Row>
						<Col>
							<Card>
								{/* <Card.Header> */}
								{/* <Player
                    playsInline
                    src={axiosInstance.get("/courses/" + course.id + "/resources/" + JSON.parse(course.outline).uploadFilenames[0])}
                  /> */}

								{/* <Player
      playsInline
      poster={require("../../img/java.jpg").default}
      src={video}
    /> */}

								{/* {(() => {
										if (course.outline) {
											const outline = JSON.parse(course.outline);
											return (
												<iframe
													title={course.title}
													allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen={false}
													src={"http://localhost:3001/resources/" + outline.uploadDir + outline.uploadFilenames[0]}
													// src={"http://localhost:3001/resources/" + '\\08f60dae-3572-48ba-8d6f-fa8c23fbf1b7\\Kalinka.mp4'}
													width="100%"
													height="400px"
													frameBorder="0"
												></iframe>)
										}
									})()} */}
								{/* </Card.Header> */}
								<Card.Body>
									{
										// store.payment ? store.account ? store.payment.filter(i => i.courseId === course.id && i.userId === store.account.id).map(
										//   <Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" onClick={()=>addCourse(course.id)} disable="true">
										//     Purchase this course
										//   </Button>
										// ) : <Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" onClick={()=>addCourse(course.id)} disable="true">
										//       Purchase this course
										//     </Button> : <Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" onClick={()=>addCourse(course.id)} disable="true">
										//     Purchase this course
										//   </Button>

										// store.payment ? store.payment.filter(i => i.courseId === course.id && i.userId === parseJwt(localStorage.account_accessToken).userId).map(
										//   <Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" disabled>
										//        Purchase this course
										//   </Button>
										//  ) : <Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" onClick={()=>addCourse(course.id)}>
										//     Purchase this course
										//   </Button>

										// (() => {
										//   if (store.payment) {
										//     for (var i of store.payment) {
										//       if (i.courseId === course.id) {
										//         if (i.userId === parseJwt(localStorage.account_accessToken).userId) {
										//           handleClose();
										//           return ;
										//         }
										//       }
										//     }
										//   }
										// })()
									}
									<Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" onClick={() => addCourse(course.id)} disabled={disableButton}>Purchase this course</Button>

									<Card.Text><b>Introduce: </b> {course.descriptionShort}</Card.Text>
									<Card.Text><b>Detail: </b>{course.descriptionLong}</Card.Text>
									<Card.Text><b>Point: </b>{course.reviewPoint}</Card.Text>
									<Card.Text><b>Reviews: </b>{course.reviews}</Card.Text>
									<Card.Text><b>Subcribe: </b>{course.participants}</Card.Text>
									<Card.Text><b>Price: </b>{course.price}$</Card.Text>
									<Card.Text><b>Sale: </b>{course.sale}</Card.Text>
									<Card.Text><b>Modified Date: </b>{course.modifiedDate}</Card.Text>

									{store.teacher ? store.teacher.filter(i => i.id === course.teacherId).map(j =>
										<Card.Text key={j.id}><b>Teacher: </b>{j.fullname}</Card.Text>) : <Card.Text></Card.Text>
									}
									{(() => {

										if (!like) {
											return <Card.Text style={{ color: 'red', fontSize: 25 }} onClick={() => likeClicked()}><FaRegHeart /></Card.Text>
										} else {
											return <Card.Text style={{ color: 'red', fontSize: 25 }} onClick={() => likeClicked()}><FaHeart /></Card.Text>
										}
									})()}
								</Card.Body>
							</Card>
						</Col>
						<Col >
							<Card.Text><b>Outline: </b></Card.Text>
							<div style={{ height: 400, overflowY: 'auto' }}>
								<Row>
									<Col>
										<Accordion>
											{checkPurchase() ? (outline ? outline.map((i, index) =>
											(<Card key={'sup' + index} className="mb-0">
												{/* <Accordion.Toggle as={Card.Header} variant="link" eventKey={index+1}>
														<p dangerouslySetInnerHTML={{ __html: i.content }} />
												</Accordion.Toggle> */}
												{/* <Card.Header> */}
												<ContextAwareToggle eventKey={index + 1}><h4 dangerouslySetInnerHTML={{ __html: i.content }} /></ContextAwareToggle>
												{/* </Card.Header> */}
												<Accordion.Collapse eventKey={index + 1}>
													<Card.Body>
														{/* <iframe
													title={course.title}
													allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen={true}
													src={"http://localhost:3001/resources/" + i.uploadDir + i.uploadFilename}
													width="100%"
													height="400px"
													frameBorder="0"
													autoPlay="false"
												></iframe> */}
														<video width="100%" height="400px" controls>
															<source src={"http://localhost:3001/resources/" + i.uploadDir + i.uploadFilename} type="video/mp4" autoPlay={false} />
														</video>
													</Card.Body>
												</Accordion.Collapse>
											</Card>)
											) : <Card></Card>) : (previewOutline ? previewOutline.map((i, index) =>
											(<Card key={'sup' + index} className="mb-0">
												{/* <Accordion.Toggle as={Card.Header} variant="link" eventKey={index+1}>
														<p dangerouslySetInnerHTML={{ __html: i.content }} />
												</Accordion.Toggle> */}
												{/* <Card.Header> */}
												<ContextAwareToggle eventKey={index + 1}><h4 dangerouslySetInnerHTML={{ __html: i.content }} /></ContextAwareToggle>
												{/* </Card.Header> */}
												<Accordion.Collapse eventKey={index + 1}>
													<Card.Body>
														{/* <iframe
													title={course.title}
													allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen={true}
													src={"http://localhost:3001/resources/" + i.uploadDir + i.uploadFilename}
													width="100%"
													height="400px"
													frameBorder="0"
													autoPlay="false"
												></iframe> */}
														<video width="100%" height="400px" controls>
															<source src={"http://localhost:3001/resources/" + i.uploadDir + i.uploadFilename} type="video/mp4" autoPlay={false} />
														</video>
													</Card.Body>
												</Accordion.Collapse>
											</Card>)
											) : <Card></Card>)
											}

										</Accordion>
									</Col>
								</Row>
								<Row>
									<Col>
										{store.accountInfo ? localStorage.account_type !== 1 ? [...Array(addMoreUpload)].map((_, i) => <VideoUploadForm key={'updatea' + i} count={i} />) : "" : ""}
									</Col>
								</Row>
								<Row>
									<Col className="d-flex justify-content-center">
										{store.accountInfo ? localStorage.account_type !== 1 ? <Button variant="outline-dark" className="button my-1 mx-auto" onClick={() => setAddMoreUpload(addMoreUpload + 1)} style={{ float: "right" }}>Add more outline</Button> : "" : ""}
									</Col>
								</Row>
								<Row className="my-4">
									<Col>
										{store.accountInfo ? localStorage.account_type !== 1 ?
											<Form onSubmit={handleSubmit(uploadOldCourse)}>
												<Card>
													<Card.Body>
														<Card.Title as="h3"><center>Course upload</center></Card.Title>
														<hr></hr>
														<Form.Group controlId="title">
															<Form.Label>Title</Form.Label>
															<Form.Control type="text" defaultValue={course.title == null ? "" : course.title} name="title" placeholder="Course title" ref={register} required />
														</Form.Group>

														<Form.Group controlId="descriptionShort">
															<Form.Label>Description Short</Form.Label>
															<Form.Control type="text" defaultValue={course.descriptionShort == null ? "" : course.descriptionShort} name="descriptionShort" placeholder="Course description short" ref={register} required />
														</Form.Group>

														<Form.Group controlId="descriptionLong">
															<Form.Label>Description Long</Form.Label>
															<Form.Control type="text" defaultValue={course.descriptionLong == null ? "" : course.descriptionLong} name="descriptionLong" placeholder="Course description long" ref={register} required />
														</Form.Group>

														<Form.Group controlId="category">
															<Form.Label>Category</Form.Label>
															<Form.Control as="select" defaultValue={course.categoryId == null ? "" : course.categoryId} name="category" ref={register} required >
																{store.categories.map(c => <option key={c.id} value={c.id}> {c.title}</option>)}
															</Form.Control>
														</Form.Group>
														<Form.Check type="switch" defaultChecked={course.isCompleted == null ? "" : course.isCompleted} name="isCompleted" id={course.id + "updaated"} label="Complete Course" ref={register} />
													</Card.Body>
													<Card.Footer>
														<Button className="float-right py-2" variant="primary" type="submit">Upload</Button>
													</Card.Footer>
												</Card>
											</Form> : "" : ""
										}
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
					<Row>
						<Col>
							<Card>
								<Card.Body>
									<Card.Text><b>Feedback:</b></Card.Text>
									{
										loadContent()
									}
									<Form onSubmit={handleSubmit(onSubmit)}>
										<Form.Group>
											<Form.Label>Review of You:</Form.Label>
											<Form.Text><i>Point</i></Form.Text>
											<Form.Control name="point" as="select" defaultValue='10' ref={register({ required: true })} >
												<option value='0'>0</option>
												<option value='1'>1</option>
												<option value='2'>2</option>
												<option value='3'>3</option>
												<option value='4'>4</option>
												<option value='5'>5</option>
												<option value='6'>6</option>
												<option value='7'>7</option>
												<option value='8'>8</option>
												<option value='9'>9</option>
												<option value='10'>10</option>
											</Form.Control>
											<Form.Text><i>Comment</i></Form.Text>
											<Form.Control name="content" as="textarea" rows={3} ref={register({ required: false })} />
										</Form.Group>
										<Button variant="primary" type="submit">Submit</Button>
									</Form>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col></Col>
						<Col xs={5}>
							<Carousel>
								{courseRef.map(i =>
									<Carousel.Item key={i.id}>
										<Card>
											<Card.Img src={require('../../img/java.jpg').default} />
											<Card.Body>
												<Button size="lg" className="mb-2" style={{ float: 'right' }} variant="success" onClick={() => addCourse(i.id)}>
													Purchase this course
                        </Button>
												<Card.Text><b>Course Name: </b>{i.title}</Card.Text>
												<Card.Text><b>Subcribe: </b>{i.participants}</Card.Text>
											</Card.Body>
										</Card>
									</Carousel.Item>
								)}
							</Carousel>
						</Col>
						<Col></Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
          </Button>
				</Modal.Footer>
			</Modal>
		</div >
	)
}
