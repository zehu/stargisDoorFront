<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-item label="紧急程度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['emergencyLevel']" :trigger-change="true" dictCode="emergency_level" placeholder="请选择紧急程度"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="办理时限" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['processingTimeLimit']" placeholder="请输入办理时限"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="项目阶段" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['stageProject']" :trigger-change="true" dictCode="project_stage" placeholder="请选择项目阶段"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="办理事项名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['transactionName']" placeholder="请输入办理事项名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="    执行部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="list" v-decorator="['executiveDepartment']" :trigger-change="true" dictCode="executive_department" placeholder="请选择    执行部门"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="发起人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sponsor']" placeholder="请输入发起人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="提交时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-date placeholder="请选择提交时间" v-decorator="['submissionTime']" :trigger-change="true" style="width: 100%"/>
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

  export default {
    name: 'DblbForm',
    components: {
      JFormContainer,
      JDate,
      JDictSelectTag,
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
          add: "/estar/dblb/add",
          edit: "/estar/dblb/edit",
          queryById: "/estar/dblb/queryById"
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
          this.form.setFieldsValue(pick(this.model,'emergencyLevel','processingTimeLimit','stageProject','transactionName','executiveDepartment','sponsor','submissionTime'))
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
        this.form.setFieldsValue(pick(row,'emergencyLevel','processingTimeLimit','stageProject','transactionName','executiveDepartment','sponsor','submissionTime'))
      },
    }
  }
</script>