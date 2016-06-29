# kBoom
###A javascript lib for shortcut keys




###Usage
    kBoom.bind("test",function(){
    	alert('test')
    });
    
    //or
    
    kBoom.bind({
    	"test":function(){
    		alert('test');
    	},
    	"boom":function(){
    		alert("getBoom");
    	}
    });
    
    //filter elements
    kBoom.filter('body','#demo','.test');


###config

    kBoom.config({
    	intv:500, //frequency(ms),default 500
    	max:10,//max length of keycode,default 10
    	shift:false //need shift key,default false
    });

