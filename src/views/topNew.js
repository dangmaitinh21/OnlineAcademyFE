import React, { useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import Course from "../components/homeContent/Course";
import academyApppContext from '../onlineAcademyAppContext';

export default function TopNew() {
    const { store } = useContext(academyApppContext);
    var courseRef = [];
    if (store.courses != null) {
        const sortList = [].concat(store.courses);
        const sortList2 = sortList ? sortList.sort((a, b) => a.createdDate < b.createdDate ? 1 : -1) : [];
        courseRef = sortList2.splice(0, 10);
    }
    return (
        <div>
            <center><h1>Top New Course</h1></center>
            <Carousel>
                {courseRef.map(i =>
                    <Carousel.Item key={i.id+'topnew'}>
                        <Course course={i} />
                    </Carousel.Item>
                )}
            </Carousel>
        </div>
    )
}
