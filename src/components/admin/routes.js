import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const User = React.lazy(() => import('./views/user/User'));
const Category = React.lazy(() => import('./views/categories/Category'));
const Course = React.lazy(() => import('./views/courses/Course'));

const routes = [
	{ path: '/admin/', exact: true, name: 'Home' },
	{ path: '/admin/dashboard', name: 'Dashboard', component: Dashboard },
	{ path: '/admin/user', name: 'User', component: User },
	{ path: '/admin/category', name: 'Category', component: Category },
	{ path: '/admin/course', name: 'Course', component: Course },
];

export default routes;
