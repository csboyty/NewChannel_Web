var ZY=ZY||{};
ZY.touchManager=(function(){
    var enableScrolling=true;
	var lockedDraggable=null;
    var activePointerId=null;//当前被激活的pointerId
    var startPoint={x:0,y:0};
    var distance={x:0,y:0};//每一次touch所移动的距离
    var prevPoint={x:0,y:0};
    var speed={x:0,y:0};//触点每tick移动的位移
    var throwSpeed={x:0,y:0};//touch结束后“甩”出瞬间的速度
    var vTracker=null;
    var dragFlag="NONE";//"PANX","PANY"
	
	//私有函数
	//IE pointers
	var onPointerDown=function(evt){

        if((activePointerId==null)){
            activePointerId=evt.pointerId;
            distance={x:0,y:0};
            speed={x:0,y:0};
            console.log(enableScrolling);

            //prevPoint={x:evt.screenX,y:evt.screenY};
            //当enableScrolling为false时，首页内容正在水平拖动，因此不应该更新startPoint的值
            if(enableScrolling){
                startPoint={x:evt.screenX, y:evt.screenY};
                prevPoint={x:evt.screenX,y:evt.screenY};
            }

            TweenLite.killTweensOf(throwSpeed);
            vTracker=VelocityTracker.track(prevPoint, "x,y");//触点轨迹的变化速度

            //绑定事件处理
            document.addEventListener("pointermove",onPointerMove);
            document.addEventListener("pointerup",onPointerUp);
            document.addEventListener("pointercancel",onPointerCancel);

        }else{
            return false
        }

	};
	var onPointerMove=function(evt){
        if(activePointerId==evt.pointerId){
            //更新值
            distance.x=evt.screenX-startPoint.x;
            distance.y=evt.screenY-startPoint.y;
            speed.x+=evt.screenX-prevPoint.x;
            speed.y+=evt.screenY-prevPoint.y;
            prevPoint.x=evt.screenX;
            prevPoint.y=evt.screenY;

            //判断dragFlag，在touchTest开始后只会检查一次
            if(dragFlag=="NONE"){
                if(Math.abs(speed.x)-Math.abs(speed.y)>0){
                    dragFlag="PANX"
                }else if(Math.abs(speed.x)-Math.abs(speed.y)<0){
                    dragFlag="PANY";
                }
            }
            //禁用默认scroll行为
            if (!enableScrolling){
                return false;
            }
        }else{
            return false;
        }




	};
	var onPointerUp=function(evt){
        if(activePointerId==evt.pointerId){
            //获取throwSpeed
            throwSpeed.x=vTracker.getVelocity("x")/80;
            throwSpeed.y=vTracker.getVelocity("y")/80;

            if(lockedDraggable!=null){
                lockedDraggable.enable();
                lockedDraggable=null;
                enableScrolling=true
                //throwSpeed
                TweenLite.to(throwSpeed,1,{y:0,onUpdate:function(){
                    window.scrollBy(0,-throwSpeed.y);
                }});
            }

            //重置
            dragFlag="NONE";
            VelocityTracker.untrack(prevPoint);
            vTracker=null;
            activePointerId=null;

            document.removeEventListener("pointermove",onPointerMove);
            document.removeEventListener("pointerup",onPointerUp);
            document.removeEventListener("pointercancel",onPointerCancel);
        }else{
            return false;
        }

	};
    var onPointerCancel=function(evt){
        if(activePointerId==evt.pointerId){

            if(lockedDraggable!=null){
                lockedDraggable.enable();
                lockedDraggable=null;
                enableScrolling=true
            }
            dragFlag="NONE";
            VelocityTracker.untrack(prevPoint);
            vTracker=null;
            activePointerId=null;

            document.removeEventListener("pointermove",onPointerMove);
            document.removeEventListener("pointerup",onPointerUp);
            document.removeEventListener("pointercancel",onPointerCancel);
        }
    };
   /* var onMsGestureChange=function(evt){
        console.log("guesture");
        if (evt.detail == evt.MSGESTURE_FLAG_INERTIA)
            return;
        var currentXform = new MSCSSMatrix(evt.target.style.msTransform);
        var currentScale = Math.sqrt(currentXform.m11 * currentXform.m22 - currentXform.m12 * currentXform.m21);

        if (evt.scale * currentScale >= 0.4) {
            evt.target.style.msTransform = currentXform.translate(evt.offsetX, evt.offsetY).
                rotate(evt.rotation * 180 / Math.PI).
                scale(evt.scale).
                translate(evt.translationX, evt.translationY).
                translate(-evt.offsetX, -evt.offsetY);
        }
        else {
            evt.target.style.msTransform = currentXform.translate(evt.offsetX, evt.offsetY).
                rotate(evt.rotation * 180 / Math.PI).
                translate(evt.translationX, evt.translationY).
                translate(-evt.offsetX, -evt.offsetY);
        }

    };*/
	
	//general Touches
	/*var onTouchStart=function(evt){
        startPoint={x:evt.touches[0].screenX, y:evt.touches[0].screenY};
        distance={x:0,y:0};
		speed={x:0,y:0};			
		TweenLite.killTweensOf(throwSpeed);
		prevPoint={x:evt.touches[0].screenX,y:evt.touches[0].screenY};
		vTracker=VelocityTracker.track(prevPoint, "x,y");

		//绑定事件处理
		document.addEventListener("touchmove",onTouchMove);
		document.addEventListener("touchend",onTouchEnd);
	};
	var onTouchMove=function(evt){
		//更新值
        distance.x=evt.touches[0].screenX-startPoint.x;
        distance.y=evt.touches[0].screenY-startPoint.y;
		speed.x+=evt.touches[0].screenX-prevPoint.x;
		speed.y+=evt.touches[0].screenY-prevPoint.y;
        prevPoint.x=evt.touches[0].screenX;
        prevPoint.y=evt.touches[0].screenY;
		
		//判断dragFlag，在touchTest开始后只会检查一次
		if(dragFlag=="NONE"){
			if(Math.abs(speed.x)-Math.abs(speed.y)>0){
			dragFlag="PANX"
			}else if(Math.abs(speed.x)-Math.abs(speed.y)<0){
			dragFlag="PANY"
			}
		}
		
        //scroll被禁用
        if (!enableScrolling){
            return false;
        }
	};
	var onTouchEnd=function(evt){
		//获取throwSpeed
		throwSpeed.x=vTracker.getVelocity("x")/100;
		throwSpeed.y=vTracker.getVelocity("y")/100;

        if(lockedDraggable!=null){
            lockedDraggable.enable();
            lockedDraggable=null;
            //throwSpeed
            TweenLite.to(throwSpeed,1,{y:0,onUpdate:function(){
                window.scrollBy(0,-throwSpeed.y);
            }});
        }

		dragFlag="NONE";
		VelocityTracker.untrack(prevPoint);
		vTracker=null;
		
		document.removeEventListener("touchmove",onTouchMove);
		document.removeEventListener("touchend",onTouchEnd);
	};*/

	
	return {
        lockScrolling:function(){
            enableScrolling=false;
        },
        unlockScrolling:function(){
            enableScrolling=true;
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
        touchDistanceX:function(){
            return distance.x;
        },
        touchDistanceY:function(){
            return distance.y;
        },
       /* bindGesture:function(targetEle){
            targetEle.gestureObject = new MSGesture();
            targetEle.gestureObject.target = targetEle;

            targetEle.addEventListener("MSGestureChange", onMsGestureChange, false);
            console.log(targetEle.gestureObject.target)
        },
        unbindGesture:function(targetEle){
            targetEle.removeEventListener("MSGestureChange", onMsGestureChange, false);
        },*/
		init:function(){
			document.addEventListener("pointerdown",onPointerDown);
			//document.addEventListener("touchstart",onTouchStart);
			
			//更新视图渲染
			TweenLite.ticker.addEventListener("tick",function(){

				if((dragFlag=="PANY")&&(lockedDraggable!=null)){

					window.scrollBy(0,-speed.y);
					speed.x=0;
					speed.y=0;
				}
			
			})
		}
		
	}


})();