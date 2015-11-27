(function($){
	"use strict";
	
	$(function(){
		
		var handler=function(){
			console.log('mask click hide');
			basis.mask.hide().off('click');
		}
		
		$('.mask_show').on('click',function(){
			basis.mask.show().on('click',handler);
		});
		$('.mask_hide').on('click',handler);
		
		$('.tip_show').on('click',function(){
			basis.tips.show('测试诗诗诗诗',true);
		});
		$('.tip_hide').on('click',function(){
			basis.tips.hide();
		});
		
		
	});
	
	
	
})(jQuery);
