<template>
  <el-dialog v-model="dialogVisible" fullscreen>
    <template #header>
      <div
        style="
          display: flex;
          align-items: center;
          width: 480px;
          font-size: 14px;
          margin-top: 10px;
        "
      >
        <span style="flex-basis: 100px">缩放百分比 </span>
        <el-slider
          v-model="scaleValue"
          :format-tooltip="(value: number)=> `${value}%`"
          show-input
          size="small"
        />
      </div>
    </template>
    <div
      style="display: flex; flex-wrap: wrap"
      v-if="dialogVisible && allImgs.length > 0"
    >
      <div
        style="margin-right: 10px"
        v-for="(item, k) in allImgs"
        :key="k"
        :style="{
          width: `${imgWidth(item)}px`,
          height: 'auto',
        }"
      >
        <div>{{ item.name }}</div>
        <img style="width: 100%" :src="item.url" alt="" />
      </div>
    </div>
    <div v-else style="text-align: center; padding-top: 50px">暂无导出图片</div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const dialogVisible = ref(false);
const allImgs = ref([]);
const scaleValue = ref(100);
const imgWidth = (item) => {
  return (item?.name.split(" ")[1].split("x")[0] * scaleValue.value) / 100;
};
const showDialog = (data: any) => {
  scaleValue.value = 100;
  allImgs.value = data;
  dialogVisible.value = true;
};
defineExpose({
  showDialog,
});
</script>
