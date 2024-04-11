<template>
  <div class="main-content">
    <div class="page-title">
      <div class="title-word">H5定制渠道图片</div>
      <el-select
        class="title-select"
        v-model="terminalType"
        placeholder="请选择"
        style="width: 75px"
      >
        <el-option label="端外" value="0" />
        <el-option label="端内" value="1" />
      </el-select>
    </div>
    <!-- 端外 -->
    <div v-show="terminalType === '0'">
      <el-tabs v-model="outName">
        <el-tab-pane label="CBA" name="CBA">
          <CBAForm></CBAForm>
        </el-tab-pane>
        <el-tab-pane label="中超" name="ZHONGCHAO">
          <ZCForm></ZCForm>
        </el-tab-pane>
        <el-tab-pane label="德甲" name="DEJIA">
          <DJForm></DJForm>
        </el-tab-pane>
        <el-tab-pane label="法甲" name="FAJIA">
          <FJForm></FJForm>
        </el-tab-pane>
        <el-tab-pane label="西甲" name="XIJIA">
          <XJForm></XJForm>
        </el-tab-pane>
        <el-tab-pane label="意甲" name="YIJIA">
          <YJForm></YJForm>
        </el-tab-pane>
        <el-tab-pane label="英超" name="YINGCHAO">
          <YCForm></YCForm>
        </el-tab-pane>
        <el-tab-pane label="沙特" name="SATE">
          <STForm></STForm>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 端内 -->
    <div v-show="terminalType === '1'">
      <el-tabs v-model="innerName">
        <el-tab-pane label="CBA" name="CBA">
          <CBAInnerForm></CBAInnerForm>
        </el-tab-pane>
        <el-tab-pane label="中超" name="ZHONGCHAO">
          <ZCInnerForm></ZCInnerForm>
        </el-tab-pane>
        <el-tab-pane label="德甲" name="DEJIA">
          <DJInnerForm></DJInnerForm>
        </el-tab-pane>
        <el-tab-pane label="法甲" name="FAJIA">
          <FJInnerForm></FJInnerForm>
        </el-tab-pane>
        <el-tab-pane label="西甲" name="XIJIA">
          <XJInnerForm></XJInnerForm>
        </el-tab-pane>
        <el-tab-pane label="意甲" name="YIJIA">
          <YJInnerForm></YJInnerForm>
        </el-tab-pane>
        <el-tab-pane label="英超" name="YINGCHAO">
          <YCInnerForm></YCInnerForm>
        </el-tab-pane>
        <el-tab-pane label="沙特" name="SATE">
          <STInnerForm></STInnerForm>
        </el-tab-pane>
      </el-tabs>
    </div>
    <FullShow ref="fullBox"></FullShow>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, provide  } from "vue";
// 端外
import CBAForm from "@/components/CBAForm.vue";
import ZCForm from "@/components/ZCForm.vue";
import DJForm from "@/components/DJForm.vue";
import FJForm from "@/components/FJForm.vue";
import XJForm from "@/components/XJForm.vue";
import YJForm from "@/components/YJForm.vue";
import YCForm from "@/components/YCForm.vue";
import STForm from "@/components/STForm.vue";
// 端内
import CBAInnerForm from "@/components/appInner/CBAInnerForm.vue";
import ZCInnerForm from "@/components/appInner/ZCInnerForm.vue";
import DJInnerForm from "@/components/appInner/DJInnerForm.vue";
import FJInnerForm from "@/components/appInner/FJInnerForm.vue";
import XJInnerForm from "@/components/appInner/XJInnerForm.vue";
import YJInnerForm from "@/components/appInner/YJInnerForm.vue";
import YCInnerForm from "@/components/appInner/YCInnerForm.vue";
import STInnerForm from "@/components/appInner/STInnerForm.vue";

const outName = ref("CBA");
const innerName = ref("CBA");
const terminalType = ref("0");
const fullBox = ref();
onMounted(() => {
  // 关闭整个页面初始化的加载动画
  document.getElementById("loading-wrapper").style.display = "none";
});
provide('showFullDialog', (data: any)=>{
  fullBox.value.showDialog(data);
})
</script>

<style scoped lang="less">
.page-title {
  padding: 20px 0;
  display: flex;
  align-items: center;
  .title-word {
    font-size: 23px;
    font-weight: 600;
    color: #000;
  }
  .title-select {
    margin-left: 8px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.main-content {
  min-width: 1000px;
  max-width: 1380px;
  margin: 0 auto;
}
.el-tabs {
  :deep(.el-tabs__header) {
    margin: 0 0 28px;
  }
  :deep(.el-tabs__content) {
    overflow: auto;
  }
}
:deep(.el-form-item__content) {
  align-items: end;
}
.title-select:deep(.el-select__wrapper) {
  background-color: transparent;
  box-shadow: none;
  &:hover {
    box-shadow: none;
  }
}
:deep(.el-dialog.is-fullscreen) {
  padding-top: 50px;
  .el-dialog__header.show-close {
    position: fixed;
    width: 500px;
    top: 10px;
    right: 8px;
  }
}
</style>
