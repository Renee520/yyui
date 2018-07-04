
+function(window) {
  "use scrict"

  class YYToast {
    constructor(params) {
      let option = {
        theme: 'transparant',
        title: null,
        icon: null,
        duration: 2000,
        onOk: null,
      }
      this.params = Object.assign(option, params);
    };

    _create(params, type) {
      let that = this;
      that.params = Object.assign(that.params, params);
      console.log(that.params);
      if (type !== 'loading') {
        if (type === 'success') {
          that.params.title = that.params.title || '操作成功';
          that.params.icon = '<i class="icon icon-ok"></i>';
        } else if (type === 'cancel') {
          that.params.title = that.params.title || '操作失败';
          that.params.icon = '<i class="icon icon-cancel"></i>';
        } else if (type === 'text') {
          that.params.title = that.params.title || '';
          that.params.icon = null;
        } else if (type === 'custom') {
          that.params.title = that.params.title || '自定义';
          that.params.icon = '<i class="icon icon-ok"></i>';
        }
      } else {
        that.params.title = that.params.title || '加载中';
        that.params.icon = that.params.icon || '<i class="icon animate-spin icon-spin6"></i>';
      }
      //  else if (type === 'custom' && (that.title || that.icon)) {
        
      // }

      let html = 
        $('<div class="yy_toast yy_toast--'+ that.params.theme +'">' +
          '<div class="yy_mask">' +
          '</div>' +
          '<div class="yy_toast__body">' +
          (
            that.params.icon ? 
            '<div class="yy_toast__icon">' +
              that.params.icon +
            '</div>'
            : ''
          ) +            
            '<div class="yy_toast__text">' +
              '<span>'+ that.params.title +'</span>' +
            '</div>' +
          '</div>' +
        '</div>');

      html.appendTo(document.body);
      html.fadeIn('fast');
      if (type !== 'loading') {
        setTimeout(() => {
          that._hide(html);
          
        }, that.params.duration);
      }

    };

    _hide(obj) {
      let that = this;
      obj = obj || $('.yy_toast');
      obj[0].addEventListener("animationend webkitAnimationEnd", (() => {
        that.params.onOk && that.params.onOk();
        obj.remove();
      })());  // Chrome, Safari 和 Opera
    }

    success(params) {
      this._create(params, 'success');
    }

    cancel(params) {
      console.log('cancel', params);
      this._create(params, 'cancel');
    }

    text(params) {
      this._create(params, 'text');
    }

    custom(params) {
      this._create(params, 'text');
    }

    loading(params) {
      this._create(params, 'loading');
    }

    hideLoading() {
      this._hide()
    }
  }

  window.YYToast = YYToast;

}(window);