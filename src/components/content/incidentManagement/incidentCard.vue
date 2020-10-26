<template>
  <div class="incident-card"
       :style="{position: 'absolute', top: `${incident['top']}px`, left: `${incident['left']}px`}">
    <el-card v-if="isVisible"
             shadow="hover"
             style="width: 250px;"
             :body-style="{ padding: '0px' }">
      <img :src="imageURL" alt="事件图片" class="image">
      <div style="padding: 14px;">
<!--        <div style="margin-bottom: 10px">-->
<!--          {{ incident['ai_skill']['name'] }}-->
<!--        </div>-->
<!--        <div>{{ `设备名: ${incident['camera']['name']}` }}</div>-->
        <div class="bottom clearfix">
          <time class="time">{{ incident['occurrence_time'] }}</time>
          <el-button type="text"
                     style="margin-left: 10px"
                     @click="handleView(incident)"
                     class="button">查看</el-button>
<!--          <el-button type="text"-->
<!--                     @click="handleDelete(incident['incident_id'])"-->
<!--                     class="button">删除</el-button>-->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'incidentCard',

    props: {
      incident: {
        type: Object,
        required: true
      }
    },

    data: () => ({
      isVisible: true,
    }),

    computed: {
      imageURL() {
        return `data:image/png;base64,${this.incident['incident_image']}`
      },
      ...mapState({
        token: state => state.userInfo.token
      })
    },

    methods: {
      // deleteIncident(incident_id) {
      //   deleteIncidentRequest({incident_id}, this.token)
      //     .then(res => {
      //       if (!res.code) {
      //         this.$message.error(res['error_msg'])
      //       }
      //     })
      //     .catch(err => {
      //       this.$message.error('网络异常，请检查网络状况')
      //     })
      // },
      handleView(incident) {
        this.$emit('viewIncident', incident)
      },
      // handleDelete(incident_id) {
      //   this.$confirm('将永久删除该事件，是否继续？', '警告', {
      //     cancelButtonText: '取消',
      //     confirmButtonText: '确定',
      //     type: 'warning'
      //   })
      //   .then(() => {
      //     this.isVisible = false
      //     this.deleteIncident(incident_id)
      //     this.$emit('deleteIncident')
      //   })
      // }
    }
  }

</script>

<style scoped>
  .incident-card {
    user-select: none;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 13px;
  }

  .button {
    padding: 0;
    float: right;
    font-size: 13px;
  }

  .image {
    width: 100%;
    display: block;
  }
</style>