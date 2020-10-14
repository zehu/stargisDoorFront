<template>
  <j-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel">
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="项目名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['projectName']" placeholder="请输入项目名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="甲方单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['partaName']" placeholder="请输入甲方单位名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访对象" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['visitorObject']" placeholder="请输入拜访对象"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择拜访时间" v-decorator="['visitTime']" :trigger-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目所处营销阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['status']" placeholder="请输入项目所处营销阶段"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="沟通结果" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-editor v-decorator="['result',{trigger:'input'}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="存在问题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-editor v-decorator="['problems',{trigger:'input'}]"/>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>

  </j-modal>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JFormContainer from '@/components/jeecg/JFormContainer'
  import JDate from '@/components/jeecg/JDate'
  import JEditor from '@/components/jeecg/JEditor'

  export default {
    name: 'YxxmgzjlForm',
    components: {
      JFormContainer,
      JDate,
      JEditor,
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
        title:'',
        width:1000,
        visible: false,
        disableSubmit: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/estar/yxxmgzjl/add",
          edit: "/estar/yxxmgzjl/edit",
          queryById: "/estar/yxxmgzjl/queryById"
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


      handleOk () {
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
              that.visible=false;

            })
          }

        })
      },
      add () {
        this.edit({});
      },
      edit (record) {
        debugger
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'projectName','partaName','visitorObject','visitTime','status','result','problems'))
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
      close () {
        this.$emit('close');
        this.visible = false;
      },

      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>