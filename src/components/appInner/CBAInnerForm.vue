<template>
  <div class="form-box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="left-form"
    >
      <el-form-item label="赛事模板" prop="channels">
        <el-col :span="4">
          <el-select v-model="compeType" placeholder="请选择">
            <el-option label="预告" value="1" />
            <el-option label="赛果" value="2" />
          </el-select>
        </el-col>
        <el-col :span="20">
          <el-select
            v-model="ruleForm.channels"
            multiple
            clearable
            filterable
            collapse-tags
            placeholder="请选择模板"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll"
                :indeterminate="indeterminate"
                @change="handleCheckAll"
              >
                全选
              </el-checkbox>
            </template>
            <el-option
              v-for="(v, k) in channelOpions"
              :label="v.name"
              :value="v.name"
              :key="k"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="左边战队" prop="nameL">
        <el-select
          v-model="ruleForm.nameL"
          filterable
          placeholder="请选择左边战队"
          @change="teamLChange"
        >
          <el-option v-for="(v, k) in teams" :label="v" :value="v" :key="k" />
        </el-select>
      </el-form-item>
      <el-form-item label="右边战队" prop="nameR">
        <el-select
          v-model="ruleForm.nameR"
          filterable
          placeholder="请选择右边战队"
          @change="teamRChange"
        >
          <el-option v-for="(v, k) in teams" :label="v" :value="v" :key="k" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="compeType === '1' ? '赛事预告' : '赛事结果'"
        required
      >
        <el-form-item
          style="width: 100%"
          v-if="compeType == '1'"
          prop="startTime"
        >
          <el-date-picker
            style="width: 100%"
            v-model="ruleForm.startTime"
            type="datetime"
            placeholder="请选择赛事时间"
            format="YYYY-MM-DD HH:mm"
            value-format="M月D日 H:mm"
          />
        </el-form-item>
        <el-form-item style="width: 100%" v-else>
          <el-col :span="12">
            <el-form-item prop="scoreL">
              <el-input
                v-model="ruleForm.scoreL"
                placeholder="请输入左边战队比分"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="scoreR">
              <el-input
                v-model="ruleForm.scoreR"
                placeholder="请输入右边战队比分"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item label="右边图片" prop="rightImg">
        <input
          v-if="refreshFile"
          ref="fileInp"
          style="display: none"
          type="file"
          @change="fileChange($event.target)"
        />
        <el-button type="primary" @click="fileUpload">请点击上传图片</el-button>
        <span class="file-name" :title="fileName">{{ fileName }}</span>
        <span class="icon-ratio">
          <el-icon :size="15">
            <Warning />
          </el-icon>
          上传的图片比例需大于等于渠道=>小米 1056x594的宽高比1056/594≈1.78
        </span>
      </el-form-item>
      <el-form-item
        label="图片位置微调"
        v-show="channelOpions[curKey]?.needAdjust"
      >
        <el-input-number v-model="channelOpions[curKey].right" :max="0" />
      </el-form-item>
      <el-form-item label="图片导出格式" prop="imgType">
        <el-select
          v-model="ruleForm.imgType"
          placeholder="请选择图片导出的格式"
        >
          <el-option label="image/png" value="png" />
          <el-option label="image/jpeg" value="jpeg" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          导出
        </el-button>
        <el-button type="primary" @click="fullShow(ruleFormRef)">
          全屏预览
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 右边图片展示 -->
    <el-carousel
      class="out-carousel"
      height="600px"
      :autoplay="false"
      indicator-position="none"
      @change="carouselChange"
    >
      <el-carousel-item v-for="(item, k) in ruleForm.channels" :key="k">
        <div>{{ item }}</div>
        <div
          :id="channelOpions.find((v) => v.name == item)?.id"
          class="img-show"
          :style="{ height: handleHeight(item) }"
        >
          <img
            :style="{ height: handleHeight(item), width: '100%' }"
            class="bg-img"
            :src="getImg(item)"
            alt=""
          />
          <div class="team-l" :style="countStyle(item, 1)">
            <div class="img-box">
              <img class="l-img" :src="logoImgL" alt="" />
            </div>
            <div class="team-name">
              {{ ruleForm.nameL.replace(/\s/g, "&nbsp;") }}
            </div>
          </div>
          <div class="team-r" :style="countStyle(item, 2)">
            <div class="img-box">
              <img class="r-img" :src="logoImgR" alt="" />
            </div>
            <div class="team-name">
              {{ ruleForm.nameR.replace(/\s/g, "&nbsp;") }}
            </div>
          </div>
          <div
            class="start-time score"
            :style="countStyle(item, 3)"
            v-if="item !== '小米 1056x594'"
          >
            <span v-if="compeType == '1' && item !== '小米 1632x720'">{{
              ruleForm.startTime
            }}</span>
            <div v-if="compeType == '2'" class="item-score">
              <span class="num">{{ ruleForm.scoreL }}</span>
              <span class="colon">:</span>
              <span class="num">{{ ruleForm.scoreR }}</span>
            </div>
          </div>
          <img
            class="bg-r-img"
            v-if="item !== '海信 560x315'"
            :src="ruleForm.rightImg"
            :style="{ right: countRight(item) + 'px' }"
            alt=""
          />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, nextTick, inject } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import html2canvas from "html2canvas";
