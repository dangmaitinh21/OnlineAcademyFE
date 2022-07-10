import React, { useContext, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Form } from 'react-bootstrap';
import academyApppContext from '../onlineAcademyAppContext'
import { useDropzone } from 'react-dropzone';

export default function VideoForm(props) {

  const { store, dispatch } = useContext(academyApppContext);
  const [state, setState] = useState({ files: [] });
  const [value, setValue] = useState([]);

  const imgStyle = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

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
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: 'video/*',
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: (acceptedFiles) => {
      setState((oldState) => ({
        files: [...oldState.files, acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file),
          userId: localStorage.account_userID
        })).map(file => dispatch({
          type: 'addLocalFile',
          payload: file
        }))]
      }));
    }
  });

  

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

    return (
        <>
            <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here or open the dialog</p>
            <button type="button" onClick={open}>
              Open File Dialog
          </button>
          </div>
          <aside style={thumbsContainer}>
            {thumb(0)}
          </aside>
          <Form.Label>Outline</Form.Label>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
        </>
    )
}
