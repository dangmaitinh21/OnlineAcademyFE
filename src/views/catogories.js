import React, { useReducer, useEffect, useState, useParams } from 'react';
import Header from "../components/Header";
import HomeContent from "../components/HomeContent";
import HomeFooter from "../components/HomeFooter";
import reducer from '../onlineAcademyReducer';
import ApppContext from '../onlineAcademyAppContext';
import { axiosInstance } from '../utils';
import Result from './resultCategories';

export default function Categories() {

    // const initialAppState = {
    //     courses: [],
    //     query: '',
    //     categories: [],
    // };

    // const [store, dispatch] = useReducer(reducer, initialAppState);
    // useEffect(function () {
        
    // }, []);

    const initialAppState = {
        courses: [],
        query: '',
        categories: [],
    };

    const [store, dispatch] = useReducer(reducer, initialAppState);

    let {id}  =useParams();
    console.log("id", Number(id));

    useEffect(function () {
        async function initCoursesList() {
            const res = await axiosInstance.get("/courses");
            if (res.status === 200) {
                dispatch({
                    type: 'initCoursesList',
                    payload: {
                        categories:[],
                        courses: res.data,
                        query: ''
                    }
                });
            }
        }
        async function getCategory() {
            const res = await axiosInstance.get('/categories');
            if (res.status === 200) {
                dispatch({
                    type: 'getCategory',
                    payload: {
                        categories: res.data,
                        query: ''
                    }
                });
            }
        }
        initCoursesList();
        getCategory();
    }, []);

    return (
        <div>
            <ApppContext.Provider value={{ store, dispatch }}>
            <Header />
            {/* <HeaderPopup />
            <HeaderPrimary /> */}
            <Result />
            {/*    
            <AdImage />
            <Feature1 />
            <Recommendations />
            <Feature2 />
            <FillerDiv />
            <TopCategories />
            <BecomeInstructor />
            <TrustedCompanies />
            <UdemyForBusiness />
            <VideoAdDiv /> */}
            <HomeFooter />
            {/* <Footer /> */}
            </ApppContext.Provider>
        </div>
    );
}

// export default OnlineAcademy;