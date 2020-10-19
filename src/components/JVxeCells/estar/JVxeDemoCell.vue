<template>

  <a-input>
    ref="input"
    :value="innerValue"
    v-bind="cellProps"
    @blur="event => handleBlurCommon(event.target.value)"
    @change="event => handleBlurCommon(event.target.value)"
    <!--  定义尾部插槽-->
    <a-icon slot="suffix" type="setting" @click="handleIconClick"></a-icon>
  </a-input>


</template>

<script>
import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

export default {
  name: "JVxeDemoCell",
  mixins :[JVxeCellMixins],
  methods:{
    handleIconClick(){
      this.$message.success('当前值：'+this.innerValue)
    }
  }

}
</script>

<style scoped>

</style>