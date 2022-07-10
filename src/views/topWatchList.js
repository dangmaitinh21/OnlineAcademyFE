import React, { useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import Course from "../components/homeContent/Course";
import academyApppContext from '../onlineAcademyAppContext';

export default function TopWatchList() {
    const { store } = useContext(academyApppContext);
    var courseRef = [];
    if (store.teacher && store.courses) {
        const sortList = [].concat(store.teacher.filter(item => item.watchlist ? (JSON.parse(item.watchlist).course).length > 0 ? item : "" : "").map(it => JSON.parse(it.watchlist).course));
        const temp = [].concat(...sortList);
        const counts = {};
        temp.forEach((el) => {
            counts[el] = counts[el] ? (counts[el] += 1) : 1;
        });
        const countId = Object.entries(counts).sort(([_, a], [__, b]) => b - a).map(it => parseInt(it[0]));
        const watchList = store.courses ? store.courses.filter(it => countId.includes(it.id)) : [];
        courseRef = watchList.splice(0, 10);
    }
    return (
        <div>
            <center><h1>Top Wacth</h1></center>
            <Carousel>
                {courseRef.map(i =>
                    <Carousel.Item key={i.id+'watchlist'}>
                        <Course course={i} />
                    </Carousel.Item>
                )}
            </Carousel>
        </div>
    )
}
