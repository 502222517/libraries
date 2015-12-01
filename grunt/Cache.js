(function(exports) {
  'use strict';
  
// 缓存清理类
var Cache={
	regexs:{ // 
		img:/\.(jpg|png|gif)([\?]?)([#]?)/gim, 
		css:/\.(css)([\?]?)([#]?)/mgi,
		js:/\.(js)([\?]?)([#]?)/mgi
	},
	tagRegexs:{ // 包含html标记
		imgTag:/<img[^>]*\.(jpg|png|gif)[^>]*>/mgi,
		cssTag:/<link[^>]*rel="stylesheet"[^>]*\.css[^>]*>/mgi,
		jsTag:/<script[^>]*src="[^>]*\.js[^>]*><\/script>/mgi
	},
	getToday:function(){  // 当天时间 yyyymmddHHMM
		var now =new Date();
		var handler=function(num){
			return  num >=10 ? num : '0'+num ;
		}
		var formatDate=[];
		formatDate.push(now.getFullYear());
		formatDate.push(handler(now.getMonth()+1));
		formatDate.push(handler(now.getDate()));
		formatDate.push(handler(now.getHours()));
		formatDate.push(handler(now.getMinutes()));
		
		return formatDate.join('');
	},
	/**
	 * 设置单次版本号
	 * @param {string} linkText 链接文本
	 * @param {RegExp} pattern 正则表达式，必须是regexs中包含的（img,css,js）
	 * @param {Boolean} isMul 是否全文多次替换，默认为false，尽量不要设置本参数
	 */
	setVersion:function(linkText,pattern,isMul){
		var $this=this;
		var now=$this.getToday();
		var exist=linkText.search(/\?/)>=0;
		var format='.$1?v='+now+(exist ? '&':'')+'$3';
		// 检查是否是全文多次替换
		if(isMul){
		 	format='.$1?v='+now+'&$3';
		 	// [".png?", "png", "?", ""] 共4块
			return linkText.replace(pattern,format);
		}
		// 如果参数v存在，则替换旧值
		var regex = new RegExp("([\\?&]v=)([0-9a-zA-Z]*)([&]?)",["i"]);
		var match = regex.exec(linkText);
		var newLink;
		if(match == null){
			// [".png?", "png", "?", ""] 共4块
			newLink=linkText.replace(pattern,format);
		}else{
			newLink=linkText.replace(regex,'$1' + now + '$3');
		}
		
		return newLink;
	},
	/**
	 * 设置多次版本号
	 * @param {string} content 包含链接文本
	 * @param {RegExp} pattern 正则表达式，必须是regexs中包含的（img,css,js）
	 */
	setMulVersion:function(content,pattern){
		var $this=this;
		var result,linkText,temp,lastIndex=0;
		pattern.lastIndex=0;
		while((result=pattern.exec(content))!=null){
	 		linkText = content.substring(lastIndex, pattern.lastIndex);
	 		lastIndex= pattern.lastIndex;
	 		temp=$this.setVersion(linkText,pattern);
	 		content=content.replace(linkText,temp);
	 		lastIndex=lastIndex+(temp.length-linkText.length);
	 		pattern.lastIndex=lastIndex;
	    }
		return content;
	},
	/**
	 * .html文件添加版本号清缓存，包括标签 img、css、js
	 * @param {string} content html全文内容
	 */
	htmls:function(content){  // 
		var $this=this,temp;
		var matches=content.match($this.tagRegexs.imgTag);
		// img 标签 添加版本号
		if(matches  && matches.length){
			Array.prototype.forEach.call(matches,function(v,i){
				temp=$this.setVersion(v,$this.regexs.img);
				content=content.replace(v,temp);
			});
		}
		// css 标签 添加版本号
		matches=content.match($this.tagRegexs.cssTag);
		if(matches  && matches.length){ 
			Array.prototype.forEach.call(matches,function(v,i){
				temp=$this.setVersion(v,$this.regexs.css);
				content=content.replace(v,temp);
			});
		}
		// js 标签 添加版本号
		matches=content.match($this.tagRegexs.jsTag);
		if(matches  && matches.length){ 
			Array.prototype.forEach.call(matches,function(v,i){
				temp=$this.setVersion(v,$this.regexs.js);
				content=content.replace(v,temp);
			});
		}
		return content;
	},
	/**
	 * .css文件添加版本号清缓存，包括img引用
	 * @param {string} content css全文内容
	 */
	styles:function(content){
		var $this=this;
		content=$this.setMulVersion(content,$this.regexs.img);
	    
		return content;
	},
	/**
	 * .js文件添加版本号清缓存，包括img,css引用
	 * @param {string} content  js全文内容
	 */
	scripts:function(content){
		var $this=this;
		content=$this.setMulVersion(content,$this.regexs.img);
		content=$this.setMulVersion(content,$this.regexs.css);
		
		return content;
	}
}

exports.Cache = Cache;

}(typeof exports === 'object' && exports || this));
	