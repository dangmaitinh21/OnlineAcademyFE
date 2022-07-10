import React, { useState, useEffect, useContext } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { axiosInstance } from "../utils"
import { useForm } from 'react-hook-form';
import "../App.css"
import swal from 'sweetalert';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import academyApppContext from '../onlineAcademyAppContext'
import "../components/header/headerPrimary.css";
import FileBase64 from 'react-file-base64';


export default function UploadCourse() {

  const { register, handleSubmit } = useForm();

  const { store, dispatch } = useContext(academyApppContext);

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
    dispatch({
      type: 'changeMode',
      payload: {
        mode
      }
    })
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

  useEffect(() => {
    dispatch({
      type: 'initLocalFile',
      payload: []
    })
  }, []);

  const getBase64 = async function(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }
  
  const upload = async (form) => {
    
    const body = new FormData();
    var outline = [];
    store.localFiles.forEach(file => (body.append("videos", file), outline.push(file.outline)));
    var idCardBase64 = '';
    idCardBase64 = getBase64(form.thumbnail[0],  async (result) => {
      // console.log(typeof(result));
      // console.log(result);
      // idCardBase64 = result;
    
    //console.log(idCardBase64);
    body.append("metadata", JSON.stringify({
      categoryId: form.category,
      outline: outline,
      title: form.title,
      descriptionShort: form.descriptionShort,
      descriptionLong: form.descriptionLong,
      thumbnail:result,
      isCompleted: form.isCompleted,
    }));

    const res = await axiosInstance.post("/courses", body, { headers: { 'x-access-token': localStorage.account_accessToken } });
    if (res.status === 201) {
      swal({
        title: "Course uploaded",
        text: "Course uploaded with id: " + JSON.stringify(res.data.id),
        icon: "success",
      })
      async function initCoursesList() {
        const res = await axiosInstance.get("/courses");
        if (res.status === 200) {
          dispatch({
            type: 'initCoursesList',
            payload: {
              courses: res.data,
              query: '',
              mode: 'default',
            }
          });
        }
      }
      initCoursesList();
      changeView("default")
      dispatch({
        type: 'clearLocalFiles'
      })
    }
  })}

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
          <Form.Label><b>Outline</b></Form.Label>
          <ReactQuill theme="snow" value={value} onChange={setValue} required />
        </Card.Body>
      </Card>
    )
  }

  var [addMoreUpload, setAddMoreUpload] = useState(1);

  return (
    <Container className="course">
      <Row>
        <Col xs={6} className="mt-4">
          <Form onSubmit={handleSubmit(upload)}>
            <Card>
              <Card.Body>
                <Card.Title as="h3"><center>Course upload</center></Card.Title>
                <hr></hr>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" name="title" placeholder="Course title" ref={register} required />
                </Form.Group>

                <Form.Group controlId="descriptionShort">
                  <Form.Label>Description Short</Form.Label>
                  <Form.Control type="text" name="descriptionShort" placeholder="Course description short" ref={register} required />
                </Form.Group>

                <Form.Group controlId="descriptionLong">
                  <Form.Label>Description Long</Form.Label>
                  <Form.Control type="text" name="descriptionLong" placeholder="Course description long" ref={register} required />
                </Form.Group>

                <Form.Group controlId="thumbnail">
                  <Form.File name="thumbnail" label="Thumbnail" ref={register} />
                </Form.Group>

                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control as="select" name="category" ref={register} required >
                    {store.categories.map(c => <option key={c.id} value={c.id}> {c.title}</option>)}
                  </Form.Control>
                </Form.Group>
                <Form.Check type="switch" name="isCompleted" id="custom-switch" label="Complete Course" ref={register} />
              </Card.Body>
              <Card.Footer>
                <Button className="float-right py-2" variant="primary" type="submit">Upload</Button>
              </Card.Footer>
            </Card>
          </Form>
        </Col>
        <Col xs={6} className="mt-4">
          {[...Array(addMoreUpload)].map((_, i) => <VideoUploadForm key={i} count={i} />)}
          <button className="button" onClick={() => setAddMoreUpload(addMoreUpload + 1)} style={{ float: "right" }}>Add more outline</button>
        </Col>
      </Row>
    </Container >
  );
}
