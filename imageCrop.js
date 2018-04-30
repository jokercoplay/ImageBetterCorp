import './index.css'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

const CropShape = {
  RECT: 'rect',
  CIRCLE: 'circle'
}
const CursorType = {
  MOVE: 'move',
  CROSSHAIR: 'crosshair'
}
const OriginCropSize = 200
const MinCropperSize = 500
const MaxCropperWidth = 1000
const MaxCropperHeight = 800

export default class ImageCropper extends PureComponent {
  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  state = {
    cropShape: CropShape.RECT,
    cropBorderRadius: 0,
    cursorType: CursorType.MOVE,
    cropWidth: OriginCropSize,
    cropHeight: OriginCropSize,
    cropLeft: 100,
    cropTop: 100,
    canCropMove: false,
    canCropSizeChange: false,
  }

  componentDidMount = () => {
    const image = new Image()
    image.src = this.props.imageUrl
    image.onload = () => {
      this.setState({ image })
    }
  }

  render = () => {
    return (
      <div
        className="image-cropper"
        onWheel={this.catchEvent}
      >
        {this.state.image && this.renderCropper()}
        {this.renderCanvas()}
      </div >
    )
  }

  renderCropper = () => {
    let imageDivHeight = 0
    let imageDivWidth = 0
    if (this.state.image.width > this.state.image.height) {
      imageDivWidth = this.state.image.width > MaxCropperWidth ? MaxCropperWidth : this.state.image.width
      imageDivHeight = imageDivWidth * (this.state.image.height / this.state.image.width)
    } else {
      imageDivHeight = this.state.image.height > MaxCropperHeight ? MaxCropperHeight : this.state.image.height
      imageDivWidth = imageDivHeight / (this.state.image.height / this.state.image.width)
    }

    return (
      <div className="image-cropper-operation-div">
        {this.renderCropDiv(imageDivWidth, imageDivHeight)}
        {this.renderOptionsDiv(imageDivWidth, imageDivHeight)}
      </div>
    )
  }

  renderCropDiv = (imageDivWidth, imageDivHeight) => {
    return (
      <div
        id="image-cropper-image-div"
        className="image-cropper-image-div"
        onMouseEnter={this.getCropperPosition}
        onMouseMove={this.onChangeCrop}
        onMouseLeave={this.stopChangeCrop}
        style={{
          backgroundImage: `url(${this.state.image.src})`,
          width: `${imageDivWidth}px`,
          height: `${imageDivHeight}px`
        }}
      >
        <div
          className="image-cropper-cropper-div"
          onMouseDown={this.startChangeCrop}
          onMouseUp={this.stopChangeCrop}
          style={{
            width: `${this.state.cropWidth}px`,
            height: `${this.state.cropHeight}px`,
            left: `${this.state.cropLeft}px`,
            top: `${this.state.cropTop}px`,
            borderRadius: `${this.state.cropBorderRadius}`,
            cursor: `${this.state.cursorType}`
          }}
        />
      </div>
    )
  }

  renderOptionsDiv = (imageDivWidth, imageDivHeight) => {
    return (
      <div className="image-cropper-pre-options">
        <div
          id="image-cropper-image-pre"
          className="image-cropper-image-pre"
          style={{
            borderRadius: `${this.state.cropBorderRadius}`,
            backgroundImage: `url(${this.state.image.src})`,
            backgroundSize: `${(imageDivWidth < MinCropperSize ? MinCropperSize : imageDivWidth) * (OriginCropSize / this.state.cropWidth)}px ${(imageDivHeight < MinCropperSize ? MinCropperSize : imageDivHeight) * (OriginCropSize / this.state.cropHeight)}px`,
            backgroundPosition: `${-this.state.cropLeft * (OriginCropSize / this.state.cropWidth)}px ${-this.state.cropTop * (OriginCropSize / this.state.cropHeight)}px`
          }}
        />
        <button className="image-cropper-reset-button" onClick={this.resetCrop}>
          重置选择框
        </button>
        <div className="image-cropper-choose-shape">
          <span>请选择剪裁样式:</span>
          <div className="image-cropper-shapes">
            <div
              className="image-cropper-rect"
              style={{ borderColor: `${this.state.cropShape === CropShape.RECT ? '#1890ff' : ''}` }}
              onClick={() => this.setCropShape(CropShape.RECT)}
            />
            <div
              className="image-cropper-circle"
              style={{ borderColor: `${this.state.cropShape === CropShape.CIRCLE ? '#1890ff' : ''}` }}
              onClick={() => this.setCropShape(CropShape.CIRCLE)}
            />
          </div>
        </div>
        {this.state.cropShape === CropShape.CIRCLE &&
          <div className="image-cropper-change-size">
            <span>选择框大小：</span>
            <input
              className="image-cropper-size-range"
              type="range"
              step={5}
              max={imageDivWidth > imageDivHeight ? imageDivHeight : imageDivWidth}
              min={OriginCropSize}
              value={this.state.cropWidth}
              onChange={this.onChangeCropSize}
            />
          </div>
        }
        <div className="image-cropper-options">
          <button
            className="image-cropper-button image-cropper-sure"
            onClick={() => this.onClickSave(imageDivWidth, imageDivHeight)}>确定</button>
          <button className="image-cropper-button" onClick={this.props.onClose}>取消</button>
        </div>
      </div>
    )
  }

