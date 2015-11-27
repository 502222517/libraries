module.exports=function(grunt){
	/*
	title：libraries project 配置 
	email: 502222517qq.com
	*/
	
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
		/**
		 * 设置单次版本号
		 * @param {string} linkText 链接文本
		 * @param {RegExp} pattern 正则表达式，必须是regexs中包含的（img,css,js）
		 * @param {Boolean} isMul 是否全文多次替换，默认为false，尽量不要设置本参数
		 */
		setVersion:function(linkText,pattern,isMul){
			var $this=this;
			var now=grunt.template.today('yyyymmddHHMM');
//			var now='201511251608';
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
	
	// grunt 配置 
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		meta:{
			basePath:'../src/',
			destPath:'../'
		},
        // 代码清理
		clean:{
			options:{
				force:true
			},
			images:{
				expand: true,
				cwd: '<%=meta.destPath%>modules/',
				src: ['**/**.jpg','**/**.png','**/**.gif']
			},
			libImages:{
				expand: true,
				cwd: '<%=meta.destPath%>lib/',
				src: ['**/**.jpg','**/**.png','**/**.gif']
			},
			htmls:{
				expand: true,
				cwd: '<%=meta.destPath%>',
				src: ['*.html','modules/**/**.html']
			},
			styles:{
				expand: true,
				cwd: '<%=meta.destPath%>',
				src: ['lib/**/**.css','modules/**/**.css']
			},
			scripts:{
				expand: true,
				cwd: '<%=meta.destPath%>',
				src: ['lib/**/**.js','modules/**/**.js']
			}
		},
		copy:{
			images:{
				files:[{
				 	expand: true,
					cwd: '<%=meta.basePath%>modules/', 
					src: ['**/**.jpg','**/**.png','**/**.gif'],
					dest: '<%=meta.destPath%>modules/'
				},{
				 	expand: true,
					cwd: '<%=meta.basePath%>lib/', 
					src: ['**/**.jpg','**/**.png','**/**.gif'],
					dest: '<%=meta.destPath%>lib/'
				}]
			},
			htmls:{
				files:[{
					expand: true,
					cwd: '<%=meta.basePath%>', 
					src: ['*.html','modules/**/**.html'],
					dest: '<%=meta.destPath%>'
				}]
			},
			styles:{
				files:[{
					expand: true,
					cwd: '<%=meta.basePath%>', 
					src: ['lib/**/**.css','modules/**/**.css'],
					dest: '<%=meta.destPath%>'
				}]
			},
			scripts:{
				files:[{
					expand: true,
					cwd: '<%=meta.basePath%>', 
					src: ['lib/**/**.js','modules/**/**.js'],
					dest: '<%=meta.destPath%>'
				}]
			}
		},
		'string-replace':{  // 字符串替换
			styles:{
				files:[{
					expand: true,
					cwd: '<%=meta.destPath%>', 
					src: ['lib/**/**.css','modules/**/**.css'],
					dest: '<%=meta.destPath%>',
				}],
				options:{
					replacements:[{
							pattern: /[\s\S]*/img,  //  /(<link[^>]*rel="stylesheet"[^>]*)(\.css)([^>]*>)/mgi, // /\.css/ig,
						    replacement: function (match, p1, offset, string) {  
							var content=match || '';
							
							return Cache.styles(content);
						  }
					}]
				}
			},
			htmls:{
				files:[{
					expand: true,
					cwd: '<%=meta.destPath%>', 
					src: ['*.html','lib/**/**.html','modules/**/**.html'],
					dest: '<%=meta.destPath%>',
				}],
				options:{
					replacements:[{
							pattern: /[\s\S]*/img,  //  /(<link[^>]*rel="stylesheet"[^>]*)(\.css)([^>]*>)/mgi, // /\.css/ig,
						    replacement: function (match, p1, offset, string) {  
							var content=match || '';
//							grunt.log.write([' [begin] ',Cache.htmls(content),' [end] ']);
							return Cache.htmls(content);
						  }
					}]
				}
			}
			
		},
		imagemin:{
			dist:{
				options:{
					optimizationLevel: 3  // 0-7
				},
				files:[{
					expand:true,
					cwd:'<%=meta.destPath%>',
					src:['modules/**/**.jpg','modules/**/**.png','modules/**/**.gif'],
					dest:'<%=meta.destPath%>'
				}]
			}
		},
		htmlmin:{
			dist:{
			   options:{
					removeComments: true, // 去注析
					collapseWhitespace: true // 去换行
				},
				files:[{
						expand:true,
						cwd:'<%=meta.destPath%>',
						src:['*.html','modules/**/**.html'],
						dest:'<%=meta.destPath%>',
						ext:'.html'
					}]  
			}
		},
		cssmin:{
			options: {
				 keepSpecialComments: 0
			},
			dist:{
				files:[
					{
						expand:true,
						cwd:'<%=meta.destPath%>',
						src:['lib/**/**.css','modules/**/**.css'],
						dest:'<%=meta.destPath%>',
						ext:'.css'
					 }
				]
			}
		},
		uglify:{ 
			dist:{
				files:[{
					expand:true,
					cwd:'<%=meta.destPath%>',
					src:['lib/**/**.js','modules/**/**.js'],
					dest:'<%=meta.destPath%>',
					ext:'.js'
				}]
			}
		},
		watch:{
			images:{  
				files: ['<%=meta.basePath%>**/**.jpg'
				,'<%=meta.basePath%>**/**.png'
				,'<%=meta.basePath%>**/**.gif'],
				tasks:['clean:images','clean:libImages','copy:images']
			},
			htmls:{
				files: [
				'<%=meta.basePath%>*.html',
				'<%=meta.basePath%>**/**.html'
				],
				tasks:['clean:htmls','copy:htmls','string-replace:htmls']
			},
			styles:{
				files: [
				'<%=meta.basePath%>lib/**/**.css',
				'<%=meta.basePath%>modules/**/**.css'
				],
				tasks:['clean:styles','copy:styles',,'string-replace:styles']
			},
			scripts:{
				files: [
				'<%=meta.basePath%>lib/**/**.js',
				'<%=meta.basePath%>modules/**/**.js'
				],
				tasks:['clean:scripts','copy:scripts']
			}
		}
	});

	// 加载任务插件
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    
 
	// 默认被执行的任务 dist  压缩 
	grunt.registerTask('default',[
	'clean','copy','string-replace','imagemin'
	,'cssmin','uglify','htmlmin'
	]);
	
    // 开发打包  不需要压缩
	grunt.registerTask('dev',[
	'clean','copy','string-replace','watch'
	]);
    
 
}