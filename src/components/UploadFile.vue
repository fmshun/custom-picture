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
      <el-form-item label="标题">
        <el-input v-model="ruleForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item class="flex-up" label="左边战队" required>
        <el-col :span="8">
          <!-- <input type="file" @change="fileChange($event.target, 1)" /> -->
          <el-upload
            ref="upload"
            :limit="1"
            :auto-upload="false"
            :on-change="handleChange"
            :on-exceed="handleExceed"
          >
            <template #trigger>
              <el-button type="primary">上传左边战队logo</el-button>
            </template>
          </el-upload>
        </el-col>
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
        <input type="file" />
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
          <div class="score">{{ ruleForm.scoreL }}</div>
        </div>
        <div class="team-r">
          <img class="r-img" :src="logoImgR" alt="" />
          <div class="team-name">{{ ruleForm.nameR }}</div>
          <div class="score">{{ ruleForm.scoreR }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import html2canvas from "html2canvas";
import { genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";

const upload = ref<UploadInstance>();

interface RuleForm {
  title: string;
  channel: string;
  nameL: string;
  scoreL: string;
  nameR: string;
  scoreR: string;
  delivery: boolean;
  type: string[];
  rightImg: string;
}
let logoImgL = ref<string>("");
let logoImgR = ref<string>("");

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  logoImgL.value = URL.createObjectURL(file);
};

const handleChange: UploadProps["onChange"] = (uploadFile) => {
  logoImgL.value = URL.createObjectURL(uploadFile.raw);
};

let imgUrl = "";
const openPreImg = () => {
  html2canvas(document.querySelector("#imgBox")).then((canvas: any) => {
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
  delivery: false,
  type: [],
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
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
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
  } else {
    logoImgR.value = URL.createObjectURL(file);
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
    z-index: -1;
    width: 100%;
    height: 100%;
  }
}
.img-title {
  position: absolute;
  color: #f2ca26;
  font-weight: 500;
  letter-spacing: 5px;
  font-size: 33px;
  top: 107px;
  left: 37px;
}
.middle-team {
  position: absolute;
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
  }
}
.team-l {
  margin-left: 22px;
  .l-img {
    width: 70px;
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
</style>
