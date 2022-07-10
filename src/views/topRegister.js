import React, { useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import Course from "../components/homeContent/Course";
import academyApppContext from '../onlineAcademyAppContext';

export default function TopRegister() {
    const { store } = useContext(academyApppContext);
    Date.prototype.getWeekNumber = function () {
        var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    };
    var courseRef = [];
    if (store.courses) {
        let currWeek = new Date().getWeekNumber();
        const sortList = [].concat(store.courses.filter(it => (currWeek - new Date(it.createdDate).getWeekNumber() === 1) && (it.participants !== 0)));
        const sortList2 = sortList ? sortList.sort((a, b) => a.participants < b.participants ? 1 : -1) : [];
        courseRef = sortList2.splice(0, 5);
    }
    return (
        <div>
            <center><h1>Top Register</h1></center>
            <Carousel>
                {courseRef.map(i =>
                    <Carousel.Item key={i.id}>
                        <Course course={i} />
                    </Carousel.Item>
                )}
            </Carousel>
        </div>
    )
}
