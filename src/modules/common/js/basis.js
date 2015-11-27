(function(){
	'use strict';
	var basis={
		isWeiXin:function(){
			var ua = window.navigator.userAgent.toLowerCase();
			if(ua.indexOf("micromessenger")>-1){
				return true;
			}else{
				return false;
			}
		},
		setIOSWxTitle:function(title){  // 解决Ios系统，微信网页title不能重新设置
			var $body = $('body');
				document.title = title;
			// hack在微信等webview中无法修改document.title的情况
			var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
			        setTimeout(function(){
			        $iframe.off('load').remove()
			        }, 1);
			}).appendTo($body);
		},
		getUrlParam:function(name){  //获取url参数
	        var paramsText= window.location.search;
	        if(typeof name !=='undefined'){
	            var regex = new RegExp("[\\?&]"+name+"=([^&#]*)&?",["i"]);
	            var qs = regex.exec(paramsText);
	            return qs ? qs[1] : '';
	        }
	        //获取所有参数
	        var arrs=paramsText.substring(1).split('&'),param={},items;
	        for(var i= 0,len=arrs.length;i<len;i++){
	            items=arrs[i].split('=');
	            param[items[0]]=items[1]
	        }
	        return param;
	   },
	   setUrlParam:function(url,name,value){  //设置url参数 存在替换，不存在添加
            var regex = new RegExp("([\\?&]"+name+"=)([^&#]*)&?",["i"])
                ,match = regex.exec(url)
                ,temp='',index=-1;

                if(match == null)
                {
                    temp=(url.indexOf('?')>-1 ? '&':'?')+name+'='+value;
                    return url.indexOf('#')>-1 ? url.replace('#',temp+'#') :url+temp;
                }
                else
                {
                   return url.replace(regex,'$1' + value + '&');
                }
       },
       get:function(url,data,callback,noTip,tipMsg,showImg){
       		var $this=this;
	   		$this.ajax('get',url,data,callback,noTip,tipMsg,showImg);
       },
	   post:function(url,data,callback,noTip,tipMsg,showImg){
	   		var $this=this;
	   		$this.ajax('post',url,data,callback,noTip,tipMsg,showImg);
	   },
	   ajax:function(httpType,url,data,callback,noTip,tipMsg,showImg){
	   		var $this=this;
	   		if(!noTip) tips.show(tipMsg,showImg);
	   		
	   		$.ajax({
	   			type:httpType,
	   			url:url,
	   			data:data,
	   			dataType:'json',
	   			success:function(res){
	   				if(!noTip) tips.hide();
	   				if(res.code=='0'){
						callback && callback(true,res);
					}else{
						basis.tips.show(res.msg).hide(3000);
						callback && callback(false,res);
					}
	   			},
	   			error:function(jqXHR,textStatus,errorThrown ){
	   				if(!noTip) tips.hide();
	   				// 超时处理
		    		if(textStatus=='timeout'){
		    			tips.show('连接不上服务了，请检查下您的网络!').hide(3000)
		    		}
					callback && callback(false);
				}
	   		});
	   }
	}
	
	
	// mask
	var Mask=function(){
		var $this={};
		$this.$el=$('#mask');
		if(!$this.$el.length){
			$this.$el=$('<div id="mask"></div>');
			$('body').append($this.$el);
		}
		$this.eventNames=[];
		
		$this.show=function(during){
			$this.$el.fadeIn(during);
			return $this;
		}
		$this.hide=function(during){
			$this.$el.fadeOut(during);
			return $this;
		}
		// 绑定事件 click
		$this.on=function(eventName,handler){
			eventName =eventName || 'click';
			if($.isFunction(handler)){
				$this.eventNames.push(eventName);
				$this.$el.on(eventName,handler);
			}
			return $this;
		}
		// 移除事件
		$this.off=function(eventName){
			$this.$el.off(eventName);
			var index=$this.eventNames.indexOf(eventName);
			$this.eventNames.splice(index,1);
			return $this;
		}
		// 恢复为初始化状态
		$this.destroy=function(){
			// 移除事件
			while($this.eventNames.length){
				$this.$el.off($this.eventNames.shift());
			}
			$this.hide();
			return $this;
		}
		
		return $this;
	}
	
	basis.mask=new Mask();
	 
	var tips={
		initialize:function(){
			var $this=this;
			$this.el=$('#tips');
			if(!$this.el.length){
				$this.el=$("<div id='tips' class='position-middle'><div class='msg-box'><div class='loading-img'></div><div class='msg' id='tips-msg'>加载中...</div></div></div>");
				$('body').append($this.el);
			}
			$this.oTipMsg = $this.el.find('#tips-msg');
    		$this.oTipImg = $this.el.find('.loading-img');
		},
		show:function(msg,showImg){
			var $this=this;
			$this.initialize();
			msg && $this.oTipMsg.html(msg);
			showImg ? $this.oTipImg.show() : $this.oTipImg.hide();
			$this.el.show();
			return $this;
		},
		hide:function(delay){
			var $this=this;
			$this.initialize();
			if($this.timer){
				window.clearTimeout($this.timer);				
			}
			if(delay){
				$this.timer=setTimeout(function(){
		    		$this.el.hide();
		    	},delay);
		    }else{
		    	$this.el.hide();
		    }
			return $this;
		}
	}
	
	basis.tips=tips;
	
	window.basis=basis;
})();


