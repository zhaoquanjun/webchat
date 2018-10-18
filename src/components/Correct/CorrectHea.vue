<template>
  <ul class="correct-header">
    批改作业区域
    <!-- <li v-for="(day, index) in headerList" :key="index" :class="day.focus ? 'active' : ''" @click="choNear(index, day.flag)">{{day.name}}</li>
    <li>
      <el-date-picker v-model="selectDay" type="date" placeholder="选择日期" :editable="false" @change="choOther"></el-date-picker>
    </li> -->
  </ul>
</template>

<script>
export default {
  data () {
    return {
      // 批改作业头部列表
      headerList: [
        {name: '今天作业', focus: true, flag: 'today'},
        {name: '昨天作业', focus: false, flag: 'yestoday'}
      ],
      selectDay: ''
    }
  },
  methods: {
    choOther () {
      this.selectDay = this.selectDay.getTime()
    },
    choNear (index, flag) {
      this.headerList[index].focus = true
      index === 0 ? this.headerList[1].focus = false : index === 1 ? this.headerList[0].focus = false : ''
      // 今天和昨天
    }
  }
}
</script>

<style lang="less" scoped>
  .correct-header{
    // height: 20px;
    // padding-top: 30px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    background: #6eb3ae;
    li{
      height: 20px;
      line-height: 21px;
      float: left;
      padding: 0 10px;
      margin-right: 5px;
      font-size: 12px;
      background: #cdcdcd;
      cursor: pointer;
    }
    li.active {
      background: #999;
    }
    li:last-of-type{
      margin-right: 0;
      float: right;
      padding: 0;
      background: none;
    }
  }
  
</style>

<style>
  .el-input__inner{
    width: 85px;
    height: 20px;
    line-height: 20px;
    border-radius: 0;
    background: #cdcdcd;
    color: #2c3e50;
    padding: 0 5px !important;
  }
  .el-date-editor.el-input {
    width: 85px;
    height: 20px;
    background: #cdcdcd;
  }
  .el-input__icon{
    display: none;
  }
  .el-picker-panel{
    left: 50% !important;
    transform: translate(-50%) !important;
    margin-left: 574px !important;
  }
</style>