import constant from "@/constants/config";

interface RuleForm {
  title: string;
  channels: string[];
  nameL: string;
  scoreL: string;
  nameR: string;
  scoreR: string;
  startTime: string;
  rightImg: string;
  imgType: string;
}

const checkAll = ref(false);
const indeterminate = ref(false);
let compeType = ref("1"); // 赛事预告和赛事结果类型
const channelOpions = ref(constant.CBA_INNER.filter((com) => com.type !== 2));
const teams = ref(constant.CBA_LOGO);
let logoImgL = ref<string>(""); // 左右战队logo
let logoImgR = ref<string>("");
let curKey = ref(0);
let fileInp = ref(); // file input
let refreshFile = ref(true);
let fileName = ref("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  title: "",
  channels: [],
  nameL: "",
  scoreL: "",
  nameR: "",
  scoreR: "",
  startTime: "",
  rightImg: "",
  imgType: "png",
});
const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: "请输入标题名称", trigger: "blur" },
    { min: 3, max: 12, message: "3~12个字符", trigger: "blur" },
  ],
  channels: [
    {
      type: "array",
      required: true,
      message: "请至少选择一个渠道",
      trigger: "blur",
    },
  ],
  nameL: [{ required: true, message: "请选择左边战队名称", trigger: "change" }],
  nameR: [{ required: true, message: "请选择右边战队名称", trigger: "change" }],
  startTime: [{ required: true, message: "请选择赛事时间", trigger: "change" }],
  scoreL: [
    { required: true, message: "请输入左边战队比分", trigger: "change" },
  ],
  scoreR: [
    { required: true, message: "请输入右边战队比分", trigger: "change" },
  ],
  rightImg: [
    { required: true, message: "请上传右边背景图片", trigger: "change,blur" },
  ],
});

const allImgs = ref([] as object[]);
const showDialog: any = inject("showFullDialog");

// 监听赛事预告和结果切换
watch(compeType, (v) => {
  ruleForm.channels = [];
  curKey.value = 0;
  if (v === "1") {
    channelOpions.value = constant.CBA_INNER.filter((com) => com.type !== 2);
  } else {
    channelOpions.value = constant.CBA_INNER.filter((com) => com.type !== 1);
  }
});

// 渠道更改监听
watch(
  () => ruleForm.channels,
  (val) => {
    console.log(val);
    if (val.length == 1) {
      curKey.value = channelOpions.value.findIndex((o) => o.name == val[0]);
    }
    if (val.length === 0) {
      checkAll.value = false;
      indeterminate.value = false;
    } else if (val.length === channelOpions.value.length) {
      checkAll.value = true;
      indeterminate.value = false;
    } else {
      indeterminate.value = true;
    }
  }
);
const handleCheckAll = (val: any) => {
  indeterminate.value = false;
  if (val) {
    ruleForm.channels = channelOpions.value.map((_) => _.name);
  } else {
    ruleForm.channels = [];
  }
};
// 计算每个战队字体logo间距样式
const countStyle = (v: any, n?: any) => {
  let cur = channelOpions.value.find((o) => o.name == v);
  if (cur) {
    return {
      top: `${n == 1 || n == 2 ? cur?.top1 : cur.top2}px`,
      left: `${n == 1 ? cur?.left1 : n == 2 ? cur.left2 : cur.left3}px`,
      width: `${n == 1 || n == 2 ? cur?.width1 : cur.width2}px`,
      "font-size": `${n == 1 || n == 2 ? cur?.size1 : cur.size2}px`,
    };
  }
};
const countRight = (v: any) => {
  let cur = channelOpions.value.find((o) => o.name == v);
  return cur?.right;
};
const handleHeight = (v: any) => {
  const curV = channelOpions.value.find((i) => i.name === v)?.value;
  let w: any = curV?.split("x")[0];
  let h: any = curV?.split("x")[1];
  return (h * 800) / w + "px";
};
// 左右战队logo地址以及不能相同处理
const teamLChange = (v: string) => {
  if (v == ruleForm.nameR) {
    ElMessage.warning("左右战队不能相同");
    ruleForm.nameL = "";
    logoImgL.value = "";
    return;
  }
  if (v) {
    logoImgL.value = new URL(
      `../../assets/img/CBA_LOGO/${v}.png`,
      import.meta.url
    ).href;
  }
};
const teamRChange = (v: any) => {
  if (v == ruleForm.nameL) {
    ElMessage.warning("左右战队不能相同");
    ruleForm.nameR = "";
    logoImgR.value = "";
    return;
  }
  if (v) {
    logoImgR.value = new URL(
      `../../assets/img/CBA_LOGO/${v}.png`,
      import.meta.url
    ).href;
  }
};

// 轮播图切换索引查找
const carouselChange = (v: any) => {
  console.log("当前轮播图索引", v);
  curKey.value = channelOpions.value.findIndex(
    (o) => o.name == ruleForm.channels[v]
  );
};

