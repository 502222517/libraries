!function(){"use strict";var a={isWeiXin:function(){var a=window.navigator.userAgent.toLowerCase();return a.indexOf("micromessenger")>-1?!0:!1},setIOSWxTitle:function(a){var b=$("body");document.title=a;var c=$('<iframe src="/favicon.ico"></iframe>').on("load",function(){setTimeout(function(){c.off("load").remove()},1)}).appendTo(b)},getUrlParam:function(a){var b=window.location.search;if("undefined"!=typeof a){var c=new RegExp("[\\?&]"+a+"=([^&#]*)&?",["i"]),d=c.exec(b);return d?d[1]:""}for(var e,f=b.substring(1).split("&"),g={},h=0,i=f.length;i>h;h++)e=f[h].split("="),g[e[0]]=e[1];return g},setUrlParam:function(a,b,c){var d=new RegExp("([\\?&]"+b+"=)([^&#]*)&?",["i"]),e=d.exec(a),f="";return null==e?(f=(a.indexOf("?")>-1?"&":"?")+b+"="+c,a.indexOf("#")>-1?a.replace("#",f+"#"):a+f):a.replace(d,"$1"+c+"&")},get:function(a,b,c,d,e,f){var g=this;g.ajax("get",a,b,c,d,e,f)},post:function(a,b,c,d,e,f){var g=this;g.ajax("post",a,b,c,d,e,f)},ajax:function(b,d,e,f,g,h,i){g||c.show(h,i),$.ajax({type:b,url:d,data:e,dataType:"json",success:function(b){g||c.hide(),"0"==b.code?f&&f(!0,b):(a.tips.show(b.msg).hide(3e3),f&&f(!1,b))},error:function(a,b,d){g||c.hide(),"timeout"==b&&c.show("连接不上服务了，请检查下您的网络!").hide(3e3),f&&f(!1)}})}},b=function(){var a={};return a.$el=$("#mask"),a.$el.length||(a.$el=$('<div id="mask"></div>'),$("body").append(a.$el)),a.eventNames=[],a.show=function(b){return a.$el.fadeIn(b),a},a.hide=function(b){return a.$el.fadeOut(b),a},a.on=function(b,c){return b=b||"click",$.isFunction(c)&&(a.eventNames.push(b),a.$el.on(b,c)),a},a.off=function(b){a.$el.off(b);var c=a.eventNames.indexOf(b);return a.eventNames.splice(c,1),a},a.destroy=function(){for(;a.eventNames.length;)a.$el.off(a.eventNames.shift());return a.hide(),a},a};a.mask=new b;var c={initialize:function(){var a=this;a.el=$("#tips"),a.el.length||(a.el=$("<div id='tips' class='position-middle'><div class='msg-box'><div class='loading-img'></div><div class='msg' id='tips-msg'>加载中...</div></div></div>"),$("body").append(a.el)),a.oTipMsg=a.el.find("#tips-msg"),a.oTipImg=a.el.find(".loading-img")},show:function(a,b){var c=this;return c.initialize(),a&&c.oTipMsg.html(a),b?c.oTipImg.show():c.oTipImg.hide(),c.el.show(),c},hide:function(a){var b=this;return b.initialize(),b.timer&&window.clearTimeout(b.timer),a?b.timer=setTimeout(function(){b.el.hide()},a):b.el.hide(),b}};a.tips=c,window.basis=a}();