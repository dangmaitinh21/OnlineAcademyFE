import React, { useState, forwardRef, useContext } from 'react'
import { axiosInstance } from '../../../../utils';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Col, Row, ToggleButton, ButtonGroup } from 'react-bootstrap';
import ApppContext from '../../adminContext';
import swal from 'sweetalert';

import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import DetailsIcon from '@material-ui/icons/Details';



export default function User(props) {
	const [userTable, setUserTable] = useState([]);
	const { register, handleSubmit, watch, errors } = useForm();
	const [showModalDetail, setShowModalDetail] = useState(false);
	const [showModalEdit, setShowModalEdit] = useState(false);
	const [showModalDelete, setShowModalDelete] = useState(false);
	const [showModalNew, setShowModalNew] = useState(false);
	const [disableChangePassword, setDisableChangePassword] = useState(true);
	const handleDisableChangePassword = () => { disableChangePassword ? setDisableChangePassword(false) : setDisableChangePassword(true) };
	const [disableChangeStatus, setDisableChangeStatus] = useState(true);
	const handleDisableChangeStatus = () => { disableChangeStatus ? setDisableChangeStatus(false) : setDisableChangeStatus(true) };
	const handleShowModelDetail = () => setShowModalDetail(true);
	const handleCloseModalDetail = () => setShowModalDetail(false);
	const handleShowModelEdit = () => setShowModalEdit(true);
	const handleCloseModalEdit = () => setShowModalEdit(false);
	const handleShowModelDelete = () => setShowModalDelete(true);
	const handleCloseModalDelete = () => setShowModalDelete(false);
	const handleShowModelNew = () => setShowModalNew(true);
	const handleCloseModalNew = () => setShowModalNew(false);
	const [radioValue, setRadioValue] = useState('1');
	// const initialUserData = { query: '', items: [] }
	// const [store, dispatch] = useReducer(reducer, initialUserData);
	const {store, dispatch} = useContext(ApppContext);
	const defaulteUser = { id: null, email: null, fullname: null }

	// useEffect(function () {
	// 	async function loadDataUser() {
	// 		const res = await axiosInstance.get('/users', { headers: { 'x-access-token': localStorage.account_accessToken } });
	// 		if (res.status === 200) {
	// 			res.data.map(item => {
	// 				return item.type===1?item.typeName="Student":item.type===2?item.typeName="Teacher":item.type===3?item.typeName="Admin":""; 
	// 			});
	// 			dispatch({
	// 				type: 'initUser',
	// 				payload: {
	// 					items: res.data,
	// 					query: ''
	// 				}
	// 			});
	// 		}
	// 	}
	// 	loadDataUser();
	// }, []);
	const radios = [
		{ name: 'Show all account', value: '1' },
		{ name: 'Show only teacher account', value: '2' },
		{ name: 'Show only student account', value: '3' },
	];
	const columns = [
		{ title: "ID", field: "id" },
		{ title: "Fullname", field: "fullname" },
		{ title: "Email", field: "email" },
		{ title: "Type", field: "typeName" }
	];

	const tableIcons = {
		Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
		Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
		Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
		Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
		DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
		Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
		Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
		Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
		FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
		LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
		NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
		PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
		ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
		Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
		SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
		ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
		ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
		DetailsIcon: forwardRef((props, ref) => <DetailsIcon {...props} ref={ref} />)
	};
	const reLoadDataUser = async function () {
		const res = await axiosInstance.get('/users', { headers: { 'x-access-token': localStorage.account_accessToken } });
		if (res.status === 200) {
			res.data.map(item => {
				return item.type===1?item.typeName="Student":item.type===2?item.typeName="Teacher":item.type===3?item.typeName="Admin":""; 
			});
			dispatch({
				type: 'initUser',
				payload: {
					items: res.data,
					query: ''
				}
			});
		}
	}
	const reLoadDataOnlyTeacher = async function () {
		const res = await axiosInstance.get('/users/teacher', { headers: { 'x-access-token': localStorage.account_accessToken } });
		if (res.status === 200) {
			res.data.map(item => {
				return item.type===1?item.typeName="Student":item.type===2?item.typeName="Teacher":item.type===3?item.typeName="Admin":""; 
			});
			dispatch({
				type: 'initUser',
				payload: {
					items: res.data,
					query: ''
				}
			});
		}
	}
	const reLoadDataOnlyStudent = async function () {
		const res = await axiosInstance.get('/users/student', { headers: { 'x-access-token': localStorage.account_accessToken } });
		if (res.status === 200) {
			res.data.map(item => {
				return item.type===1?item.typeName="Student":item.type===2?item.typeName="Teacher":item.type===3?item.typeName="Admin":""; 
			});
			dispatch({
				type: 'initUser',
				payload: {
					items: res.data,
					query: ''
				}
			});
		}
	}

	const handleFilterShowAccount = async function(value) {
		switch(parseInt(value)) {
			case 1:
				await reLoadDataUser();
				break;
			case 2:
				await reLoadDataOnlyTeacher();
				break;
			case 3:
				await reLoadDataOnlyStudent();
				break;
			default:
				break;
		}
	}

	const handleDetail = async function (dataRow) {
		setUserTable(defaulteUser);
		let id = dataRow.id;
		// let res = await axiosInstance.get('/users/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		// if (res.status === 200) {
		// 	setUserTable(res.data);
		// }
		setUserTable((store.users.filter(item => item.id===id))[0]);
		handleShowModelDetail();
	}

	const handleEdit = async function (dataRow) {
		setUserTable(defaulteUser);
		let id = dataRow.id;
		// let res = await axiosInstance.get('/users/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		// if (res.status === 200) {
		// 	setUserTable(res.data);
		// }
		setUserTable((store.users.filter(item => item.id===id))[0]);
		handleShowModelEdit();
	}

	const handleDelete = async function (dataRow) {
		setUserTable(defaulteUser);
		let id = dataRow.id;
		// let res = await axiosInstance.get('/users/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		// if (res.status === 200) {
		// 	setUserTable(res.data);
		// }
		setUserTable((store.users.filter(item => item.id===id))[0]);
		handleShowModelDelete();
	}

	const handleNew = async function (dataRow) {
		handleShowModelNew();
	}

	const onSubmitUpdateUser = async function (data) {
		try {
			if (data != null && data.id > 0) {
				let id = data.id;
				data.type = parseInt(data.type);
				data.isActive = parseInt(data.isActive);
				delete data.id;
				let res = await axiosInstance.put('/users/' + id, data, {
					headers: { 'x-access-token': localStorage.account_accessToken }
				});
				if (res.status === 200) {
					reLoadDataUser();
					swal({
						title: "Account is updated",
						text: "User ID " + id + " updated",
						icon: "success",
						button: "OK"
					});
					handleCloseModalEdit();
				} else {
					swal({
						title: "Failed",
						icon: "danger",
						button: "OK"
					});
				}
			} else {
				swal({
					title: "Failed",
					icon: "danger",
					button: "OK"
				});
			}
		} catch (err) {
			console.log(err.response.data);
		}
	}

	const onSubmitDeleteUser = async function (data) {
		try {
			if (data != null && data.id > 0) {
				let id = data.id;
				let res = await axiosInstance.delete('/users/' + id, {
					headers: { 'x-access-token': localStorage.account_accessToken }
				});
				if (res.status === 200) {
					reLoadDataUser();
					swal({
						title: "Account is deleted",
						text: "User ID " + id + " deleted",
						icon: "success",
						button: "OK"
					});
					handleCloseModalDelete();
				} else {
					swal({
						title: "Failed",
						icon: "danger",
						button: "OK"
					});
				}
			} else {
				swal({
					title: "Failed",
					icon: "danger",
					button: "OK"
				});
			}
		} catch (err) {
			console.log(err.response.data);
		}
	}

	const onSubmitNewUser = async function (data) {
		try {
			if (data != null) {
				data.type = parseInt(data.type);
				let res = await axiosInstance.post('/users', data, {
					headers: { 'x-access-token': localStorage.account_accessToken }
				});
				if (res.status === 201) {
					reLoadDataUser();
					swal({
						title: "Account is created",
						text: "User ID " + res.data.id + " created",
						icon: "success",
						button: "OK"
					});
					//handleCloseModalNew();
				} else {
					swal({
						title: "Failed",
						icon: "danger",
						button: "OK"
					});
				}
			} else {
				swal({
					title: "Failed",
					icon: "danger",
					button: "OK"
				});
			}
		} catch (err) {
			console.log(err.response.data);
			swal({
				title: "Failed",
				text: err.response.data.message,
				icon: "danger",
				button: "OK"
			});
		}
	}

	return (
		<div>
			{/* <AppContext.Provider value={{ store, dispatch }}> */}
				<div className="container mt-3">
					<div className="row mt-3">
						<div className="col-sm-12">
							<div className="card shadow">
								<h3 className="card-header d-flex">
									User List from Academy
            </h3>
								<div className="card-body">
									<div className="row">
										<button className="btn btn-warning" onClick={reLoadDataUser}>Reload</button>
										<button className="btn btn-primary" onClick={handleNew}>New Account Teacher</button>
									</div>
									<br />
									<div className="row">
										<ButtonGroup toggle>
											{radios.map((radio, idx) => (
												<ToggleButton
													key={idx}
													type="radio"
													variant="secondary"
													name="radio"
													value={radio.value}
													checked={radioValue === radio.value}
													onChange={(e) => {setRadioValue(e.currentTarget.value); handleFilterShowAccount(e.currentTarget.value);}}
												>
													{radio.name}
												</ToggleButton>
											))}
										</ButtonGroup>
									</div>
									<br></br>
									<div style={{ maxWidth: '100%' }}>
										<MaterialTable columns={columns} data={store.users} icons={tableIcons} title={null}
											actions={[
												{
													icon: tableIcons.DetailsIcon,
													tooltip: 'Detail User',
													onClick: (event, rowData) => handleDetail(rowData)
												},
												{
													icon: tableIcons.Edit,
													tooltip: 'Modify user',
													onClick: (event, rowData) => handleEdit(rowData)
												},
												{
													icon: tableIcons.Delete,
													tooltip: 'Delete User',
													onClick: (event, rowData) => handleDelete(rowData)
												}
											]}
										/>
									</div>
								</div>
								<div className="card-footer text-muted">
									Footer
          </div>
							</div>
						</div>
					</div>
				</div>
				<Modal show={showModalDetail} onHide={handleCloseModalDetail}>
					<Modal.Header closeButton>
						<Modal.Title>Detail User</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Row>
								<Col>
									<Form.Group >
										<Form.Label>ID</Form.Label>
										<Form.Control type="text" name="id" value={userTable.id == null ? "" : userTable.id} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Fullname</Form.Label>
										<Form.Control type="text" name="fullname" value={userTable.fullname == null ? "" : userTable.fullname} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Email</Form.Label>
										<Form.Control type="email" name="email" value={userTable.email == null ? "" : userTable.email} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Type</Form.Label>
										<Form.Control type="text" name="type" value={userTable.type == null ? "" : userTable.type === 1 ? "Student" : userTable.type === 2 ? "Teacher" : "Admin"} readOnly />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group >
										<Form.Label>Active</Form.Label>
										<Form.Control type="text" name="isActive" value={userTable.isActive == null ? "" : userTable.isActive === 1 ? "Yes" : "No"} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Watch List</Form.Label>
										<Form.Control type="text" name="watchlist" value={userTable.watchlist == null ? "" : userTable.watchlist} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Created Date</Form.Label>
										<Form.Control type="text" name="createdDate" value={userTable.createdDate == null ? "" : userTable.createdDate} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Modified Date</Form.Label>
										<Form.Control type="text" name="modifiedDate" value={userTable.modifiedDate == null ? "" : userTable.modifiedDate} readOnly />
									</Form.Group>
								</Col>
							</Row>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseModalDetail}>Close</Button>
					</Modal.Footer>
				</Modal>
				<Modal show={showModalEdit} onHide={handleCloseModalEdit}>
					<Form onSubmit={handleSubmit(onSubmitUpdateUser)}>
						<Modal.Header closeButton>
							<Modal.Title>Update User</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Group >
								<Form.Label>ID</Form.Label>
								<Form.Control type="text" name="id" value={userTable.id == null ? "" : userTable.id} ref={register} required readOnly />
							</Form.Group>
							<Form.Group >
								<Form.Label>Fullname</Form.Label>
								<Form.Control type="text" name="fullname" defaultValue={userTable.fullname == null ? "" : userTable.fullname} ref={register} required autoFocus />
							</Form.Group>
							{/* <Form.Group >
								<Form.Check type="switch" id="custom-switch" label="Change password" onChange={handleDisableChangePassword}/>
								<Form.Label>Password</Form.Label>
								<Form.Control type="text" name="password" ref={register({ required: !{disableChangePassword} })} disabled={disableChangePassword} />
							</Form.Group> */}
							<Form.Group >
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" name="email" defaultValue={userTable.email == null ? "" : userTable.email} ref={register} required readOnly />
							</Form.Group>
							<Form.Group>
								<Form.Label>Type</Form.Label>
								<Form.Control as="select" name="type" defaultValue={userTable.id == null ? -1 : userTable.type == null ? "" : userTable.type === 1 ? 1 : userTable.type === 2 ? 2 : 3} ref={register} required >
									<option value="1">Student</option>
									<option value="2">Teacher</option>
									<option value="3">Admin</option>
								</Form.Control>
							</Form.Group>
							<Form.Group>
								<Form.Label>Active</Form.Label>
								<Form.Control as="select" name="isActive" defaultValue={userTable.id == null ? "" : userTable.isActive == null ? "" : userTable.isActive === 1 ? 1 : 0} ref={register} required >
									<option value="1">Yes</option>
									<option value="0">No</option>
								</Form.Control>
							</Form.Group>
							{/* <Form.Group>
								<Form.Label>Status</Form.Label>
								<Form.Check type="switch" id="custom-switch" label="Restore user" onChange={handleDisableChangeStatus} disabled={userTable.isDeleted == null ? true : userTable.isDeleted === 1 ? false : true} />
								<Form.Control as="select" name="isActive" defaultValue={userTable.isDeleted == null ? "" : userTable.isDeleted === 1 ? 1 : 0} ref={register({ required: !{disableChangeStatus} })} disabled={disableChangeStatus}>
									<option value="1">User is deleted</option>
									<option value="0">User is live</option>
								</Form.Control>
							</Form.Group> */}
							{/* <Form.Group >
								<Form.Label>Watch List</Form.Label>
								<Form.Control type="text" name="watchlist" defaultValue={userTable.watchlist == null ? "" : userTable.watchlist} ref={register} />
							</Form.Group> */}
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" type="submit">Update</Button>
							<Button variant="secondary" onClick={handleCloseModalEdit}>Close</Button>
						</Modal.Footer>
					</Form>
				</Modal>
				<Modal show={showModalDelete} onHide={handleCloseModalDelete}>
					<Form onSubmit={handleSubmit(onSubmitDeleteUser)}>
						<Modal.Header closeButton>
							<Modal.Title>Delete User</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Row>
								<Col>
									<Form.Group >
										<Form.Label>ID</Form.Label>
										<Form.Control type="text" name="id" defaultValue={userTable.id == null ? "" : userTable.id} ref={register} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Fullname</Form.Label>
										<Form.Control type="text" name="fullname" defaultValue={userTable.fullname == null ? "" : userTable.fullname} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Email</Form.Label>
										<Form.Control type="text" name="email" defaultValue={userTable.email == null ? "" : userTable.email} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Type</Form.Label>
										<Form.Control type="text" name="type" defaultValue={userTable.type == null ? "" : userTable.type === 1 ? "Student" : userTable.type === 2 ? "Teacher" : "Admin"} readOnly />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group >
										<Form.Label>Active</Form.Label>
										<Form.Control type="text" name="isActive" defaultValue={userTable.isActive == null ? "" : userTable.isActive === 1 ? "Yes" : "No"} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Watch List</Form.Label>
										<Form.Control type="text" name="watchlist" defaultValue={userTable.watchlist == null ? "" : userTable.watchlist} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Created Date</Form.Label>
										<Form.Control type="text" name="createdDate" defaultValue={userTable.createdDate == null ? "" : userTable.createdDate} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Modified Date</Form.Label>
										<Form.Control type="text" name="modifiedDate" defaultValue={userTable.modifiedDate == null ? "" : userTable.modifiedDate} readOnly />
									</Form.Group>
								</Col>
							</Row>

						</Modal.Body>
						<Modal.Footer>
							<Button variant="danger" type="submit">Delete</Button>
							<Button variant="secondary" onClick={handleCloseModalDelete}>Close</Button>
						</Modal.Footer>
					</Form>
				</Modal>
				<Modal show={showModalNew} onHide={handleCloseModalNew}>
					<Form onSubmit={handleSubmit(onSubmitNewUser)}>
						<Modal.Header closeButton>
							<Modal.Title>New User</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Group >
								<Form.Label>Fullname</Form.Label>
								<Form.Control type="text" name="fullname" ref={register} required autoFocus />
							</Form.Group>
							<Form.Group >
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" name="email" ref={register} required />
							</Form.Group>
							<Form.Group >
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" name="password" ref={register} required />
							</Form.Group>
							<Form.Group>
								<Form.Label>Type</Form.Label>
								<Form.Control as="select" name="type" ref={register} required >
									<option value="2">Teacher</option>
									<option value="3">Admin</option>
								</Form.Control>
							</Form.Group>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="success" type="submit">Create</Button>
							<Button variant="secondary" onClick={handleCloseModalNew}>Close</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			{/* </AppContext.Provider> */}
		</div>
	);
}
