import React, { useContext, useEffect } from "react";
// import "../../components/homeContent/fillerDiv.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import academyApppContext from '../../onlineAcademyAppContext';
import { axiosInstance } from '../../utils';

function FillerDiv() { 

  const { store, dispatch } = useContext(academyApppContext);

  useEffect(function() {
    async function loadCourses() {
      const res = await axiosInstance.get("/courses");
      console.log(res);
      dispatch({
        type: 'loadCourses',
        payload: {
          items: res.data,
          query: ''
        }
      });
    }
    loadCourses();
  }, []);

  return (
    <div>
      <Row>
        {store.items.map(item =>
        <Col>
          <Card key={item.id}>
            <Card.Body>
              <Card.Title><center>{item.title}</center></Card.Title>
              <Card.Text>{item.descriptionShort}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        )}
      </Row>
    </div>
  );
}

export default FillerDiv;
