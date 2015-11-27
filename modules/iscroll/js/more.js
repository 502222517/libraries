(function($){
	"use strcit";
	
	
	var PageView={
		collection:null,
		liTemplate:null,
		options:{
			start:0,
			size:20,
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
			$this.addEvent();
		},
		initScroll:function(){
			var $this=this;
			var myScroll = new LiteScroll('#list-box',{},{
				scrollStart:function(){
					console.log('开始滚动',this.y);
				},
				scrollEnd:function(){
					console.log('结束滚动',this.y);
				}
			});
	
			$this.myScroll=myScroll;
		},
	    fetch:function(start){
			var $this=this;
			$this.options.start= $.isNumeric(start) ? start : $('.data-list>.list-item').length;
			$this.collection.fetch($this.options.start
				,$this.options.size
				,function(records){
				$this.render(records,$this.options.start);
			});
		},
		addEvent:function(){
			var $this=this,myScroll=$this.myScroll;
			
			var scroll=myScroll.getScroll();
			
			scroll.on('scrollStart',function(){
//				console.log('开始滚动',this.y);
			});
			scroll.on('scrollEnd',function(){
//				console.log('滚动结束',this.y);
				
				var loadHeight=100;
				
				if(this.y){
					
				}
				 
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
	}
	
	$(function(){
		PageView.initialize();
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	})
	
	
})(jQuery)
