<template>
  <div class="incident-management">
    <view-incident
      :isVisible.sync="viewIncidentVisible"
      :incident="currentIncident">
    </view-incident>

    <!-- all count start -->
    <div class="all-count">
      <i class="el-icon-data-analysis"></i>
      当前总数据量：{{ allCount }}
    </div>
    <!-- all conunt end -->

    <!-- selector start -->
    <div class="selector clearfix" style="user-select: none">
      <div class="time-range-selector fl">
        <span style="margin-right: 12px; font-size: 13px">选择时间范围</span>
        <el-date-picker
          v-model="timeRangeDuplicated"
          type="datetimerange"
          @change="handleSubmit"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
    <!-- selector end -->

    <!-- incident content start -->
    <div class="incident-content">
      <div class="incidents-waterfall"
           ref="incidentsWaterfall">
        <div class="incident-empty-data"
             v-show="emptyDataVisible">
          <empty-data>
            <template v-slot:emptyText>
              暂无数据
            </template>
          </empty-data>
        </div>
        <div class="infinite-container"
             v-show="!emptyDataVisible"
             ref="infiniteContainer">
          <template v-for="(incidents, index1) in incidentsCard">
            <incident-card v-for="(incident, index2) in incidents"
                           :key="index1 + ',' + index2"
                           :ref="index1 + ',' + index2"
                           :incident="incident"
                           @viewIncident="handleViewIncident">
            </incident-card>
          </template>
        </div>
        <div v-show="noMoreDataVisible && !emptyDataVisible"
             class="container-footer">
          没有更多数据了...
        </div>
        <div v-show="isLoading"
             class="container-footer">
          <i class="el-icon-loading"></i>&nbsp;加载中...
        </div>
      </div>
    </div>
    <!-- incident content end -->

  </div>
</template>

