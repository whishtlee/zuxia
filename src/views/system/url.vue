<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="URL地址" v-model="listQuery.key"></el-input>
            <el-button class="filter-item el-button--medium" type="success"  icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item el-button--medium" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
        </div>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" type="selection" width="45"></el-table-column>
            <el-table-column align="center" label='ID' width="95"><template slot-scope="scope">{{scope.$index+1}}</template></el-table-column>
            <el-table-column label="Url"><template slot-scope="scope">{{scope.row.url}}</template></el-table-column>
            <el-table-column label="Port" width="80"><template slot-scope="scope">{{scope.row.port}}</template></el-table-column>
            <el-table-column label="Privilege" width="80"><template slot-scope="scope">{{scope.row.privilege}}</template></el-table-column>
            <el-table-column label="Project" width="80"><template slot-scope="scope">{{scope.row.project}}</template></el-table-column>
            <el-table-column label="Name" width="80"><template slot-scope="scope">{{scope.row.name}}</template></el-table-column>
            <el-table-column label="Info" width="80"><template slot-scope="scope">{{scope.row.info}}</template></el-table-column>
            <el-table-column label="Server" width="80"><template slot-scope="scope">{{scope.row.server}}</template></el-table-column>
            <el-table-column label="操作" width="125">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteData"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form  ref="dataForm" :model="temp" label-position="left" label-width="110px">
                <el-form-item label="URL地址" prop="url" :rules="{ required: true, message: 'URL地址不能为空'}">
                    <el-input v-model="temp.url" placeholder="URL地址"></el-input>
                </el-form-item>
                <el-form-item label="Project" prop="title">
                    <el-input v-model="temp.project" placeholder="Project"></el-input>
                </el-form-item>
                <el-form-item label="Privilege">
                    <el-select class="filter-item" v-model="temp.privilege" placeholder="Privilege">
                        <el-option v-for="item in privilegeList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Nmae">
                    <el-input v-model="temp.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="Info">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="描述" v-model="temp.info"></el-input>
                </el-form-item>
                <el-form-item label="Server">
                    <el-select class="filter-item" v-model="temp.server" placeholder="服务">
                        <el-option v-for="se in serverList" :key="se" :label="se" :value="se"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Port">
                    <el-input v-model="temp.port" placeholder="端口"></el-input>
                </el-form-item>
                <el-form-item label="Cache_expires">
                    <el-input v-model="temp.cache_expires" placeholder="cache_expires"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
                <el-button v-else type="primary" @click="editData">修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { getUrlList,deleteUrl } from '@/api/system'

    export default {
        data() {
            return {
                list: null,
                listLoading: true,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '修改URL地址',
                    create: '新增URL地址'
                },
                listQuery: {
                    page: 1,
                    limit: 20,
                    key: ''
                },
                temp: {
                    url: '',
                    project: '',
                    privilege: 'public',
                    name: '',
                    info: '',
                    cache_expires: '-1',
                    server: 'tomcat',
                    port: '8080'
                },
                privilegeList: ['public', 'protected', 'private'],
                serverList: ['tomcat', 'web'],
            }
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                }
                return statusMap[status]
            }
        },
        created() {
            this.fetchData()
        },
        methods: {
            fetchData() {// 加载数据
                this.listLoading = false
                getUrlList(this.listQuery).then(d => {
                    this.list = d.content
                    this.listLoading = false
                })
            },
            editData() {// 修改URL地址
                this.$refs['dataForm'].validate((valid) => {
                    if(valid) {
                        const tempData = Object.assign({}, this.temp)
                        console.log(valid)
                        console.log('---------------------')
                        console.log(tempData)
                    }
                })
            },
            createData() {// 创建新URL地址

            },
            getList() {//得到列表数据
                this.listLoading = true
                getUrlList(this.listQuery).then(d => {
                    this.list = d.content
                    this.total = d.size
                    this.listLoading = false
                })
            },
            deleteData() {// 删除URL地址
                this.$confirm('此操作将永久删除该URL地址, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteUrl().then(d => {
                        this.$message({
                            message: d.msg,
                            type: d.status == 1? 'success' : 'error'
                        });
                    })
                }).catch(() => {});
            },
            handleFilter() {// 跟他URL查询数据
                this.listQuery.page = 1
                this.getList()
            },
            handleCreate() {// 显示新增窗口
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            handleUpdate() {//  显示修改窗口
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                })
            }
        }
    }
</script>