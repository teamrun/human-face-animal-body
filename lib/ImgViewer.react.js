var React = require('react/addons');
var cx = React.addons.classSet;


var screenW = window.screen.width;
var screenH = window.screen.height;

function getStyleObj(state){
    var style = {
        width: state.width || screenW,
        top: state.top || 0,
        height: state.height || 'auto',
        left: state.left || 0
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
        left: -(targetW - screenW)/2
    };
}
// var defaultStyle = {

// }

var ImgViewer = React.createClass({
    getInitialState: function() {
        return {
            loaded: false
        };
    },
    // 绑定事件
    componentDidMount: function() {
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
        return (
            <div className={classes}>
                <img className='img-viewer'
                    ref="img"
                    src={ this.props.img }
                    style={ style }
                    onLoad={ this._onLoad }
                />
            </div>
        );
    },
    // 重复的图片也会触发onLoad
    _onLoad: function(){
        var imgEl = this.refs['img'].getDOMNode();
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