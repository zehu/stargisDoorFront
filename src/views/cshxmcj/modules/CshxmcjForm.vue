<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
<!--          <a-col :span="12">-->
<!--            <a-form-item label="项目编号" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input v-decorator="['projectId']" placeholder="请输入项目编号"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-item label="项目名称" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['projectName']" placeholder="请输入项目名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="甲方单位名称" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['partaName']" placeholder="请输入甲方单位名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="法定代表人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['legalRepresentative',validatorRules.legalRepresentative]" placeholder="请输入法定代表人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="统一社会信用代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['socialCode',validatorRules.socialCode]" placeholder="请输入统一社会信用代码"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业性质" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['enterpriseNature',validatorRules.enterpriseNature]" placeholder="请输入企业性质"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="详细地址" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['detailAddress',validatorRules.detailAddress]" placeholder="请输入详细地址"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="甲方联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partaPerson']" placeholder="请输入甲方联系人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人手机" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['mobilePhone']" placeholder="请输入联系人手机"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['post']" placeholder="请输入联系人职务"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系人角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['role']" placeholder="请输入联系人角色"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="业务类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['bussinessType']" placeholder="请输入业务类型"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['department']" placeholder="请输入所属部门"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="初次登记项目所处阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectInitStatus']" placeholder="请输入初次登记项目所处阶段"></a-input>
<!--              <a-textarea v-decorator="['projectInitStatus']" rows="4" placeholder="请输入初次登记项目所处阶段"/>-->
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目预算" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectBudget']" placeholder="请输入项目预算"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['status']" placeholder="请输入项目状态"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目内容简介" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['contents']" rows="4" placeholder="请输入项目内容简介"/>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'

  export default {
    name: 'CshxmcjForm',
    components: {
      JFormContainer,
    },
    props: {
      //流程表单data
      formData: {
        type: Object,
        default: ()=>{},
        required: false
      },
      //表单模式：true流程表单 false普通表单
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
    data () {
      return {
        form: this.$form.createForm(this),
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          legalRepresentative: {
            rules: [
              { required: true, message: '请输入法定代表人!'},
            ]
          },
          socialCode: {
            rules: [
              { required: true, message: '请输入统一社会信用代码!'},
            ]
          },
          enterpriseNature: {
            rules: [
              { required: true, message: '请输入企业性质!'},
            ]
          },
          detailAddress: {
            rules: [
              { required: true, message: '请输入详细地址!'},
            ]
          },
        },
        url: {
          add: "/estar/cshxmcj/add",
          edit: "/estar/cshxmcj/edit",
          queryById: "/estar/cshxmcj/queryById"
        }
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
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'projectId','projectName','partaName','legalRepresentative','socialCode','enterpriseNature','detailAddress','partaPerson','mobilePhone','post','role','bussinessType','department','projectInitStatus','projectBudget','status'))
        })
      },
      //渲染流程表单数据
      showFlowData(){
        if(this.formBpm === true){
          let params = {id:this.formData.dataId};
          getAction(this.url.queryById,params).then((res)=>{
            if(res.success){
              this.edit (res.result);
            }
          });
        }
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'projectId','projectName','partaName','legalRepresentative','socialCode','enterpriseNature','detailAddress','partaPerson','mobilePhone','post','role','bussinessType','department','projectInitStatus','projectBudget','status'))
      },
    }
  }
</script>