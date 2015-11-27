/*
 * 精简版的IScroll，适合移动端
 */
(function($,IScroll){
	'use strict';
	
	var liteConfig={
		isEmptyScroll:true, // 为空的区域是否也可以拖拽
		listEl:'.scroll-main', // list 容器
		listItemEl:'.scroll-item' // list item 容器
	}
	
	var defaultConfig={
		useTransition: true,
	    momentum: true, //惯性滑动
	    bounce:true
	    
//	    scrollbars: true,
//		mouseWheel: true,
//		interactiveScrollbars: true,
//		shrinkScrollbars: 'scale',
//		fadeScrollbars: true
	}
	
	var LiteScroll=function(el,config,liteCfg){
		var $this=this;
		$this.initialize.call($this,el,config,liteCfg);
	}
	LiteScroll.prototype={
		initialize:function(el,config,liteCfg){
			var $this=this;
			var conf=$this.config=$.extend({},defaultConfig,config);
			var cfg=$this.cfg=$.extend({},liteConfig,liteCfg);
			var tag=$(el);
			$this.$el=tag;
			
			$this.scroll=new IScroll(tag[0],conf);
			window.scroll=$this.scroll;
			$this.addEvent();
			$this.change();
		},
		getScroll:function(){
			var $this=this;
			return $this.scroll;
		},
		addEvent:function(){
			var $this=this
			,scroll=$this.scroll;
			 
		},
		change:function(){
			var $this=this
			
			if($this.cfg.isEmptyScroll){
				$this.adapt();	
			}
			$this.refresh();
		},
		refresh:function(){
			var $this=this;
			
			$this.scroll.refresh();
		},
		adapt:function(){ //自动适应整个区域
			var $this=this;
			var tag=$($this.cfg.listEl,$this.$el);
			var items=$($this.cfg.listItemEl,tag);
			var scrollHeight=$this.$el.height();
			var boxHeight=tag.height();
			var h=0;
			for(var i=0,len=items.length;i<len;i++){
				h+=items.eq(i).outerHeight();
			}
			if(scrollHeight>h){
				tag.css('height',scrollHeight+1);
			}else{
				tag.css('height','auto');
			}
		}
	}
	
	
	
	
	window.LiteScroll=LiteScroll;
})(jQuery,IScroll);