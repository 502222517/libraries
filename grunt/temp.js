
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
		/**
		 * 设置单次版本号
		 * @param {string} linkText 链接文本
		 * @param {RegExp} pattern 正则表达式，必须是regexs中包含的（img,css,js）
		 * @param {Boolean} isMul 是否全文多次替换，默认为false，尽量不要设置本参数
		 */
		setVersion:function(linkText,pattern,isMul){
			var $this=this;
//			var now=grunt.template.today('yyyymmddHHMM');
			var now='201511251608';
			var exist=linkText.search(/\?/)>=0;
			var format='.$1?v='+now+(exist ? '&':'')+'$3';
			// 检查是否是全文多次替换
			if(isMul){
			 	format='.$1?v='+now+'&$3';
			}
			// [".png?", "png", "?", ""] 共4块
			var newLink=linkText.replace(pattern,format);
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
			var $this=this;
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



window.onload=function(){
	var htmlFile='<title>js-libraries</title> <link rel="stylesheet" href="modules/common/css/basis.css#share" /> <link rel="stylesheet" href="modules/app/css/index.css?a=1#share" /><script type="text/javascript" src="temp.js"></script></head>';
	var cssFile='.test{background: url(../../app/images/d_01.jpg) no-repeat;}.test2{background: url(../../app/images/w_01.jpg) no-repeat;}';
	window.htmlFile=htmlFile;
	
	
	
	var resText=Cache.htmls(htmlFile);
	
	var cssText= Cache.setMulVersion(cssFile,Cache.regexs.img);
	console.log('res',[resText,cssText]);
}



	