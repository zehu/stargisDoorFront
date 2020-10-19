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
  </a-card>
  </j-modal>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  let aa;
  export default {
    name: 'YxgzapjhList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {

    },
    data () {

      return {
        aa:false,
        description: '本周工作安排情况管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'拜访人',
            align:"center",
            dataIndex: 'visiter'
          },
          {
            title:'拜访目的',
            align:"center",
            dataIndex: 'purpose'
          },
          {
            title:'时间日期',
            align:"center",
            dataIndex: 'timeDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'时间段',
            align:"center",
            dataIndex: 'timeSlot'
          },
          {
            title:'地点',
            align:"center",
            dataIndex: 'place'
          },
          {
            title:'预期目标',
            align:"center",
            dataIndex: 'expectedTarget'
          },
          {
            title:'实际完成情况',
            align:"center",
            dataIndex: 'actualCompletion'
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
          list: "/estar/yxgzapjh/list",
          // delete: "/estar/yxgzapjh/delete",
          // deleteBatch: "/estar/yxgzapjh/deleteBatch",
          // exportXlsUrl: "/estar/yxgzapjh/exportXls",
          // importExcelUrl: "estar/yxgzapjh/importExcel",

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
      add () {
        this.aa = !aa;
      },
      handleOk(e) {
        console.log(e);

        this.aa = false;
      },
      handleCancel(){
        this.aa = false;
      },
      initDictConfig(){
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>