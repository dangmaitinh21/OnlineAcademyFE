import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:3001/api',
	timeout: 5000,
});

export const axiosAuth = axios.create({
	baseURL: 'http://localhost:3001/api',
	timeout: 5000,
	headers: { 'x-access-token': localStorage.account_accessToken }
});

export function parseJwt(token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));

	return JSON.parse(jsonPayload);
};

export async function refreshToken() {
	const data = {
		"accessToken": localStorage.account_accessToken,
		"refreshToken": localStorage.account_refreshToken
	};
	const res = await axiosInstance.post('/auth/refresh', data);
	if (res.status === 200) {
		localStorage.account_accessToken = res.data.accessToken;
		localStorage.account_expToken = parseJwt(res.data.accessToken).exp;
		return Promise.resolve();
	}
	return Promise.resolve();
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axiosInstance, refreshToken);
