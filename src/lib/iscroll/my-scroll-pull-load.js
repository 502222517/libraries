/* 
 * title: scroll 上拉刷新、下拉加载更多数据扩展
 * email：502222517@qq.com
 * api:  
 * var myScroll = new PullScroll('#list-box',config,loadConfig);
 *     config => iscroll config ,如：momentum，useTransition，probeType 等配置
 *     loadConfig => PullScroll config ,包含如下：
 *     {
 * 	    hasPullUp： 是否支持上拉加载，默认true
 *      hasPullDown： 是否支持下拉加载 ，默认true
 *      listEl: list 容器样式或id
 *      listItemEl： list-item 样式或id
 *     }
 * demo：
 * var myScroll = new PullScroll('#list-box', { 
 *				useTransition: false
 *			},{
 *			    hasPullDown:false, // 不可以下拉刷新
 *				prevPage:function(){
 *					console.log('prevPage');
 *					$this.fetch(0);
 *				},
 *				nextPage:function(){
 *					console.log('nextPage');
 *					$this.fetch();
 *				}
 *			});	
 *   
 */
(function($,IScroll){
	"use strict";
	
	var defaultConfig={
		/*
		 * 这个属性必须是iscroll-probe.js 才有效，比较消耗性能
		 * probeType：1对性能没有影响。在滚动事件被触发时，滚动轴是不是忙着做它的东西。
		 * probeType：2总执行滚动，除了势头，反弹过程中的事件。这类似于原生的onscroll事件。
		 * probeType：3发出的滚动事件与到的像素精度。注意，滚动被迫requestAnimationFrame（即：useTransition：假）。
		 */
		probeType:2,
//		disablePointer:true, // 是否关闭指针事件探测
		useTransition: true,
	    momentum: true, //惯性滑动
	    bounce:true, //
	    startY:0,
		t:'2015-11-03'
	}
	var defaultLoadCfg={
		isEmptyScroll:true, // 为空的区域是否也可以拖拽
		hasPullUp:true,    //  是否包含上拉加载更多
		hasPullDown:true,  //  是否包含下拉刷新
		pullHeight:50,    // 触发加载高度
		upElHeight:0,     // 上拉提示条高度 
		downElHeihgt:0,   // 下拉提示条高度
		downText:'下拉刷新数据',
		downLoadText:'释放加载上一页',
		upText:'上拉加载更多',
		upLoadText:'释放加载下一页',
		loadingText:'加载中。。。',
		listEl:'.scroll-main', // list 容器
		listItemEl:'.scroll-item', // list item 容器
		canScrollMore:function(){
			return true;
		},
		prevPage:function(){ console.log('prevPage'); },
		nextPage:function(){ console.log('nextPage'); } 
	}
	
	var PullScroll=function(el,config,loadCfg){
		var $this=this;
		$this.initialize.call($this,el,config,loadCfg);
	}
	// 
	PullScroll.prototype={
		/*
		 * 加载状态0默认，1准备加载状态，2执行加载数据，
		 * 为2时不能再次加载，这是防止过快拉动刷新
		 */
		loadingStep:0,
		initialize:function(el,config,loadCfg){
			var $this=this;
			var conf=$this.config=$.extend({},defaultConfig,config);
			var cfg=$this.cfg=$.extend({},defaultLoadCfg,loadCfg);
			
			var tag=$(el);
			$this.$el=tag;
			$this.pullDownEl=$('.pullDown',tag);
			$this.pullDownLabel=$('.pullDownLabel',$this.pullDownEl);
			$this.pullUpEl=$('.pullUp',tag);
			$this.pullUpLabel=$('.pullUpLabel',$this.pullUpEl);
			// 
			$this.pullUpLabel.html(cfg.upText);
			$this.pullDownLabel.html(cfg.downText);
			// 包含下拉刷新,更改初始Y轴坐标
			if(cfg.hasPullDown){
				cfg.downElHeihgt=$this.pullDownEl.outerHeight();
				conf.startY=-cfg.downElHeihgt;
//				cfg.pullHeight= conf.startY+cfg.pullHeight;
			}else{
				$this.pullDownEl.addClass('hide');
			}
			// 包含上拉加载更多提示条
			if(cfg.hasPullUp){
				cfg.upElHeight=$this.pullUpEl.outerHeight();
			}else{
				$this.pullUpEl.addClass('hide');
			}
			
			$this.scroll=new IScroll(tag[0],conf);
//			window.scroll=$this.scroll;
			$this.addEvent();
			// 
			$this.change();
			$this.pullDownEl.removeClass('hidden');
			$this.pullUpEl.removeClass('hidden');
		},
		addEvent:function(){
			var $this=this
			,scroll=$this.scroll
			,cfg=$this.cfg
			,conf=$this.config;
			// 开始滚动
			scroll.on('scrollStart',function(){
//				console.log('开始滚动',this.y);
			});
			
			// 滚动中
			scroll.on('scroll',function(){
//				console.log('scroll',this.y)
				// 非加载状态
				var flag=$this.loadingStep != 2 && !$this.pullDownEl.attr('class').match('loading') && !$this.pullUpEl.attr('class').match('loading');
				if(!flag) return ;
				// 下拉
				if(this.y>conf.startY){
					if(!cfg.hasPullDown) return; //不可下拉刷新
					if (this.y >(conf.startY+cfg.pullHeight)) { // 触发下拉刷新
//						console.log(this.y,' 触发下拉刷新:'+cfg.pullHeight);
					 	$this.pullDownEl.addClass('flip');
					 	$this.pullDownLabel.html(cfg.downLoadText);
					 	$this.loadingStep = 1;
					}else{
//						console.log(this.y,' 未触发下拉刷新:'+cfg.pullHeight);
						$this.pullDownEl.removeClass('flip');
						$this.pullDownLabel.html(cfg.downText);
						$this.loadingStep = 0;
					}
				}else{ // 上拉
					if(!cfg.hasPullUp) return; //不可上拉加载更多
					// 判断是否拖动到可以加载条件
					if(this.y < (this.maxScrollY + cfg.upElHeight - cfg.pullHeight)){ // 触发上拉加载更多数据
						//先判断是否可以加载更多数据
					 	if(!cfg.canScrollMore()){ 
					 		// 没有数据可提供加载
//					 		console.log('没有数据可提供加载');
					 		return; 
					 	}
	                    //上拉加载更多数据
	                    $this.pullUpEl.addClass('flip');
	                    $this.pullUpLabel.html(cfg.upLoadText);
	                    $this.loadingStep = 1;
//	                    console.log(this.y,' 触发上拉刷新（more）:'+cfg.pullHeight);
					}else{
						$this.pullUpEl.removeClass('flip');
	                    $this.pullUpLabel.html(cfg.upText);
	                    $this.loadingStep = 0;
//	                	console.log(this.y,' 未触发上拉刷新（more）:'+cfg.pullHeight);
					}
				}
			});
			// 滚动结束
			scroll.on('scrollEnd',function(){
				if($this.loadingStep==0){
					$this.reset();
				    return ;
				}else if($this.loadingStep==1){
					// 上拉
					if($this.pullUpEl.hasClass('flip')){
						$this.pullUpEl.removeClass('flip').addClass('loading');
						$this.pullUpLabel.html(cfg.loadingText);
						$this.loadingStep = 2;
						cfg.nextPage();
					}else if($this.pullDownEl.hasClass('flip')){ // 下拉
						$this.pullDownEl.removeClass('flip').addClass('loading');
						$this.pullDownLabel.html(cfg.loadingText);
						$this.loadingStep = 2;
						cfg.prevPage();
					}
				}
//				console.log('滚动结束',this.y);
			});
		},
		reset:function(){ // 重置滚动条设置
			var $this=this
			,scroll=$this.scroll
			,cfg=$this.cfg
			,conf=$this.config;
			
			$this.loadingStep=0;
			$this.pullUpEl.removeClass('flip').removeClass('loading');
			$this.pullUpLabel.html(cfg.upText);
			$this.pullDownEl.removeClass('flip').removeClass('loading');
		    $this.pullDownLabel.html(cfg.downText);
//		    console.log('one ',scroll.y,conf.startY);
		    if(scroll.y>conf.startY){
		    	$this.scrollTo(0,conf.startY);	
		    }else{
		    	var maxScrollY=scroll.maxScrollY+cfg.upElHeight;
//		    	 console.log('maxScrollY ',scroll.y,scroll.maxScrollY,maxScrollY);
		    	if(scroll.maxScrollY !=0 && scroll.y<(maxScrollY)){
			    	$this.scrollTo(0,maxScrollY);	
			    }
		    }
		},
		change:function(){
			var $this=this;
			$this.reset();
			if($this.cfg.isEmptyScroll){
				$this.adapt();	
			}
			$this.refresh();
		},
		scrollTo:function(x,y,time,easing){
			var $this=this,scroll=$this.scroll;
			time= $.isNumeric(time) || scroll.options.bounceTime;
			easing= easing || scroll.options.bounceEasing;
			scroll.scrollTo(x, y,time,easing); 	
		},
		refresh:function(){
			var $this=this;
			
			$this.scroll.refresh();
		},
		adapt:function(){ //自动适应整个区域
			var $this=this;
	  	  	var tag=$($this.cfg.listEl,$this.$el);
	  	  	var scrollHeight=$this.$el.height();
	  	  	tag.css('height','auto');
	  	  	var boxHeight=tag.height();
	  	  	
	  	  	if(scrollHeight>boxHeight){
				tag.css('height',scrollHeight+1);
			}else{
				tag.css('height','auto');
			}
			// end
		}
	}
	
	window.PullScroll=PullScroll;
	
})(jQuery,IScroll);


