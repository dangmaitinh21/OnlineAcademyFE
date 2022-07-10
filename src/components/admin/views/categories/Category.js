import React, { lazy, useState, useEffect, useReducer, forwardRef, useContext } from 'react'
import { axiosInstance, parseJwt } from '../../../../utils';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, FormCheck, Col, Row } from 'react-bootstrap';
import reducer from '../../categoryReducer';
import AppContext from '../../categoryContext';
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



export default function Category(props) {
	const [categoryTable, setCategoryTable] = useState([]);
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
	// const initialCategoryData = { query: '', items: [] }
	// const [store, dispatch] = useReducer(reducer, initialCategoryData);
	const {store, dispatch} = useContext(ApppContext);
	const defaulteCategory = { id: null, title: null, description: null }

	// useEffect(function () {
	// 	async function loadDataCategory() {
	// 		const res = await axiosInstance.get('/categories', { headers: { 'x-access-token': localStorage.account_accessToken } });
	// 		if (res.status === 200) {
	// 			dispatch({
	// 				type: 'init',
	// 				payload: {
	// 					items: res.data,
	// 					query: ''
	// 				}
	// 			});
	// 		}
	// 	}
	// 	loadDataCategory();
	// }, []);
	const columns = [
		{ title: "ID", field: "id" },
		{ title: "Title", field: "title" },
		{ title: "Description", field: "description" },
		{ title: "Level", field: "level" },
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
	const reLoadDataCategory = async function () {
		const res = await axiosInstance.get('/categories', { headers: { 'x-access-token': localStorage.account_accessToken } });
		if (res.status === 200) {
			dispatch({
				type: 'initCategory',
				payload: {
					items: res.data,
					query: ''
				}
			});
		}
	}

	const handleDetail = async function (dataRow) {
		setCategoryTable(defaulteCategory);
		let id = dataRow.id;
		// let res = await axiosInstance.get('/categories/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		// if (res.status === 200) {
		// 	setCategoryTable(res.data);
		// }
		setCategoryTable((store.categories.filter(item => item.id===id))[0]);
		handleShowModelDetail();
	}

	const handleEdit = async function (dataRow) {
		setCategoryTable(defaulteCategory);
		let id = parseInt(dataRow.id);
		// let res = await axiosInstance.get('/categories/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		// if (res.status === 200) {
		// 	setCategoryTable(res.data);
		// }
		setCategoryTable((store.categories.filter(item => item.id===id))[0]);
		handleShowModelEdit();
	}

	const handleDelete = async function (dataRow) {
		setCategoryTable(defaulteCategory);
		let id = dataRow.id;
		// let res = await axiosInstance.get('/categories/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
		// if (res.status === 200) {
		// 	setCategoryTable(res.data);
		// }
		setCategoryTable((store.categories.filter(item => item.id===id))[0]);
		handleShowModelDelete();
	}

	const handleNew = async function (dataRow) {
		handleShowModelNew();
	}

	const onSubmitUpdate = async function (data) {
		try {
			if (data != null && data.id > 0) {
				const id = data.id;
				data.level = parseInt(data.level);
				data.owned = parseInt(data.owned);
				delete data.id;
				let res = await axiosInstance.put('/categories/' + id, data, {
					headers: { 'x-access-token': localStorage.account_accessToken }
				});
				if (res.status === 201) {
					reLoadDataCategory();
					swal({
						title: "Category is updated",
						text: "Category ID " + id + " updated",
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
			swal({
				title: "Failed",
				text: err.response.data.message,
				icon: "danger",
				button: "OK"
			});
		}
	}

	const onSubmitDelete = async function (data) {
		try {
			if (data != null && data.id > 0) {
				let id = data.id;
				let res = await axiosInstance.delete('/categories/' + id, {
					headers: { 'x-access-token': localStorage.account_accessToken }
				});
				if (res.status === 200) {
					reLoadDataCategory();
					swal({
						title: "Category is deleted",
						text: "Category ID " + id + " deleted",
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
			swal({
				title: "Failed",
				text: "Category has course",
				icon: "danger",
				button: "OK"
			});
		}
	}

	const onSubmitNew = async function (data) {
		try {
			if (data != null) {
				if (data.id) {
					delete data.id;
				}
				data.level = parseInt(data.level);
				data.owned = parseInt(data.owned);
				let res = await axiosInstance.post('/categories', data, {
					headers: { 'x-access-token': localStorage.account_accessToken }
				});
				if (res.status === 201) {
					reLoadDataCategory();
					swal({
						title: "Category is created",
						text: "Category ID " + res.data.id + " created",
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
									Category List from Academy
            </h3>
								<div className="card-body">
									<div className="row">
										<button className="btn btn-warning" onClick={reLoadDataCategory}>Reload</button>
										<button className="btn btn-primary" onClick={handleNew}>New</button>
									</div>
									<br></br>
									<div style={{ maxWidth: '100%' }}>
										<MaterialTable columns={columns} data={store.categories?store.categories:[]} icons={tableIcons} title={null}
											actions={[
												{
													icon: tableIcons.DetailsIcon,
													tooltip: 'Detail Category',
													onClick: (event, rowData) => handleDetail(rowData)
												},
												{
													icon: tableIcons.Edit,
													tooltip: 'Modify Category',
													onClick: (event, rowData) => handleEdit(rowData)
												},
												{
													icon: tableIcons.Delete,
													tooltip: 'Delete Category',
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
						<Modal.Title>Detail Category</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Row>
								<Col>
									<Form.Group >
										<Form.Label>ID</Form.Label>
										<Form.Control type="text" name="id" value={categoryTable? categoryTable.id:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Title</Form.Label>
										<Form.Control type="text" name="title" value={categoryTable? categoryTable.title:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Description</Form.Label>
										<Form.Control type="text" name="description" value={categoryTable?categoryTable.description:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Level</Form.Label>
										<Form.Control type="number" name="level" value={categoryTable?categoryTable.level:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Owned</Form.Label>
										<Form.Control type="number" name="owned" value={categoryTable?categoryTable.owned:""} readOnly />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group >
										<Form.Label>Created Date</Form.Label>
										<Form.Control type="text" name="createdDate" value={categoryTable?categoryTable.createdDate:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Modified Date</Form.Label>
										<Form.Control type="text" name="modifiedDate" value={categoryTable?categoryTable.modifiedDate:""} readOnly />
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
					<Form onSubmit={handleSubmit(onSubmitUpdate)}>
						<Modal.Header closeButton>
							<Modal.Title>Update Category</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Group >
								<Form.Label>ID</Form.Label>
								<Form.Control type="text" name="id" value={categoryTable?categoryTable.id:""} ref={register} required readOnly />
							</Form.Group>
							<Form.Group >
								<Form.Label>Title</Form.Label>
								<Form.Control type="text" name="title" defaultValue={categoryTable?categoryTable.title:""} ref={register} required autoFocus />
							</Form.Group>
							<Form.Group >
								<Form.Label>Description</Form.Label>
								<Form.Control type="text" name="description" defaultValue={categoryTable?categoryTable.description:""} ref={register} required />
							</Form.Group>
							<Form.Group >
								<Form.Label>Level</Form.Label>
								<Form.Control type="number" name="level" defaultValue={categoryTable?categoryTable.level:""} ref={register} required />
							</Form.Group>
							<Form.Group >
								<Form.Label>Owned</Form.Label>
								<Form.Control type="number" name="owned" defaultValue={categoryTable?categoryTable.owned:""} ref={register} required />
							</Form.Group>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" type="submit">Update</Button>
							<Button variant="secondary" onClick={handleCloseModalEdit}>Close</Button>
						</Modal.Footer>
					</Form>
				</Modal>
				<Modal show={showModalDelete} onHide={handleCloseModalDelete}>
					<Form onSubmit={handleSubmit(onSubmitDelete)}>
						<Modal.Header closeButton>
							<Modal.Title>Delete Category</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Row>
								<Col>
									<Form.Group >
										<Form.Label>ID</Form.Label>
										<Form.Control type="text" name="id" defaultValue={categoryTable?categoryTable.id:""} ref={register} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Title</Form.Label>
										<Form.Control type="text" name="title" defaultValue={categoryTable?categoryTable.title:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Description</Form.Label>
										<Form.Control type="text" name="description" defaultValue={categoryTable?categoryTable.description:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Level</Form.Label>
										<Form.Control type="number" name="level" defaultValue={categoryTable?categoryTable.level:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Owned</Form.Label>
										<Form.Control type="number" name="owned" defaultValue={categoryTable?categoryTable.owned:""} readOnly />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group >
										<Form.Label>Created Date</Form.Label>
										<Form.Control type="text" name="createdDate" defaultValue={categoryTable?categoryTable.createdDate:""} readOnly />
									</Form.Group>
									<Form.Group >
										<Form.Label>Modified Date</Form.Label>
										<Form.Control type="text" name="modifiedDate" defaultValue={categoryTable?categoryTable.modifiedDate:""} readOnly />
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
					<Form onSubmit={handleSubmit(onSubmitNew)} id="newForm">
						<Modal.Header closeButton>
							<Modal.Title>New Category</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form.Group id="newTitle">
								<Form.Label>Title</Form.Label>
								<Form.Control type="text" name="title" ref={register} required autoFocus />
							</Form.Group>
							<Form.Group id="newdes">
								<Form.Label>Description</Form.Label>
								<Form.Control type="text" name="description" ref={register} required />
							</Form.Group>
							<Form.Group id="newLevle">
								<Form.Label>Level</Form.Label>
								<Form.Control type="number" name="level" ref={register} required />
							</Form.Group>
							<Form.Group id="newOwn">
								<Form.Label>Owned</Form.Label>
								<Form.Control type="number" name="owned" ref={register} required />
							</Form.Group>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="success" type="submit" id="newFormSub">Create</Button>
							<Button variant="secondary" onClick={handleCloseModalNew}>Close</Button>
						</Modal.Footer>
					</Form>
				</Modal>
			{/* </AppContext.Provider> */}
		</div>
	);
}
