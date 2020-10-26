<template>
  <el-dialog
    title="事件详情"
    :visible.sync="$_isVisible"
    :center="true"
    :show-close="false"
    width="800px"
    @open="handleOpen"
    @opened="handleOpened"
    @closed="handleClose"
    @close="$emit('update:isVisible', false)">
    <div class="wrapper clearfix">

      <div class="loading" v-show="isLoading">
        <i class="el-icon-loading"></i>
      </div>

      <div class="incident-viewer"
           v-show="!isLoading">
        <div class="incident-canvas-container">
          <canvas ref="viewIncident" :width="incidentCanvasWidth"></canvas>
        </div>

        <template v-if="currentIncident">
          <div class="incident-image-label-viewer" :style="{
            width: `${incidentCanvasWidth}px`,
            height: `${incidentCanvasHeight}px`}">
            <div class="viewer-wrapper clearfix">
              <div class="image-viewer">
                <img :src="currentIncident['image']"
                     class="current-incident-image"
                     :style="{width: `150px`,height: `${incidentCanvasHeight - 55}px`}"
                     alt="事件图片">
              </div>
              <div class="label-viewer" :style="currentIncident['label']['style']">
                {{ `${currentIncident['label']['key_desc']}: ${currentIncident['label']['value']}` }}
              </div>
            </div>
            <div style="position: absolute; top: 1px; right: 1px; cursor: pointer;"
                 @click="currentIncident = null">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </template>

        <template v-if="imageListVisible">
          <el-scrollbar :style="{width: `${incidentCanvasWidth}px`}"
                        view-style="white-space: nowrap">
            <div class="image-wrapper">
              <img v-for="(item, index) in incidentList"
                   :src="item['image']"
                   :key="index"
                   @click="handleViewSingleIncident(item, $event)"
                   alt="事件图片"
                   class="incident-item">
            </div>
          </el-scrollbar>
        </template>
      </div>

      <div class="incident-text"
           v-if="!isLoading">
