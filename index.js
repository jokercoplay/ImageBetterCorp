'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('./index.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CropShape = {
  RECT: 'rect',
  CIRCLE: 'circle'
};
var CursorType = {
  MOVE: 'move',
  CROSSHAIR: 'crosshair'
};
var OriginCropSize = 200;
var MinImageSize = 500;
var MaxCropperWidth = 1000;
var MaxCropperHeight = 800;

var ImageCropper = function (_PureComponent) {
  _inherits(ImageCropper, _PureComponent);

  function ImageCropper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ImageCropper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ImageCropper.__proto__ || Object.getPrototypeOf(ImageCropper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      cropShape: CropShape.RECT,
      cropBorderRadius: 0,
      cursorType: CursorType.MOVE,
      cropWidth: OriginCropSize,
      cropHeight: OriginCropSize,
      cropLeft: 100,
      cropTop: 100,
      canCropMove: false,
      canCropSizeChange: false
    }, _this.componentDidMount = function () {
      var image = new Image();
      image.src = _this.props.imageUrl;
      image.onload = function () {
        if (image.width < MinImageSize || image.width < MinImageSize) {
          _this.props.onSave(image.src);
          return;
        }
        _this.setState({ image: image });
      };

      addEventListener('resize', _this.getCropperPosition);
    }, _this.componentWillUnmount = function () {
      removeEventListener('resize', _this.getCropperPosition);
    }, _this.render = function () {
      return _react2.default.createElement(
        'div',
        {
          className: 'image-cropper',
          onWheel: _this.catchEvent
        },
        _this.state.image && _this.renderCropper(),
        _this.renderCanvas()
      );
    }, _this.renderCropper = function () {
      var imageDivHeight = 0;
      var imageDivWidth = 0;
      if (_this.state.image.width > _this.state.image.height) {
        imageDivWidth = _this.state.image.width > MaxCropperWidth ? MaxCropperWidth : _this.state.image.width;
        imageDivHeight = imageDivWidth * _this.state.image.height / _this.state.image.width;
      } else {
        imageDivHeight = _this.state.image.height > MaxCropperHeight ? MaxCropperHeight : _this.state.image.height;
        imageDivWidth = imageDivHeight * _this.state.image.width / _this.state.image.height;
      }

      return _react2.default.createElement(
        'div',
        { className: 'image-cropper-operation-div' },
        _this.renderCropDiv(imageDivWidth, imageDivHeight),
        _this.renderOptionsDiv(imageDivWidth, imageDivHeight)
      );
    }, _this.renderCropDiv = function (imageDivWidth, imageDivHeight) {
      return _react2.default.createElement(
        'div',
        {
          id: 'image-cropper-image-div',
          className: 'image-cropper-image-div',
          onMouseEnter: _this.getCropperPosition,
          onMouseMove: _this.onChangeCrop,
          onMouseUp: _this.stopChangeCrop,
          style: {
            backgroundImage: 'url(' + _this.state.image.src + ')',
            width: imageDivWidth + 'px',
            height: imageDivHeight + 'px'
          }
        },
        _react2.default.createElement('div', {
          className: 'image-cropper-cropper-div',
          onMouseDown: _this.startChangeCrop,
          onMouseUp: _this.stopChangeCrop,
          style: {
            width: _this.state.cropWidth + 'px',
            height: _this.state.cropHeight + 'px',
            left: _this.state.cropLeft + 'px',
            top: _this.state.cropTop + 'px',
            borderRadius: '' + _this.state.cropBorderRadius,
            cursor: '' + _this.state.cursorType
          }
        })
      );
    }, _this.renderOptionsDiv = function (imageDivWidth, imageDivHeight) {
      return _react2.default.createElement(
        'div',
        { className: 'image-cropper-pre-options' },
        _react2.default.createElement('div', {
          className: 'image-cropper-image-pre',
          style: {
            borderRadius: '' + _this.state.cropBorderRadius,
            backgroundImage: 'url(' + _this.state.image.src + ')',
            backgroundSize: imageDivWidth * (OriginCropSize / _this.state.cropWidth) + 'px ' + imageDivHeight * (OriginCropSize / _this.state.cropHeight) + 'px',
            backgroundPosition: -_this.state.cropLeft * (OriginCropSize / _this.state.cropWidth) + 'px ' + -_this.state.cropTop * (OriginCropSize / _this.state.cropHeight) + 'px'
          }
        }),
        _react2.default.createElement(
          'button',
          { className: 'image-cropper-reset-button', onClick: _this.resetCrop },
          '\u91CD\u7F6E\u9009\u62E9\u6846'
        ),
        _react2.default.createElement(
          'div',
          { className: 'image-cropper-choose-shape' },
          _react2.default.createElement(
            'span',
            null,
            '\u8BF7\u9009\u62E9\u526A\u88C1\u6837\u5F0F:'
          ),
          _react2.default.createElement(
            'div',
            { className: 'image-cropper-shapes' },
            _react2.default.createElement('div', {
              className: 'image-cropper-rect',
              style: { borderColor: '' + (_this.state.cropShape === CropShape.RECT ? '#1890ff' : '') },
              onClick: function onClick() {
                return _this.setCropShape(CropShape.RECT);
              }
            }),
            _react2.default.createElement('div', {
              className: 'image-cropper-circle',
              style: { borderColor: '' + (_this.state.cropShape === CropShape.CIRCLE ? '#1890ff' : '') },
              onClick: function onClick() {
                return _this.setCropShape(CropShape.CIRCLE);
              }
            })
          )
        ),
        _this.state.cropShape === CropShape.CIRCLE && _react2.default.createElement(
          'div',
          { className: 'image-cropper-change-size' },
          _react2.default.createElement(
            'span',
            null,
            '\u9009\u62E9\u6846\u5927\u5C0F\uFF1A'
          ),
          _react2.default.createElement('input', {
            className: 'image-cropper-size-range',
            type: 'range',
            step: 5,
            max: imageDivWidth > imageDivHeight ? imageDivHeight : imageDivWidth,
            min: OriginCropSize,
            value: _this.state.cropWidth,
            onChange: _this.onChangeCropSize
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'image-cropper-options' },
          _react2.default.createElement(
            'button',
            {
              className: 'image-cropper-button image-cropper-sure',
              onClick: function onClick() {
                return _this.onClickSave(imageDivWidth, imageDivHeight);
              } },
            '\u786E\u5B9A'
          ),
          _react2.default.createElement(
            'button',
            { className: 'image-cropper-button', onClick: _this.props.onClose },
            '\u53D6\u6D88'
          )
        )
      );
    }, _this.renderCanvas = function () {
      return _react2.default.createElement('canvas', {
        id: 'canvas',
        className: 'image-cropper-canvas',
        width: _this.state.cropWidth,
        height: _this.state.cropHeight
      });
    }, _this.getCropperPosition = function () {
      _this.cropperDivPosition = document.getElementById('image-cropper-image-div').getBoundingClientRect();
    }, _this.onChangeCrop = function (e) {
      if (_this.state.cropShape !== CropShape.CIRCLE && (_this.cropperDivPosition.left + _this.state.cropLeft + _this.state.cropWidth - e.clientX < 10 || _this.cropperDivPosition.top + _this.state.cropTop + _this.state.cropHeight - e.clientY < 10)) {
        _this.setState({ cursorType: CursorType.CROSSHAIR });
      } else {
        _this.setState({ cursorType: CursorType.MOVE });
      }

      if (_this.state.canCropMove) {
        _this.setState({
          cropLeft: e.clientX - _this.cropperDivPosition.left - _this.mouseCropX,
          cropTop: e.clientY - _this.cropperDivPosition.top - _this.mouseCropY
        });
      } else if (_this.state.canCropSizeChange) {
        _this.setState({
          cropWidth: e.clientX - _this.cropperDivPosition.left - _this.state.cropLeft,
          cropHeight: e.clientY - _this.cropperDivPosition.top - _this.state.cropTop
        });
      }
    }, _this.startChangeCrop = function (e) {
      if (_this.state.cursorType === CursorType.MOVE) {
        _this.setState({ canCropMove: true });
      } else if (_this.state.cursorType === CursorType.CROSSHAIR) {
        _this.setState({ canCropSizeChange: true });
      }

      _this.mouseCropX = e.clientX - e.target.getBoundingClientRect().left;
      _this.mouseCropY = e.clientY - e.target.getBoundingClientRect().top;
    }, _this.stopChangeCrop = function () {
      _this.setState({ canCropMove: false, canCropSizeChange: false });
    }, _this.onChangeCropSize = function (e) {
      _this.setState({ cropWidth: e.target.value, cropHeight: e.target.value });
    }, _this.resetCrop = function () {
      _this.setState({ cropWidth: OriginCropSize, cropHeight: OriginCropSize, cropLeft: 100, cropTop: 100 });
    }, _this.setCropShape = function (cropShape) {
      if (cropShape === _this.state.cropShape) {
        return;
      }

      if (cropShape === CropShape.CIRCLE) {
        _this.setState({ cropBorderRadius: '50%', cropWidth: OriginCropSize, cropHeight: OriginCropSize });
      } else {
        _this.setState({ cropBorderRadius: 0 });
      }
      _this.setState({ cropShape: cropShape });
    }, _this.onClickSave = function (imageDivWidth, imageDivHeight) {
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      if (_this.state.cropShape === CropShape.CIRCLE) {
        ctx.arc(_this.state.cropWidth / 2, _this.state.cropHeight / 2, _this.state.cropWidth / 2, 0, Math.PI * 2);
        ctx.clip();
      }
      ctx.drawImage(_this.state.image, _this.state.cropLeft * _this.state.image.width / imageDivWidth, _this.state.cropTop * _this.state.image.height / imageDivHeight, _this.state.cropWidth * _this.state.image.width / imageDivWidth, _this.state.cropHeight * _this.state.image.height / imageDivHeight, 0, 0, _this.state.cropWidth, _this.state.cropHeight);
      var image = canvas.toDataURL();
      _this.props.onSave(image);
    }, _this.catchEvent = function (e) {
      e.stopPropagation();
      e.preventDefault();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return ImageCropper;
}(_react.PureComponent);

ImageCropper.propTypes = {
  imageUrl: _propTypes2.default.string.isRequired,
  onClose: _propTypes2.default.func.isRequired,
  onSave: _propTypes2.default.func.isRequired
};
exports.default = ImageCropper;
