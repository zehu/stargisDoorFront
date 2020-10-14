<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="项目名称">
              <a-input placeholder="请输入项目名称" v-model="queryParam.projectName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="甲方单位名称">
              <a-input placeholder="请输入甲方单位名称" v-model="queryParam.partaName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="甲方联系人">
                <a-input placeholder="请输入甲方联系人" v-model="queryParam.partaPerson"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="业务类型">
                <a-input placeholder="请输入业务类型" v-model="queryParam.bussinessType"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="所属部门">
                <a-input placeholder="请输入所属部门" v-model="queryParam.department"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="初次登记项目所处阶段">
                <a-input placeholder="请输入初次登记项目所处阶段" v-model="queryParam.projectInitStatus"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('初始化项目信息采集')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div style="margin-bottom: 10px;">
        <a-radio-group default-value="0,1,2,3" v-model="status" @change="getValue" size="large" button-style="solid">
          <a-radio-button value="0,1,2,3">
            全部
          </a-radio-button>
          <a-radio-button value="0">
            我的待办
          </a-radio-button>
          <a-radio-button value="1">
            我的已办
          </a-radio-button>
          <a-radio-button value="2">
            我的办结
          </a-radio-button>
        </a-radio-group>

      </div>

      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        <span style="float:right;">
          <a @click="loadData()"><a-icon type="sync" />刷新</a>
          <a-divider type="vertical" />
          <a-popover title="自定义列" trigger="click" placement="leftBottom">
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
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <div slot="filterDropdown">
          <a-card>
            <a-checkbox-group @change="onColSettingsChange" v-model="settingColumns" :defaultValue="settingColumns">
              <a-row>
                <template v-for="(item,index) in defColumns">
                  <template v-if="item.key!='rowIndex'&& item.dataIndex!='action'">
                    <a-col :span="12">
                      <a-checkbox :value="item.dataIndex">{{ item.title }}</a-checkbox>
                    </a-col>
                  </template>
                </template>
              </a-row>
            </a-checkbox-group>
          </a-card>
        </div>
        <a-icon slot="filterIcon" type='setting' :style="{ fontSize:'16px',color:  '#108ee9' }" />

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt=""
               style="max-width:80px;font-size: 12px;font-style: italic;" />
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

    <cshxmcj-modal ref="modalForm" @ok="modalFormOk"></cshxmcj-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CshxmcjModal from './modules/CshxmcjModal'
import Vue from 'vue'
import { filterObj } from '@/utils/util'
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue'
import JInput from '@/components/jeecg/JInput.vue'

export default {
  name: 'CshxmcjList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    CshxmcjModal
  },
  data() {
    return {
      description: '初始化项目信息采集管理页面',
      //表头
      columns: [],
      //列设置
      settingColumns: [],
      //列定义
      defColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '项目编号',
          sorter: true,
          align: 'center',
          dataIndex: 'projectId'
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '甲方单位名称',
          align: 'center',
          dataIndex: 'partaName'
        },
        {
          title: '法定代表人',
          align: 'center',
          dataIndex: 'legalRepresentative'
        },
        {
          title: '统一社会信用代码',
          align: 'center',
          dataIndex: 'socialCode'
        },
        {
          title: '企业性质',
          align: 'center',
          dataIndex: 'enterpriseNature'
        },
        {
          title: '详细地址',
          align: 'center',
          dataIndex: 'detailAddress'
        },
        {
          title: '甲方联系人',
          align: 'center',
          dataIndex: 'partaPerson'
        },
        {
          title: '联系人手机',
          sorter: true,
          align: 'center',
          dataIndex: 'mobilePhone'
        },
        {
          title: '联系人职务',
          align: 'center',
          dataIndex: 'post'
        },
        {
          title: '联系人角色',
          align: 'center',
          dataIndex: 'role'
        },
        {
          title: '业务类型',
          sorter: true,
          align: 'center',
          dataIndex: 'bussinessType'
        },
        {
          title: '所属部门',
          align: 'center',
          dataIndex: 'department'
        },
        {
          title: '初次登记项目所处阶段',
          align: 'center',
          dataIndex: 'projectInitStatus'
        },
        {
          title: '项目预算',
          align: 'center',
          dataIndex: 'projectBudget'
        },
        {
          title:'项目内容简介',
          align:"center",
          dataIndex: 'contents'
        },
        {
          title: '项目状态',
          align: 'center',
          key: 'status',
          dataIndex: 'status'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      status: '0,1,2,3',
      url: {
        list: '/estar/cshxmcj/list',
        delete: '/estar/cshxmcj/delete',
        deleteBatch: '/estar/cshxmcj/deleteBatch',
        exportXlsUrl: '/estar/cshxmcj/exportXls',
        importExcelUrl: 'estar/cshxmcj/importExcel'

      },
      dictOptions: {}
    }
  },

  methods: {
    getValue(e) {

      this.status = e.target.value
      this.loadData(1)
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.status = this.status
      return filterObj(param)
    },
    initDictConfig() {
    },
    //列设置更改事件
    onColSettingsChange(checkedValues) {
      var key = this.$route.name + ':colsettings'
      Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
      this.settingColumns = checkedValues
      const cols = this.defColumns.filter(item => {
        if (item.key == 'rowIndex' || item.dataIndex == 'action') {
          return true
        }
        if (this.settingColumns.includes(item.dataIndex)) {
          return true
        }
        return false
      })
      this.columns = cols
    },
    initColumns() {
      //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
      //this.defColumns = colAuthFilter(this.defColumns,'testdemo:');

      var key = this.$route.name + ':colsettings'
      let colSettings = Vue.ls.get(key)
      if (colSettings == null || colSettings == undefined) {
        let allSettingColumns = []
        this.defColumns.forEach(function(item, i, array) {
          allSettingColumns.push(item.dataIndex)
        })
        this.settingColumns = allSettingColumns
        this.columns = this.defColumns
        console.log(this.columns)
        console.log(this.defColumns)
      } else {
        this.settingColumns = colSettings
        const cols = this.defColumns.filter(item => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action') {
            return true
          }
          if (colSettings.includes(item.dataIndex)) {
            return true
          }
          return false
        })
        this.columns = cols
      }
    },
    //业务状态切换status
    onChange(e) {
      this.status = e.target.value

    }

  },
  created() {
    this.initColumns()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>