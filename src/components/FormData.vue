<template>
  <div class="form-box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="left-form"
    >
      <el-form-item label="渠道" prop="channel">
        <el-select v-model="ruleForm.channel" placeholder="请选择渠道">
          <el-option label="当贝1" value="1" />
          <el-option label="当贝2" value="2" />
          <el-option label="峰米" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item class="flex-up" label="左边战队" required>
        <el-col :span="8">
          <el-form-item prop="nameL">
            <el-input v-model="ruleForm.nameL" placeholder="左边战队名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="scoreL">
            <el-input v-model="ruleForm.scoreL" placeholder="左边战队比分" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <input type="file" @change="fileChange($event.target, 1)" />
        </el-col>
      </el-form-item>
      <el-form-item label="右边战队" required>
        <el-col :span="8">
          <el-form-item prop="nameR">
            <el-input v-model="ruleForm.nameR" placeholder="右边战队名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="scoreR">
            <el-input v-model="ruleForm.scoreR" placeholder="右边战队比分" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <input type="file" @change="fileChange($event.target, 2)" />
        </el-col>
      </el-form-item>
      <el-form-item label="右边背景图片">
        <input type="file" @change="fileChange($event.target, 3)" />
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="submitForm(ruleFormRef)">
          确认
        </el-button> -->
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          导出
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="imgBox" class="img-show">
      <img class="bg-img" src="../assets/bg.png" alt="" />
      <div class="img-title">{{ ruleForm.title }}</div>
      <div class="middle-team">
        <div class="team-l">
          <img class="l-img" :src="logoImgL" alt="" />
          <div class="team-name">{{ ruleForm.nameL }}</div>
          <!-- <div class="score">{{ ruleForm.scoreL }}</div> -->
          <svg viewBox="0 0 100 90">
            <defs>
              <linearGradient
                id="rainbow"
                x1="0"
                x2="0"
                y1="5%"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#ffffff" offset="0%" />
                <stop stop-color="#ffffff" offset="20%" />
                <stop stop-color="#ffffff" offset="40%" />
                <stop stop-color="#003c83" offset="60%" />
                <stop stop-color="#003c83" offset="80%" />
                <stop stop-color="#003c83" offset="100%" />
              </linearGradient>
            </defs>
            <text fill="url(#rainbow)" text-anchor="middle" dominant-baseline="middle" x="50" y="45">
              <tspan font-size="36" font-weight="600">{{ ruleForm.scoreL }}</tspan>
            </text>
          </svg>
        </div>
        <div class="team-r">
          <img class="r-img" :src="logoImgR" alt="" />
          <div class="team-name">{{ ruleForm.nameR }}</div>
          <!-- <div class="score">{{ ruleForm.scoreR }}</div> -->
          <svg viewBox="0 0 100 90">
            <defs>
              <linearGradient
                id="rainbow"
                x1="0"
                x2="0"
                y1="20%"
                y2="100%"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#f8fffd" offset="0%" />
                <stop stop-color="#f8fffd" offset="20%" />
                <stop stop-color="#7b8db9" offset="40%" />
                <stop stop-color="#003c83" offset="60%" />
                <stop stop-color="#003c83" offset="80%" />
                <stop stop-color="#003c83" offset="100%" />
              </linearGradient>
            </defs>
            <text fill="url(#rainbow)" text-anchor="middle" dominant-baseline="middle" x="50" y="45">
              <tspan font-size="36" font-weight="600">{{ ruleForm.scoreR }}</tspan>
            </text>
          </svg>
        </div>
      </div>
      <img class="bg-r-img" :src="bgImgR" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import html2canvas from "html2canvas";

interface RuleForm {
  title: string;
  channel: string;
  nameL: string;
  scoreL: string;
  nameR: string;
  scoreR: string;
  rightImg: string;
}
let logoImgL = ref<string>("");
let logoImgR = ref<string>("");
let bgImgR = ref<string>("");

let imgUrl = "";
const openPreImg = () => {
  html2canvas(document.querySelector("#imgBox"), {
    scale: 2.2,
  }).then((canvas: any) => {
    imgUrl = canvas.toDataURL("image/png", 1.0); // 最终生成图片的 url
    console.log(canvas);
    exportImg();
  });
};

const exportImg = () => {
  //获取下载的文件名
  let text = Date.now();
  //创建a标签
  let bqa = document.createElement("a");
  //给a标签的href属性赋值
  bqa.setAttribute("href", imgUrl);
  //给a标签的download属性赋值,表示下载的文件名
  bqa.setAttribute("download", text + ".png");
  //调用a标签的点击事件
  bqa.click();
  //移除a标签
  bqa.remove();
};

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  title: "",
  channel: "",
  nameL: "",
  scoreL: "",
  nameR: "",
  scoreR: "",
  rightImg: "",
});

const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: "请输入标题名称", trigger: "blur" },
    { min: 3, max: 12, message: "3~12个字符", trigger: "blur" },
  ],
  channel: [
    {
      required: true,
      message: "请选择渠道",
      trigger: "change",
    },
  ],
  rightImg: [
    { required: true, message: "请上传右边背景图片", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      openPreImg();
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const fileChange = (target: any, key: number) => {
  if (!target.files[0]) {
    return;
  }
  //获取文件
  let file = target.files[0];
  if (key == 1) {
    logoImgL.value = URL.createObjectURL(file);
  } else if (key == 2) {
    logoImgR.value = URL.createObjectURL(file);
  } else {
    bgImgR.value = URL.createObjectURL(file);
  }
};
</script>
<style lang="less" scoped>
:deep(.flex-up) {
  .el-form-item__content {
    align-items: flex-start;
  }
}
.form-box {
  display: flex;
  justify-content: space-between;
  .left-form {
    width: 515px;
    margin-right: 40px;
  }
  .img-show {
    width: 816px;
    height: 360px;
    position: relative;
    overflow: hidden;
  }
  .bg-img {
    position: absolute;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
  }
}
.img-title {
  position: absolute;
  z-index: 2;
  color: #f2ca26;
  font-weight: 600;
  letter-spacing: 5px;
  font-size: 33px;
  top: 100px;
  left: 0;
  width: 293px;
  text-align: center;
}
.middle-team {
  position: absolute;
  z-index: 2;
  top: 165px;
  display: flex;
}
.team-l,
.team-r {
  width: 100px;
  text-align: center;
  color: #fefbff;
  .team-name {
    line-height: 11px;
    font-size: 18px;
  }
  .score {
    margin-top: 21px;
    font-size: 31px;
    color: #fefbff;
    font-weight: 600;
    // text-shadow: 0 0 10px #f00, 0 0 20px #0f0, 0 0 30px #00f, 0 0 40px #ff0;
    background: linear-gradient(to top, #4e6799, #7b8db9, #e6e6e6, #fefbff);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.team-l {
  margin-left: 21px;
  .l-img {
    width: 68px;
    height: 80px;
  }
}
.team-r {
  margin-left: 47px;
  .r-img {
    width: 65px;
    height: 80px;
  }
}
.bg-r-img {
  position: absolute;
  right: 0;
  height: 100%;
}
</style>
