<template>
  <div class="manage">
    <el-dialog title="更新文档" :visible.sync="isShow">
      <file-form
        :formLabel="operateFormLabel"
        :form="operateForm"
        :rules="rules"
        ref="form"
      ></file-form>
      <!-- action表示文件要上传到的后台API地址 -->
      <el-upload
        class="upload-demo"
        :action="uploadApiUrl"
        accept="image/jpeg,image/png,image/jpg,image/gif,application/pdf,application/doc,application/docx,.zip,.rar.7z"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="onBeforeUpload"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :on-change="handleChange"
        :file-list="fileList"
        :auto-upload="false"
        :http-request="uploadFile"
        :show-file-list="true"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">
          请上传格式为jpeg,png,gif,jpg,pdf,doc,docx,zip.rar,7z的文件
        </div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <div>
        <el-button type="primary" @click="exportRow">导出</el-button>
      </div>

      <common-form inline :formLabel="formLabel" :form="searchFrom">
        <el-button type="primary" @click="searchKey(searchFrom.keyword)"
          >搜索</el-button
        >
      </common-form>
    </div>
    <audit-file-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @changePage="getList()"
      @pass="passRow"
      @reject="rejectRow"
      @edit="editRow"
      id="out-table"
    ></audit-file-table>
  </div>
</template>

