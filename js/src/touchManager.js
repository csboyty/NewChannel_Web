var ZY=ZY||{};
ZY.touchManager=(function(){
	var lockedDraggable=null;
    var prevPoint={x:0,y:0};
    var offsetPoint={x:0,y:0}; 
    var vTracker=null;
	var touchStartEvt;
	var touchMoveEvt;
	var touchEndEvt;	
	
	//私有函数
	//IE pointers
	var onPointerDown=function(evt){			
		offsetPoint={x:0,y:0};			
		TweenLite.killTweensOf(throwPoint);
		prevPoint={x:evt.screenX,y:evt.screenY};
		vTracker=VelocityTracker.track(prevPoint, "x,y");

		//绑定事件处理
		document.addEventListener(touchMoveEvt,onPointerMove);
		document.addEventListener(touchEndEvt,onPointerUp);
	};
	var onPointerMove=function(evt){
		//scroll被禁用
		if (!this.enableScrolling){
			return false;
		}
		//更新值
		offsetPoint.x=evt.screenX-prevPoint.x;
		offsetPoint.y=evt.screenY-prevPoint.y;
		prevPoint={x:evt.screenX,y:evt.screenY};
		//判断dragFlag，在touchTest开始后只会检查一次
		if(this.dragFlag=="NONE"){
			if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)>0){
			this.dragFlag="PAN"
			this.enableScrolling=false
			}else if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)<0){
			this.enableScrolling=false
			this.dragFlag="SCROLL"
			}
		}			
		if(this.dragFlag=="SCROLL"){
			window.scrollBy(0,-offsetPoint.y);
			return false
		}
	};
	var onPointerUp=function(evt){
		//获取throwPoint
		this.throwPoint.x=vTracker.getVelocity("x")/100;
		this.throwPoint.y=vTracker.getVelocity("y")/100;
		this.dragFlag="NONE"
		VelocityTracker.untrack(prevPoint)
		vTracker=null;
		this.resumeDrag();
		this.enableScrolling=true;
		
		document.removeEventListener(touchMoveEvt,onPointerMove);
		document.removeEventListener(touchEndEvt,onPointerUp);
	};
	//general Touchs
	var onTouchStart=function(evt){			
		offsetPoint={x:0,y:0};			
		TweenLite.killTweensOf(throwPoint);
		prevPoint={x:evt.touchs[0].screenX,y:evt.touchs[0].screenY};
		vTracker=VelocityTracker.track(prevPoint, "x,y");

		//绑定事件处理
		document.addEventListener(touchMoveEvt,onTouchMove);
		document.addEventListener(touchEndEvt,onTouchEnd);
	};
	var onTouchMove=function(evt){
		//scroll被禁用
		if (!this.enableScrolling){
			return false;
		}
		//更新值
		offsetPoint.x=evt.touchs[0].screenX-prevPoint.x;
		offsetPoint.y=evt.touchs[0].screenY-prevPoint.y;
		prevPoint={x:evt.screenX,y:evt.screenY};
		//判断dragFlag，在touchTest开始后只会检查一次
		if(this.dragFlag=="NONE"){
			if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)>0){
			this.dragFlag="PAN"
			this.enableScrolling=false
			}else if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)<0){
			this.enableScrolling=false
			this.dragFlag="SCROLL"
			}
		}			
		if(this.dragFlag=="SCROLL"){
			window.scrollBy(0,-offsetPoint.y);
			return false
		}
	};
	var onTouchEnd=function(evt){
		//获取throwPoint
		this.throwPoint.x=vTracker.getVelocity("x")/100;
		this.throwPoint.y=vTracker.getVelocity("y")/100;
		this.dragFlag="NONE"
		VelocityTracker.untrack(prevPoint)
		vTracker=null;
		this.resumeDrag()
		
		document.removeEventListener(touchMoveEvt,onTouchMove);
		document.removeEventListener(touchEndEvt,onTouchEnd);
	};
	
	
	return {
		enableScrolling:true,
		throwPoint:{x:0,y:0}, 
		dragFlag:"NONE",//"PAN","SCROLL"		
		lockDrag:function(draggable){
			if(lockedDraggable!=null){
				lockedDraggable.enable()
			}
			lockedDraggable=draggable
			lockedDraggable.disable()
		},
		resumeDrag:function(){
			if(lockedDraggable!=null){
				lockedDraggable.enable();
				lockedDraggable=null
			}			
		},
		init:function(){
			if(window.PointerEvent) {
				touchStartEvt="pointerdown";
				touchMoveEvt="pointermove";
				touchEndEvt="pointerup";
				document.addEventListener(touchStartEvt,onPointerDown)
			} else if ("ontouchstart" in document.createElement("div")) {
				touchStartEvt="touchstart";
				touchMoveEvt="touchmove";
				touchEndEvt="touchend";
				document.addEventListener(touchStartEvt,onTouchStart)
			}
		}
		
	}


})();