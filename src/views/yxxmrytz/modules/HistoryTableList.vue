<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="aa"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel">
    <a-card :bordered="false">

      <!-- table区域-begin -->
      <div>
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

        </a-table>
      </div>

    </a-card>
  </j-modal>
</template>
<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import pick from "lodash.pick";

let aa;
export default {
  name: 'HistoryTableList',
  mixins:[JeecgListMixin, mixinDevice],


  data () {
    return {
      aa:false,
      description: '历史表管理页面',
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
          title:'所在部门',
          align:"center",
          dataIndex: 'department'
        },
        {
          title:'经营人员',
          align:"center",
          dataIndex: 'businessPersonnel'
        },
        {
          title:'状态',
          align:"center",
          dataIndex: 'status'
        },
        {
          title:'跟进开始时间',
          align:"center",
          dataIndex: 'startTime',
          customRender:function (text) {
            return !text?"":(text.length>10?text.substr(0,10):text)
          }
        },
        {
          title:'跟进结束时间',
          align:"center",
          dataIndex: 'endTime',
          customRender:function (text) {
            return !text?"":(text.length>10?text.substr(0,10):text)
          }
        },
        {
          title:'时长',
          align:"center",
          dataIndex: 'duration'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align:"center",
          fixed:"right",
          width:147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: "/estar/historyTable/list",
        // delete: "/estar/historyTable/delete",
        // deleteBatch: "/estar/historyTable/deleteBatch",
        // exportXlsUrl: "/estar/historyTable/exportXls",
        // importExcelUrl: "estar/historyTable/importExcel",

      },
      dictOptions:{},

    }
  },
  created() {
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    },
  },
  methods: {
    initDictConfig(){
    },
    add () {
      this.aa = !aa;
    },

    handleOk(e) {
      console.log(e);

      this.aa = false;
    },
    handleCancel(){
      this.aa = false;
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>

