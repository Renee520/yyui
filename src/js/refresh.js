
+function(window) {
  "use scrict"

  class YYRefresh {
    constructor(params) {
      var options = {
        container: 'body',
        triggerDistance: 100,
      }
      this.params = Object.assign(options, params);
      this.initX = 0;
      this.initY = 0;
      this.scrollX = 0;
      this.scrollY = 0;
      this.pullBox = null;
      this.loading = false;
    };

    _init(box, type='pull') {
      if(type === 'pull') {
        $(box).addClass('yy_refresh__pull--animate');
        var pullBox = $('<div class="yy_refresh__pull_box yy_text_center"><i class="icon icon-down-1"></i><span>下拉刷新</span></div>');
        this.pullBox = pullBox;
        $(box).prepend(pullBox);
      }
    };

    _create(type, callback) {
      var box = $(this.params.container)[0] || $(this.params.container);
      this._init(box);
      box.addEventListener('touchstart', (event) => {
        this.initX = event.touches[0].pageX;
        this.initY = event.touches[0].pageY;
      });
      box.addEventListener('touchmove', (event) => {
        if (event.cancelable) {
          // 判断默认行为是否已经被禁用
          if (!event.defaultPrevented) {
              event.preventDefault();
          }
        }
        // event.preventDefault();
        this.scrollX = event.touches[0].pageX - this.initX;
        this.scrollY = event.touches[0].pageY - this.initY;
        let scrollY = 0;
        if (this.scrollY <= 50) {
          scrollY = this.scrollY;
        } else {
          scrollY = Math.pow(this.scrollY, 0.7) + 25;
          if (scrollY >= 100) scrollY = 100;
          if(this.scrollY >= 100) {
            this.pullBox.find('i.icon').removeClass('icon-down-1').addClass('icon-up-1');
            this.pullBox.find('span').html('释放刷新');
          }
        }
        $(box).css('transform', `translate3d(0, ${scrollY}px, 0)`).addClass('yy_refresh__pull--active');

      });
      box.addEventListener('touchend', (event) => {
        console.log('object', this.scrollY);
        if(this.scrollY >= 100) {
          $(box).css('transform', `translate3d(0, ${this.pullBox.height()}px, 0)`).addClass('yy_refresh__pull--end');
          this.pullBox.find('i.icon').removeClass('icon-up-1 icon-down-1').addClass('icon-spin5 animate-spin');
          this.pullBox.find('span').html('正在刷新');
        }else {
          this.pullRefreshEnd();
        }
        callback(this.scrollY >= 100 ? null : 'refresh fail');
        this.initX = 0;
        this.initY = 0;
        this.scrollX = 0;
        this.scrollY = 0;
      });
    };

    pullRefresh(callback) {
      this._create('pull', callback)
    }

    pullRefreshEnd() {
      var box = $(this.params.container)[0] || $(this.params.container);
      $(box).css('transform', `translate3d(0, 0, 0)`).removeClass('yy_refresh__pull--active yy_refresh__pull--end');
      this.pullBox.find('i.icon').removeClass('icon-spin5 animate-spin').addClass('icon-down-1');
      this.pullBox.find('span').html('下拉刷新');
    };
  }

  window.YYRefresh = YYRefresh;

}(window);