  renderCanvas = () => {
    return (
      <canvas
        id="canvas"
        className="image-cropper-canvas"
        width={this.state.cropWidth}
        height={this.state.cropHeight}
      />
    )
  }

  getCropperPosition = (e) => {
    if (!this.cropperDivPosition) {
      this.cropperDivPosition = e.target.getBoundingClientRect()
    }
  }

  onChangeCrop = (e) => {
    if ((this.cropperDivPosition.left + this.state.cropWidth + this.state.cropLeft - e.clientX < 10
      || this.cropperDivPosition.top + this.state.cropHeight + this.state.cropTop - e.clientY < 10)
      && this.state.cropShape !== CropShape.CIRCLE) {
      this.setState({ cursorType: CursorType.CROSSHAIR })
    } else {
      this.setState({ cursorType: CursorType.MOVE })
    }

    if (this.state.canCropMove) {
      this.setState({
        cropLeft: e.clientX - this.cropperDivPosition.left - this.mouseCropX,
        cropTop: e.clientY - this.cropperDivPosition.top - this.mouseCropY
      })
    } else if (this.state.canCropSizeChange) {
      this.setState({
        cropWidth: e.clientX - this.cropperDivPosition.left - this.state.cropLeft,
        cropHeight: e.clientY - this.cropperDivPosition.top - this.state.cropTop,
      })
    }
  }

  startChangeCrop = (e) => {
    if (this.state.cursorType === CursorType.MOVE) {
      this.setState({ canCropMove: true })
    } else if (this.state.cursorType === CursorType.CROSSHAIR) {
      this.setState({ canCropSizeChange: true })
    }

    this.mouseCropX = e.clientX - e.target.getBoundingClientRect().x
    this.mouseCropY = e.clientY - e.target.getBoundingClientRect().y
  }

  stopChangeCrop = () => {
    this.setState({ canCropMove: false, canCropSizeChange: false })
  }

  onChangeCropSize = (e) => {
    this.setState({ cropWidth: e.target.value, cropHeight: e.target.value })
  }

  resetCrop = () => {
    this.setState({ cropWidth: OriginCropSize, cropHeight: OriginCropSize, cropLeft: 100, cropTop: 100 })
  }

  setCropShape = (cropShape) => {
    if (cropShape === this.state.cropShape) {
      return
    }

    if (cropShape === CropShape.CIRCLE) {
      this.setState({ cropBorderRadius: '50%', cropWidth: OriginCropSize, cropHeight: OriginCropSize })
    } else {
      this.setState({ cropBorderRadius: 0 })
    }
    this.setState({ cropShape })
  }

  onClickSave = (imageDivWidth, imageDivHeight) => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    if (this.state.cropShape === CropShape.CIRCLE) {
      ctx.arc(this.state.cropWidth / 2, this.state.cropHeight / 2, this.state.cropWidth / 2, 0, Math.PI * 2)
      ctx.clip()
    }
    ctx.drawImage(
      this.state.image,
      this.state.cropLeft * this.state.image.width / imageDivWidth,
      this.state.cropTop * this.state.image.height / imageDivHeight,
      this.state.cropWidth * this.state.image.width / imageDivWidth,
      this.state.cropHeight * this.state.image.height / imageDivHeight,
      0,
      0,
      this.state.cropWidth,
      this.state.cropHeight
    )
    const image = canvas.toDataURL()
    this.props.onSave(image)
  }

  catchEvent = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }
}
