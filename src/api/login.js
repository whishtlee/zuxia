import request from '@/utils/request'
//import redis from 'redis'
//
//console.log(redis)
//
//var client = redis.createClient({
//    port: 6379,
//    host: 'cache_redis_master',
//    retry_strategy: function (options) {
//        if (options.error && options.error.code === 'ECONNREFUSED') {
//            return new Error('The server refused the connection');
//        }
//        if (options.total_retry_time > 1000 * 60 * 60) {
//            return new Error('Retry time exhausted');
//        }
//        if (options.attempt > 10) {
//            return undefined;
//        }
//        return Math.min(options.attempt * 100, 3000);
//    }
//});
//
//// 链接超时
//client.on("error", function (error) {
//    // console.log('redis 连接失败');
//});

export function login(username, password) {
    return request({
        url: '/LoginRel/web',
        method: 'post',
        params: {
            username,
            password
        },
        withCredentials:false
    })
}

export function getInfo(userid) {
    return request({
        url: '/MessageOut/individualResume',
        method: 'get',
        params: {userid}
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post'
    })
}
