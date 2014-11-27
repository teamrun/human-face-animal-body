var React = require('react');

var ImgViewer = require('./component/ImgViewer.react.js');



var imgSrc = './img/seagull.jpg';

React.render(<ImgViewer img={imgSrc}/>, document.querySelector('#ctn'));

// setTimeout(function(){
//     imgSrc = './img/75H.jpg'
//     React.render(<ImgViewer img={imgSrc}/>, document.querySelector('#ctn'));
// }, 4000);

// setTimeout(function(){
//     imgSrc = './img/seagull.jpg'
//     React.render(<ImgViewer img={imgSrc}/>, document.querySelector('#ctn'));
// }, 4000);