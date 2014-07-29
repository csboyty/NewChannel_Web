/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    //更新视图
    ZY.uiManager.updateView();

    //音乐获取
    ZY.dataManager.getMusic();

    //音乐时间轴
    ZY.music.musicTimeLine();

    //音乐播放结束
    ZY.music.musicEndHandler();

    //音乐：上一首
    $("#zy_music_prev").click(function(){
        ZY.music.musicPrev();
    });

    //音乐：下一首
    $("#zy_music_next").click(function(){
        ZY.music.musicNext();
    });

    //音乐：暂停/播放
    $("#zy_music_control").click(function(){
        ZY.music.musicControlHandler();
    });

    //切换音乐播放器
    $("#zy_music_show").click(function(){
        ZY.uiManager.toggleMiniMusicPlayer();
        $("#zy_music_section").blur();
    });

    //菜单点击事件
    $("#zy_nav a").click(function(){
        var target=$(this).attr("href");
        ZY.uiManager.scrollToTarget($(target));
        return false;
    });

    //logo点击事件
    $("#zy_logo a").click(function(){
        ZY.uiManager.scrollToTarget($("#zy_top_post"));
        return false;
    });

    //获取封面故事和推荐文章
    ZY.dataManager.getTopPosts();


    //点击头条文章
    $(document).on("click","#zy_featured_articles li",function(evt){
        var postID=$(evt.currentTarget).data("zy-post-id")
        if(postID!=null && postID!=undefined){
            ZY.dataManager.currentPostId=postID;
            ZY.uiManager.showArticle(ZY.dataManager.currentPostId);
        }
    });


    //显示单篇文章时的横向滚动
    ZY.controllerManager.bindHScroll($("#zy_article_content")[0]);

    //收回单篇文章展示
    $("#zy_article_content_close").click(function(){
        ZY.uiManager.hideArticle();
    });

    //显示视频，幻灯片不显示大图，图文混排显示大图
    $(document).on("click","#zy_article_content a",function(){
        return false;
    });

    //关闭显示视频或者大图
    $("#zy_show_close").click(function(){
        ZY.uiManager.hideDetail();
    });

    //提示窗口关闭按钮
    $("#zy_popout_close").click(function(){
        ZY.uiManager.hidePopOut();
    });


    //window 放大缩小事件
    $(window).resize(function(){
        ZY.controllerManager.windowResizeHandler();
    });

    //window滚动事件
    $(window).scroll(function(){
        ZY.controllerManager.scrollingHandler();
    });

    //有可能刷新就已经滚动到了一定位置，需要触发一下，加载相应的数据
    $(window).trigger("scroll");


    //拖拽控制



    //栏目列表横向滚动
    Draggable.create(".zy_list_container",{
        type:"scrollLeft",
        edgeResistance:0.5,
        throwProps:true,
        lockAxis:true,
        maxDuration:0.8,
        onClick:function(evt){
            var clickTarget = evt.target || evt.srcElement;
            clickTarget = $(clickTarget).is("*[data-zy-post-id]") ? $(clickTarget):$(clickTarget).parents("*[data-zy-post-id]");
            if(clickTarget.length>0){
                ZY.dataManager.currentPostId=$(clickTarget).data("zy-post-id");
                ZY.uiManager.showArticle(ZY.dataManager.currentPostId);
            }
        },
        onDragStart:function(evt){
            //显示左右拖动提示
            var clickTarget=evt.target || evt.srcElement;
            clickTarget=$(clickTarget).parents(".zy_list_container");
            var containerID=clickTarget.attr("id");
            switch (containerID) {
                case"zy_landscape_list_container":
                    ZY.uiManager.showMovingTips("#zy_landscape_contain");
                    break;
                case"zy_people_list_container":
                    ZY.uiManager.showMovingTips("#zy_people_contain");
                    break;
                case"zy_artifact_list_container":
                    ZY.uiManager.showMovingTips("#zy_artifact_contain");
                    break;
                case"zy_community_list_container":
                    ZY.uiManager.showMovingTips("#zy_community_contain");
                    break;
            }
        },
        onDrag:function(){
            if(dragFlag=="SCROLL"){
                lockedDraggable=this;
                this.disable()
            }
        },
        onDragEnd:function (evt) {

            //获取更多列表数据
            var clickTarget=evt.target || evt.srcElement;
            clickTarget=$(clickTarget).parents(".zy_list_container");
            var containerID=clickTarget.attr("id");
            switch (containerID) {
                case"zy_landscape_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_landscape_contain"),
                        width:ZY.config.articleWidths.landscapeWidth,
                        categoryId:ZY.config.categoryIds.landscapeId,
                        lastDate:ZY.dataManager.lastLandscapeDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_landscape_contain");
                    break;
                case"zy_people_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_people_contain"),
                        width:ZY.config.articleWidths.peopleWidth,
                        categoryId:ZY.config.categoryIds.peopleId,
                        lastDate:ZY.dataManager.lastPeopleDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_people_contain");
                    break;
                case"zy_artifact_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_artifact_contain"),
                        width:ZY.config.articleWidths.artifactWidth,
                        categoryId:ZY.config.categoryIds.artifactId,
                        lastDate:ZY.dataManager.lastArtifactDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_artifact_contain");
                    break;
                case"zy_community_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_community_contain"),
                        width:ZY.config.articleWidths.communityWidth,
                        categoryId:ZY.config.categoryIds.communityId,
                        lastDate:ZY.dataManager.lastCommunityDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_community_contain");
                    break;
            }
        }
    });

    //内容文章滚动
    Draggable.create(".zy_article_content_wrapper",{
        type:"scrollLeft",
        edgeResistance:0.5,
        throwProps:true,
        dragClickables:true,
        lockAxis:true,
        maxDuration:0.8,
        onClick:function(evt){
            var clickTarget = evt.target || evt.srcElement;
            var url;
            //仅显示视频和图文混排模板中的图像大图
            if($(clickTarget).is("a") && $(clickTarget).hasClass("videoslide")){
                //点在带有视频的a元素上
                url=ZY.config.siteurl+"/show_media/"+ZY.dataManager.currentPostId+"/"+$(clickTarget).find("img").data("zy-media-id");
                ZY.uiManager.showVideoDetail(url);
            }else if($(clickTarget).is("img") && $(clickTarget).parents("a.videoslide").length>0){
                //点在带有视频的img元素上
                url=ZY.config.siteurl+"/show_media/"+ZY.dataManager.currentPostId+"/"+$(clickTarget).data("zy-media-id");
                ZY.uiManager.showVideoDetail(url);
            } else if($(clickTarget).is("img") && $(clickTarget).parents(".article-content-post").length>0){
                //点在图文混排模板的img元素上
                url=$(clickTarget).parents("a").attr("href");
                ZY.uiManager.showImageDetail(url);
            }

        },
        onDragStart:function(){
            freezeDefaultScrolling=true
        }
    });

    //弹出内容拖动
    Draggable.create("#zy_show_load_wrapper",{
        type:"scrollTop",
        edgeResistance:0.5,
        throwProps:true,
        lockAxis:true,
        maxDuration:0.8,
        onDragStart:function(){
            freezeDefaultScrolling=true
        }
    });


    //lockedDraggable存储被锁定的Draggable实例。用户不能同时水平和垂直滑动页面，所以scroll激活时，要临时锁定Draggable，等滑动结束后再解锁。
    var lockedDraggable=null;
    var prevPoint={x:0,y:0};
    var offsetPoint={x:0,y:0};
    var throwObj={x:0,y:0};
    var tracePoint={x:0,y:0};
    var vTracker=VelocityTracker.track(tracePoint, "x,y");
    var dragFlag="NONE";
    var freezeDefaultScrolling=false;

    //对IE触屏事件优化
    document.addEventListener("pointerdown",function(evt){
        //重置状态
        prevPoint={x:evt.screenX,y:evt.screenY};
        tracePoint.x=evt.screenX;
        tracePoint.y=evt.screenY;
        TweenLite.killTweensOf(throwObj);

    },false);

    document.addEventListener("pointermove",function(evt){
        //冻结默认的滚轴行为
        if(freezeDefaultScrolling){
            return false
        }

        //更新状态
        tracePoint.x=evt.screenX;
        tracePoint.y=evt.screenY;
        //计算偏移
        offsetPoint.x=evt.screenX-prevPoint.x;
        offsetPoint.y=evt.screenY-prevPoint.y;
        //更新位置
        prevPoint={x:evt.screenX,y:evt.screenY};

        //判断dragFlag，只判断一次
        if(dragFlag=="NONE"){
            if(Math.abs(offsetPoint.y)-Math.abs(offsetPoint.x)>0){
                dragFlag="SCROLL";
            }else if(Math.abs(offsetPoint.x)-Math.abs(offsetPoint.y)>0){
                dragFlag="PAN";
            }
        }

        //根据偏移定位scroll
        if((dragFlag=="SCROLL")&&(evt.pointerType != "mouse")){
            window.scrollBy(0,-offsetPoint.y);
            return false
        }

    },true);

    document.addEventListener("pointerup",function(evt){
        freezeDefaultScrolling=false;
        dragFlag="NONE";
        if(lockedDraggable!=null){
            lockedDraggable.enable();
            lockedDraggable=null;
            //throws
            throwObj.y=vTracker.getVelocity("y")/100;
            TweenLite.to(throwObj,1,{y:0,onUpdate:function(){
                window.scrollBy(0,-throwObj.y);
            }});
        }
        ZY.uiManager.updateView();
    },false);
    document.addEventListener("selectstart", function(evt) {
        evt.preventDefault();
    }, false);
    document.addEventListener("contextmenu", function(evt) {
        evt.preventDefault();
    }, false);
    document.addEventListener("MSHoldVisual", function(evt) {
        evt.preventDefault();
    }, false);

    //对支持touch事件的浏览器



});