<script>
  import {
    getIncidentRequest,
  } from 'api/incidentManagement'

  import incidentCard from './incidentCard'
  import emptyData from 'components/common/emptyData'
  import viewIncident from './viewIncident'


  export default {
    name: "incident",

    components: {
      viewIncident,
      incidentCard,
      emptyData
    },

    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        cameraOptionsSuccess: false,
        AISkillOptionsSuccess: false,

        cameraID: null,
        AISkillID: null,
        timeRangeDuplicated: [],
        timeRange: null,
        offset: 0,
        limit: 20,
        allCount: 0,

        incidentsCard: [],

        colNumbers: null,
        colWidth: 272,
        colGap: 31,
        colHeight: [],
        positionRecord: [],
        incidentCardWidth: 250,
        cardFooterHeight: 125,

        isEnd: false,
        noMoreDataVisible: false,
        emptyDataVisible: false,
        isLoading: false,

        viewIncidentVisible: false,
        currentIncident: {}
      }
    },

    watch: {
      timeRangeDuplicated: function (val) {
        if (val) {
          if (val.length > 0) {
            this.timeRange = {}
            this.timeRange.start_time = val[0]
            this.timeRange.end_time = val[1]
          } else {
            this.timeRange = null
          }
        } else {
          this.timeRange = null
        }

      },
      isScrollToBottom: function (val) {
        if (val) {
          this.loadIncidents()
        }
      }
    },

    computed: {
      submitData() {
        let data = {
          offset: this.offset,
          limit: this.limit
        }

        if (this.timeRange) {
          data.time_range = this.timeRange
        }
        return data
      }
    },

    mounted() {
      this.getColNumbers()
      this.handleSubmit()
    },

    methods: {
      handleSubmit() {
        this.offset = 0
        this.limit = this.colNumbers

        this.incidentsCard.forEach(item => {
          item.splice(0, item.length - 1)
        })

        if (this.colHeight.length > 0) {
          this.colHeight = []
        }

        const loading = this.$loading({
          lock: true,
          text: '努力加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })

        getIncidentRequest(this.submitData)
        .then(res => {
          loading.close()
          if (!res.code) {
            this.$message.error(res['error_msg'])
          } else {
            this.allCount = res['all_count']

            if (res['data'].length > 0) {
              this.emptyDataVisible = false
              this.isEnd = res['is_end']
              this.offset = res['next_offset']
              this.incidentPreprocessing(res['data'])
              this.$message({
                type: 'success',
                message: '事件数据获取成功',
                duration: 1500
              })
            } else {
              this.$refs.infiniteContainer.setAttribute(
                'style',
                ""
              )
              this.emptyDataVisible = true
            }
          }
        })
      },
      loadIncidents() {
        if (!this.isEnd) {
          this.noMoreDataVisible = false
          this.isLoading = true
          getIncidentRequest(this.submitData, this.token)
            .then(res => {
              this.isLoading = false
              if (!res.code) {
                this.$message.error(res['error_msg'])
              } else {
                this.isEnd = res['is_end']
                this.allCount = res['all_count']
                this.offset = res['next_offset']
                this.incidentPreprocessing(res['data'])
              }
            })
        } else {
          this.noMoreDataVisible = true
        }
      },
      getColNumbers() {
        let clientWidth = this.$refs['incidentsWaterfall'].clientWidth
        this.colNumbers = Math.floor(clientWidth / this.colWidth)
        let tmp = this.colNumbers
        while (tmp--) {
          this.$set(
            this.incidentsCard,
            tmp,
            []
          )
        }
      },
      getPosition(item, index, ratio) {
        if (this.offset !== this.limit) {
          index = index + this.limit
        }
        if (index < this.colNumbers) {
          let colIndex = index % this.colNumbers
          this.$set(
            this.positionRecord,
            colIndex,
            this.positionRecord[colIndex] ? this.positionRecord[colIndex] + 1 : 0
          )
          item.left = colIndex * this.colWidth + this.colGap
          item.top = 0
          item.pos = [colIndex, this.positionRecord[colIndex]]
          item.ratio = ratio
          this.$set(
            this.colHeight,
            colIndex,
            ((this.incidentCardWidth / ratio) + this.cardFooterHeight))
        } else {
          let minHeight = Math.min.apply(null, this.colHeight)
          let minIndex = this.colHeight.indexOf(minHeight)
          this.$set(
            this.positionRecord,
            minIndex,
            this.positionRecord[minIndex] ? this.positionRecord[minIndex] + 1 : 1
          )
          item.top = minHeight
          item.left = minIndex * this.colWidth + this.colGap
          item.pos = [minIndex, this.positionRecord[minIndex]]
          let tmp = this.colHeight[minIndex] + ((this.incidentCardWidth / ratio) + this.cardFooterHeight)
          this.$set(this.colHeight, minIndex, tmp)
        }
        return item
      },
      incidentPreprocessing(incidents) {
        if (incidents.length > 0) {
          incidents.forEach((item, index) => {
            const imageURL = `data:image/png;base64,${item['incident_image']}`
            let img = new Image()
            img.src = imageURL
            img.onload = () => {
              let incidentCard = this.getPosition(item, index, img.width / img.height)
              this.incidentsCard[incidentCard.pos[0]].splice(incidentCard.pos[1], 1, incidentCard)
            }
          })
          setTimeout(() => {
            let maxHeight = Math.max.apply(null, this.colHeight)
            this.$refs.infiniteContainer.setAttribute(
              'style',
              `height: ${maxHeight}px`
            )
            if (maxHeight < window.innerHeight - 100) {
              this.loadIncidents()
            }
          }, 0)
        }
      },
      handleViewIncident(incident) {
        this.currentIncident = incident
        this.viewIncidentVisible = true
      },
    },
  }
</script>

<style scoped>
  .fl {
    float: left;
  }

  .selector {
    margin-bottom: 20px;
    padding: 0 0 15px 0;
    border-bottom: solid 1px #e6e6e6;
  }

  .infinite-container {
    position: relative;
  }

  .incident-empty-data {
    width: 226px;
    margin: 0 auto;
  }

  .container-footer {
    text-align: center;
    font-size: 13px;
    color: #666666;
    user-select: none;
  }

  .all-count {
    font-size: 20px;
    font-weight: 300;
    margin: 10px auto 20px auto;
    text-align: center;
  }

  .selector {
    line-height: 40px;
  }
</style>