<script>
import CommonForm from "../../components/CommonForm";
import AuditFileTable from "../../components/AuditFileTable";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import axios from '../../axios/ajax'
import qs from 'qs'
export default {
  components: {
    CommonForm,
    AuditFileTable,
  },
  data () {
    return {
      operateType: "edit",
      isShow: false,
      updateFile: false,
      tableData: [],
      tableLabel: [
        {
          prop: "file_name",
          label: "文档名称",
          width: 160
        },
        {
          prop: "file_type",
          label: "文档类型",
          width: 160
        },
        {
          prop: "file_property",
          label: "文档说明",
          width: 200
        },
        {
          prop: "file_id",
          label: "文档编号",
          width: 150
        },
        {
          prop: "file_version",
          label: "文档版本",
          width: 150
        },
        {
          prop: "file_project",
          label: "所属项目",
          width: 180
        },
        {
          prop: "file_uploaddate",
          label: "上传日期",
          width: 150
        },
        {
          prop: "file_updatedate",
          label: "更新日期",
          width: 150
        },
        {
          prop: "file_url",
          label: "下载链接",
          width: 150,
          type: "link"
        },
        {
          prop: "if_issued",
          label: "审核状态",
          width: 100,
          type: "status"
        },
        {
          prop: "operatorname",
          label: "经办人",
          width: 100,
          type: "name"
        },
      ],
      config: {
        page: 1,
        total: 30,
        loading: false
      },
      operateForm: {
        file_name: "",
        file_type: "",
        file_property: "",
        file_version: "",
        file_project: ""
      },
      operateFormLabel: [
        {
          model: "file_name",
          label: "设计文档名称",
          width: 160
        },
        {
          model: "file_type",
          label: "文档类型",
          width: 160,
          type: 'select',
          opts: [
            {
              label: 'contractFile',
              value: '合同文档'
            },
            {
              label: 'designFile',
              value: '设计文档'
            },
            {
              label: 'auditFile',
              value: '审计文档'
            },
            {
              label: 'administrativeFile',
              value: '行政文档'
            },
            {
              label: 'archiveFile',
              value: '档案文档'
            }
          ]
        },
        {
          model: "file_property",
          label: "文档说明",
          width: 200
        },
        {
          model: "file_version",
          label: "设计文档版本",
          width: 100
        },
        {
          model: "file_project",
          label: "所属项目",
          width: 180
        }
      ],
      rules: {
        file_name: [
          { required: true, message: '请输入文档名称', trigger: 'blur' },
          { min: 4, max: 255, message: '文档名称长度需要在 4 到 255 个字符', trigger: 'blur' }
        ],
        file_type: [
          { type: "enum", enum: ['合同文档', '设计文档', '审计文档', '行政文档', '档案文档'], required: true, message: '请选择文档类型：设计文档，审计文档，行政文档或档案文档', trigger: 'blur' }
        ],
        file_property: [
          { message: '请输入文档说明', trigger: 'blur' },
          { max: 255, message: '文档名称长度最多 255 个字符', trigger: 'blur' }
        ],
        file_version: [
          { required: true, message: '请输入文档版本', trigger: 'blur' },
          { max: 255, message: '文档版本长度最多 255 个字符', trigger: 'blur' }
        ],
        file_project: [
          { message: '请输入文档相关项目', trigger: 'blur' },
          { max: 255, message: '文档相关项目长度最多 255 个字符', trigger: 'blur' }
        ]
      },
      searchFrom: {
        keyword: ""
      },
      fileList: [

      ],
      formLabel: [
        {
          model: "keyword",
          label: ""
        }
      ],
      formData: "",
      uploadApiUrl: "/file/upload",
    };
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleChange (file, fileList) {
      this.fileList = fileList;
    },
    uploadFile (file) {
      this.formData.append("file", file.file);
    },
    onBeforeUpload (file) {
      var result = true;
      for (var key in this.operateForm) {
        if (key === "file_url" && this.operateForm[key] != "NULL") {
          result = false;
          break;
        }
      }
      if (result === false) {
        result = this.$confirm("已经上传的旧文件将会被覆盖，请问确定要上传新的文件吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
      }
      if (result === false) {
        return false;
      }

      const isIMAGE = file.type === "image/jpeg" || "image/png" || "image/gif" || "image/jpg";
      const isDOCUMENT = file.type === "application/pdf" || "application/doc" || "application/docx"
      const isZip = file.type === "application/zip" || "application/rar" || "application/7z";
      const isLt100M = file.size / 1024 / 1024 < 100;

      if (!isIMAGE || !isDOCUMENT || !isZip) {
        this.$message.error('上传文件格式只能为jpeg,png,gif,jpg,pdf,doc,docx,zip.rar,7z');
      }

      if (!isLt100M) {
        this.$message.error('上传文件大小不得大于100MB');
      }
      return (isIMAGE || isDOCUMENT || isZip) && isLt100M;
    },
    getList (name = '') {
      this.config.loading = true
      name ? (this.config.page = 1) : ''
      axios._get("http://8.129.86.121:8080/file/getChecker").then(res => {
        this.$message.success("获取项目列表成功！")
        this.tableData = res;
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i]["file_url"] == null) {
            this.tableData[i]["file_url"] = "NULL";
          }
          else {
            this.tableData[i]["file_url"] = window.encodeURI(this.tableData[i]["file_url"]);
          }

          if (this.tableData[i]["if_submit"] === "0" || this.tableData[i]["if_delete"] === "1") {
            this.tableData.splice(i, 1);
          }
        }
        // this.config.total = res.data.count;
        this.config.loading = false;
        //console.log("tabledata: "+JSON.stringify(res));
      }, err => {
        alert("error!!!");
      })
    },

    editRow (row) {
      this.operateType = "edit";
      this.isShow = true;
      this.operateForm = row;
    },
    confirm () {
      if (this.operateType === "edit") {
        let formdata = new FormData();
        for (var key in this.operateForm) {
          formdata.append(key, this.operateForm[key])
        }

        if (this.fileList.length != 0) {
          formdata.append("file", this.fileList[0].raw)
          this.fileList.splice(0, 1);
        }

        axios._post('http://8.129.86.121:8080/file/update', formdata).then(res => {
          this.$message.success("更新文档成功！");
          this.isShow = false;
          console.log("Inserted " + res);//res是返回插入数据的id
          this.getList()
        }, err => {
          alert("error!!!");
          console.log(JSON.stringify(formdata));
          console.log(formdata);
        })
      }
    },
    delRow (row) {
      this.$confirm("此操作将不再显示该文档信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.operateForm = row;
          let formdata = new FormData();
          for (var key in this.operateForm) {
            formdata.append(key, this.operateForm[key])
          }

          axios._post('http://8.129.86.121:8080/file/checkdelete', formdata).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          }, err => {
            this.$message({
              type: "error",
              message: "删除失败"
            });
            this.getList();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    passRow (row) {
      this.$confirm("此操作将审核通过该文档, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.operateForm = row;
          let formdata = new FormData();
          for (var key2 in this.operateForm) {
            formdata.append(key2, this.operateForm[key2])
          }

          axios._post('http://8.129.86.121:8080/file/checkpass', formdata).then(res => {
            if (res.code == "250") {
              this.$message({
                type: "error",
                message: "已有审核人处理此文档！"
              });
            }
            else {
              this.$message({
                type: "success",
                message: "审核结果保存成功!"
              });
            }

            this.getList();
          }, err => {
            this.$message({
              type: "error",
              message: "审核结果保存失败！"
            });
            this.getList();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },
    rejectRow (row) {
      this.$confirm("此操作将驳回该文档, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.operateForm = row;
          let formdata = new FormData();
          for (var key3 in this.operateForm) {
            formdata.append(key3, this.operateForm[key3])
          }

          axios._post('http://8.129.86.121:8080/file/checknotpass', formdata).then(res => {
            if (res.code == "250") {
              this.$message({
                type: "error",
                message: "已有审核人处理此文档！"
              });
            }
            else {
              this.$message({
                type: "success",
                message: "审核结果保存成功!"
              });
            }
            this.getList();
          }, err => {
            this.$message({
              type: "error",
              message: "审核结果保存失败"
            });
            this.getList();
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },
    //定义导出Excel表格事件
    exportRow () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "导出文档.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    searchKey (keyword) {
      if (keyword == "" || keyword == undefined || keyword == null) {
        this.getList();
      }
      else {
        this.config.loading = true;
        var dataList = [];

        for (var i = 0; i < this.tableData.length; i++) {
          for (var j = 0; j < this.tableLabel.length; j++) {
            var keyStr = this.tableLabel[j]["prop"];

            if (this.tableData[i][keyStr] != null && this.tableData[i][keyStr].toString().indexOf(keyword) != -1 && keyStr != "file_url") {
              dataList.push(this.tableData[i]);
              break;
            }
          }
        }
        this.tableData = dataList;
        this.config.loading = false;
      }
    }
  },
  created () {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common";
</style>
