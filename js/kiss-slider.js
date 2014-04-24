/*
 * Author:卢伟标
 * English-Name:Bill
 * Date:2014/04/23
 */

(function($){
var winJq = $(window);
var defaults = {
	curIndex : 0,
	direction : "x",
	speed : 1000,
	viewWidth: winJq.width(),//view-port height //chnage to $(window).width() for condition of full page;
	viewHeight: winJq.height(),//view-port height //chnage to $(window).height() for condition of full page;
	sliderWidth: winJq.width(),//don't set "auto",a fixed value is needed
	sliderHeight : winJq.height(),//this.viewHeight;//change to "auto" for condition of slider with variable height greater than view-port height
	unactivatedSliderWidth: winJq.width(),//the height of unactived slider.Normally, just keep default value(viewHeight)
	unactivatedSliderHeight: winJq.height(),//the height of unactived slider.Normally, just keep default value(viewWidth)
	isFixedView : true,//view-port is height-fixed or not
	isXCenter : false,
	isVCenter : false,

	activatedSliderCss : { },
	unActivatedSliderCss : { },
}
/*
 * actions : {
 *	"validate","move","prev","next"
 * }
 * param :{
 *	"prevId","nextId",
 * }
 */
$.fn.kissSlider = function(){
	var param = arguments[0];
	return this.each(function(){
		var $this = $(this);//Notice:牢记这里的this是被遍历元素集中的当前元素,所有操作都针对它
		if(param === "validate"){
			validate.call($this);
			alert("validate");
		} else if(typeof(param) == "object" || arguments.length == 2){
			setSettings.call($this,param);
			alert("setSetting");
		} else{
			alert("no match");
		}
	});
}
//配置参数
function setSettings(param){
	//..code here to go
	//this.data(param);
}
//init
function init(){
	var settings = {};
	if(this.data("isSet ") == "undefined") settings = $.extend({"isSet":true},defaults);
	settings.sliderViewPort = this;
	settings.sliders = this.children();
	settings.sliderNum = settings.sliders.length;
	settings.sliderLine = $("<div></div>").append(settings.sliders.detach()).appendTo(settings.sliderViewPort);//sliderLine 用于包裹所有slider,对用户是透明的,仅作为功能实现的辅助
	this.data(settings);
	return this
}
function alignCenter(){
	var settings = this.data();
	//the function make the align effect by changing the padding and margin of viewport,activated slider and unactivated sliders
	//激活和非激活滑块的css样式分别记录在activatedSliderCss和unactivatedSliderCss里
	if(settings.direction == "x"){//"x" horizontal sliders
		if(settings.isXCenter){
			settings.viewWidth = (settings.viewWidth + settings.sliderWidth)/2;//NOTE:due to the effect of padding-left,viewWidth should be recalculated
			var xStep = settings.viewWidth - settings.sliderWidth;
			settings.sliderViewPort.css("padding-left",xStep);
		} else { /* no padding-left effect,just keep default -> settings.viewWidth = settings.viewWidth; */ }
		if(settings.isVCenter){
			var vStep = (settings.sliderHeight - settings.unactivatedSliderHeight)/2;//if sliderHeight is "auto",it won't work.There is no reason to support "auto",I think noboy want to align the unactivated slider center when activated slider is height-variable
			$.extend(settings.activatedSliderCss,{"margin-top":0});
			$.extend(settings.unactivatedSliderCss,{"margin-top":vStep});
			for(var i=0; i<settings.sliderNum; i++ ){
				if(i != settings.curIndex)
					settings.sliders.eq(i).css(settings.unactivatedSliderCss);
			}
		}
	}else{//"y" vertical sliders
		if(settings.isXCenter){
			var xStep = (settings.sliderWidth - settings.unactivatedSliderWidth)/2;
			$.extend(settings.activatedSliderCss,{"margin-left":0});
			$.extend(settings.unactivatedSliderCss,{"margin-left":xStep});
			for(var i=0; i<settings.sliderNum; i++){
				if(i != settings.curIndex)
					settings.sliders.eq(i).css("margin-left",xStep);
			}
		}
		if(settings.isVCenter){
			settings.viewHeight = (settings.viewHeight + settings.sliderHeight)/2;//NOTE:due to the effect of padding-left,viewHeight should be recalculated
			var vStep = settings.viewHeight - settings.sliderHeight;
			settings.sliderViewPort.css("padding-top",vStep);
		} else { 
			/*no padding-left effect,just keep default -> settings.viewHeight = settings.viewHeight;*/
		}
	}
	return this;
}

//使配置生效
function validate(){

	init.call(this);

	alignCenter.call(this);

	var settings = this.data();
	//init the viewport
	settings.sliderViewPort.css({
		"width":settings.viewWidth,
		"height":settings.viewHeight,
		"overflow":"hidden",
	});
	//init the slider line
	if(settings.direction == "x") {
		var maxWidth = settings.sliderWidth >settings.unactivatedSliderWidth ? settings.sliderWidth:settings.unactivatedSliderWidth;
		settings.sliderLine.css("width",settings.sliderNum * maxWidth);
	} else settings.sliderLine.css("width",settings.sliderWidth);
	settings.sliderLine.css("height","auto");
	//init the sliders
	settings.sliders.addClass("slider")
		.css({
			"width":settings.unactivatedSliderWidth,
			"height":settings.unactivatedSliderHeight,
			"overflow":"hidden",
		});
	if(settings.direction == "x") settings.sliders.css("float","left");
	else settings.sliders.css("float","none");
	settings.sliders.eq(settings.curIndex).css({
		"width":settings.sliderWidth,
		"height":settings.sliderHeight,
	});

	//statically locate to the specified current slider
	if(settings.direction == "x"){
		var marginLeft = -(settings.curIndex * settings.unactivatedSliderWidth);
		settings.sliderLine.css({"margin-left": marginLeft});
	} else{
		var marginTop = -(settings.curIndex * settings.unactivatedSliderHeight);
		settings.sliderLine.css({"margin-top": marginTop});
	}
	//settings.move(settings.curIndex);//dynamically locate to the specified current slider
	return this;
}
/* 移动到指定索引值对应的滑块(滑块链移动n个滑块大小的距离)
 * @public
 */
function move(nextCurIndex){
	var settings = this.data();
	//if(nextCurIndex == settings.curIndex) return nextCurIndex;
	if(nextCurIndex < 0) nextCurIndex = settings.sliderNum - 1;
	else if(nextCurIndex > settings.sliderNum - 1) nextCurIndex = 0; 
	//change height && width of current slider 
	$.extend(settings.unactivatedSliderCss,{"height":settings.unactivatedSliderHeight,"width":settings.unactivatedSliderWidth});
	settings.sliders.eq(settings.curIndex).removeClass("active").animate(settings.unactivatedSliderCss,settings.speed);

	//change height&&width of next slider
	var nextJq = settings.sliders.eq(nextCurIndex).addClass("active");
	var nextCurHeight = nextJq.height();
	var nextNextHeight;
	if(settings.sliderHeight == "auto"){//"auto" is invalid in function animate()
		nextNextHeight = nextJq.css("height","auto").height();
		$.extend(settings.activatedSliderCss,{"height": nextNextHeight,"width":settings.sliderWidth});
		nextJq.height(nextCurHeight).animate(settings.activatedSliderCss,settings.speed);
	} else {
		nextNextHeight = settings.sliderHeight;
		$.extend(settings.activatedSliderCss,{"height": nextNextHeight,"width":settings.sliderWidth});
		nextJq.animate(settings.activatedSliderCss,settings.speed);
	}
	if(!settings.isFixedView){ settings.sliderViewPort.height(nextNextHeight);}//change the height of view-port to fit the active slider

	//move slider-line to the specified slider
	if(settings.direction == "x"){
		var marginLeft = -(nextCurIndex * settings.unactivatedSliderWidth);
		settings.sliderLine.animate({"margin-left": marginLeft},settings.speed);
	} else{
		var marginTop = -(nextCurIndex * settings.unactivatedSliderHeight);
		settings.sliderLine.animate({"margin-top": marginTop},settings.speed);
	}
	settings.curIndex = nextCurIndex;
	return this;
}
//下一张 next page
function prev(){
	var nextCurIndex = this.data("curIndex ")- 1;
	return this.move(nextCurIndex);
}
//上一张 previou page
function next(){
	var nextCurIndex = this.data("curIndex") + 1;
	return this.move(nextCurIndex);
}
