module.exports=function(grunt){
	/*
	title：libraries project 配置 
	email: 502222517qq.com
	*/

	// 缓存清理类
	var Cache= require('./Cache').Cache;
	 
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
				options:{
					force:true
				},
				files: [
				'<%=meta.basePath%>lib/**/**.css',
				'<%=meta.basePath%>modules/**/**.css'
				],
				tasks:['clean:styles','copy:styles','string-replace:styles']
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
    
 
	// 默认被执行的任务 dist  压缩  ,'imagemin'
	grunt.registerTask('default',[
	'clean','copy','string-replace'
	,'cssmin','uglify','htmlmin'
	]);
	
    // 开发打包  不需要压缩
	grunt.registerTask('dev',[
	'clean','copy','string-replace','watch'
	]);
    
 
}