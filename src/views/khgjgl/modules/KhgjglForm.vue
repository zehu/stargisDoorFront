<template>
  <a-card>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form :form="form" slot="detail">
        <a-row>
          <a-col :span="15" style="text-align: left;">
            <a-form-item label="拜访时间" :labelCol="{span: 5}" :wrapperCol="{span:17}">
              <a-row>
                <a-col :span="12">
                  <j-date @change="changeValue" placeholder="请选择拜访开始时间"
                          v-decorator="['visitingStarttime', validatorRules.visitingStarttime]" :trigger-change="true"
                          :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"/>
                </a-col>

                <a-col :span="12">
                  <j-date placeholder="请选择拜访结束时间" v-decorator="['visitingEndtime', validatorRules.visitingEndtime]"
                          :trigger-change="true" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss"
                          style="width: 100%"/>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item :labelCol="labelCol" :wrapperCol="{span:20}">
              <a-radio-group name="radioGroup" @change="getValue">
                <a-radio :value="1">
                  一小时
                </a-radio>
                <a-radio :value="2">
                  二小时
                </a-radio>
                <a-radio :value="3">
                  三小时
                </a-radio>
                <a-radio :value="4">
                  四小时
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访地点" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['visitLocation']" placeholder="请输入拜访地点"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="拜访人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['visitors', validatorRules.visitors]" placeholder="请输入拜访人"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="拜访方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['visitingWay']" placeholder="请输入拜访方式"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访单位" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['visitingUnit']" placeholder="请输入拜访单位"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访项目名称" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-input v-decorator="['projectName']" placeholder="请输入拜访项目名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否周计划内拜访" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <j-dict-select-tag type="radio" v-decorator="['weekVisting']" :trigger-change="true" dictCode="yn"
                                 placeholder="请选择是否周计划内拜访"/>
            </a-form-item>

          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-button type="primary" @click="plan()">
                关联本周计划
              </a-button>
            </a-form-item>

          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访纪要" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['visitSummary']" rows="3" placeholder="我方传达内容"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="拜访纪要" :labelCol="{span:3}" :wrapperCol="{span:20}">
              <a-textarea v-decorator="['visit2summary']" rows="3" placeholder="对方提出要求"/>
            </a-form-item>
          </a-col>
          <a-col v-if="showFlowSubmitButton" :span="24" style="text-align: center">
            <a-button @click="submitForm">提 交</a-button>
          </a-col>
        </a-row>
      </a-form>
    </j-form-container>
  </a-spin>

    <YxgzapjhList ref="zjh"></YxgzapjhList>
  </a-card>
</template>

<script>
import moment from 'moment'
import {httpAction, getAction} from '@/api/manage'
import pick from 'lodash.pick'
import {validateDuplicateValue} from '@/utils/util'
import JFormContainer from '@/components/jeecg/JFormContainer'
import JDate from '@/components/jeecg/JDate'
import JDictSelectTag from "@/components/dict/JDictSelectTag"
import YxgzapjhList from "./YxgzapjhList";

export default {
  name: 'KhgjglForm',
  components: {
    YxgzapjhList,
    JFormContainer,
    JDate,
    JDictSelectTag,
  },
  props: {
    //流程表单data
    formData: {
      type: Object,
      default: () => {
      },
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
  data() {
    return {
      form: this.$form.createForm(this),
      model: {},
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
      confirmLoading: false,
      validatorRules: {
        visitingStarttime: {
          rules: [
            {required: true, message: '请输入拜访开始时间!'},
          ]
        },
        visitingEndtime: {
          rules: [
            {required: true, message: '请输入拜访结束时间!'},
          ]
        },
        visitors: {
          rules: [
            {required: true, message: '请输入拜访人!'},
          ]
        },
      },
      url: {
        add: "/estar/khgjgl/add",
        edit: "/estar/khgjgl/edit",
        queryById: "/estar/khgjgl/queryById"
      }
    }
  },
  computed: {
    formDisabled() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return false
        }
        return true
      }
      return this.disabled
    },
    showFlowSubmitButton() {
      if (this.formBpm === true) {
        if (this.formData.disabled === false) {
          return true
        }
      }
      return false
    }
  },
  created() {
    //如果是流程中表单，则需要加载流程表单data
    this.showFlowData();
  },
  methods: {
    plan(){

      this.visible = true;
      this.$refs.zjh.add()
      this.$refs.zjh.title = '周计划管理'
      this.$refs.zjh.disableSubmit = false

      console.log("111111111111");
    },
    add() {
      this.edit({});
    },
    edit(record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'visitingStarttime', 'visitingEndtime', 'visitLocation', 'visitors', 'visitingWay', 'visitingUnit', 'projectName', 'weekVisting', 'visitSummary', 'visit2summary'))
      })
    },
    //渲染流程表单数据
    showFlowData() {
      if (this.formBpm === true) {
        let params = {id: this.formData.dataId};
        getAction(this.url.queryById, params).then((res) => {
          if (res.success) {
            this.edit(res.result);
          }
        });
      }
    },
    // changeValue(e){
    //   // console.log(e)
    //  let newDate= moment(e).add(1, "h").format("YYYY-MM-DD HH:mm:ss");
    //   this.form.setFieldsValue({'visitingEndtime':newDate})
    //   // console.log(newDate)
    // },
    getValue(e) {
      let newDate = moment(this.form.getFieldValue("visitingStarttime")).add(e.target.value, "h").format("YYYY-MM-DD HH:mm:ss");
      this.form.setFieldsValue({'visitingEndtime': newDate})
      //
      // console.log(this.form.getFieldValue("visitingStarttime"))
      // console.log(e.target.value)
    },
    submitForm() {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if (!this.model.id) {
            httpurl += this.url.add;
            method = 'post';
          } else {
            httpurl += this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          console.log("表单提交数据", formData)
          httpAction(httpurl, formData, method).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
              that.$emit('ok');
            } else {
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
    popupCallback(row) {
      this.form.setFieldsValue(pick(row, 'visitingStarttime', 'visitingEndtime', 'visitLocation', 'visitors', 'visitingWay', 'visitingUnit', 'projectName', 'weekVisting', 'visitSummary', 'visit2summary'))
    },
  }
}
</script>