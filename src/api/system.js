import request from '@/utils/request'

//  获取URL地址列表
export function getUrlList(params) {
    return request({
        url: '/ProxyIsd/proxyQuery?pr=0&pn=15',
        method: 'get',
        params
    })
}

//  删除URL地址 - 单条数据
export function deleteUrl(params) {
    return request({
        url: '/ProxyIsd/proxyDel',
        method: 'get',
        params
    })
}
