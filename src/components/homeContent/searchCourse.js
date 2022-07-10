import React, { useState, useEffect, useContext } from 'react';
import academyAppContext from '../../onlineAcademyAppContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form } from "react-bootstrap";

export default function Searchcourse({ initQuery }) {
    
    const [courseKey, setCourseKey] = useState(initQuery);
    const { dispatch } = useContext(academyAppContext);

    useEffect(function() {
        dispatch({
            type: 'update_query',
            payload: {
                query: courseKey
            }
        });
    }, [courseKey, dispatch]);

    const txtQuery_Changed = function(e) {
        setCourseKey(e.target.value);
    };

    const txtQuery_KeyUp = function(e) {
        if(e.keyCode === 27) {
            setCourseKey(initQuery);
        }
    };

    return (
        <Form>
            <Form.Label as='h4'>Course Search</Form.Label>
            <Form.Control type="text" placeholder="Search..." value={courseKey} onChange={txtQuery_Changed} onKeyUp={txtQuery_KeyUp} />
        </Form>
    )
}
