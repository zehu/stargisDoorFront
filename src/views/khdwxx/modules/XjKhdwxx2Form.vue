<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-item label=" 企业名称" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['enterpriseName', validatorRules.enterpriseName]" placeholder="请输入 企业名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label=" 法定代表人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['legalRepresentative', validatorRules.legalRepresentative]" placeholder="请输入 法定代表人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label=" 统一社会信用代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['unifiedSocialCreditCode', validatorRules.unifiedSocialCreditCode]" placeholder="请输入 统一社会信用代码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label=" 所在区域" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <j-area-linkage type="cascader" v-decorator="['region', validatorRules.region]" placeholder="请输入省市区"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="企业性质" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['natureOfEnterprise', validatorRules.natureOfEnterprise]" placeholder="请输入企业性质"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label=" 企业网址 " :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['enterpriseWebsite', validatorRules.enterpriseWebsite]" placeholder="请输入 企业网址 "></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label="详细地址" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['address', validatorRules.address]" placeholder="请输入详细地址"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label=" 业务范围 " :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['businessScope']" rows="4" placeholder="请输入 业务范围 "/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择更新日期" v-decorator="['updateTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12" >
            <a-form-item label="状态信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['status']" :trigger-change="true" dictCode="approval_status" placeholder="请选择状态信息"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
    <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="客户联系人信息" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="khlxrxxTable.loading"
          :columns="khlxrxxTable.columns"
          :dataSource="khlxrxxTable.dataSource"
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
import JAreaLinkage from '@comp/jeecg/JAreaLinkage'

export default {
  name: 'XjKhdwxx2Form',
  mixins: [JEditableTableMixin],
  components: {
    JFormContainer,
    JDate,
    JDictSelectTag,
    JAreaLinkage,
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
      addDefaultRowNum:1,
      validatorRules: {
        enterpriseName: {
          rules: [
            { required: true, message: '请输入 企业名称!'},
          ]
        },
        legalRepresentative: {
          rules: [
            { required: true, message: '请输入 法定代表人!'},
          ]
        },
        unifiedSocialCreditCode: {
          rules: [
            { required: true, message: '请输入 统一社会信用代码!'},
          ]
        },
        region: {
          rules: [
            { required: true, message: '请输入 所在区域!'},
          ]
        },
        natureOfEnterprise: {
          rules: [
            { required: true, message: '请输入企业性质!'},
          ]
        },
        enterpriseWebsite: {
          rules: [
            { required: true, message: '请输入 企业网址 !'},
          ]
        },
        address: {
          rules: [
            { required: true, message: '请输入详细地址!'},
          ]
        },
      },
      refKeys: ['khlxrxx', ],
      tableKeys:['khlxrxx', ],
      activeKey: 'khlxrxx',
      // 客户联系人信息
      khlxrxxTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '姓名',
            key: 'name',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: ' 性别',
            key: 'sex',
            type: FormTypes.select,
            dictCode:"sex",
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '移动电话',
            key: 'mobilePhone',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '座机',
            key: 'telPhone',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: ' 邮箱',
            key: 'email',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '职务',
            key: 'post',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '企业名称',
            key: 'enterpriseName',
            type: FormTypes.select,
            dictCode:"xj_khdwxx2,enterprise_name,id",
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '所属部门',
            key: 'sysOrgCode',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '更新日期',
            key: 'updateTime',
            type: FormTypes.datetime,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '角色',
            key: 'role',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '区域',
            key: 'region',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '家庭住址',
            key: 'adrress',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: ' 兴趣爱好',
            key: 'hobby',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
          {
            title: '备注',
            key: 'remark',
            type: FormTypes.input,
            width:"200px",
            placeholder: '请输入${title}',
            defaultValue: '',
          },
        ]
      },
      url: {
        add: "/estar/xjKhdwxx2/add",
        edit: "/estar/xjKhdwxx2/edit",
        queryById: "/estar/xjKhdwxx2/queryById",
        khlxrxx: {
          list: '/estar/xjKhdwxx2/queryKhlxrxxByMainId'
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
      this.khlxrxxTable.dataSource=[]
    },
    getAllTable() {
      let values = this.tableKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      let fieldval = pick(this.model,'enterpriseName','legalRepresentative','unifiedSocialCreditCode','region','natureOfEnterprise','enterpriseWebsite','address','businessScope','updateTime','status')
      this.$nextTick(() => {
        this.form.setFieldsValue(fieldval)
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.khlxrxx.list, params, this.khlxrxxTable)
      }
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        khlxrxxList: allValues.tablesValue[0].values,
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
      this.form.setFieldsValue(pick(row,'enterpriseName','legalRepresentative','unifiedSocialCreditCode','region','natureOfEnterprise','enterpriseWebsite','address','businessScope','updateTime','status'))
    },

  }
}
</script>

<style scoped>
</style>