import React, { useState, useEffect, useContext } from 'react'
import {
	CWidgetDropdown,
	CRow,
	CCol,
} from '@coreui/react'
import { axiosInstance, parseJwt } from '../../../../utils';
import ApppContext from '../../adminContext';

const WidgetsDropdown = () => {

	const [countUser, setCountUser] = useState(0);
	const [countCategory, setCountCategory] = useState(0);
	const [countCourse, setCountCourse] = useState(0);
	const {store, dispatch} = useContext(ApppContext);

	useEffect(function () {
		// async function loadDataUser() {
		// 	const res = await axiosInstance.get('/users', { headers: { 'x-access-token': localStorage.account_accessToken } });
		// 	if (res.status === 200) {
		// 		setCountUser(res.data.length);
		// 	}
		// }
		// async function loadDataCategory() {
		// 	const res = await axiosInstance.get('/categories', { headers: { 'x-access-token': localStorage.account_accessToken } });
		// 	if (res.status === 200) {
		// 		setCountCategory(res.data.length);
		// 	}
		// }
		// async function loadDataCourse() {
		// 	const res = await axiosInstance.get('/courses', { headers: { 'x-access-token': localStorage.account_accessToken } });
		// 	if (res.status === 200) {
		// 		setCountCourse(res.data.length);
		// 	}
		// }
		// loadDataUser();
		// loadDataCategory();
		// loadDataCourse();
		setCountUser(store.users?store.users.length:"");
		setCountCategory(store.categories?store.categories.length:"");
		setCountCourse(store.courses?store.courses.length:"");
	}, []);

	// render
	return (
		<CRow>
			<CCol sm="6" lg="3">
				<CWidgetDropdown
					color="gradient-primary"
					header={countUser.toString()}
					text="Total users"
				>
				</CWidgetDropdown>
			</CCol>

			<CCol sm="6" lg="3">
				<CWidgetDropdown
					color="gradient-info"
					header={countCategory.toString()}
					text="Total categories"
				>
				</CWidgetDropdown>
			</CCol>

			<CCol sm="6" lg="3">
				<CWidgetDropdown
					color="gradient-warning"
					header={countCourse.toString()}
					text="Total courses"
				>
				</CWidgetDropdown>
			</CCol>
		</CRow>
	)
}

export default WidgetsDropdown
