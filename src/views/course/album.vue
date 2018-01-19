<template>
    <div class="app-container">

        <div class="filter-container">
            <el-button class="filter-item el-button--medium" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="80"><template slot-scope="scope">{{scope.$index+1}}</template></el-table-column>
            <el-table-column label="名称"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
            <el-table-column label="标签"><template slot-scope="scope">{{scope.row.flag}}</template></el-table-column>
            <el-table-column label="时间" width="160"><template slot-scope="scope">{{scope.row.time | parseTime}}</template></el-table-column>
            <el-table-column label="操作" width="125">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="修改" placement="top">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row.feeid)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="创建专辑" :visible.sync="dialogFormVisible" width="50%">
            <el-form  ref="createPackage" :model="album" label-position="right" label-width="100px" style="padding: 0 10px">
                <el-form-item label="专辑封面">
                    <div style="height: 300px;">
                        <vueCropper
                                ref="cropper2"
                                :img="example2.img"
                                :outputSize="example2.size"
                                :outputType="example2.outputType"
                                :info="example2.info"
                                :canScale="example2.canScale"
                                :autoCrop="example2.autoCrop"
                                :autoCropWidth="example2.autoCropWidth"
                                :autoCropHeight="example2.autoCropHeight"
                                :fixed="example2.fixed"
                                :fixedNumber="example2.fixedNumber"
                        ></vueCropper>
                    </div>
                    <div>
                        <label class="btn" for="upload2">选择图片</label>
                        <input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 2)">
                        <button @click="finish2('base64')" class="btn">上传到服务器</button>
                    </div>
                </el-form-item>
                <el-form-item label="提示">
                    <el-input v-model="album.picid" placeholder="专辑标题"></el-input>
                </el-form-item>
                <el-form-item label="专辑标题" prop="name" :rules="{ required: true, message: '标题不能为空'}">
                    <el-input v-model="album.name" placeholder="专辑标题"></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="flag" :rules="{ required: true, message: '关键词不能为空'}">
                    <el-input v-model="album.flag" placeholder="用逗号隔开如：JAVA,PHP,C"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="描述" v-model="album.info"></el-input>
                </el-form-item>
                <el-form-item label="展开扩展">
                    <el-switch @click="showm"  v-model="showMoney"></el-switch>
                </el-form-item>
                <div v-if="showMoney">
                    <el-form-item label="售价">
                        <el-input v-model.number="album.total" placeholder="卖价"></el-input>
                    </el-form-item>
                    <el-form-item label="套餐描述">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="套餐描述" v-model="album.finfo"></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="VIP1 售价" prop="v1">
                                <el-input v-model.number="album.v1" placeholder="VIP1 售价" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="VIP2 售价" prop="v2">
                                <el-input v-model.number="album.v2" placeholder="VIP2 售价"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="VIP3 售价" prop="v3">
                                <el-input v-model.number="album.v3" placeholder="VIP3 售价"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="VIP4 售价" prop="v4">
                                <el-input v-model.number="album.v4" placeholder="VIP4 售价"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="VIP5 售价" prop="v5">
                                <el-input v-model.number="album.v5" placeholder="VIP5 售价"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="VIP6 售价" prop="v6">
                                <el-input v-model.number="album.v6" placeholder="VIP6 售价"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="zuxia" @click="createData">添加</el-button>
                <el-button v-else type="primary" @click="updateData">修改</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import VueCropper from 'vue-cropper'
    import { getAlbumList } from '@/api/course'
    import uploading from '@/api/utils'
    import { parseTime } from '@/utils/index'
    export default {
        data() {
            return {
                example2: {
                    img: 'http://ofyaji162.bkt.clouddn.com/bg1.jpg',
                    info: true,
                    size: 1,
                    outputType: 'jpeg',
                    canScale: false,
                    autoCrop: true,
                    // 只有自动截图开启 宽度高度才生效
                    autoCropWidth: 200,
                    autoCropHeight: 300,
                    // 开启宽度和高度比例
                    fixed: true,
                    fixedNumber: [2, 3]
                },

                showMoney:false,
                list:null,
                dialogFormVisible:false,
                dialogStatus:'',
                dataObj: { token: '', key: '' },
                album:{
                    name:'',
                    flag:'',
                    info:'',
                    total:'',
                    fname:'',
                    finfo:'',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: '',
                    picid:''
                }
            }
        },
        components: {
            VueCropper
        },
        created() {
            this.fetchData()
        },
        filters: {
            parseTime(time,format){
                return parseTime(time,format)
            }
        },
        methods: {
            handleImageScucess(file) {
                this.emitInput(file.files.file)
            },
            resetTemp() {
                this.album = {
                    name:'',
                    flag:'',
                    info:'',
                    total:'',
                    fname:'',
                    finfo:'',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: '',
                    picid:''
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 5;

                if (!isJPG || !isPNG) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 5MB!');
                }
                return isJPG && isLt2M;
            },
            fetchData() {// 加载数据
                this.listLoading = true
                getAlbumList().then(d => {
                    this.list = d.list
                    this.listLoading = false
                })
            },
            handleCreate(){
                this.resetTemp()
                this.dialogFormVisible = true
                this.dialogStatus = 'create'
                this.$nextTick(() => {
                    this.$refs['createPackage'].clearValidate()
                })
            },
            handleUpdate(row){

            },
            deleteData(id){

            },
            createData(){

            },
            updateData(){

            },
            showm(){
                this.showMoney = !this.showMoney
            },
            uploadImg (e, num) {
                //上传图片
                // this.option.img
                var file = e.target.files[0]
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                    return false
                }
                var reader = new FileReader()
                reader.onload = (e) => {
                    let data
                    if (typeof e.target.result === 'object') {
                        // 把Array Buffer转化为blob 如果是base64不需要
                        data = window.URL.createObjectURL(new Blob([e.target.result]))
                    } else {
                        data = e.target.result
                    }
                    if (num === 1) {
                        this.option.img = data
                    } else if (num === 2) {
                        this.example2.img = data
                    }
                }
                // 转化为base64
                // reader.readAsDataURL(file)
                // 转化为blob
                reader.readAsArrayBuffer(file)
            },
            finish2 (type) {
                this.$refs.cropper2.getCropBlob((data) => {
                    uploading(data)
                    //this.album.picid = data
                })
            }
        }
    }
</script>

<style>

    .btn {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c0ccda;
        color: #1f2d3d;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin:20px 10px 0px 0px;
        padding: 9px 15px;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        background-color: #50bfff;
        border-color: #50bfff;
        transition: all .2s ease;
        text-decoration: none;
        user-select: none;
    }

</style>