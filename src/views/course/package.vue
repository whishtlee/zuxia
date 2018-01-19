<template>
    <div class="app-container" v-if="videoManager">
        <div class="filter-container">
            <el-button class="filter-item el-button--medium" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="80"><template slot-scope="scope">{{(scope.$index+listQuery.pr)+1}}</template></el-table-column>
            <el-table-column label="名称"><template slot-scope="scope">{{scope.row.label}}</template></el-table-column>
            <el-table-column label="售价" width="100"><template slot-scope="scope">{{scope.row.total}}</template></el-table-column>
            <el-table-column label="时间" width="160"><template slot-scope="scope">{{scope.row.time | parseTime}}</template></el-table-column>
            <el-table-column label="操作" width="195">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="管理" placement="top">
                        <el-button type="zuxia" size="mini" @click="videoList(scope.row.feeid)">管理</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="修改" placement="top">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData(scope.row.feeid)"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pn" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
        </div>

        <!-- 添加，修改窗口 -->
        <el-dialog title="创建套餐" :visible.sync="dialogFormVisible" width="50%">
            <el-form  ref="createPackage" :model="temp" label-position="right" label-width="100px" style="padding: 0 10px">
                <el-form-item label="标题" prop="label" :rules="{ required: true, message: '标题不能为空'}">
                    <el-input v-model="temp.label" placeholder="套餐标题"></el-input>
                </el-form-item>
                <el-form-item label="售价" prop="total" :rules="[{ required: true, message: '售价不能为空'},{ type: 'number', message: '售价必须为数字值'}]">
                    <el-input v-model.number="temp.total" placeholder="卖价"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="描述" v-model="temp.info"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="VIP1 售价" prop="v1" :rules="{ type: 'number', message: '售价必须为数字值'}">
                            <el-input v-model.number="temp.v1" placeholder="VIP1 售价" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="VIP2 售价" prop="v2" :rules="{ type: 'number', message: '售价必须为数字值'}">
                            <el-input v-model.number="temp.v2" placeholder="VIP2 售价"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="VIP3 售价" prop="v3" :rules="{ type: 'number', message: '售价必须为数字值'}">
                            <el-input v-model.number="temp.v3" placeholder="VIP3 售价"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="VIP4 售价" prop="v4" :rules="{ type: 'number', message: '售价必须为数字值'}">
                            <el-input v-model.number="temp.v4" placeholder="VIP4 售价"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="VIP5 售价" prop="v5" :rules="{ type: 'number', message: '售价必须为数字值'}">
                            <el-input v-model.number="temp.v5" placeholder="VIP5 售价"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="VIP6 售价" prop="v6" :rules="{ type: 'number', message: '售价必须为数字值'}">
                            <el-input v-model.number="temp.v6" placeholder="VIP6 售价"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="zuxia" @click="createData">添加</el-button>
                <el-button v-else type="primary" @click="updateData">修改</el-button>
            </div>
        </el-dialog>
    </div>
    <!-- 套餐定价 -->
    <!-- 套餐视频管理 -->
    <div class="app-container" v-else>
        <div class="filter-container">
            <el-button class="filter-item el-button--medium" @click="videoManager = true" type="primary" icon="el-icon-arrow-left">后退</el-button>
        </div>

        <div class="filter-container">
            <template>
                <el-table :data="vlist" height="300" border fit highlight-current-row>
                    <el-table-column label="专辑名称"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
                    <el-table-column label="专辑时间" width="180"> <template slot-scope="scope">{{scope.row.time | parseTime}}</template></el-table-column>
                    <el-table-column label="专辑标签"><template slot-scope="scope">{{scope.row.flags}}</template></el-table-column>
                    <el-table-column label="操作" width="125">
                        <template slot-scope="scope">
                            <el-button type="zuxia" size="mini" @click="albumVideo(scope.row.id)">查看专辑视频</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <div class="filter-container">
            <el-row :gutter="24">
                <el-col :span="6" v-for="(o, index) in videoToAlbum" :key="index" style="margin-bottom: 15px;">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="'http://img.zuxiaedu.com/small_light(cw=500,ch=300)/images/'+o.pic.stdmsgpicsid+'.png'" class="image">
                        <div style="padding: 14px;">
                            <span class="ellipsis">{{o.message}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{o.time | parseTime('{y}-{m}-{d}')}}</time>
                                <el-button v-if="o.isAddFee == 1" type="text" class="button" @click="joinPack(o)">移除套餐</el-button>
                                <el-button v-else type="text" class="button" @click="joinPack(o,true)">加入套餐</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import { getPackageList,deletePage,createPage,updatePage,getPageAlbumList,getPageAlbumVideo,joinOrRemovePack } from '@/api/course'
    import { parseTime } from '@/utils/index'
    export default {
        data() {
            return {
                videoToAlbum:null,
                vlist:null,
                videoManager:true,
                dialogFormVisible: false,
                listLoading:false,
                dialogStatus:'',
                list:null,
                total:null,
                input: '',
                listQuery: {
                    pr: 0,
                    pn: 10,
                    count: 1
                },
                videoQuery:{
                    feeid:null,
                    count:1,
                    pr:0,
                    pn:999,
                    id:0
                },
                temp: {
                    label: '',
                    total: '',
                    info: '',
                    type: 'package',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: '',
                },
                joinText:{
                    join: '加入套餐',
                    unjoin: '移除套餐'
                },
            }
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
            fetchData() {// 加载数据
                this.listLoading = true
                getPackageList(this.listQuery).then(response => {
                    this.list = response.list
                    this.total = response.size
                    this.listLoading = false
                })
            },
            resetTemp() {
                this.temp = {
                    label: '',
                    total: '',
                    info: '',
                    type: 'package',
                    v1: '',
                    v2: '',
                    v3: '',
                    v4: '',
                    v5: '',
                    v6: '',
                }
            },
            handleSizeChange(val) {
                this.listQuery.pn = val
                this.fetchData()
            },
            handleCurrentChange(val) {
                let page = (val - 1) *  this.listQuery.pn;
                this.listQuery.pr = page
                this.fetchData()

            },
            deleteData(val){
                this.$confirm('此操作将永久删除套餐, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePage({id:val}).then(d => {
                        this.$message({
                            message: d.msg,
                            type: d.status == 1? 'success' : 'error'
                        });
                    })
                }).catch(() => {});
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
                this.temp = Object.assign({}, row) // copy obj
                this.dialogFormVisible = true
                this.dialogStatus = 'update'
                this.$nextTick(() => {
                    this.$refs['createPackage'].clearValidate()
                })
            },
            createData(){
                this.$refs['createPackage'].validate((valid) => {
                    if (valid) {
                        createPage(this.temp).then(d => {
                            if(d.status === 1){
                                this.dialogFormVisible = false
                                this.fetchData();
                            }
                            this.$message({
                                message: d.msg,
                                type: d.status == 1? 'success' : 'error'
                            });
                        })
                    }
                });
            },
            updateData(){
                this.$refs['createPackage'].validate((valid) => {
                    if (valid) {
                        updatePage(this.temp).then(d => {
                            if(d.status === 1){
                                this.dialogFormVisible = false
                                this.fetchData();
                            }
                            this.$message({
                                message: d.msg,
                                type: d.status == 1? 'success' : 'error'
                            });
                        })
                    }
                });
            },
            videoList(id) {
                this.videoManager = false
                this.videoQuery.feeid = id
                this.videoToAlbum = null
                getPageAlbumList(this.listQuery).then(response => {
                    this.vlist = response.list
                })
            },
            albumVideo(id) {
                this.videoQuery.id = id
                getPageAlbumVideo(this.videoQuery).then((d) => {
                    this.videoToAlbum = d.list
                })
            },
            joinPack(o,type){
                if(type) {
                    o.isAddFee = 1
                } else {
                    o.isAddFee = 0
                }
                joinOrRemovePack({id: o.id,feeid:this.videoQuery.feeid},type).then((d) => {
                    this.$message({
                        message: d.msg,
                        type: d.status == 1? 'success' : 'error'
                    });
                })
            }
        }
    }
</script>