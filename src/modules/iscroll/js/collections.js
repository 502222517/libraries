var Collections=function(total){
		var $this=this;
		var records=[];
		// 
		total = total || 500;
		for(var i=0;i<total;i++){
			records.push({
				id:i+1,
				title:'这是第'+(i+1)+'行',
				time:'2015-11-02 11:41'
			});
		}
		
		$this.fetch=function(start,size,callback){
			size = size>total ? total:size;
			
			setTimeout(function(){
				callback && callback(records.slice(start,start+size));
			},500);
		 
		}
	}