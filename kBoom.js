(function(window,undefined){
	var intv = 500,
		events = {},
		filters = [],
		lastTime = 0,
        maxLen = 10,//max lengths of record
        needFilter = true,
        needShift = false,
		record = "",
        startInput = null,
        inputing = null;
	var getType = function(v){
		return ({}).toString.call(v).match(/^\[object (\w+)\]$/)[1].toLowerCase();
	};
	var matches = function(el, selector) {
        try{
            return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
        }catch(e){
            console.warn(e);
            return false;
        }
	};
    document.addEventListener('keyup',function(e){
        if((/^[^A-Za-i\d`]$/).test(String.fromCharCode(e.keyCode)) || needShift && !e.shiftKey || needFilter && filters.some(function(sl){return matches(e.target,sl)})){
            record = "";
            return;
        }
        var curT = new Date-0,
            curK = e.code.replace("Key","").replace("Numpad","").replace("Digit","");
        if(record.length === 0 || record.length > maxLen || curT-lastTime>intv){ //record the first keycode
            startInput && startInput(e);
            record = curK;
        }else{
            inputing && inputing(e);
            record += curK  
        }
        lastTime = curT;
        if(record in events){
            events[record](e);
            record = "";
        }
    });
	var $ = {
		config:function(op){
            intv = isNaN(parseInt(op["intv"])) ? intv : parseInt(op["intv"]);
            maxLen = isNaN(parseInt(op["max"])) ? intv : parseInt(op["max"]);
			needFilter = op["filter"] !== undefined ? op["filter"] : needFilter;
            needShift = op["shift"] !== undefined ? op["shift"] : needShift;
            getType(op['event']) === 'object' && this.bind.call(this,op['event']);
            if(getType(op['filter']) === 'string'){
                this.filter.call(this,op['filter']);
            }else if(getType(op['filter']) === 'array'){
                this.filter.apply(this,op['filter']);
            }
            return this;
		},
		bind:function(key,fn){
            if(getType(key)==='string'){
                events[key.trim().toUpperCase()] = fn;
            }else if(getType(key)==='object'){
				for(var k in key){
					getType(k)==='string' &&  getType(key[k])==='function' && (events[k.trim().toUpperCase()] = key[k]);
				}
                return this;
			}
            return events;
		},
        filter:function(){
            if(arguments.length){
                for(var i=0,l=arguments.length;i<l;i++){
					getType(arguments[i])==='string' && 
					filters.push(arguments[i].trim());
				}
                return this;
            }
            return filters;
		},
		unbind:function(){
            for(var i=0,l=arguments.length;i<l;i++){
                getType(arguments[i])==='string' && delete events[arguments[i].trim().toUpperCase()];
            }
            return this;
		},
		unfilter:function(){
            for(var i=0,l=arguments.length;i<l;i++){
                if(getType(arguments[i])==='string'){
                    var index = filters.indexOf(arguments[i].trim());
                    index !== -1 && filters.splice(index,1)
                } 
            }
            return this;
		},
        onStartInpt:function(fn){
            startInput = getType(fn)==='function' ? fn : null;
            return this;
        },
        onInputing:function(fn){
            inputing = getType(fn)==='function' ? fn : null;
            return this;
        }
	};
	window.kBoom !== undefined && ($._kBoom = window.kBoom);
	window.kBoom = $;
})(window);