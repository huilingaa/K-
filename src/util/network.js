import axios from 'axios';

const service = axios.create({
    // baseURL:'http://47.110.155.158:8080/api',
    baseURL:'http://kline.wscbank.info/api',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    }
})

service.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.reject(error);
})

// 配置响应拦截器 
service.interceptors.response.use(res => {
    if(res.data.code === 200){
        return Promise.resolve(res.data)
    }
    return Promise.resolve(res);
}, error => {
    return Promise.reject(error);
})

export{
    service as axios
}