var Home = (function(){
	var that = this,
	_maxDistance = 4.0,
	_xRange = [2.2, -2.2],
	_scrollSpeed = 100,
	_resetTime = 40000,
	_resetId = -1,
	_lastTrackingId = null,
	_firstTouch = false,
	_elements = {
		html: $("html"),
		body: $("body"),
		index: $(".index"),
		back: $(".back"),
		forward: $(".forward"),
		movingElement: $("#moving-element"),
		qr: $("#generate-qr"),
		touch: $(".tap-container")
	};

	var init = function(){
		$(document).foundation();
		_elements.body.on({
		    'mousewheel': function(e) {
		        if (e.target.id == 'el'){
		        	return;
		        }
		        e.preventDefault();
		        e.stopPropagation();
		    },
		    'touchmove': function(e){
		    	if(e.target.id == 'article-detail-description'){
		    		return;
		    	}
		    	e.preventDefault(); 
		    	e.stopPropagation();
		    },
		    onmousedown: function(e){
		    	if(e.button == 2){
		    		return false;
		    	}
		    }
		});
		$(document).on("newDistance", onKinect);
		_elements.back.click(function(event) {
			var stateDOM = $(this).parents("div[class^='state']");
			var currentState = parseInt(stateDOM.attr('class').replace(/state-/i, ""));
			changeToState(currentState - 1);
		});
		_elements.forward.click(function(event) {
			var stateDOM = $(this).parents("div[class^='state']");
			var currentState = parseInt(stateDOM.attr('class').replace(/state-/i, ""));
			changeToState(currentState + 1);
		});
		_elements.qr.click(function(event) {
			
		});
		_elements.html.click(function(event) {
			setTimer();
			FileWriter.write({
                qr: 1,
                trackingId: _lastTrackingId
            });
		});
	},
	onKinect = function(event, data){
		console.log(data);
		var isInteractive = _elements.index.hasClass('interactive');
		switch(data.section){
			case "CLOSEST":
				_lastTrackingId = data.trackingId;
				if(isInteractive){
					changeToState(4);
				}
				break;
			case "CLOSE":
				_lastTrackingId = data.trackingId;
				if(isInteractive){
					changeToState(3);
				}
				break;
			case "FAR":
				_lastTrackingId = data.trackingId;
				if(isInteractive){
					changeToState(2);
				}
				break;
			case "FAREST":
				_lastTrackingId = data.trackingId;
				if(isInteractive){
					// reset horizontal scroll
					changeToState(1);
				}
				break;
			default:
				noSkeleton();
		}
	},
	changeToState = function(state){
		if(_.isNaN(state) || state < 1){
			return;
		}else{
			if(_elements.index.hasClass('interactive')){
				_elements.index.attr("class", "index interactive" + " change-to-state-" + state);
			}else{
				_elements.index.attr("class", "index" + " change-to-state-" + state);
			}
			if(state == 3 && _firstTouch == false){
				_elements.touch.addClass('visible');
				_firstTouch = true;
			}
			if(state == 2 || state == 1){
				$("#slider").slider("value", 0);
			}
		}
		setTimer();
	},
	clearStates = function(){
		$(".reveal-modal").foundation('reveal', 'close');
		if(_elements.index.hasClass('interactive')){
			_firstTouch = false;
			_elements.index.attr("class", "index interactive");
		}else{
			_elements.index.attr("class", "index");
		}
	},
	clearTimer = function(){
		if(_resetId > 0){
			window.clearTimeout(_resetId);
			_resetId = -1;
		}
	},
	setTimer = function(){
		clearTimer();
		_resetId = window.setTimeout(clearStates, _resetTime);
	},
	noSkeleton = function(){
		if(_resetId <0){
			setTimer();
		}
	},
	changeInteractivity = function(){
		if(_elements.index.hasClass('interactive')){
			window.location.href = "index.php";
		}else{
			window.location.href = "index.php?interactive=true";
		}
	};

	return {
		init: init,
		changeToState: changeToState,
		clearStates: clearStates,
		changeInteractivity: changeInteractivity,
		elements: _elements
	};
})();

Home.init();