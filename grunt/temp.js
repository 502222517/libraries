
 

window.onload=function(){
	var htmlFile='<title>js-libraries</title> <link rel="stylesheet" href="modules/common/css/basis.css#share" /> <link rel="stylesheet" href="modules/app/css/index.css?a=3&v=1#share" /><script type="text/javascript" src="temp.js"></script></head>';
	var cssFile='.test{background: url(../../app/images/d_01.jpg) no-repeat;}.test2{background: url(../../app/images/w_01.jpg) no-repeat;}';
	window.htmlFile=htmlFile;
	
	
	
	var resText=Cache.htmls(htmlFile);
	
	var cssText= Cache.setMulVersion(cssFile,Cache.regexs.img);
	console.log('res',[resText,cssText]);
}



	