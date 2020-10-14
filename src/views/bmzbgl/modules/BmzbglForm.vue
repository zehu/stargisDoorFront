<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-item label="部门名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['name']" placeholder="请输入部门名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="指标年度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择指标年度" v-decorator="['indexYear']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="新签合同额(万元)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['contractAmount']" placeholder="请输入新签合同额(万元)"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="营业收入额(万元)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['businessIncome']" placeholder="请输入营业收入额(万元)"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="利润额(万元)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['profitMargin']" placeholder="请输入利润额(万元)"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="部门考核指标" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="bmkhzbTable.loading"
          :columns="bmkhzbTable.columns"
          :dataSource="bmkhzbTable.dataSource"
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
  import JDate from '@/components/jeecg/JDate'  

  export default {
    name: 'BmzbglForm',
    mixins: [JEditableTableMixin],
    components: {
      JFormContainer,
      JDate,
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
        refKeys: ['bmkhzb', ],
        tableKeys:['bmkhzb', ],
        activeKey: 'bmkhzb',
        // 部门考核指标
        bmkhzbTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '考核指标',
              key: 'assessmentIndex',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '考核阶段内容',
              key: 'content',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '考核指南及评定原则',
              key: 'assessmentPrinciples',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '考核分值',
              key: 'assessmentScore',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '考核截止时间节点',
              key: 'timeNode',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        url: {
          add: "/estar/bmzbgl/add",
          edit: "/estar/bmzbgl/edit",
          queryById: "/estar/bmzbgl/queryById",
          bmkhzb: {
            list: '/estar/bmzbgl/queryBmkhzbByMainId'
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
        this.bmkhzbTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'name','indexYear','contractAmount','businessIncome','profitMargin')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.bmkhzb.list, params, this.bmkhzbTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          bmkhzbList: allValues.tablesValue[0].values,
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
       this.form.setFieldsValue(pick(row,'name','indexYear','contractAmount','businessIncome','profitMargin'))
     },

    }
  }
</script>

<style scoped>
</style>