import React, { lazy, useState, useEffect, useReducer, forwardRef, useContext } from 'react'
import { axiosInstance, parseJwt } from '../../../../utils';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, FormCheck, Col, Row } from 'react-bootstrap';
import reducer from '../../courseReducer';
import AppContext from '../../courseContext';
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
import { TrendingUpRounded } from '@material-ui/icons';



export default function Course(props) {
    const [courseTable, setCourseTable] = useState([]);
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
    const { store, dispatch } = useContext(ApppContext);
    const defaultCourse = { id: null, title: null, descriptionShort: null, descriptionLong: null }

    // useEffect(function () {
    //     async function loadDataCourse() {
    //         const res = await axiosInstance.get('/courses', { headers: { 'x-access-token': localStorage.account_accessToken } });
    //         if (res.status === 200) {
    //             for (let i in res.data) {
    //                 let resGetTeacherEmail = await axiosInstance.get('/users/'+ res.data[i].teacherId, { headers: { 'x-access-token': localStorage.account_accessToken } });
    //                 if (resGetTeacherEmail.status === 200) {
    //                     res.data[i].teacher = resGetTeacherEmail.data.email;
    //                 }
    //                 let resGetCategoryTitle = await axiosInstance.get('/categories/'+ res.data[i].categoryId, { headers: { 'x-access-token': localStorage.account_accessToken } });
    //                 if (resGetCategoryTitle.status === 200) {
    //                     res.data[i].category = resGetCategoryTitle.data.title;
    //                 }
    //             }
    //             dispatch({
    //                 type: 'init',
    //                 payload: {
    //                     items: res.data,
    //                     query: ''
    //                 }
    //             });
    //         }
    //     }
    //     loadDataCourse();
    // }, []);
    let filteredList = [
        ...new Map(store.courses.map(obj => [`${obj.categoryId}:${obj.category}`, obj]))
            .values()
    ];
    var obj = filteredList.reduce(function (acc, cur, i) {
        acc[cur.categoryId] = cur.category;
        return acc;
    }, {});
    const columns = [
        { title: "ID", field: "id", filtering: false },
        { title: "Title", field: "title", filtering: false },
        { title: "Category Title", field: "categoryId", lookup: obj },
        { title: "Teacher Email", field: "teacher" },
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
    const reLoadDataCourse = async function () {
        const res = await axiosInstance.get('/courses', { headers: { 'x-access-token': localStorage.account_accessToken } });
        if (res.status === 200) {
            for (let i in res.data) {
                let resGetTeacherEmail = await axiosInstance.get('/users/' + res.data[i].teacherId, { headers: { 'x-access-token': localStorage.account_accessToken } });
                if (resGetTeacherEmail.status === 200) {
                    res.data[i].teacher = resGetTeacherEmail.data.email;
                }
                let resGetCategoryTitle = await axiosInstance.get('/categories/' + res.data[i].categoryId, { headers: { 'x-access-token': localStorage.account_accessToken } });
                if (resGetCategoryTitle.status === 200) {
                    res.data[i].category = resGetCategoryTitle.data.title;
                }
            }
            dispatch({
                type: 'initCourse',
                payload: {
                    items: res.data,
                    query: ''
                }
            });
        }
    }

    const handleDetail = async function (dataRow) {
        setCourseTable(defaultCourse);
        let id = dataRow.id;
        // let res = await axiosInstance.get('/courses/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
        // if (res.status === 200) {
        //     setCourseTable(res.data);
        // }
        setCourseTable((store.courses.filter(item => item.id === id))[0]);
        handleShowModelDetail();
    }

    const handleEdit = async function (dataRow) {
        setCourseTable(defaultCourse);
        let id = dataRow.id;
        // let res = await axiosInstance.get('/courses/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
        // if (res.status === 200) {
        //     setCourseTable(res.data);
        // }
        setCourseTable((store.courses.filter(item => item.id === id))[0]);
        handleShowModelEdit();
    }

    const handleDelete = async function (dataRow) {
        setCourseTable(defaultCourse);
        let id = dataRow.id;
        // let res = await axiosInstance.get('/courses/' + id, { headers: { 'x-access-token': localStorage.account_accessToken } });
        // if (res.status === 200) {
        //     setCourseTable(res.data);
        // }
        setCourseTable((store.courses.filter(item => item.id === id))[0]);
        handleShowModelDelete();
    }

    const handleNew = async function (dataRow) {
        handleShowModelNew();
    }

    const onSubmitUpdate = async function (data) {
        try {
            if (data != null && data.id > 0) {
                let id = data.id;
                data.price = parseInt(data.price);
                data.sale = parseInt(data.sale);
                data.categoryId = parseInt(data.categoryId);
                data.teacherId = parseInt(data.teacherId);
                delete data.id;
                let res = await axiosInstance.put('/courses/' + id, data, {
                    headers: { 'x-access-token': localStorage.account_accessToken }
                });
                if (res.status === 200) {
                    reLoadDataCourse();
                    swal({
                        title: "Course is updated",
                        text: "Course ID " + id + " updated",
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
                let res = await axiosInstance.delete('/courses/' + id, {
                    headers: { 'x-access-token': localStorage.account_accessToken }
                });
                if (res.status === 200) {
                    reLoadDataCourse();
                    swal({
                        title: "Course is deleted",
                        text: "Course ID " + id + " deleted",
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
                icon: "danger",
                button: "OK"
            });
        }
    }

    const onSubmitNew = async function (data) {
        try {
            if (data != null) {
                data.price = parseInt(data.price);
                data.sale = parseInt(data.sale);
                data.categoryId = parseInt(data.categoryId);
                data.teacherId = parseInt(data.teacherId);
                let res = await axiosInstance.post('/courses', data, {
                    headers: { 'x-access-token': localStorage.account_accessToken }
                });
                if (res.status === 201) {
                    reLoadDataCourse();
                    swal({
                        title: "Course is created",
                        text: "Course ID " + res.data.id + " created",
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
                                Course List from Academy
            </h3>
                            <div className="card-body">
                                <div className="row">
                                    <button className="btn btn-warning" onClick={reLoadDataCourse}>Reload</button>
                                    {/* <button className="btn btn-primary" onClick={handleNew}>New</button> */}
                                </div>
                                <br></br>
                                <div style={{ maxWidth: '100%' }}>
                                    <MaterialTable columns={columns} data={store.courses} icons={tableIcons} title={null}
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
                                        options={{
                                            filtering: true
                                        }}
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
                    <Modal.Title>Detail Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group >
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control type="text" name="id" value={courseTable.id == null ? "" : courseTable.id} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" value={courseTable.title == null ? "" : courseTable.title} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description Short</Form.Label>
                                    <Form.Control type="text" name="descriptionShort" value={courseTable.descriptionShort == null ? "" : courseTable.descriptionShort} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description Long</Form.Label>
                                    <Form.Control type="text" name="descriptionLong" value={courseTable.descriptionLong == null ? "" : courseTable.descriptionLong} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Thumbnail</Form.Label>
                                    <Form.Control type="text" name="thumbnail" value={courseTable.thumbnail == null ? "" : courseTable.thumbnail} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" name="price" value={courseTable.price == null ? "" : courseTable.price} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Sale</Form.Label>
                                    <Form.Control type="number" name="sale" value={courseTable.sale == null ? "" : courseTable.sale} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Review Point</Form.Label>
                                    <Form.Control type="number" name="reviewPoint" value={courseTable.reviewPoint == null ? "" : courseTable.reviewPoint} readOnly />
                                </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group >
                                    <Form.Label>Reviews</Form.Label>
                                    <Form.Control type="number" name="reviews" value={courseTable.reviews == null ? "" : courseTable.reviews} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Participants</Form.Label>
                                    <Form.Control type="number" name="participants" value={courseTable.participants == null ? "" : courseTable.participants} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Outline</Form.Label>
                                    <Form.Control type="text" name="outline" value={courseTable.outline == null ? "" : courseTable.outline} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Teacher</Form.Label>
                                    <Form.Control as="select" name="teacherId" defaultValue={courseTable.teacherId == null ? "" : courseTable.teacherId} ref={register} readOnly>
                                        {
                                            store.users?store.users.filter(it => it.type===2).map(item => 
                                                <option value={item.id}>{item.email}</option>
                                            ):""
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Category Title</Form.Label>
                                    <Form.Control as="select" name="categoryId" defaultValue={courseTable.categoryId == null ? "" : courseTable.categoryId} ref={register} readOnly>
                                        {
                                            store.categories?store.categories.map(item => 
                                                <option value={item.id}>{item.title}</option>
                                            ):""
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Complete Status</Form.Label>
                                    <Form.Control type="text" name="isCompleted" value={courseTable.isCompleted == null ? "" : courseTable.isCompleted === 1 ? "Yes" : "No"} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Created Date</Form.Label>
                                    <Form.Control type="text" name="createdDate" value={courseTable.createdDate == null ? "" : courseTable.createdDate} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Modified Date</Form.Label>
                                    <Form.Control type="text" name="modifiedDate" value={courseTable.modifiedDate == null ? "" : courseTable.modifiedDate} readOnly />
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
                        <Row>
                            <Col>
                                <Form.Group >
                                    <Form.Label>ID</Form.Label>
                                    <Form.Control type="text" name="id" defaultValue={courseTable.id == null ? "" : courseTable.id} ref={register} readOnly />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" defaultValue={courseTable.title == null ? "" : courseTable.title} ref={register} required/>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description Short</Form.Label>
                                    <Form.Control type="text" name="descriptionShort" defaultValue={courseTable.descriptionShort == null ? "" : courseTable.descriptionShort} ref={register({ required: TrendingUpRounded })} required/>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description Long</Form.Label>
                                    <Form.Control type="text" name="descriptionLong" defaultValue={courseTable.descriptionLong == null ? "" : courseTable.descriptionLong} ref={register} required />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Thumbnail</Form.Label>
                                    <Form.Control type="text" name="thumbnail" defaultValue={courseTable.thumbnail == null ? "" : courseTable.thumbnail} ref={register} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group >
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" name="price" defaultValue={courseTable.price == null ? "" : courseTable.price} ref={register} required/>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Sale</Form.Label>
                                    <Form.Control type="number" name="sale" defaultValue={courseTable.sale == null ? "" : courseTable.sale} ref={register} required/>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Teacher</Form.Label>
                                    <Form.Control as="select" name="teacherId" defaultValue={courseTable.teacherId == null ? "" : courseTable.teacherId} ref={register} required>
                                        {
                                            store.users?store.users.filter(it => it.type===2).map(item => 
                                                <option value={item.id}>{item.email}</option>
                                            ):""
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Category Title</Form.Label>
                                    <Form.Control as="select" name="categoryId" defaultValue={courseTable.categoryId == null ? "" : courseTable.categoryId} ref={register} >
                                        {
                                            store.categories?store.categories.map(item => 
                                                <option value={item.id}>{item.title}</option>
                                            ):""
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
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
                        <Form.Group >
                            <Form.Label>ID</Form.Label>
                            <Form.Control type="text" name="id" defaultValue={courseTable.id == null ? "" : courseTable.id} ref={register} readOnly />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={courseTable.title == null ? "" : courseTable.title} ref={register} readOnly />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" type="submit">Delete</Button>
                        <Button variant="secondary" onClick={handleCloseModalDelete}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showModalNew} onHide={handleCloseModalNew}>
                <Form onSubmit={handleSubmit(onSubmitNew)}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Form.Group >
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" ref={register} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description Short</Form.Label>
                                    <Form.Control type="text" name="descriptionShort" ref={register} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Description Long</Form.Label>
                                    <Form.Control type="text" name="descriptionLong" ref={register} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Thumbnail</Form.Label>
                                    <Form.Control type="text" name="thumbnail" ref={register} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" name="price" ref={register} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group >
                                    <Form.Label>Sale</Form.Label>
                                    <Form.Control type="number" name="sale" ref={register} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Outline</Form.Label>
                                    <Form.Control type="text" name="outline" ref={register} />
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Teacher</Form.Label>
                                    <Form.Control as="select" name="teacherId" defaultValue={courseTable.teacherId == null ? "" : courseTable.teacherId} ref={register} >
                                        {
                                            store.users?store.users.filter(it => it.type===2).map(item => 
                                                <option value={item.id}>{item.email}</option>
                                            ):""
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Category Title</Form.Label>
                                    <Form.Control as="select" name="categoryId" defaultValue={courseTable.categoryId == null ? "" : courseTable.categoryId} ref={register} >
                                        {
                                            store.categories?store.categories.map(item => 
                                                <option value={item.id}>{item.title}</option>
                                            ):""
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
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
