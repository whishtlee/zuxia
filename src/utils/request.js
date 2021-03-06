import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import NProgress from 'nprogress'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 15000, // 请求超时时间,
    withCredentials: true
})

// request拦截器
service.interceptors.request.use(config => {
    //Loading.service();
    NProgress.start()
    if (store.getters.token) {
        //config.headers['NOONLYSESSION'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    //Loading.service().close();
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
        //Loading.service().close();
        NProgress.done()
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        console.log("%c返回状态信息代码： " + res.status, "color:blue");
        if (res.status !== 1) {
            Message({
                message: res.msg,
                type: 'error',
                duration: 5 * 1000
            })

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()// 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        //Loading.service().close();
        console.log('err' + error)// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
