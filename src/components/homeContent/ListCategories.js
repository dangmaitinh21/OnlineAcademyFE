import React, { useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tabs, Tab, Row, Col, Spinner } from 'react-bootstrap';
import academyApppContext from '../../onlineAcademyAppContext';
import { axiosInstance } from '../../utils';
import ListCourses from "./ListCourses";

export default function Listcategories(props) {
    
    const { store, dispatch } = useContext(academyApppContext);

    useEffect(function() {
        async function initCoursesList() {
          const res = await axiosInstance.get('/courses');
          if(res.status === 200){
            dispatch({
              type: 'initCoursesList',
              payload: {
                courses: res.data,
                query: ''
              }
            });
          }
        }
        initCoursesList();
    }, []);

    return (
        <div>
            <Container>
                {/* <Row>
                    <Tabs> */}
                {store.categories.map(category =>
                        // <Tab eventKey={}></Tab>
                <Row key={category.id} className="my-4">
                    <Col xs="1"><h4>{category.title.toUpperCase()}</h4></Col>
                    <Col><ListCourses category={category} /></Col>
                </Row>
                )}
                    {/* </Tabs>
                </Row> */}
            </Container>
        </div>
    )
}
