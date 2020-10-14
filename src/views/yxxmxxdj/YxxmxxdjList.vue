<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="项目名称">
              <j-dict-select-tag placeholder="请选择项目名称" v-model="queryParam.projectName" dictCode="cshxmcj,project_name,id"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="辅助营销人员">
              <a-input placeholder="请输入辅助营销人员" v-model="queryParam.managementPerson"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="当前进度">
                <a-input placeholder="请输入当前进度" v-model="queryParam.currentProgress"></a-input>
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('营销项目信息登记')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>

      <div style="margin-bottom: 10px;">
        <a-radio-group default-value="1,2,3,4" v-model="status" @change="getValue" size="large" button-style="solid">
          <a-radio-button value="1,2,3,4">
            全部
          </a-radio-button>
          <a-radio-button value="2">
            我的待办
          </a-radio-button>
          <a-radio-button value="3">
            我的已办
          </a-radio-button>
          <a-radio-button value="4">
            我的办结
          </a-radio-button>
        </a-radio-group>

      </div>

      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
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
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import YxxmxxdjModal from './modules/YxxmxxdjModal'
  import JDictSelectTag from '@/components/dict/JDictSelectTag.vue'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'
  import { filterObj } from '@/utils/util'

  export default {
    name: "YxxmxxdjList",
    mixins:[JeecgListMixin],
    components: {
      JDictSelectTag,
      YxxmxxdjModal
    },
    data () {
      return {
        description: '营销项目信息登记管理页面',
        // 表头
        columns: [
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
            dataIndex: 'phone'
          },
          {
            title:'联系人职务',
            align:"center",
            dataIndex: 'post'
          },
          {
            title:'联系人角色',
            align:"center",
            dataIndex: 'role_dictText'
          },
          {
            title:'项目预算',
            align:"center",
            dataIndex: 'budget'
          },
          {
            title:'业务类型',
            align:"center",
            dataIndex: 'businessType'
          },
          {
            title:'经营类型',
            align:"center",
            dataIndex: 'managementType_dictText'
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
            title:'当前进度',
            align:"center",
            dataIndex: 'currentProgress_dictText'
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
            scopedSlots: { customRender: 'action' },
          }
        ],
        status: '1,2,3,4',
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
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
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
      initDictConfig(){
      },

    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>