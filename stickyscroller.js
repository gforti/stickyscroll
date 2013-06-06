var stickyScroll = function() {
  					
	//Private properties   
	var properties = {
		singletonInstance: null     
	};

	//Private Methods
	var methods = {
		$ : function(id) { 
			var elem = null;
			if( this.oType( id ) == "string" ) {
				elem = document.getElementById( id ); 
				// IE needs this extra check to return the ID and not the name of an element it finds.
				elem = (elem && elem.id && elem.id == id ? elem : null);						
			}
			return elem;
		},
		oType: function (o) {
			var objTypes = [], types = "Boolean Number String Function Array Date RegExp Object".split(" ");	
			for (var i = 0, l = types.length; i < l; i++)				
				objTypes[ "[object " + types[i] + "]" ] = types[i].toLowerCase();					
			return objTypes[ Object.prototype.toString.call(o) ] || "object";
		},
		Event: {
			add: function (obj, evt, fn) {
				if (!obj) return false;
				if (obj.addEventListener) {
					obj.addEventListener(evt, fn, false);
				} else if (obj.attachEvent) {
					obj.attachEvent('on' + evt, fn);
				}
				return this;
			}
		},			
		getPosition: function (id) {
			var obj = this.$(id), x = y = a = b = null;				
			if(obj) {
				var objSize = this.size(id);
				if (obj.offsetParent) {
					x =  parseInt(obj.offsetLeft, 10);
					y =  parseInt(obj.offsetTop, 10);
					while (obj = obj.offsetParent) {
						x +=  parseInt(obj.offsetLeft, 10);
						y +=  parseInt(obj.offsetTop, 10);
					}
				}						
				a = Math.round(x+objSize.width);
				b = Math.round(y+objSize.height);					
			}
			return { left: x, top: y, right: a, bottom: b };
		},
		size: function (id) {
			var obj = this.$(id), w = h = null;
			if(obj) {
				if (obj.offsetHeight && obj.offsetWidth) {
					w = parseInt(obj.offsetWidth, 10);
					h = parseInt(obj.offsetHeight, 10);
				}
			}
			return { width: w, height: h };
		},
		place: function (id, x, y) {
			var obj = this.$(id)
			if( obj && obj.style ) {					
				if ( this.oType(x) == "number" ) obj.style.left = parseInt( x, 10 )+"px";
				if ( this.oType(y) == "number" ) obj.style.top = parseInt( y, 10 )+"px"; 
			}
			return this;
		},
		page : {
			width:function(){return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; },
			height:function(){return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; },
			left: function () {return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft ||  0; }, 
			top: function () {return window.pageYOffset ||  document.documentElement.scrollTop || document.body.scrollTop || 0; } ,
			scrollWidth: function() { return Math.max(Math.max(document.body.scrollWidth,document.documentElement.scrollWidth), this.width()); },
			scrollHeight: function() { return Math.max(Math.max(document.body.scrollHeight,document.documentElement.scrollHeight), this.height()); }
		},	
		setScrollLeftPosition : function ( scrollerID, rightOfID ) {
			var rightOfPos = this.getPosition(rightOfID);
			var obj = this.$(scrollerID);
			
			if( obj && obj.style ) {
				obj.style.position =  "absolute";
				this.place( scrollerID, parseInt(rightOfPos.right+10,10));							
			}
			return this;			
		},
		setScrollPosition: function ( scrollerID, rightOfID, limitID ) {
			var limitPos = this.getPosition(limitID),
				rightOfPos = this.getPosition(rightOfID),
				limitPosBottom = ( this.oType(limitPos.top) == "number" ? limitPos.top : ( this.oType(rightOfPos.bottom) == "number" ? rightOfPos.bottom : this.page.scrollHeight() ) ),					
				scrollerElem = this.$(scrollerID),
				scrollerElemHeight = this.size(scrollerID).height,
				bottomTop = parseInt(limitPosBottom-scrollerElemHeight,10),
				setPos = 0;
		
			this.setScrollLeftPosition(scrollerID, rightOfID);
			
			if ( this.page.top() > bottomTop ) {									
				setPos = (bottomTop-10);															
			} else if ( rightOfPos.top <= this.page.top() ) {
				
				if ( this.page.scrollWidth() == this.page.width() ) {								
					scrollerElem.style.position =  "fixed";
					setPos = 10;
				} else {
					setPos = ( this.page.top()+10 );								
				}
			} else {
				if ( this.page.scrollWidth() == this.page.width() ) {
					scrollerElem.style.position =  "fixed";
					setPos = (rightOfPos.top-this.page.top());
				} else {
					setPos = rightOfPos.top;
				}
			}
						
			return this.place( scrollerID, null, setPos );
		},	
		// Get the instance of the class.
		getInstance: function () {
			if (null === properties.singletonInstance) {                   
				properties.singletonInstance = _createInstance();
			}
			return properties.singletonInstance;
		}
	};

	var _createInstance = function () {
		return {
			setScrollPosition : function( scrollerID, rightOfID, limitID ) {
				return methods.setScrollPosition( scrollerID, rightOfID, limitID );
			},
			observe : function( scrollerID, rightOfID, limitID ) {
				methods.Event.add(window, "resize", function(){ stickyScroll.setScrollPosition( scrollerID, rightOfID, limitID ); });
				methods.Event.add(window, "scroll", function(){ stickyScroll.setScrollPosition( scrollerID, rightOfID, limitID ); });					
				methods.Event.add(window, "load", function(){ stickyScroll.setScrollPosition( scrollerID, rightOfID, limitID ); });
			}
		};
	};

	return methods.getInstance();				
	
}();
