<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="项目名称">
              <j-dict-select-tag placeholder="请选择项目名称" v-model="queryParam.projectName" dictCode="cshxmcj,project_name,project_name"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="甲方单位名称">
              <j-dict-select-tag placeholder="请选择甲方单位名称" v-model="queryParam.partaName" dictCode="cshxmcj,parta_name,parta_name"/>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="甲方联系人">
                <j-dict-select-tag placeholder="请选择甲方联系人" v-model="queryParam.partaContactPerson" dictCode="cshxmcj,parta_person,parta_person"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="经营类型">
                <a-input placeholder="请输入经营类型" v-model="queryParam.managementYpe"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="初次登记项目所处阶段">
                <a-input placeholder="请输入初次登记项目所处阶段" v-model="queryParam.status"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->



    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>


        <span style="float:right;" class="navbar">
          <a @click="loadData()"><a-icon type="sync" />刷新</a>
          <a-divider type="vertical" />
          <a-popover  :getPopupContainer="triggerNode => {return triggerNode.parentNode;}" title="自定义列" trigger="click" placement="leftBottom">
            <template slot="content">
              <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
                <a-row>
                  <template v-for="(item,index) in defColumns">
                    <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                        <a-col :span="12"><a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox></a-col>
                    </template>
                  </template>
                </a-row>
              </a-checkbox-group>
            </template>
            <a><a-icon type="setting" />设置</a>
          </a-popover>
        </span>

      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />

          <a @click="handleAdds(record)">添加跟踪信息</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <yxxmxxdj-modal ref="modalForm" @ok="modalFormOk"/>
    <yxxmgzjl-form ref="yzpForm"></yxxmgzjl-form>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import YxxmxxdjModal from './modules/YxxmxxdjModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import YxxmgzjlForm from "./modules/YxxmgzjlForm";
  import Vue from 'vue'

  export default {
    name: "YxxmxxdjList",
    mixins:[JeecgListMixin],
    components: {
      YxxmgzjlForm,
      JDictSelectTag,
      YxxmxxdjModal
    },
    data () {
      return {
        description: '营销项目信息登记管理页面',
        //表头
        columns:[],
        //列设置
        settingColumns:[],
        //列定义
        defColumns: [
          {
            title: '序号',
           dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'创建日期',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title:'项目名称',
            align:"center",
            dataIndex: 'projectName_dictText'
          },
          {
            title:'甲方单位名称',
            align:"center",
            dataIndex: 'partaName_dictText'
          },
          {
            title:'甲方联系人',
            align:"center",
            dataIndex: 'partaContactPerson_dictText'
          },
          {
            title:'联系人手机',
            align:"center",
            dataIndex: 'iphone'
          },
          {
            title:'联系人职务',
            align:"center",
            dataIndex: 'post'
          },
          {
            title:'联系人角色',
            align:"center",
            dataIndex: 'role'
          },
          {
            title:'项目预算',
            align:"center",
            dataIndex: 'budget'
          },
          {
            title:'业务类型',
            align:"center",
            dataIndex: 'businessYpe'
          },
          {
            title:'经营类型',
            align:"center",
            dataIndex: 'managementYpe'
          },
          {
            title:'当前进度',
            align:"center",
            dataIndex: 'progress'
          },
          {
            title:'所在部门',
            align:"center",
            dataIndex: 'department'
          },
          {
            title:'独立营销人',
            align:"center",
            dataIndex: 'independentMarketer'
          },
          {
            title:'初次登记项目所处阶段',
            align:"center",
            dataIndex: 'status'
          },
          {
            title:'辅助营销人员',
            align:"center",
            dataIndex: 'managementPerson'
          },
          {
            title:'是否存在经营人员调整',
            align:"center",
            dataIndex: 'turnover_dictText'
          },
          {
            title:'是否新业务',
            align:"center",
            dataIndex: 'newBusiness_dictText'
          },
          {
            title:'是否新客户',
            align:"center",
            dataIndex: 'newCustomer_dictText'
          },
          {
            title:'项目内容',
            align:"center",
            dataIndex: 'projectContent'
          },
          {
            title:'备注',
            align:"center",
            dataIndex: 'remark'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width: '160px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/estar/yxxmxxdj/list",
          delete: "/estar/yxxmxxdj/delete",
          deleteBatch: "/estar/yxxmxxdj/deleteBatch",
          exportXlsUrl: "/estar/yxxmxxdj/exportXls",
          importExcelUrl: "estar/yxxmxxdj/importExcel",

        },
        dictOptions:{},
      }
    },
    created() {
      this.initColumns();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },

      handleAdds(record) {
        this.$refs.yzpForm.edit(record)
        this.$refs.yzpForm.title = '追踪'
        this.$refs.yzpForm.disableSubmit = false
      },


      //列设置更改事件
      onColSettingsChange (checkedValues) {
        var key = this.$route.name+":colsettings";
        Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
        this.settingColumns = checkedValues;
        const cols = this.defColumns.filter(item => {
          if(item.key =='rowIndex'|| item.dataIndex=='action'){
            return true
          }
          if (this.settingColumns.includes(item.dataIndex)) {
            return true
          }
          return false
        })
        this.columns =  cols;
      },
      initColumns(){
        //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
        //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

        var key = this.$route.name+":colsettings";
        let colSettings= Vue.ls.get(key);
        if(colSettings==null||colSettings==undefined){
          let allSettingColumns = [];
          this.defColumns.forEach(function (item,i,array ) {
            allSettingColumns.push(item.dataIndex);
          })
          this.settingColumns = allSettingColumns;
          this.columns = this.defColumns;
        }else{
          this.settingColumns = colSettings;
          const cols = this.defColumns.filter(item => {
            if(item.key =='rowIndex'|| item.dataIndex=='action'){
              return true;
            }
            if (colSettings.includes(item.dataIndex)) {
              return true;
            }
            return false;
          })
          this.columns =  cols;
        }
      }

    }
  }
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';
.navbar {
  /deep/ .ant-popover-inner-content{
    width: 300px;
  }
}
</style>