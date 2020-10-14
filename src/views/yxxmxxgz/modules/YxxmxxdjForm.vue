<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="12" >
            <a-form-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectName']" placeholder="请输入项目名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="甲方单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partaName']" placeholder="请输入甲方单位名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="甲方联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partaContactPerson']" placeholder="请输入甲方联系人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="联系人手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['phone']" placeholder="请输入联系人手机"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="联系人职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['post']" placeholder="请输入联系人职务"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="联系人角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['role']" :trigger-change="true" dictCode="" placeholder="请选择联系人角色"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="项目预算" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['budget']" placeholder="请输入项目预算"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="业务类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['businessType']" placeholder="请输入业务类型"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="经营类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['managementType']" :trigger-change="true" dictCode="" placeholder="请选择经营类型"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="独立营销人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['independentMarketer']" placeholder="请输入独立营销人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="初次登记项目所处阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['status']" placeholder="请输入初次登记项目所处阶段"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="辅助营销人员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['managementPerson']" placeholder="请输入辅助营销人员"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="是否新业务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['newBusiness']" :trigger-change="true" dictCode="yn" placeholder="请选择是否新业务"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="是否新客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['newCustomer']" :trigger-change="true" dictCode="yn" placeholder="请选择是否新客户"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="当前进度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['currentProgress']" :trigger-change="true" dictCode="" placeholder="请选择当前进度"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目内容" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-textarea v-decorator="['projectContent']" rows="4" placeholder="请输入项目内容"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="labelCol2" :wrapperCol="wrapperCol2">
              <a-textarea v-decorator="['remark']" rows="4" placeholder="请输入备注"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="营销项目信息跟踪添加" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="xmxxgzTable.loading"
          :columns="xmxxgzTable.columns"
          :dataSource="xmxxgzTable.dataSource"
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'YxxmxxdjForm',
    mixins: [JEditableTableMixin],
    components: {
      JFormContainer,
      JDictSelectTag,
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
        refKeys: ['xmxxgz', ],
        tableKeys:['xmxxgz', ],
        activeKey: 'xmxxgz',
        // 营销项目信息跟踪添加
        xmxxgzTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '项目名称',
              key: 'projectName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '甲方单位名称',
              key: 'partyaName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '拜访对象',
              key: 'visitors',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '拜访时间',
              key: 'visitingTime',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '项目所处营销阶段',
              key: 'status',
              type: FormTypes.select,
              dictCode:"",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '沟通结果',
              key: 'communicationResults',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '存在问题',
              key: 'problems',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
          ]
        },
        url: {
          add: "/estar/yxxmxxdj/add",
          edit: "/estar/yxxmxxdj/edit",
          queryById: "/estar/yxxmxxdj/queryById",
          xmxxgz: {
            list: '/estar/yxxmxxdj/queryXmxxgzByMainId'
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
        this.xmxxgzTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'projectName','partaName','partaContactPerson','phone','post','role','budget','businessType','managementType','independentMarketer','status','managementPerson','newBusiness','newCustomer','currentProgress','projectContent','remark')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.xmxxgz.list, params, this.xmxxgzTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          xmxxgzList: allValues.tablesValue[0].values,
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
       this.form.setFieldsValue(pick(row,'projectName','partaName','partaContactPerson','phone','post','role','budget','businessType','managementType','independentMarketer','status','managementPerson','newBusiness','newCustomer','currentProgress','projectContent','remark'))
     },

    }
  }
</script>

<style scoped>
</style>