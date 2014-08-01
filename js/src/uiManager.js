/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * 页面展示类，主要负责页面元素的展示
 * */
var ZY=ZY||{};
ZY.uiManager=(function(){
	
    //私有属性
    var isMiniPlayer=true;
	
	//DOM映射
	var topMenu;
    var topMenuLandScape;
    var topMenuPeople;
    var topMenuArtifact;
    var topMenuCommunity;
	var topPoster;
	
	var musicPlayerWrapper;
	var musicPlayer;
	var musicAudio;
	var miniPlayerToggleBtn;
	var popout;
	var spinnerDOM;
	
	
    var landScapeBG;
    var peopleBG;
    var artifactBG;
    var communityBG;

	var articleWrapper;
	var articleContent;
	var articleSlide;
	var articlePost;
	var articleCloseBtn;

    return {

        /**
         * 初始化 绑定DOM映射
         */
        init:function(){
            var _this=this
            //DOM映射
            topMenu=$("#zy_nav");
            topMenuLandScape=$("#zy_nav>ul>li:nth-child(1) a");
            topMenuPeople=$("#zy_nav>ul>li:nth-child(2) a");
            topMenuArtifact=$("#zy_nav>ul>li:nth-child(4) a");
            topMenuCommunity=$("#zy_nav>ul>li:nth-child(5) a");
            topPoster=$("#zy_top_post_poster");

            musicPlayerWrapper=$("#zy_music_Section");
            musicPlayer=$("#zy_music_player");
            musicAudio=$("#zy_music_audio");
            miniPlayerToggleBtn=$("#zy_music_show");
            popout=$("#zy_popout");
            spinnerDOM=$("#zy_spinner_tpl").html();

            landScapeBG=$("#zy_landscape_bg .zy_theme_bg_content");
            peopleBG=$("#zy_people_bg .zy_theme_bg_content");
            artifactBG=$("#zy_artifact_bg .zy_theme_bg_content");
            communityBG=$("#zy_community_bg .zy_theme_bg_content");

            articleWrapper=$("#zy_article_container");
            articleContent=$("#zy_article_content");
            articleSlide=$("#zy_article_content .allslides-slide");
            articlePost=$("#zy_article_content .article-main-post");
            articleCloseBtn=$("#zy_article_content_close");



            //视图相关设置初始化
            CSSPlugin.defaultTransformPerspective=800;

            //UI元素的初始状态
            TweenLite.to("#zy_popout_win",0,{opacity:0,rotationX:90,transformOrigin:"50% 50%"});

            //初始事件绑定
            //绑定全屏事件
            document.addEventListener("MSFullscreenChange",function(){
                if(document.msFullscreenElement!=null){
                    //进入

                }else{
                    //退出
                    _this.hideDetail()
                }
            })

            //更新视图
            this.updateView()

        },

        /**
         * 视图更新，数据发生变化后调用
         */
        updateView:function(){
            var winH=$(window).height();

            //头条海报的高度刷新
            topPoster.css("height",winH-topMenu.height()-miniPlayerToggleBtn.height()+"px");

            //隐藏movingtips按钮
            this.hideMovingTips("#zy_landscape_contain");
            this.hideMovingTips("#zy_people_contain");
            this.hideMovingTips("#zy_artifact_contain");
            this.hideMovingTips("#zy_community_contain");

            //更新详情文章的高度
            articleContent.css("height",winH-110+"px");
			/*
			articleSlide.css("height",winH-110+"px");
            articlePost.css("height",winH-110+"px")
			*/

            //更新位置数值
            ZY.controllerManager.init();
        },

        /**
         * 切换音乐播放器显示隐藏
         */
        toggleMiniMusicPlayer:function(){
            if(isMiniPlayer){
                TweenLite.to(musicPlayer,0.3,{top:"-50px",onComplete:function(){
                isMiniPlayer=false
			    }})
            }else{
                TweenLite.to(musicPlayer,0.3,{top:"0",onComplete:function(){
				isMiniPlayer=true
			    }})
            }
        },

        /** 改变顶部菜单外观
         *   @param {boolean} flag 标识菜单是否切换为mini菜单
         */
        topMenuMiniMode:function(miniFlag){
            if(miniFlag){
                if(!topMenu.hasClass("zy_nav_active")){
                    topMenu.addClass("zy_nav_active");
                }
            }else{
                if(topMenu.hasClass("zy_nav_active")){
                    topMenu.removeClass("zy_nav_active");
                }
            }
        },

        /**
         * 根据当前章节高亮显示顶部菜单相应条目
         * @param {String} sectionID 菜单对应章节的名字 ，如果传入null则不高亮任何条目
         */
        highlightMenu:function(sectionID){

            //设置顶部菜单状态, 首先重置所有菜单
            $("#zy_nav>ul>li>a").removeClass("active");
            switch (sectionID){
                case "landscape" :
                    topMenuLandScape.addClass("active");
                    break;
                case "people" :
                    topMenuPeople.addClass("active");
                    break;
                case "artifact" :
                    topMenuArtifact.addClass("active");
                    break;
                case "community" :
                    topMenuCommunity.addClass("active");
                    break;
            }

        },

        /**
         * 显示消息提示框
         * @param {String} msg 需要显示的信息
         * @param {Boolean} showblackout  是否显示显示遮盖层
         */
        showPopOut:function(msg){
            if(popout.hasClass("zy_hidden")){
                popout.removeClass("zy_hidden")
            }
            this.showBlackout(popout);
            $("#zy_popout_win").find(".zy_popout_title").html(msg);
            //动效
            TweenLite.to("#zy_popout_win",0.5,{opacity:1,rotationX:0,transformOrigin:"50% 50%",ease:Back.easeOut})

        },

        /**
         * 隐藏消息提示框
         */
        hidePopOut:function(){
            if(popout.hasClass("zy_hidden")){
                popout.removeClass("zy_hidden")
            }
            this.hideBlackout(popout);
            //动效
            TweenLite.to("#zy_popout_win",0.3,{opacity:0,rotationX:90,transformOrigin:"50% 50%"})
        },

        /**
         * 显示移动提示
         *  @param {Object} targetContain 需要滚动到的元素jquery对象
         */
        showMovingTips:function(targetContain){
            var leftBtn=$(targetContain).find("a.zy_contain_prev");
            var rightBtn=$(targetContain).find("a.zy_contain_next");
            TweenLite.fromTo(leftBtn,0.4,{left:"-50px",opacity:0},{left:"0",opacity:1})
            TweenLite.fromTo(rightBtn,0.4,{right:"-50px",opacity:0},{right:"0",opacity:1})
        },

        /**
         * 隐藏移动提示
         *  @param {Object} targetContain 需要滚动到的元素jquery对象
         */
        hideMovingTips:function(targetContain){
            var leftBtn=$(targetContain).find("a.zy_contain_prev");
            var rightBtn=$(targetContain).find("a.zy_contain_next");
            TweenLite.to(leftBtn,0.4,{left:"-50px",opacity:0})
            TweenLite.to(rightBtn,0.4,{right:"-50px",opacity:0})
        },

        /**
         * 滚动动画，主要用于菜单点击
         * @param {Object} target 需要滚动到的元素jquery对象
         */
        scrollToTarget:function(target){
            var top=target.offset().top;

            if(top!= undefined){
                TweenLite.killTweensOf(window);

                //需要减去nav的高度，以为到下面后nav就是fixed不占高度,加5是为了在滚动那里设置nav的状态
                if(target.is("#zy_artifact")){
                    TweenLite.to(window, 1, {scrollTo:{y:top+35, x:0},ease:Circ.easeInOut});
                }else if(target.is("#zy_community")){
                    TweenLite.to(window, 1, {scrollTo:{y:top+35, x:0},ease:Circ.easeInOut});
                }else{
                    TweenLite.to(window, 1, {scrollTo:{y:top+1, x:0},ease:Circ.easeInOut});
                }

            }

        },

        /**
         * 视频淡入
         * @param {Object} target 需要淡入的元素dom
         */
        fadingIn:function(target){
            $(target).css("opacity",1);
        },

        /**
         * 显示数据加载时候的等待动画,采用动态添加元素,使用juicer
         * @param {Object} target 动画的容器元素jquery对象
         */
        showLoadingSpinner:function(target){
            //添加到target DOM中
            if(target.find(".zy_loading_spinner").length<=0){
                target.append($(spinnerDOM));
            }
        },

        /**
         * 隐藏数据加载时候的等待动画,动态删除元素
         * @param {Object} target 动画的容器元素jquery对象
         */
        hideLoadingSpinner:function(target){
            target.find(".zy_loading_spinner").remove();
        },

        /**
         * 显示顶部4篇文章，使用juicer
         * @param {Array} posts 文章数组
         */
        showTopPost:function(posts){
            var tpl_top = $("#zy_top_post_tpl").html();
            var html_top = juicer(tpl_top,{top_posts:posts});
            $("#zy_top_post_heading").html(html_top);
            this.updateSectionBg(posts[0],$("#zy_top_post_poster"));
        },

        /**
         * 显示顶部4篇文章，使用juicer
         * @param {Array} posts 文章数组
         */
        showFeaturePosts:function(posts){
            var tpl_featured = $("#zy_featured_articles_tpl").html();
            var html_featured = juicer(tpl_featured,{top_posts:posts});
            $("#zy_featured_articles").html(html_featured);
            //动效
            TweenLite.fromTo("#zy_featured_articles li:nth-child(1)",0.5,{rotationY:90,opacity:0,transformOrigin:"50% 50%"},{rotationY:0,opacity:1,ease:Back.easeOut})
            TweenLite.fromTo("#zy_featured_articles li:nth-child(2)",0.5,{rotationY:90,opacity:0,transformOrigin:"50% 50%"},{rotationY:0,opacity:1,delay:0.2,ease:Back.easeOut})
            TweenLite.fromTo("#zy_featured_articles li:nth-child(3)",0.5,{rotationY:90,opacity:0,transformOrigin:"50% 50%"},{rotationY:0,opacity:1,delay:0.4,ease:Back.easeOut})

            //绑定pointer事件
            $("#zy_featured_articles").delegate("li","pointerdown",function(){
                TweenLite.to($(this),0.3,{rotationY:30,transformOrigin:"50% 50%"});
                var _this=$(this)
                //绑定pointerleave
                $(document).on("pointerleave",function(evt){
                    TweenLite.to(_this,0.3,{rotationY:0,transformOrigin:"50% 50%"});
                    $(document).off("pointerleave")
                })

            });
			//绑定touch事件
			$("#zy_featured_articles").delegate("li","touchstart",function(){
                TweenLite.to($(this),0.3,{rotationY:30,transformOrigin:"50% 50%"});
                var _this=$(this)
                //绑定touchend
                $(document).on("touchend",function(evt){
                    TweenLite.to(_this,0.3,{rotationY:0,transformOrigin:"50% 50%"});
                    $(document).off("touchend")
                })

            });

        },

        /**
         * 更新背景
         * @param {Object} data 第一篇文章对象
         * @param {Object} target 容器元素jquery对象
         */
        updateSectionBg:function(data,target){
            if(data["background"]!==null){
            	
                //第一次才换背景
                if(data["background"]["type"]!="mp4"){

                    //使用append比使用html函数过度效果好
                    target.append($("<img class='zy_theme_bg_content' src='"+data["background"]["filepath"]+
                        "' onload='ZY.uiManager.fadingIn(this)' />"));
                }else if(!ZY.config.deviceCode.iOS){
                	
                    //视频作为背景，由于使用了img的clip，这里最好不做处理
                    target.append($("<video class='zy_theme_bg_content' autoplay loop muted "+
                        "oncanplay='ZY.uiManager.fadingIn(this)'><source src='"+data["background"]["filepath"]+
                        "' type='video/mp4' /></video>"));
                }
            }
        },

        /**
         * 根据当前section显示相应的背景
         * @param {Object} targetSection 目标section元素的jquery对象
         */
        showSectionBg:function(targetSection){

            if(!ZY.config.deviceCode.iOS){
                landScapeBG.removeClass("zy_bg_fixed");
                peopleBG.removeClass("zy_bg_fixed");
                artifactBG.removeClass("zy_bg_fixed");
                communityBG.removeClass("zy_bg_fixed");

                if((targetSection!=null)&&(!$(targetSection).hasClass("zy_bg_fixed"))){
                    $(targetSection).addClass("zy_bg_fixed")
                }
            }


        },

        /**
         * 显示风景分类文章,使用juicer
         * @param {Array} posts 文章数组
         */
        showLandscapePosts:function(posts){
            var tpl= $("#zy_landscape_articles_tpl").html();
            var html = juicer(tpl,{posts:posts});
            $("#zy_landscape_list").append($(html));
        },

        /**
         * 显示人文分类文章
         * @param {Array} posts 文章数组
         */
        showPeoplePosts:function(posts){
            var tpl= $("#zy_people_articles_tpl").html();
            var html = juicer(tpl,{posts:posts});
            $("#zy_people_list").append($(html));
        },

        /**
         * 显示社区分类文章
         * @param {Array} posts 文章数组
         */
        showCommunityPosts:function(posts){
            var tpl= $("#zy_community_articles_tpl").html();
            var html = juicer(tpl,{posts:posts});
            $("#zy_community_list").append($(html));
        },

        /**
         * 显示物语分类文章,第一个是单独的大图
         * @param {Array} posts 文章数组
         * @param {Boolean} isFirst 是否是第一次加载
         */
        showArtifactPosts:function(posts,isFirst){
            var tpl= $("#zy_artifact_articles_tpl").html();
            var html = juicer(tpl,{posts:posts,isFirst:isFirst});
            $("#zy_artifact_list").append($(html));
        },

        /**
         * 显示文章详情，弹出层显示
         * @param {Number} post_id 文章id
         */
        showArticle:function(post_id){
            var me=this;
            //首先要清除原有的内容
            articleContent.find("article").remove();

            if($("#zy_article").hasClass("zy_hidden")){
                $("#zy_article").removeClass("zy_hidden")
            }
            this.showBlackout($("#zy_article"))
			TweenLite.to(articleWrapper,0.5,{
				left:"0%",
				ease:Circ.easeInOut,
				onComplete:function(){
					TweenLite.to(articleCloseBtn,0.3,{top:0})
					me.showLoadingSpinner(articleContent);
                	ZY.dataManager.getPostDetail(post_id);
				}
			})

        },

        /**
         * 隐藏文章详情
         */
        hideArticle:function(){
            //此处调用是因为可能数据还没加载完就被收回
            var me=this;
            me.hideLoadingSpinner(articleContent);
			TweenLite.to(articleCloseBtn,0.3,{top:50});
			TweenLite.to(articleWrapper,0.5,{
				left:"100%",
				ease:Circ.easeInOut,
				onComplete:function(){					
					me.hideBlackout($("#zy_article"));
				}
			})
        },

        /**
         * 显示遮盖层
         * @param {$obj} targetEle 具有blackout的目标元素
         */
        showBlackout:function(targetEle){
            var blackOut=$(targetEle).find(".zy_blackout");
            TweenLite.to(blackOut,0.5,{opacity:0.9})
        },

        /**
         * 隐藏遮盖层
         */
        hideBlackout:function(targetEle){
            var blackOut=$(targetEle).find(".zy_blackout");
            TweenLite.to(blackOut,0.5,{opacity:0,onComplete:function(){
                if(!$(targetEle).hasClass("zy_hidden")){
                    $(targetEle).addClass("zy_hidden");
                }
            }})

        },

        /**
         * 显示文章详情时注入内容，使用juicer
         * @param {Object} data 文章数据对象
         */
        showArticleDetail:function(data){
            var tpl=$("#zy_show_detail_tpl").html();
            var html=juicer(tpl,data);
            articleContent.append(html);

            ZY.uiManager.hideLoadingSpinner(articleContent);
            //视图更新
            this.updateView();

            //动效
            /*TweenLite.set([".article-title-slide",".article-author-slide",".article-category-slide",".article-abstract-slide"],{rotationY:-90,opacity:0});
            TweenLite.to(".article-title-slide",0.5,{rotationY:0,opacity:1,transformOrigin:"0 50%",ease:Back.easeOut});
            TweenLite.to([".article-author-slide",".article-category-slide",".article-abstract-slide"],0.5,{rotationY:0,opacity:1,transformOrigin:"0 50%",delay:0.2,ease:Back.easeOut});
            */
            TweenLite.set([".article-title-slide",".article-author-slide",".article-category-slide",".article-abstract-slide"],{y:100,opacity:0});
            TweenLite.set(".allslides-slide",{opacity:0,x:50});
            TweenLite.to(".article-title-slide",0.5,{y:0,opacity:1,ease:Back.easeOut});
            TweenLite.to(".article-author-slide",0.5,{y:0,opacity:1,delay:0.2,ease:Circ.easeOut});
            TweenLite.to(".article-category-slide",0.5,{y:0,opacity:1,delay:0.4,ease:Circ.easeOut});
            TweenLite.to(".article-abstract-slide",0.5,{y:0,opacity:1,delay:0.6,ease:Circ.easeOut});
            TweenLite.to(".allslides-slide",0.5,{opacity:1,x:0,ease:Back.easeOut,delay:1});

            TweenLite.set([".article-title-post",".article-author-post"],{x:100,opacity:0});
            TweenLite.set(".article-content-post-wrapper",{x:50,opacity:0});
            TweenLite.set(".article-poster-post",{opacity:0});
            TweenLite.to(".article-title-post",0.5,{x:0,opacity:1,ease:Back.easeOut});
            TweenLite.to(".article-author-post",0.5,{x:0,opacity:1,ease:Back.easeOut,delay:0.2});
            TweenLite.to(".article-content-post-wrapper",0.5,{opacity:1,x:0,ease:Back.easeOut,delay:0.4});
            TweenLite.to(".article-poster-post",0.5,{opacity:1,delay:0.8})

            //article-poster-post
        },

        /**
         * 显示文章中绑定的视频,使用jquery的load，加载后台的一个页面
         * 此时要暂停音乐，并且更改遮盖层的z-index
         * @param {string} url 视频地址
         */
        showVideoDetail:function(url){
            var _this=this;
			var loadContainer=$("#zy_show_video_container");
            musicAudio[0].pause(); //暂停音乐
            loadContainer.html("");
            $("#zy_show_section").removeClass("zy_hidden");
            //隐藏图片
            $("#zy_show_img_wrapper").addClass("zy_hidden");
            TweenLite.to("#zy_show_close",0.3,{top:0})

            _this.showBlackout($("#zy_show_section"));
            loadContainer.load(url,function(response, status, xhr){
                _this.hideLoadingSpinner(articleContent);
                if (status == "error") {
                    _this.showPopOut(ZY.config.errorCode.connectionError+xhr.status + " " + xhr.statusText);
                } else if(status =="success"){
                    _this.goFullscreen($("#zy_show_video_container video"));
                }
            });
        },
        /**
         * 全屏显示视频,IE only
         * @param  targetEle, 请求全屏的DOM元素
         */
        goFullscreen:function(targetEle){
            var target=$(targetEle)[0];
            if(target.requestFullscreen){
                if(document.fullscreenElement==null){
                    target.requestFullscreen();
                }else{
                    //已处于全屏状态，退出全屏
                    document.cancelFullscreen()
                }
            }else if(target.msRequestFullscreen){
                if(document.msFullscreenElement==null){
                    target.msRequestFullscreen();
                }else{
                    //已处于全屏状态，退出全屏
                    document.msExitFullscreen()
                }
            }else if(target.webkitRequestFullscreen){
                if(document.webkitFullscreenElement==null){
                    target.webkitRequestFullscreen();
                }else{
                    //已处于全屏状态，退出全屏
                    document.webkitCancelFullscreen()
                }
            }

        },
        /**
         * 显示图片大图
         * @param {String} url 大图的地址
         */
        showImageDetail:function(url){
            if($("#zy_show_section").hasClass("zy_hidden")){
                $("#zy_show_section").removeClass("zy_hidden");
            }
            this.showBlackout($("#zy_show_section"));
            //隐藏视频
            $("#zy_show_video_container").addClass("zy_hidden");
            TweenLite.to("#zy_show_close",0.3,{top:0})

            $("#zy_show_img_container").html("<img src='"+url+"'>");
        },

        /**
         * 隐藏显示的视频或者大图
         */
        hideDetail:function(){
            this.hideBlackout($("#zy_show_section"));
            TweenLite.to("#zy_show_close",0.3,{top:-50});
            $("#zy_show_img_container").html("");
            $("#zy_show_img_wrapper").removeClass("zy_hidden");
            $("#zy_show_video_container").html("");
            $("#zy_show_video_container").removeClass("zy_hidden");
            //恢复音乐
            if(ZY.music.musicPlaying){
                musicAudio[0].play();
            }
        }

    }
})();