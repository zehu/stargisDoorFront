<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['name', validatorRules.name]" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label=" 性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['sex', validatorRules.sex]" :trigger-change="true" dictCode="sex" placeholder="请选择 性别"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="移动电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['mobilePhone', validatorRules.mobilePhone]" placeholder="请输入移动电话"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="座机" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['telPhone']" placeholder="请输入座机"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label=" 邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['email', validatorRules.email]" placeholder="请输入 邮箱"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['post', validatorRules.post]" placeholder="请输入职务"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="企业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['enterpriseName', validatorRules.enterpriseName]" :trigger-change="true" dictCode="xj_khdwxx2,enterprise_name,id" placeholder="请选择企业名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sysOrgCode']" placeholder="请输入所属部门"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="更新日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择更新日期" v-decorator="['updateTime']" :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['role', validatorRules.role]" placeholder="请输入角色"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="所在区域" :labelCol="{span:3}" :wrapperCol="{span:20}">
             <j-area-linkage type="cascader" v-decorator="['region', validatorRules.region]" placeholder="请输入省市区"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="家庭住址" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['address', validatorRules.address]" placeholder="请输入家庭地址"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24" >
            <a-form-item label=" 兴趣爱好" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['hobby']" rows="4" placeholder="请输入兴趣爱好"/>

            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['remark']" rows="4" placeholder="请输入备注"/>

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
  import JDate from '@/components/jeecg/JDate'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import JEditor from '@/components/jeecg/JEditor'
  import JAreaLinkage from '@comp/jeecg/JAreaLinkage'

  export default {
    name: 'KhlxrxxForm',
    components: {
      JFormContainer,
      JDate,
      JDictSelectTag,
      JEditor,
      JAreaLinkage,
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
          name: {
            rules: [
              { required: true, message: '请输入姓名!'},
            ]
          },
          sex: {
            rules: [
              { required: true, message: '请输入 性别!'},
            ]
          },
          mobilePhone: {
            rules: [
              { required: true, message: '请输入移动电话!'},
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!'},
            ]
          },
          email: {
            rules: [
              { required: true, message: '请输入 邮箱!'},
              { pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/, message: '请输入正确的电子邮件!'},
            ]
          },
          post: {
            rules: [
              { required: true, message: '请输入职务!'},
            ]
          },
          enterpriseName: {
            rules: [
              { required: true, message: '请输入企业名称!'},
            ]
          },
          role: {
            rules: [
              { required: true, message: '请输入角色!'},
            ]
          },
          region: {
            rules: [
              { required: true, message: '请输入区域!'},
            ]
          },
        },
        url: {
          add: "/estar/khlxrxx/add",
          edit: "/estar/khlxrxx/edit",
          queryById: "/estar/khlxrxx/queryById"
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
          this.form.setFieldsValue(pick(this.model,'name','sex','mobilePhone','telPhone','email','post','enterpriseName','sysOrgCode','updateTime','role','region','adrress','hobby','remark'))
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
        this.form.setFieldsValue(pick(row,'name','sex','mobilePhone','telPhone','email','post','enterpriseName','sysOrgCode','updateTime','role','region','adrress','hobby','remark'))
      },
    }
  }
</script>