<!--        <div class="incident-text-title">-->
<!--          <div class="ai-skill-name">-->
<!--            {{ incident['ai_skill']['name'] }}-->
<!--          </div>-->
<!--          <div class="camera-name">-->
<!--            {{ `设备名: ${incident['camera']['name']}` }}-->
<!--          </div>-->
<!--        </div>-->
        <div class="incident-text-content">
          <div class="incident-text-content-title">
            分析结果
          </div>
          <div class="result-wrapper">
            <div class="result-item"
                 :key="index"
                 :style="item['style']"
                 v-for="(item, index) in incidentResults">
              <span v-if="item['value']"> {{ `${item['key_desc']}: ${item['value']}` }} </span>
              <span v-else> {{ item['key_desc'] }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "viewIncident",

    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      incident: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        incidentResponse: null,

        incidentCanvas: null,
        incidentCanvasCtx: null,

        incidentImage: null,
        imageHeight: null,
        imageWidth: null,

        incidentCanvasHeight: null,
        incidentCanvasWidth: 350,

        incidentList: [],
        currentImageActive: null,
        imageListVisible: false,
        currentIncident: null,

        isLoading: true
      }
    },

    computed: {
      imageURL() {
        return `data:image/png;base64,${this.incident['incident_image']}`
      },
      renderedImage() {
        if (this.incidentResponse.hasOwnProperty('renderedImage')) {
          this.imageListVisible = false
          return this.incidentResponse['renderedImage']
        } else {
          return null
        }
      },
      incidentAreas() {
        return this.incidentResponse['incidents']
      },
      incidentResults() {
        return this.incidentResponse['results']
      },
      $_isVisible: {
       get() {
         return this.isVisible
       },
       set() {}
     },
    },

    methods: {
      initCanvas() {
        this.incidentCanvas = this.$refs['viewIncident']
        this.incidentCanvasCtx = this.incidentCanvas.getContext('2d')
      },

      getRectPosition(top, left, width, height) {
        let rectTop = Math.ceil(top * (this.incidentCanvasHeight / this.imageHeight))
        let rectLeft = Math.ceil(left * (this.incidentCanvasWidth / this.imageWidth))
        let rectWidth = Math.ceil(width * (this.incidentCanvasWidth / this.imageWidth))
        let rectHeight = Math.ceil(height * (this.incidentCanvasHeight / this.imageHeight))
        return [rectLeft, rectTop, rectWidth, rectHeight]
      },

      getClippedImage() {
        for (let area of this.incidentAreas) {
          let clipImageCanvas = document.createElement('canvas')
          clipImageCanvas .setAttribute('width', area['location']['width'])
          clipImageCanvas .setAttribute('height', area['location']['height'])
          let clipImageCanvasCtx = clipImageCanvas.getContext('2d')

          clipImageCanvasCtx.drawImage(
            this.incidentImage,
            area['location']['left'],
            area['location']['top'],
            area['location']['width'],
            area['location']['height'],
            0,
            0,
            area['location']['width'],
            area['location']['height']
          )
          this.incidentList.push({
            image: clipImageCanvas.toDataURL('image/png'),
            label: area['label']
          })
        }
      },

      loadImage(imageURL) {
        let image = new Image()
        image.src = imageURL
        image.onload = () => {
          this.imageHeight = image.height
          this.imageWidth = image.width

          this.incidentCanvasHeight = this.incidentCanvasWidth * (this.imageHeight / this.imageWidth)
          this.incidentCanvas.setAttribute('height', this.incidentCanvasHeight)

          this.incidentImage = image
          this.imageListVisible = true

          this.incidentCanvasCtx.drawImage(image, 0, 0, this.incidentCanvasWidth, this.incidentCanvasHeight)
          this.isLoading = false

          for (let area of this.incidentAreas) {
            this.incidentCanvasCtx.strokeStyle = area['style']['color']
            this.incidentCanvasCtx.lineWidth = area['style']['stroke']['width']
            let rectPosition = this.getRectPosition(
              area['location']['top'],
              area['location']['left'],
              area['location']['width'],
              area['location']['height']
            )
            this.incidentCanvasCtx.strokeRect(rectPosition[0], rectPosition[1], rectPosition[2], rectPosition[3])
          }

          this.getClippedImage()
        }
      },

      handleOpened() {
        if (Object.keys(this.incident).length > 0) {
          this.initCanvas()
          if (this.renderedImage) {
            this.loadImage(this.renderedImage)
          } else {
            this.loadImage(this.imageURL)
          }
        }
      },

      handleOpen() {
        if (Object.keys(this.incident).length > 0) {
          this.incidentResponse = JSON.parse(this.incident['response'])
        }
      },

      handleClose() {
        this.incidentImage = null
        this.imageHeight = null
        this.imageWidth = null
        this.incidentCanvasHeight = null
        this.incidentList = null
        this.incidentList = []
        this.imageListVisible = false
        this.isLoading = true
        this.currentImageActive = null
        this.currentIncident = null
      },

      handleViewSingleIncident(incident, event) {
        if (this.currentImageActive) {
          this.currentImageActive.setAttribute('style', "")
        }
        event.target.setAttribute('style', 'border-color: #409EFF')
        this.currentImageActive = event.target

        this.currentIncident = incident
      },
    }
  }
</script>

<style scoped>
  .loading {
    text-align: center;
    font-size: 30px;
  }

  .incident-canvas-container {
    margin-bottom: 20px;
  }

  .incident-item {
    display: inline-block;
    margin-right: 10px;
    height: 70px;
    cursor: pointer;
    border: 2px solid transparent;
  }

  .image-wrapper {
    margin-bottom: 12px;
  }

  .incident-viewer {
    float: left;
    position: relative;
    margin-right: 50px;
  }

  .incident-image-label-viewer {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.8);
  }

  .viewer-wrapper {
    margin-top: 40px;
    padding: 10px;
  }

  .viewer-wrapper>.image-viewer {
    float: left;
    width: 140px;
  }

  .viewer-wrapper>.label-viewer {
    float: left;
    margin-left: 50px;
    width: 140px;
  }
  
  .incident-text {
    float: left;
    width: 350px;
  }

  .incident-text>.incident-text-title {
    margin-bottom: 20px;
    text-align: center;
    color: black
  }

  .incident-text>.incident-text-title>.ai-skill-name {
    font-size: 25px;
  }

  .incident-text>.incident-text-title>.camera-name {
    font-size: 15px;
    color: #666;
  }

  .result-item {
    margin-bottom: 5px;
  }

  .incident-text-content-title {
    margin-bottom: 5px;
    font-size: 18px;
  }

  .current-incident-image {
    object-fit: contain;
  }

</style>