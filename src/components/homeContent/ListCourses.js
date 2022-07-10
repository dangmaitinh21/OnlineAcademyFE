import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Row, Col, Form } from 'react-bootstrap';
import academyApppContext from '../../onlineAcademyAppContext';
import Course from './Course';
import { axiosInstance } from '../../utils';


function ListCourses({ currentPosts, props }) { 

  const { store } = useContext(academyApppContext);

  return (
    <div>
      <Container>
        
          <Row>
            {
            currentPosts.filter(course => course.title.toLowerCase().includes(store.query.toLowerCase()) || course.categoryId.toString().toLowerCase().includes(store.query.toLowerCase())).map(course =>
            <Col md={3} key={course.id}>
              <Course course={course}/>
            </Col>
            )}
          </Row>
      </Container>
    </div>
  );
}

export default ListCourses;
