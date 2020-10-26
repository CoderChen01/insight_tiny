<template>
  <div class="analysis-area-selection-util">
    <canvas id="selection-util"
            :width="canvasWidth"
            :height="canvasHeight"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            ref="canvasUtil"></canvas>
    <div class="help-text">
      <div class="help-text-title">
        <span style="font-size: 15px">
          <i class="el-icon-info"></i>
          <span> 操作设置 </span>
        </span>
      </div>
      <div class="help-text-content">
        <p> 注意： </p>
        <p>
          <span style="color: #868686; font-size: 10px">
            1.如果您什么也不做，分析区域默认是整张图片。
          </span>
        </p>
        <p>
          <span style="color: #868686; font-size: 10px">
            2.划分区域不宜过小。
          </span>
        </p>
        <p> 一、如何设置分析区域？ </p>
        <p>
          <span style="color: #868686; font-size: 10px">
            鼠标点击预览图片，拖动鼠标直到松开鼠标，划分区域形成。
          </span>
        </p>
        <p> 二、如何取消已设置的分析区域？ </p>
        <p>
          <span style="color: #868686; font-size: 10px">
            鼠标点击已设置的分析区域，
            分析区域变为红色，
            再次点击则取消已设置的分析区域，
            分析区域变为默认分析区域(全图)。
            取消已设置的分析区域后，可再次设置分析区域。
          </span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "analysisAreaSelectionUtil",

    props: {
      b64Image: {
        type: String,
        required: true
      },
      oldCoordinates: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        canvasObj: null,
        ctx: null,
        canvasWidth: 650,
        canvasHeight: 0,
        imageWidth: 0,
        imageHeight: 0,
        img: null,
        isDrawinging: false,
        hasDrawn: false,
        hasMoved: false,
        selected: false,
        beginX: 0,
        beginY: 0,
        xMin: 0,
        yMin: 0,
        xMax: 0,
        yMax: 0,
        areaWidth: 0,
        areaHeight: 0
      }
    },

    computed: {
      imageURL() {
        return `data:image/png;base64,${this.b64Image}`
      }
    },

    mounted() {
      this.canvasObj = this.$refs['canvasUtil']
      this.ctx = this.canvasObj.getContext('2d')
      this.loadImg(this.ctx)
    },

    methods: {
      loadImg(ctx) {
        this.img = new Image()
        this.img.src = this.imageURL
        this.img.onload = () => {
          this.imageHeight = this.img.height
          this.imageWidth = this.img.width
          this.canvasHeight = (this.img.height / this.img.width) * this.canvasWidth

          this.$emit('initCoordinates', {
            x_min: 0,
            y_min: 0,
            x_max: this.imageWidth,
            y_max: this.imageHeight
          })

          if (Object.keys(this.oldCoordinates).length > 0) {
            this.xMin = Math.floor(this.oldCoordinates['x_min'] / (this.imageWidth / this.canvasWidth))
            this.yMin = Math.floor(this.oldCoordinates['y_min'] / (this.imageWidth / this.canvasWidth))
            this.xMax = Math.floor(this.oldCoordinates['x_max'] / (this.imageWidth / this.canvasWidth))
            this.yMax = Math.floor(this.oldCoordinates['y_max'] / (this.imageWidth / this.canvasWidth))
          }

          setTimeout(() => {
            ctx.drawImage(this.img, 0, 0, this.canvasWidth, Math.floor(this.canvasHeight))
            if (Object.keys(this.oldCoordinates).length > 0) {
              this.areaWidth = this.xMax - this.xMin
              this.areaHeight = this.yMax - this.yMin
              this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, Math.floor(this.canvasHeight))
              this.ctx.strokeStyle = 'rgb(0,115,252)'
              this.ctx.lineWidth = 3
              this.ctx.strokeRect(
                this.xMin,
                this.yMin,
                this.areaWidth,
                this.areaHeight
              )
              this.ctx.fillStyle = 'rgba(0,115,252,0.5)'
              this.ctx.fillRect(
                this.xMin,
                this.yMin,
                this.areaWidth,
                this.areaHeight
              )
              this.hasDrawn = true
            }
          }, 0)
        }
      },
      checkArea(width, height) {
        return !(width <= 100 || height <= 100)
      },
      getRawX(x) {
        return Math.ceil(x * (this.imageWidth / this.canvasWidth))
      },
      getRawY(y) {
        return Math.ceil(y * (this.imageHeight / this.canvasHeight))
      },
      computeCoordinates(beginX, beginY, endX, endY) {
        const width = Math.abs(endX - beginX)

        if ((beginX === endX) || (beginY === endY)) {
          this.xMin = beginX
          this.yMin = beginY
          this.xMax = endX
          this.yMax = endY
        }
        if ((beginX < endX) && (endY > beginY)) {
          this.xMin = beginX
          this.yMin = beginY
          this.xMax = endX
          this.yMax = endY
        }
        if ((beginX > endX) && (beginY > endY)) {
          this.xMin = endX
          this.yMin = endY
          this.xMax = beginX
          this.yMax = beginY
        }
        if ((beginX < endX) && (beginY > endY)) {
          this.xMin = endX - width
          this.yMin = endY
          this.xMax = beginX + width
          this.yMax = beginY
        }
        if ((beginX > endX) && (beginY < endY)) {
          this.xMin = beginX - width
          this.yMin = beginY
          this.xMax = endX + width
          this.yMax = endY
        }
      },
      handleMouseDown(event) {
        if (this.hasDrawn) {
          let currentX = event.offsetX
          let currentY = event.offsetY
          if ((currentX >= this.xMin && currentX <= this.xMax)
            && (currentY >= this.yMin && currentY <= this.yMax)) {
            if (!this.selected) {
              this.selected = true
              this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
              this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, Math.floor(this.canvasHeight))
              this.ctx.strokeStyle = 'rgb(255,0,0)'
              this.ctx.lineWidth = 3
              this.ctx.strokeRect(
                this.xMin,
                this.yMin,
                this.areaWidth,
                this.areaHeight
              )
              this.ctx.fillStyle = 'rgba(255,0,0,0.5)'
              this.ctx.fillRect(
                this.xMin,
                this.yMin,
                this.areaWidth,
                this.areaHeight
              )
              this.ctx.fillStyle = 'rgb(255,0,0)'
              this.ctx.font = '15px Microsoft YaHei'
              this.ctx.fillText('再次点击恢复默认分析区域', this.xMin, this.yMin - 10)
            } else {
              this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
              this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, Math.floor(this.canvasHeight))
              this.xMin = 0
              this.yMin = 0
              this.xMax = this.imageWidth
              this.yMax = this.imageHeight
              this.$emit('coordinates', {
                x_min: this.xMin,
                y_min: this.yMin,
                x_max: this.xMax,
                y_max: this.yMax
              })
              this.hasDrawn = false
              this.selected = false
              this.hasMoved = false
            }
          } else {
            if (this.selected) {
              this.selected = false
              this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
              this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, Math.floor(this.canvasHeight))
              this.ctx.strokeStyle = 'rgb(0,115,252)'
              this.ctx.lineWidth = 3
              this.ctx.strokeRect(
                this.xMin,
                this.yMin,
                this.areaWidth,
                this.areaHeight
              )
              this.ctx.fillStyle = 'rgba(0,115,252,0.5)'
              this.ctx.fillRect(
                this.xMin,
                this.yMin,
                this.areaWidth,
                this.areaHeight
              )
            }
          }
        } else {
          this.isDrawing = true
          this.beginX = event.offsetX
          this.beginY = event.offsetY
        }
      },
      handleMouseUp() {
        if (this.isDrawing) {
          this.isDrawing = false
          if (this.hasMoved) {
            this.hasMoved = false
            this.hasDrawn = true
            if (this.checkArea(this.areaWidth, this.areaHeight)) {
              this.$emit('coordinates', {
                x_min: this.getRawX(this.xMin),
                y_min: this.getRawY(this.yMin),
                x_max: this.getRawX(this.xMax),
                y_max: this.getRawY(this.yMax)
              })
            } else {
              this.$emit('coordinates', {
                x_min: 0,
                y_min: 0,
                x_max: this.imageWidth,
                y_max: this.imageHeight
              })
            }
          }
        }
      },
      handleMouseMove(event) {
        if (this.isDrawing) {
          this.hasMoved = true
          this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
          this.computeCoordinates(
            this.beginX,
            this.beginY,
            event.offsetX,
            event.offsetY
          )
          this.areaWidth = this.xMax - this.xMin
          this.areaHeight = this.yMax - this.yMin
          this.ctx.drawImage(this.img, 0, 0, this.canvasWidth, Math.floor(this.canvasHeight))
          this.ctx.strokeStyle = 'rgb(0,115,252)'
          this.ctx.lineWidth = 3
          this.ctx.strokeRect(
            this.xMin,
            this.yMin,
            this.areaWidth,
            this.areaHeight
          )
          this.ctx.fillStyle = 'rgba(0,115,252,0.5)'
          this.ctx.fillRect(
            this.xMin,
            this.yMin,
            this.areaWidth,
            this.areaHeight
          )
          if (!this.checkArea(this.areaWidth, this.areaHeight)) {
            this.ctx.fillStyle = 'rgb(255,0,0)'
            this.ctx.font = '15px Microsoft YaHei'
            this.ctx.fillText('划分区域过小, 将采用默认分析区域，双击可重新设置', this.xMin, this.yMin - 10)
          }
        }
      },
    }
  }
</script>

<style scoped>
  .help-text {
    float: right;
    margin-top: 45px;
    width: 270px;
  }
</style>