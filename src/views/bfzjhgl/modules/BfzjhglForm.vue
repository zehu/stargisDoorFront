<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-item label="姓名"  :labelCol="{span:8}" :wrapperCol="wrapperCol">
              <a-input v-decorator="['name']" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="所在部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['department']" placeholder="请输入所在部门"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="岗级" :labelCol="{span:8}" :wrapperCol="wrapperCol">
              <a-input v-decorator="['grade']" placeholder="请输入岗级"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="岗位指标已完成合同核算额" :labelCol="{span:4}" :wrapperCol="{span:18}">
              <a-input v-decorator="['budget']" placeholder="请输入岗位指标已完成合同核算额"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="岗位指标已完成回款核算额" :labelCol="{span:4}" :wrapperCol="{span:18}">
              <a-input v-decorator="['accountsReceivable']" placeholder="请输入岗位指标已完成回款核算额"></a-input>
            </a-form-item>
          </a-col>
<!--          <a-col :span="24" >-->
<!--            <a-form-item label="本周工作完成情况" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input v-decorator="['completionWeekWork']" placeholder="请输入本周工作完成情况"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24" >-->
<!--            <a-form-item label="下周工作计划安排" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input v-decorator="['nextWeekPlan']" placeholder="请输入下周工作计划安排"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
        </a-row>
      </a-form>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="本周工作安排情况" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="yxgzapjhTable.loading"
          :columns="yxgzapjhTable.columns"
          :dataSource="yxgzapjhTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
      <a-tab-pane tab="下周工作计划安排" :key="refKeys[1]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[1]"
          :loading="xzgzapTable.loading"
          :columns="xzgzapTable.columns"
          :dataSource="xzgzapTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise } from '@/utils/JEditableTableUtil'
  import { JEditableTableMixin } from '@/mixins/JEditableTableMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'

  export default {
    name: 'BfzjhglForm',
    mixins: [JEditableTableMixin],
    components: {
      JFormContainer,
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['yxgzapjh', 'xzgzap', ],
        tableKeys:['yxgzapjh', 'xzgzap', ],
        activeKey: 'yxgzapjh',
        // 本周工作安排情况
        yxgzapjhTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '拜访人',
              key: 'visiter',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '拜访目的',
              key: 'purpose',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '时间日期',
              key: 'timeDate',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '时间段',
              key: 'timeSlot',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '地点',
              key: 'place',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '预期目标',
              key: 'expectedTarget',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '实际完成情况',
              key: 'actualCompletion',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        // 下周工作计划安排
        xzgzapTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '拜访人',
              key: 'visiter',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '拜访项目',
              key: 'purpose',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '时间日期',
              key: 'dateTime',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '时间段',
              key: 'timeSlot',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '地点',
              key: 'place',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '预期目标',
              key: 'expectedTarget',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        url: {
          add: "/estar/bfzjhgl/add",
          edit: "/estar/bfzjhgl/edit",
          queryById: "/estar/bfzjhgl/queryById",
          yxgzapjh: {
            list: '/estar/bfzjhgl/queryYxgzapjhByMainId'
          },
          xzgzap: {
            list: '/estar/bfzjhgl/queryXzgzapByMainId'
          },
        }
      }
    },
    props: {
      //流程表单data
      formData: {
        type: Object,
        default: ()=>{},
        required: false
      },
      //表单模式：false流程表单 true普通表单
      formBpm: {
        type: Boolean,
        default: false,
        required: false
      },
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return false
          }
          return true
        }
        return this.disabled
      },
      showFlowSubmitButton(){
        if(this.formBpm===true){
          if(this.formData.disabled===false){
            return true
          }
        }
        return false
      }
    },
    created () {
      //如果是流程中表单，则需要加载流程表单data
      this.showFlowData();
    },
    methods: {
      addBefore(){
        this.form.resetFields()
        this.yxgzapjhTable.dataSource=[]
        this.xzgzapTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'name','department','grade','budget','accountsReceivable','completionWeekWork','nextWeekPlan')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.yxgzapjh.list, params, this.yxgzapjhTable)
          this.requestSubTableData(this.url.xzgzap.list, params, this.xzgzapTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          yxgzapjhList: allValues.tablesValue[0].values,
          xzgzapList: allValues.tablesValue[1].values,
        }
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          })
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
     popupCallback(row){
       this.form.setFieldsValue(pick(row,'name','department','grade','budget','accountsReceivable','completionWeekWork','nextWeekPlan'))
     },

    }
  }
</script>

<style scoped>
</style>