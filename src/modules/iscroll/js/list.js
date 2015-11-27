(function($){
	'use strict';
	 
	
	var PageView={
		collection:null,
		liTemplate:null,
		options:{
			start:0,
			size:50,
			total:0
		},
		initialize:function(){
			var $this=this;
			var total=1000;
			$this.options.total=total;
			$this.collection=new Collections(total);
			$this.liTemplate=_.template($('#li-template').html())
			$this.initScroll();
			$this.fetch();
		},
		initScroll:function(){
			var $this=this;
			
			var myScroll = new PullScroll('#list-box', { 
				useTransition: true
			},{
//				hasPullDown:false, // 不可以下拉刷新
//				hasPullUp:false,   // 不可以拉加载更多
				prevPage:function(){
					console.log('prevPage');
					$this.fetch(0);
				},
				nextPage:function(){
					console.log('nextPage');
					$this.fetch();
				}
			});
			
			$this.myScroll=myScroll;
		},
		addEvent:function(){
			var $this=this;
			
		},
		fetch:function(start){
			var $this=this;
			$this.options.start= $.isNumeric(start) ? start : $('.data-list>.list-item').length;
			$this.collection.fetch($this.options.start
				,$this.options.size
				,function(records){
				$this.render(records,$this.options.start);
//				console.log('加载数据，并渲染完成！',$this.options.start,records);
			});
		},
		render:function(records,isAppend){
			var $this=this;
			var _html= $this.liTemplate({records:records});
			var tag=$('.data-list');
			if(!isAppend){
				tag.empty()	
			}
			tag.append(_html);
			$this.change();
		},
		change:function(){
			var $this=this;
			$this.myScroll.change();
		}
	};
	 
	
	$(function(){
		PageView.initialize();
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	})
	
})(jQuery);
