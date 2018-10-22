
+function(window) {
  "use strict"

  class YYDialog {
    // constructor(params) {
    //   this.params = {
    //     theme: 'transparant',
    //     title: null,
    //     icon: null,
    //     duration: 2000,
    //     onOk: null,
    //   }
    // };

    _create(params, type) {
      this.params = {
        theme: 'transparant',
        title: '',
        content: '',
        cancelText: '取消',
        confimrText: '确定',
        onOk: null,
        onCancel: null,
      }
      let that = this;
      that.params = Object.assign(that.params, params);

      let footer = '';
      if (type === 'alert') {
        footer = `<div class="yy_cell">
                    <div class="yy_dialog__confirm yy_dialog__footer-btn yy_text_primary">${that.params.confimrText}</div>
                  </div>
        `;
      } else {
        footer = `
          <div class="yy_cell">
            <div class="yy_dialog__cancel yy_dialog__footer-btn yy_text_gray">${that.params.cancelText}</div>
            </div>
            <div class="yy_cell">
            <div class="yy_dialog__confirm yy_dialog__footer-btn yy_text_primary">${that.params.confimrText}</div>
          </div>
        `;
      }
      

      let html = 
        $(`<div class="yy_dialog yy_dialog--black_trans">
            <div class="yy_mask"></div>
            <div class="yy_dialog__body-wrap">
              <div class="yy_dialog__body">
                <div class="yy_dialog__title">${that.params.title}</div>
                <div class="yy_dialog__content">${that.params.content}</div>
              </div>
              <div class="yy_dialog__footer">
                <div class="yy_row">${footer}</div>
              </div>
            </div>
          </div>`);

      html.appendTo(document.body);
      html.fadeIn('fast');
      html.on('tap', '.yy_dialog__cancel', () => {
        that._hide(html, 'cancel');
      })
      .on('tap', '.yy_dialog__confirm', () => {
        that._hide(html, 'confirm');
      });
    };

    _hide(obj, type) {
      let that = this;
      obj = obj || $('.yy_dialog');
      obj.fadeOut(100);
      setTimeout(() => {
        type === 'confirm' ? that.params.onOk && that.params.onOk() : that.params.onCancel && that.params.onCancel();
        obj.remove();
      }, 100);
    }

    alert(params) {
      this._create(params, 'alert');
    }

    confirm(params) {
      this._create(params);
    }

    input(params) {
      this._create(params);
    }
  }

  window.YYDialog = YYDialog;

}(window);