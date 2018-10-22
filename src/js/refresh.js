
+function(window) {
  "use strict"

  class YYRefresh {
    constructor(params) {
      var options = {
        container: 'body',
        triggerDistance: 100,
        text: '正在加载',
      }
      this.params = Object.assign(options, params);
      this.initY = 0;
      this.scrollY = 0;
      this.pullBox = null;
      this.scrollBox = null;
      this.loading = false;
    };

    _init(box, type='pull') {
      if(type === 'pull') {
        $(box).addClass('yy_refresh__pull--animate');
        var pullBox = $('<div class="yy_refresh__pull_box yy_text_center"><i class="icon icon-down-1"></i><span>下拉刷新</span></div>');
        this.pullBox = pullBox;
        $(box).prepend(pullBox);
      }
      if (type === 'scroll') {
        // 判断是否填满屏幕
        let offsetTop = box.offsetTop;
        let containerHeight = box.scrollHeight;
        let clientHeight = document.documentElement.clientHeight;
        if (clientHeight - offsetTop - containerHeight > 0) return;
        var scrollBox = $(`<div class="yy_refresh__scroll--animate yy_text_center"><i class="icon icon-spin5 animate-spin"></i><span>${this.params.text}</span></div>`);
        this.scrollBox = scrollBox;
        $(box).append(scrollBox);
      }
    };

    _pullRefreshActive(box, callback) {
      box.addEventListener('touchstart', (event) => {
        this.initY = event.touches[0].pageY;
      });
      box.addEventListener('touchmove', (event) => {
        if (event.cancelable) {
          // 判断默认行为是否已经被禁用
          if (!event.defaultPrevented) {
              event.preventDefault();
          }
        }
        this.scrollY = event.touches[0].pageY - this.initY;
        let scrollY = 0;
        if (this.scrollY <= this.pullBox.height()) {
          scrollY = this.scrollY;
        } else {
          scrollY = Math.pow(this.scrollY, 0.7) + 25;
          if (scrollY >= 100) scrollY = 100;
          if(this.scrollY >= this.params.triggerDistance) {
            this.pullBox.find('i.icon').removeClass('icon-down-1').addClass('icon-up-1');
            this.pullBox.find('span').html('释放刷新');
          }
        }
        $(box).css('transform', `translate3d(0, ${scrollY}px, 0)`).addClass('yy_refresh__pull--active');
      });
      box.addEventListener('touchend', (event) => {
        if(this.scrollY >= this.params.triggerDistance) {
          $(box).css('transform', `translate3d(0, ${this.pullBox.height()}px, 0)`).addClass('yy_refresh__pull--end');
          this.pullBox.find('i.icon').removeClass('icon-up-1 icon-down-1').addClass('icon-spin5 animate-spin');
          this.pullBox.find('span').html('正在刷新');
        }else {
          this.pullRefreshEnd();
        }
        callback(this.scrollY >= this.params.triggerDistance ? null : 'refresh fail');
        this.initX = 0;
        this.initY = 0;
        this.scrollX = 0;
        this.scrollY = 0;
      });
    };

    _create(type='pull', callback) {
      var box = $(this.params.container)[0] || $(this.params.container);
      if(!box && !box.length) {
        return callback('no such container!');
      }
      this._init(box, type);
      if (type === 'pull') {
        this.loading = true;
        this._pullRefreshActive(box, callback);
      }
      
      if (type === 'scroll') {
        let that = this;
        that.loading = false;
        window.onscroll = function(event){
          let scrollTop = document.documentElement.scrollTop || this.document.body.scrollTop;
          let documentHeight = document.documentElement.scrollHeight;
          let clientHeight = document.documentElement.clientHeight;
          let triggerDistance = documentHeight - scrollTop - clientHeight;
          if(triggerDistance < (that.scrollBox.height() / 2) && triggerDistance >= 0 && !that.loading) {
            callback(null);
            that.loading = true;
          }
        }
      } 
    };

    pullRefresh(callback) {
      this._create('pull', callback)
    }

    pullRefreshEnd() {
      var box = $(this.params.container)[0] || $(this.params.container);
      $(box).css('transform', `translate3d(0, 0, 0)`).removeClass('yy_refresh__pull--active yy_refresh__pull--end');
      this.pullBox.find('i.icon').removeClass('icon-spin5 animate-spin').addClass('icon-down-1');
      this.pullBox.find('span').html('下拉刷新');
      this.loading = false;
    };

    scrollRefresh(callback) {
      this._create('scroll', callback)
    }

    scrollRefreshEnd({over = false}) {
      this.loading = false;
      if(over) {
        this.loading = true;
        this.scrollBox.empty().html('<span>已加载全部</span>');
      }
    };
  }

  window.YYRefresh = YYRefresh;

}(window);