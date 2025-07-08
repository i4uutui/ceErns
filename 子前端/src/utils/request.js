import axios from "axios";
import { ElMessage } from "element-plus";
import $router from "@/router";
import { getItem } from "@/assets/js/storage";

const service = axios.create({
	baseURL: "http://localhost:3000/",
	timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(config => {
		const token = getItem("token");
		if (token) {
			config.headers["Authorization"] = `${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(response => {
		const res = response.data;
		if (res.code == 200) {
			return res;
		}else if (res.code == 402) {
			ElMessage({
				message: res.message || "Error",
				type: "error",
				duration: 3 * 1000,
			});
			localStorage.clear();
			$router.push("/login");
		}else{
			return ElMessage({
				message: res.message || "Error",
				type: "error",
				duration: 3 * 1000,
			});
		}
	}, error => {
		const { status } = error.response || {};
		if (status === 402) {
			ElMessage.error("登录状态已过期，请重新登录");
			localStorage.clear();
			$router.push("/");
		} else {
			ElMessage({
				message: error.message,
				type: "error",
				duration: 3 * 1000,
			});
		}
		return Promise.reject(error);
	}
);

export default service;