// 获取本地渠道模板图片地址
const getImg = (item: string) => {
  return new URL(`../../assets/img/CBA_INNER/${item}.png`, import.meta.url)
    .href;
};

// 上传右边图片
const fileUpload = () => {
  fileInp.value.click();
  refreshFile.value = false;
  nextTick(() => {
    refreshFile.value = true;
  });
};
const fileChange = (target: any) => {
  if (!target.files[0]) {
    return;
  }
  //获取文件
  let file = target.files[0];
  const imgType = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!imgType) {
    ElMessage.warning("上传的图片只能是 JPG/PNG 格式!");
    return;
  }
  if (!isLt2M) {
    ElMessage.warning("上传的图片大小不能超过 2MB!");
    return;
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    let img: any = new Image();
    img.onload = function () {
      let ratio = img.width / img.height; // 宽度除以高度得到比例
      console.log("图片比例: " + ratio);
      if (Number(ratio.toFixed(2)) < 1056 / 594) {
        ElMessage.warning(
          "上传的图片比例需大于等于渠道=>小米 1056x594的宽高比1056/594≈1.78"
        );
      } else {
        ruleForm.rightImg = e.target?.result;
        fileName.value = file.name;
      }
    };
    img.src = e.target?.result;
  };
  reader.readAsDataURL(file); // 读取文件内容
};

// 通过canvas导出图片
let imgUrl = "";
const openPreImg = (name: any) => {
  const curV = channelOpions.value.find((i) => i.name === name);
  let w: any = curV?.value.split("x")[0]; // 还原初始比例
  html2canvas(document.querySelector(`#${curV?.id}`), {
    scale: w / 800,
    backgroundColor: null,
  }).then((canvas: any) => {
    imgUrl = canvas.toDataURL(`image/${ruleForm.imgType}`, 1.0); // 最终生成图片的 url
    exportImg(name);
    allImgs.value.push({
      name: name,
      url: imgUrl,
    });
  });
};
const exportImg = (name: any) => {
  //创建a标签
  let bqa = document.createElement("a");
  //给a标签的href属性赋值
  bqa.setAttribute("href", imgUrl);
  //给a标签的download属性赋值,表示下载的文件名
  bqa.setAttribute("download", name + `_${ruleForm.nameL}vs${ruleForm.nameR}.${ruleForm.imgType}`);
  //调用a标签的点击事件
  bqa.click();
  //移除a标签
  bqa.remove();
};
const pause = async (msec: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, msec || 1000);
  });
};
const fullShow = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      showDialog(allImgs.value);
    }
  });
};
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      ElMessage.success("请您稍等，正在生成并导出图片 . . .");
      await pause(300);
      allImgs.value = [];
      let count = 0;
      for (let item of ruleForm.channels) {
        openPreImg(item);
        if (++count >= 10) {
          await pause(1000);
          count = 0;
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 重置表单
  formEl.resetFields();
  // 重置战队logo
  logoImgL.value = "";
  logoImgR.value = "";
  fileName.value = "";
};
</script>
<style lang="less" scoped>
.form-box {
  display: flex;
  justify-content: space-between;
  .left-form {
    width: 552px;
    margin-right: 20px;
    flex-shrink: 0;
  }
  .out-carousel {
    flex-shrink: 0;
    width: 800px;
  }
  .img-show {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: transparent;
  }
  .bg-img {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: auto;
  }
}

.team-l,
.team-r {
  position: absolute;
  z-index: 2;
  top: 142px;
  width: 76px;
  font-size: 18px;
  text-align: center;
  color: #ffffff;
  .team-name {
    font-weight: 550;
    letter-spacing: 3px;
    // font-family: "字魂正酷超级黑-Bold";
    font-family: Arial, sans-serif;
    text-shadow: -1px -1px 0 #06489c, 1px -1px 0 #06489c, -1px 1px 0 #06489c,
      1px 2px 0 #06489c;
  }
  .img-box {
    width: 100%;
    padding-top: 100%;
    box-sizing: border-box;
    position: relative;
    margin-bottom: 9px;
    img {
      width: auto;
      height: 100%;
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.team-l {
  left: 35px;
}
.team-r {
  left: 184px;
}

.start-time {
  position: absolute;
  z-index: 2;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 0;
  font-size: 28px;
  top: 273px;
  left: 28px;
  width: 240px;
  text-align: center;
  font-family: "Alibaba-PuHuiTi-Bold";
}
.item-score {
  width: 100%;
  justify-content: center;
  display: flex;
  font-weight: bold;
  .colon {
    width: 12px;
    text-align: center;
  }
  .num {
    flex: 1;
    text-align: center;
  }
}
.bg-r-img {
  position: absolute;
  right: 0;
  height: 100%;
}
.file-name {
  margin-left: 3px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon-ratio {
  line-height: 21px;
  font-size: 12px;
  color: #e6a23c;
  .el-icon {
    position: relative;
    top: 3px;
  }
}
</style>
