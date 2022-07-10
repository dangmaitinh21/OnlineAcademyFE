import React, { Suspense, useReducer, useEffect } from 'react'
import {
	Redirect,
	Route,
	Switch,
	Link
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react'
import { axiosInstance, parseJwt } from '../../../utils';
import reducer from '../adminReducer';
import AppContext from '../adminContext';

// routes config
import routes from '../routes'
import { Provider } from 'react-redux'

const loading = (
	<div className="pt-3 text-center">
		<div className="sk-spinner sk-spinner-pulse"></div>
	</div>
);



const TheContent = () => {

	const initialData = { query: '', categories: [] }
	const [store, dispatch] = useReducer(reducer, initialData);

	useEffect(function () {
		async function loadDataCategory() {
			const res = await axiosInstance.get('/categories', { headers: { 'x-access-token': localStorage.account_accessToken } });
			if (res.status === 200) {
				dispatch({
					type: 'initCategory',
					payload: {
						items: res.data,
						query: ''
					}
				});
			}
		}
		async function loadDataCourse() {
            const res = await axiosInstance.get('/courses', { headers: { 'x-access-token': localStorage.account_accessToken } });
            if (res.status === 200) {
                for (let i in res.data) {
                    let resGetTeacherEmail = await axiosInstance.get('/users/'+ res.data[i].teacherId, { headers: { 'x-access-token': localStorage.account_accessToken } });
                    if (resGetTeacherEmail.status === 200) {
                        res.data[i].teacher = resGetTeacherEmail.data.email;
                    }
                    let resGetCategoryTitle = await axiosInstance.get('/categories/'+ res.data[i].categoryId, { headers: { 'x-access-token': localStorage.account_accessToken } });
                    if (resGetCategoryTitle.status === 200) {
                        res.data[i].category = resGetCategoryTitle.data.title;
                    }
                }
                dispatch({
                    type: 'initCourse',
                    payload: {
                        items: res.data,
                        query: ''
                    }
                });
            }
        }
		async function loadDataUser() {
			const res = await axiosInstance.get('/users', { headers: { 'x-access-token': localStorage.account_accessToken } });
			if (res.status === 200) {
				res.data.map(item => {
					return item.type===1?item.typeName="Student":item.type===2?item.typeName="Teacher":item.type===3?item.typeName="Admin":""; 
				});
				dispatch({
					type: 'initUser',
					payload: {
						items: res.data,
						query: ''
					}
				});
			}
		}
		loadDataUser();
        loadDataCourse();
		loadDataCategory();
	}, []);

	return (
		<AppContext.Provider value={{ store, dispatch }}>
			<main className="c-main">

				<CContainer fluid>

					<Suspense fallback={loading}>
						<Switch>
							{routes.map((route, idx) => {
								return route.component && (
									<Route
										key={idx}
										path={route.path}
										exact={route.exact}
										name={route.name}
										render={props => (
											<CFade>
												<route.component {...props} />
											</CFade>
										)} />
								)
							})}
							{
								store.categories?store.courses?store.users?<Redirect from="/" to="/admin/dashboard" />:"":"":""
								
							}
						</Switch>
					</Suspense>

				</CContainer>

			</main>
		</AppContext.Provider>
	)
}

export default React.memo(TheContent)
