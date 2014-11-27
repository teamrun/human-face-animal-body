var React = require('react/addons');
var cx = React.addons.classSet;

var util = require('../util');

var screenW = window.screen.width;
var screenH = window.screen.height;

var ALL_TST = 'all 200ms ease';
var NO_TST = 'all 0ms ease';

function getStyleObj(state){
    var style = {
        width: state.width || screenW,
        top: state.top || 0,
        height: state.height || 'auto',
        left: state.left || 0,
        transition: state.tst
    };
    return style;
}

function getNewState(originalSize, rate){
    var targetH = originalSize.height * rate;
    var targetW = originalSize.width * rate;
    return {
        height: targetH,
        width: targetW,
        top: -(targetH - screenH)/2,
        left: -(targetW - screenW)/2,
        tst: ALL_TST
    };
}
// var defaultStyle = {

// }

var ImgViewer = React.createClass({
    getInitialState: function() {
        return {
            loaded: false,
            tst: ALL_TST
        };
    },
    // 绑定事件
    componentDidMount: function() {
        this.el = this.getDOMNode();
        this.img = this.refs['img'].getDOMNode();
        document.body.addEventListener('keydown', this.keyZoom);

        this.originalSize = {
            width: screenW
        };
        this.zoomRate = 1;
    },
    componentWillUnmount: function() {
        document.body.removeEventListener('keydown', this.keyZoom);
    },
    // life cycle中, 获取数据并作出响应的机会
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.img !== this.props.img){
            this.setState({
                loaded: false
            });
        }
    },
    render: function(){
        var classes = cx({
            'img-viewer-ctn': true,
            'loading': !this.state.loaded
        });
        var style = getStyleObj(this.state);
        //console.log('new style', style);
        return (
            <div className={classes}>
                <img className='img-viewer'
                    ref="img"
                    draggable="false"
                    src={ this.props.img }
                    style={ style }

                    onLoad={ this._onLoad }
                    onMouseDown={ this._onMouseDown }
                    onMouseMove={ this._onMouseMove }
                    onMouseUp={ this._onMouseUp }
                    onMouseLeave={ this._onMouseLeave }
                />
            </div>
        );
    },
    // 重复的图片也会触发onLoad
    _onLoad: function(){
        var imgEl = this.img;
        var imgH = imgEl.height;
        this.originalSize.height = imgH;
                
        this.setState({
            loaded: true,
            top: -(imgH - screenH)/2,
            width: screenW,
            height: imgH
        });
        this.zoomRate = 1;
    },
    keyZoom: function(e){
        // console.log(e.keyCode);
        // console.log(e.shiftKey);
        // shift +
        var key = e.keyCode;
        if(key === 187 && e.shiftKey === true){
            this.zoomRate += 0.1;
            this.setState( getNewState(this.originalSize, this.zoomRate) );
        }
        // shift -
        else if(key === 189 && e.shiftKey === true){
            this.zoomRate -= 0.1;
            this.setState( getNewState(this.originalSize, this.zoomRate) );
        }
        // shft 1 或 shift 0, 重置缩放
        else if((key === 49 || key === 48 ) && e.shiftKey === true){
            this.zoomRate = 1;
            this.setState( getNewState(this.originalSize, this.zoomRate) );
        }
    },
    _onMouseDown: function(e){
        this.dragging = true;
        // 存储数据
        var mousePos = {
            x: e.pageX,
            y: e.pageY
        };
        var offset = util.getOffset(this.img);
        var imgPos = {
            x: offset.left,
            y: offset.top
        };

        this.draggingData = {
            mousePos: mousePos,
            imgPos: imgPos
        };
        console.log('拖拽开始: ', this.draggingData);
    },
    _onMouseMove: function(e){
        if( this.dragging ){
            // dragging mouse pos and image pos;
            var dmPos = this.draggingData.mousePos;
            var diPos = this.draggingData.imgPos;
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            var newTop = mouseY - dmPos.y + diPos.y;
            var newLeft = mouseX - dmPos.x + diPos.x;

            this.setState({
                top: newTop,
                left: newLeft,
                tst: NO_TST
            });
        }
    },
    _onMouseUp: function(){
        this.dragging = false;
    },
    _onMouseLeave: function(){
        this.dragging = false;
    }
});

module.exports = ImgViewer;


// 获取原始图片大小
// 也可以用html5的naturalHeight / naturalWidth
// console.log('react ele loaded');
// console.time('document el loaded');
// var img = document.createElement('img');
// img.onload = function(){
//     console.timeEnd('document el loaded');
//     console.log(img.width)
//     console.log(img.height)
//     img = null;
// }
// img.src = this.props.img;