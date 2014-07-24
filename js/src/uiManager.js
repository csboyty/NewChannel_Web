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
    var miniMusicPlayer=true;
    var landScapeBG=$("#zy_landscape_bg .zy_theme_bg_content");
    var peopleBG=$("#zy_people_bg .zy_theme_bg_content");
    var artifactBG=$("#zy_artifact_bg .zy_theme_bg_content");
    var communityBG=$("#zy_community_bg .zy_theme_bg_content");
    var topMenu=$("#zy_nav");
    var topMenuLandScape=$("#zy_nav>ul>li:nth-child(1) a");
    var topMenuPeople=$("#zy_nav>ul>li:nth-child(2) a");
    var topMenuArtifact=$("#zy_nav>ul>li:nth-child(4) a");
    var topMenuCommunity=$("#zy_nav>ul>li:nth-child(5) a");


    return {

        /**
         * 视图更新，数据发生变化后调用
         */
        updateView:function(){
            var winH=$(window).height();

            //头条海报的高度刷新
            $("#zy_top_post_poster").css("height",winH-$("#zy_nav").height()-$("#zy_music_section").height()+"px");

            //隐藏movingtips按钮
            this.hideMovingTips("#zy_landscape_contain");
            this.hideMovingTips("#zy_people_contain");
            this.hideMovingTips("#zy_artifact_contain");
            this.hideMovingTips("#zy_community_contain");

            //更新详情文章的高度
            $("#zy_article_content").css("height",winH-50+"px");
            $("#zy_article_content .allslides-slide").css("height",winH-110+"px");
            $("#zy_article_content .article-main-post").css("height",winH-110+"px")

            //更新位置数值
            ZY.controllerManager.init();
        },

        /**
         * 显示音乐播放器
         */
        showMusicPlayer:function(){
            TweenLite.to("#zy_music_player",0.5,{rotationX:"0deg",transformOrigin:"50% 100%",ease:Back.easeOut})

        },

        /**
         * 隐藏音乐播放器
         */
        hideMusicPlayer:function(){
            TweenLite.to("#zy_music_player",0.5,{rotationX:"90deg",transformOrigin:"50% 100%",ease:Back.easeOut})

        },

        /**
         * 切换音乐播放器显示隐藏
         */
        toggleMiniMusicPlayer:function(){
            if(miniMusicPlayer){
                this.showMusicPlayer()
                miniMusicPlayer=false
            }else{
                this.hideMusicPlayer()
                miniMusicPlayer=true
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
        showPopOut:function(msg,showblackout){
            var pop=$("#zy_popout_win");
            pop.removeClass("zy_hidden").find(".zy_popout_title").html(msg);
            if(showblackout){
                this.showBlackout(9999);
            }
        },

        /**
         * 隐藏消息提示框
         */
        hidePopOut:function(){

            //只有浏览器不支持的时候才会显示wrap，不需要清除。
            $("#zy_popout_win").addClass("zy_hidden");
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

            if(!$("#zy_nav").hasClass("zy_nav_active")){
                top=top-80;
            }
            if(top!= undefined){
                TweenLite.killTweensOf(window);

                //需要减去nav的高度，以为到下面后nav就是fixed不占高度,加5是为了在滚动那里设置nav的状态
                if(target.is("#zy_artifact")){
                    TweenLite.to(window, 1, {scrollTo:{y:top+35, x:0}});
                }else if(target.is("#zy_community")){
                    TweenLite.to(window, 1, {scrollTo:{y:top+35, x:0}});
                }else{
                    TweenLite.to(window, 1, {scrollTo:{y:top+1, x:0}});
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
            var spinnerDOM=$("#zy_spinner_tpl").html();

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
            $("#zy_article_content").find("article").remove();
            me.showBlackout(ZY.config.defaultWrapZindex);
            $("#zy_article_container").animate({left:"0%"},300,function(){
                me.showLoadingSpinner($("#zy_article_content"));
                ZY.dataManager.getPostDetail(post_id);
            });

        },

        /**
         * 隐藏文章详情
         */
        hideArticle:function(){

            //此处调用是因为可能数据还没加载完就被收回
            var me=this;
            me.hideLoadingSpinner($("#zy_article_content"));
            $("#zy_article_container").animate({left:"100%"},300,function(){
                me.hideBlackout();
            });
        },

        /**
         * 显示遮盖层
         * @param {Number} zIndex 此层的css属性z-index
         */
        showBlackout:function(zIndex){
            var wrap=$("#zy_wrap");
            wrap.css("z-index",zIndex); //此句位置和下面不一样是因为可能在显示的同时改变zindex，例如显示视频时
            if(wrap.hasClass("zy_hidden")){
                wrap.removeClass("zy_hidden");
            }
        },

        /**
         * 隐藏遮盖层
         */
        hideBlackout:function(){
            var wrap=$("#zy_wrap");
            if(!wrap.hasClass("zy_hidden")){
                wrap.addClass("zy_hidden");
                wrap.css("z-index",ZY.config.defaultWrapZindex);
            }
        },

        /**
         * 显示文章详情时注入内容，使用juicer
         * @param {Object} data 文章数据对象
         */
        showArticleDetail:function(data){
            var tpl=$("#zy_show_detail_tpl").html();
            var html=juicer(tpl,data);
            var article_content=$("#zy_article_content");
            article_content.append(html);

            ZY.uiManager.hideLoadingSpinner(article_content);
            //视图更新
            this.updateView();
        },

        /**
         * 显示文章中绑定的视频,使用jquery的load，加载后台的一个页面
         * 此时要暂停音乐，并且更改遮盖层的z-index
         * @param {string} url 视频地址
         */
        showVideoDetail:function(url){
            var me=this,loadContainer=$("#zy_show_load_container");
            $("#zy_music_audio")[0].pause(); //暂停音乐
            loadContainer.html("");
            me.showBlackout(9998);
            $("#zy_show_section").removeClass("zy_hidden");
            loadContainer.load(url,function(response, status, xhr){
                me.hideLoadingSpinner($("#zy_article_content"));
                if (status == "error") {
                    me.showPopOut(ZY.config.errorCode.connectionError+xhr.status + " " + xhr.statusText,false);
                }
            });

        },

        /**
         * 显示图片大图
         * @param {String} url 大图的地址
         */
        showImageDetail:function(url){
            this.showBlackout(9998);
            $("#zy_show_section").removeClass("zy_hidden");
            $("#zy_show_load_container").html("<img src='"+url+"'>");
        },

        /**
         * 隐藏显示的视频或者大图
         */
        hideDetail:function(){
            var audio=$("#zy_music_audio")[0];
            this.showBlackout(ZY.config.defaultWrapZindex);
            $("#zy_show_section").addClass("zy_hidden");
            $("#zy_show_load_container").html("");

            //恢复音乐
            if(ZY.music.musicPlaying){
                audio.play();
            }
        }

    }
})();