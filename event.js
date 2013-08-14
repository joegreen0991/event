/**
* Cross browser event handling
 */

var Event = function(window,document){

	var Cache = {
		cache : {},
		store : function( elem, type, handler ){
			if(!Cache.cache[type]){
				Cache.cache[type] = [];
			}
			Cache.cache[type].push([elem, type]);
		},
		get : function( elem, type ){
			if(!Cache.cache[type]){
				return false;
			}
			for(var i = 0; i < Cache.cache.length; i++){
				if(Cache.cache[type][i][0] === elem) return type;
			}
		}
	};

	var Exports = {
		unbind : function() {  
			if ( document.removeEventListener ) {  
				return function( elem, type, handler ) {  
					if ( (elem && !elem.length) || elem === window ) {  
						var handler = handler || Cache.get(elem, type);
						elem.removeEventListener(type, handler, false );  
					}  
					else if ( elem && elem.length ) {  
						var len = elem.length;  
						for ( var i = 0; i < len; i++ ) {  
							Exports.removeEvent( elem[i], type );  
						}  
					}  
				};  
			}  
			else if ( document.detachEvent ) {  
				return function ( elem, type, handler ) {  
					if ( (elem && !elem.length) || elem === window ) {  
						var handler = handler || Cache.get(elem, type);
						elem.detachEvent( 'on' + type, handler );  
					}  
					else if ( elem.length ) {  
						var len = elem.length;  
						for ( var i = 0; i < len; i++ ) {  
							Exports.removeEvent( elem[i], type );  
						}  
					}  
				};  
			}  
		}(),

		bind : function() {  
			if ( document.addEventListener ) {  
				return function( elem, type, handler ) {  
					if ( (elem && !elem.length) || elem === window ) { 
						Cache.store( elem, type, handler );
						elem.addEventListener(type, handler, false );  
					}  
					else if ( elem && elem.length ) {  
						var len = elem.length;  
						for ( var i = 0; i < len; i++ ) {  
							Exports.addEvent( elem[i], type, handler );  
						}  
					}  
				};  
			}  
			else if ( document.attachEvent ) {  
				return function ( elem, type, handler ) {  
					if ( (elem && !elem.length) || elem === window ) {  
						Cache.store( elem, type, handler );
						elem.attachEvent( 'on' + type, function() { return handler.call(elem, window.event) } );  
					}  
					else if ( elem.length ) {  
						var len = elem.length;  
						for ( var i = 0; i < len; i++ ) {  
							Exports.addEvent( elem[i], type, handler );  
						}  
					}  
				};  
			}  
		}(),
		hover : function(el, inCallback,outCallback){
		
			var inFunc = function(event){

				Exports.one(el,'mouseout',outFunc);
				inCallback && inCallback(event);
			};

			var outFunc = function(event){

				Exports.one(el,'mouseover',inFunc);
				outCallback && outCallback(event);
			};

			Exports.one(el,'mouseover',inFunc);

		},
		one : function(el,type,callback){
		
			var inFunc = function(event){
				Exports.unbind(el,type,inFunc);
				callback && callback(event);
			};

			Exports.bind(el,type,inFunc);

		}
	};

	var bindings = ['blur','change','click','dblclick','focus','keydown','keypress','keyup','load','mousedown','mouseenter','mouseleave','mouseover','mouseout','mouseup','resize','scroll','submit'];

	for(var i = 0; i < bindings.length; i++){
		(function(i){
			Exports[bindings[i]] = function(element,handler){
				return Exports.bind(element, bindings[i],handler);
			};
		})(i);
	}

	return Exports;

}(window,document);
