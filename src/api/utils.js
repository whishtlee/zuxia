import axios from 'axios'

// 添加请求头
function uploadImg(e) {
    //console.log(e)
    //var self = this
    //let file = e.target.files[0]
    let file = e
    /* eslint-disable no-undef */
    let param = new FormData()  // 创建form对象
    param.append('file', file, file.name)  // 通过append向form对象添加数据
    param.append('chunk', '0') // 添加form表单中其他数据
    console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
    let config = {
        headers: {'Content-Type': 'multipart/form-data'}
    }
    // 添加请求头
    axios.post('http://edu.cqzuxia.com/uploading', param, config).then(response => {
        console.log(response)
        if (response.data.code === 0) {
            //   self.ImgUrl = response.data.data
        }
        console.log(response.data)
    })
}


export default uploadImg