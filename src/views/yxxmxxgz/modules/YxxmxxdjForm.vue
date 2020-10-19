<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
<!--          <a-col :span="12" >-->
<!--            <a-form-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <j-date placeholder="请选择更新日期" v-decorator="['updateTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :span="24" >
            <a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <j-dict-select-tag type="list" v-decorator="['projectName', validatorRules.projectName]" :trigger-change="true" dictCode="cshxmcj,project_name,project_name" placeholder="请选择项目名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="甲方单位名称" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <j-dict-select-tag type="list" v-decorator="['partaName', validatorRules.partaName]" :trigger-change="true" dictCode="cshxmcj,parta_name,parta_name" placeholder="请选择甲方单位名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="甲方联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['partaContactPerson', validatorRules.partaContactPerson]" :trigger-change="true" dictCode="cshxmcj,parta_person,parta_person" placeholder="请选择甲方联系人"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="联系人手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['iphone', validatorRules.iphone]" placeholder="请输入联系人手机"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="联系人职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['post']" placeholder="请输入联系人职务"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="联系人角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['role']" placeholder="请输入联系人角色"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="项目预算" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['budget']" placeholder="请输入项目预算"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="业务类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['businessYpe']" placeholder="请输入业务类型"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="经营类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['managementYpe']" placeholder="请输入经营类型"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="当前进度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['progress']" placeholder="请输入当前进度"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="所在部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['department']" placeholder="请输入所在部门"></a-input>
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
            <a-form-item label="是否存在经营人员调整" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['turnover']" :trigger-change="true" dictCode="yn" placeholder="请选择是否存在经营人员调整"/>
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
          <a-col :span="24">
            <a-form-item label="项目内容" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['projectContent']" rows="4" placeholder="请输入项目内容"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['remark']" rows="4" placeholder="请输入备注"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="营销项目跟踪记录" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="yxxmgzjlTable.loading"
          :columns="yxxmgzjlTable.columns"
          :dataSource="yxxmgzjlTable.dataSource"
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
  import JDictSelectTag from "@/components/dict/JDictSelectTag"

  export default {
    name: 'YxxmxxdjForm',
    mixins: [JEditableTableMixin],
    components: {
      JFormContainer,
      JDate,
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
          projectName: {
            rules: [
              { required: true, message: '请输入项目名称!'},
            ]
          },
          partaName: {
            rules: [
              { required: true, message: '请输入甲方单位名称!'},
            ]
          },
          partaContactPerson: {
            rules: [
              { required: true, message: '请输入甲方联系人!'},
            ]
          },
          iphone: {
            rules: [
              { required: false},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
            ]
          },
        },
        refKeys: ['yxxmgzjl', ],
        tableKeys:['yxxmgzjl', ],
        activeKey: 'yxxmgzjl',
        // 营销项目跟踪记录
        yxxmgzjlTable: {
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
              key: 'partaName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '拜访对象',
              key: 'visitorObject',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '拜访时间',
              key: 'visitTime',
              type: FormTypes.date,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '项目所处营销阶段',
              key: 'status',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue: '',
            },
            {
              title: '沟通结果',
              key: 'result',
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
            {
              title: '营销项目信息登记id',
              key: 'yxxmxxdjId',
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
          yxxmgzjl: {
            list: '/estar/yxxmxxdj/queryYxxmgzjlByMainId'
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
        this.yxxmgzjlTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        let fieldval = pick(this.model,'createTime','updateTime','projectName','partaName','partaContactPerson','iphone','post','role','budget','businessYpe','managementYpe','progress','department','independentMarketer','status','managementPerson','turnover','newBusiness','newCustomer','projectContent','remark')
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldval)
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.yxxmgzjl.list, params, this.yxxmgzjlTable)
        }
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展开
          yxxmgzjlList: allValues.tablesValue[0].values,
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
       this.form.setFieldsValue(pick(row,'createTime','updateTime','projectName','partaName','partaContactPerson','iphone','post','role','budget','businessYpe','managementYpe','progress','department','independentMarketer','status','managementPerson','turnover','newBusiness','newCustomer','projectContent','remark'))
     },

    }
  }
</script>

<style scoped>
</style>