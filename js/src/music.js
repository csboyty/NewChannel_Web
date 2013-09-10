/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午5:25
 * 音乐播放器模块
 */
var ZY=ZY||{};
ZY.music={

    /**
     * 将数据注入到页面的歌曲列表,使用juicer
     * @param {Array} musics 音乐对象数组
     */
    setMusicList:function(musics){
        var tpl = $("#zy_music_tpl").html();
        var html = juicer(tpl,{musics:musics});
        $("#zy_music_list").html(html);

        //设置第一首音乐信息
        $("#zy_music_audio").attr("src",musics[0].music_path);
        $("#zy_music_title").html(musics[0].music_title);
    },

    /**
     * 音乐播放、暂停事件逻辑
     */
    musicControlHandler:function(){
        var musicControl=$("#zy_music_control");
        if(musicControl.hasClass("zy_music_play")){
            this.musicPlay();
        }else if (musicControl.hasClass("zy_music_pause")){
            this.musicPause();
        }
    },

    /**
     * 音乐播放
     */
    musicPlay:function(){
        $("#zy_music_audio")[0].play();
        $("#zy_music_control").addClass("zy_music_pause").removeClass("zy_music_play");
    },

    /**
     * 音乐暂停
     */
    musicPause:function(){
        $("#zy_music_audio")[0].pause();
        $("#zy_music_control").removeClass("zy_music_pause").addClass("zy_music_play");
    },

    /**
     * 上一首
     */
    musicPrev:function(){
        $("#zy_music_timeline").stop().width("0%");
        var activeMusic=$(".active_music");
        var target=activeMusic.prev().length!=0?activeMusic.prev():$("#zy_music_list li:last");
        activeMusic.removeClass("active_music");
        $("#zy_music_audio").attr("src",target.html());//设置音乐路径
        $("#zy_music_author").html(target.data("music-author"));
        $("#zy_music_title").html(target.data("music-title"));
        target.addClass("active_music");

        $("#zy_music_control").addClass("zy_music_pause").removeClass("zy_music_play");
    },

    /**
     * 下一首
     */
    musicNext:function(){
        $("#zy_music_timeline").stop().width("0%");
        var activeMusic=$(".active_music");
        var target=activeMusic.next().length!=0?activeMusic.next():$("#zy_music_list li:first");
        activeMusic.removeClass("active_music");
        $("#zy_music_audio").attr("src",target.html());//设置音乐路径
        $("#zy_music_author").html(target.data("music-author"));
        $("#zy_music_title").html(target.data("music-title"));
        target.addClass("active_music");

        $("#zy_music_control").addClass("zy_music_pause").removeClass("zy_music_play");
    },

    /**
     * 播放结束事件逻辑，自动下一首
     */
    musicEndHandler:function(){
        var me=this;
        $("#zy_music_audio")[0].addEventListener("ended",function(){
            me.musicNext();
        });
    },

    /**
     * 音乐进度条
     */
    musicTimeLine:function(){
        $("#zy_music_audio")[0].addEventListener("timeupdate",function(){
            var audio=$(this)[0];
            var totalTime=audio.duration;
            var currentTime=audio.currentTime;
            $("#zy_music_timeline").css("width",currentTime/totalTime*100+"%");
        });
    }
};
