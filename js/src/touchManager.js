var ZY=ZY||{};
ZY.touchManager=(function(){
    var enableScrolling=true;
	var lockedDraggable=null;
    var prevPoint={x:0,y:0};
    var offsetPoint={x:0,y:0};
    var throwPoint={x:0,y:0}
    var vTracker=null;
    var dragFlag="NONE";//"PANX","PANY"
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
		document.addEventListener("pointermove",onPointerMove);
		document.addEventListener("pointerup",onPointerUp);
	};
	var onPointerMove=function(evt){
		//更新值
		offsetPoint.x+=evt.screenX-prevPoint.x;
		offsetPoint.y+=evt.screenY-prevPoint.y;
        prevPoint.x=evt.screenX;
        prevPoint.y=evt.screenY;
		
		//判断dragFlag，在touchTest开始后只会检查一次
		if(dragFlag=="NONE"){
			if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)>0){
			dragFlag="PANX"
			}else if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)<0){
			dragFlag="PANY"
			}
		}
        //禁用默认scroll行为
        if (!enableScrolling){
            return false;
        }

	};
	var onPointerUp=function(evt){

		//获取throwPoint
		throwPoint.x=vTracker.getVelocity("x")/80;
		throwPoint.y=vTracker.getVelocity("y")/80;

        if(lockedDraggable!=null){
            lockedDraggable.enable();
            lockedDraggable=null;
            //throw
            TweenLite.to(throwPoint,1,{y:0,onUpdate:function(){
                window.scrollBy(0,-throwPoint.y);
            }});
        }

        //重置
		dragFlag="NONE";
		VelocityTracker.untrack(prevPoint);
		vTracker=null;
		enableScrolling=true;
		
		document.removeEventListener("pointermove",onPointerMove);
		document.removeEventListener("pointerup",onPointerUp);
	};
	
	//general Touches
	var onTouchStart=function(evt){			
		offsetPoint={x:0,y:0};			
		TweenLite.killTweensOf(throwPoint);
		prevPoint={x:evt.touches[0].screenX,y:evt.touches[0].screenY};
		vTracker=VelocityTracker.track(prevPoint, "x,y");

		//绑定事件处理
		document.addEventListener("touchmove",onTouchMove);
		document.addEventListener("touchend",onTouchEnd);
	};
	var onTouchMove=function(evt){
		//更新值
		offsetPoint.x+=evt.touches[0].screenX-prevPoint.x;
		offsetPoint.y+=evt.touches[0].screenY-prevPoint.y;
        prevPoint.x=evt.touches[0].screenX;
        prevPoint.y=evt.touches[0].screenY;
		
		//判断dragFlag，在touchTest开始后只会检查一次
		if(dragFlag=="NONE"){
			if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)>0){
			dragFlag="PANX"
			}else if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)<0){
			dragFlag="PANY"
			}
		}
		
        //scroll被禁用
        if (!enableScrolling){
            return false;
        }
		evt.preventDefault();
	};
	var onTouchEnd=function(evt){
		//获取throwPoint
		throwPoint.x=vTracker.getVelocity("x")/100;
		throwPoint.y=vTracker.getVelocity("y")/100;

        if(lockedDraggable!=null){
            lockedDraggable.enable();
            lockedDraggable=null;
            //throw
            TweenLite.to(throwPoint,1,{y:0,onUpdate:function(){
                window.scrollBy(0,-throwPoint.y);
            }});
        }

		dragFlag="NONE";
		VelocityTracker.untrack(prevPoint);
		vTracker=null;
		
		document.removeEventListener("touchmove",onTouchMove);
		document.removeEventListener("touchend",onTouchEnd);
	};
	
	//鼠标模拟
	var onMouseDown=function(evt){			
		offsetPoint={x:0,y:0};			
		TweenLite.killTweensOf(throwPoint);
		prevPoint={x:evt.screenX,y:evt.screenY};
		vTracker=VelocityTracker.track(prevPoint, "x,y");

		//绑定事件处理
		document.addEventListener("mousemove",onMouseMove);
		document.addEventListener("mouseup",onMouseUp);
	};
	var onMouseMove=function(evt){
		//更新值
		offsetPoint.x+=evt.screenX-prevPoint.x;
		offsetPoint.y+=evt.screenY-prevPoint.y;
        prevPoint.x=evt.screenX;
        prevPoint.y=evt.screenY;
		
		//判断dragFlag，在touchTest开始后只会检查一次
		if(dragFlag=="NONE"){
			if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)>0){
			dragFlag="PANX"
			}else if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)<0){
			dragFlag="PANY"
			}
		}
        //禁用默认scroll行为
        if (!enableScrolling){
            return false;
        }

	};
	var onMouseUp=function(evt){

		//获取throwPoint
		throwPoint.x=vTracker.getVelocity("x")/80;
		throwPoint.y=vTracker.getVelocity("y")/80;

        if(lockedDraggable!=null){
            lockedDraggable.enable();
            lockedDraggable=null;
            //throw
            TweenLite.to(throwPoint,1,{y:0,onUpdate:function(){
                window.scrollBy(0,-throwPoint.y);
            }});
        }

        //重置
		dragFlag="NONE";
		VelocityTracker.untrack(prevPoint);
		vTracker=null;
		enableScrolling=true;
		
		document.removeEventListener("mousemove",onMouseMove);
		document.removeEventListener("mouseup",onMouseUp);
	};
	
	return {
        lockScrolling:function(){
            enableScrolling=false;
        },
        isPanY:function(){
            return dragFlag=="PANY"
        },
		lockDrag:function(draggable){
			if(lockedDraggable!=null){
				lockedDraggable.enable()
			}
			lockedDraggable=draggable;
			lockedDraggable.disable()
		},
		init:function(){
			document.addEventListener("pointerdown",onPointerDown);
			document.addEventListener("touchstart",onTouchStart);
			document.addEventListener("mousedown",onMouseDown);
			
			//更新视图渲染
			TweenLite.ticker.addEventListener("tick",function(){		
							
				if((dragFlag=="PANY")&&(lockedDraggable!=null)){
					window.scrollBy(0,-offsetPoint.y)
					offsetPoint.x=0;
					offsetPoint.y=0;
				}
			
			})
		}
		
	}


})();