import request from '@/utils/request'

//  获取我的专辑列表
export function getAlbumList(params) {
    return request({
        url: '/Group/getGroup?status=4&isAbs=1',
        method: 'get',
        params
    })
}



// 获取定价与套餐
export function getPackageList(params) {
    return request({
        url: '/MessageSafeOut/myFee',
        method: 'get',
        params
    })
}

//  删除定价与套餐
export function deletePage(params) {
    return request({
        url: '/MessageSafeInShare/delFee338',
        method: 'post',
        params
    })
}

//  创建定价与套餐
export function createPage(params) {
    return request({
        url: '/MessageSafeInShare/createFee',
        method: 'post',
        params
    })
}

//  更新定价与套餐
export function updatePage(params) {
    return request({
        url: '/MessageSafeInShare/updateFee',
        method: 'post',
        params
    })
}

//  获取专辑列表
export function getPageAlbumList(params) {
    return request({
        url: '/AlbumSafe/myAlbum380',
        method: 'post',
        params
    })
}

//  根据专辑ID 获取专辑内视频
export function getPageAlbumVideo(params) {
    return request({
        url: '/MessageOut/getAblumCourse380',
        method: 'post',
        params
    })
}

//  把视频加入或者移除套餐 type = ture 加入
export function joinOrRemovePack(params,type) {
    if(type) {
        return request({
            url: '/MessageSafeInShare/courseInPage',
            method: 'post',
            params
        })
    } else {
        return request({
            url: '/MessageSafeInShare/courseOutPage',
            method: 'post',
            params
        })
    }
}