
+function(window) {
  "use strict"

  class YYPicker {
    constructor(params) {
      let options = {
        element: 'body',
        title: '请选择日期',
        cancelText: '取消',
        confirmText: '完成',
        linkage: false,         // 联动json数据
        data: [],
        value: [],
        showValue: [],
        onChange: null,
        onConfirm: null,
      };
      this.params = Object.assign(options, params);
      this.close = true;
      this.cols = [];
      this.pickerBox = '';
      this.initHeight = 0;
      this.itemHeight = 30;
      this._active();
    }

    _active() {
      // 选择元素点击事件
      this.params.element.on('click', () => {
        if (this.close) {
          this._init();
          this.pickerBox.addClass('yy_picker--show');
  
          setTimeout(() => {
            if (this.close) this.close = false;
          });
          
          // 取消或完成事件
          $(document).on('tap', (event) => {
            if (event.target.className.indexOf('yy_picker') < 0 && event.target !== this.params.element[0] && !this.close) {
              this._hide();
            }
          });
          this.pickerBox
            .on('click', '.yy_picker__cancel', () => {
              this._hide();
            })
            .on('click', '.yy_picker__confirm', () => {
              // 触发confirm函数
              this.params.onConfirm && this.params.onConfirm(this.params.value, this.params.showValue);
              this._hide();
            });

        }
      });
    }

    _init() {
      this.pickerBox = $(`<div class="yy_picker"><div class="yy_picker__header"><a href="javascript:;" class="yy_picker__cancel yy_text_gray">${this.params.cancelText}</a><a href="javascript:;" class="yy_picker__confirm yy_text_primary">${this.params.confirmText}</a><div class="yy_picker__title">${this.params.title}</div></div><div class="yy_picker__body"><div class="yy_row"></div></div></div>`);

      if (this.params.data && this.params.data.length) {
        if (!this.params.linkage) {
          this.params.data.forEach((col, idx) => {
            if (col && col.value && col.value.length) {
              this.cols.push({
                idx: 0,                   // 每列初始值下标
                len: col.value.length,    // 每列数据长度
              });
              if (this.params.value.length < this.params.data.length) {
                this.params.value[idx] = col.value[0].value || col.value[0];
                this.params.showValue[idx] = col.value[0].name || col.value[0];
              }
              let colBox = `<div class="yy_picker__col"><div class="yy_picker__col_wrap">`;
              col.value.forEach((item, itemIdx) => {
                let value = item.value || item;
  
                colBox += `<div class="yy_picker__col_item">${item.name || item}</div>`;
                if (value === this.params.value[idx]) {
                  this.cols[idx]['idx'] = itemIdx;
                  this.params.showValue[idx] = item.name || item;
                }
              });
              colBox += `</div></div>`;
              this.pickerBox.find('.yy_row').append(colBox);
            }
          });
        } else {
          // 联动数据处理
          this._setLinkageHtml(this.params.data, 0);
        }
      }
      if (this.cols.length) {
        // 加入body

        this.pickerBox.find('.yy_row').append('<div class="yy_picker__select_item"></div>');
        $('body').append(this.pickerBox);
        this.itemHeight = this.pickerBox.find('.yy_picker__col_item').height() || this.itemHeight;
        this.initHeight = (this.pickerBox.find('.yy_picker__body').height()- this.itemHeight) / 2;
       
        this.params.element.val(this.params.showValue.join(' '));

        // 设置每列定顶部距离
        this.cols.forEach((col, idx) => {
          this.pickerBox.find('.yy_picker__col').eq(idx).find('.yy_picker__col_wrap').css('transform', `translate3d(0, ${this.initHeight - col.idx * this.itemHeight}px, 0)`).find('.yy_picker__col_item').eq(col.idx).addClass('yy_picker__col_item--selected');
        });
        

        // 每列添加滑动事件
        this._picker();
      }
    }

    _picker() {
      this.pickerBox.find('.yy_picker__col').forEach((col) => {
        this._slide(col);
      });
      
    }

    _slide(element) {
      // 待重构
      
      let initY = 0;
      let idx = $(element).index();     // 操作列数
      let initScrollY = this.initHeight - this.cols[idx]['idx'] * this.itemHeight;
      let scrollY = initScrollY;
      let translateY = scrollY;
      let maxScrollHeight = (this.cols[idx]['len'] - 1) * this.itemHeight;
      let maxScrollY = initScrollY - maxScrollHeight;
      
      element.addEventListener('touchstart', (event) => {
        if (event.cancelable) {
          // 判断默认行为是否已经被禁用
          if (!event.defaultPrevented) {
            event.preventDefault();
          }
        }
        initY = event.touches[0].pageY;
        idx = $(element).index();
        initScrollY = this.initHeight - this.cols[idx]['idx'] * this.itemHeight;
        scrollY = initScrollY;
        translateY = scrollY;
        maxScrollHeight = (this.cols[idx]['len'] - 1) * this.itemHeight;
        maxScrollY = initScrollY - maxScrollHeight;
      });
      element.addEventListener('touchmove', (event) => {
        if (event.cancelable) {
          // 判断默认行为是否已经被禁用
          if (!event.defaultPrevented) {
              event.preventDefault();
          }
        }
        scrollY = event.touches[0].pageY - initY;
        translateY = initScrollY + scrollY;
        if (translateY < maxScrollY) {
          translateY = initScrollY - maxScrollHeight -(-scrollY - maxScrollHeight) / 3;
        }
        if (scrollY > this.initHeight) {
          translateY = this.initHeight + (scrollY - this.initHeight) / 3;
        }
        translateY = Math.round(translateY);
        let num = this.cols[idx]['idx'] - Math.round(scrollY / 30);
        if (this.cols[idx]['len'] <= num) {
          num = this.cols[idx]['len'] - 1;
        }
        if (num < 0) num = 0;
        $(element).find('.yy_picker__col_wrap').css('transform', `translate3d(0, ${translateY}px, 0)`);
        this._setSelect(element, idx, num);
        if((this.initHeight - translateY) % this.itemHeight === 0 && scrollY !== 0) {
        }
      });

      element.addEventListener('touchend', (event) => {
        let num = this.cols[idx]['idx']-Math.round(scrollY / 30);
        if (this.cols[idx]['len'] <= num) {
          num = this.cols[idx]['len'] - 1;
        }
        if (num < 0) num = 0;
        this.cols[idx]['idx'] = num;
        $(element).find('.yy_picker__col_wrap').css('transform', `translate3d(0, ${this.initHeight - num * this.itemHeight}px, 0)`);
        this._setSelect(element, idx);
      });
    }

    _setSelect(element, idx, itemIdx = this.cols[idx]['idx']) {
      let data = this.params.data;
      let val = '';
      let showVal = '';
      if (this.params.linkage) {
        data = this._getSubValue(data, 0, idx, itemIdx);
        val = data.value || data.name;
        showVal = data.name;
      } else {
        val = data[idx].value[itemIdx].value || data[idx].value[itemIdx];
        showVal = data[idx].value[itemIdx].name || data[idx].value[itemIdx];
      }

      // 有所改动
      if (this.params.value[idx] != val) {
        this.params.value[idx] = val;
        this.params.showValue[idx] = showVal;

        // 联动数据改动相对应的子列数据
        if (this.params.linkage) {
          this._setLinkageHtml(data.sub, idx + 1);
        }

        this.params.onChange && this.params.onChange(this.params.value, this.params.showValue);
        $(element).find('.yy_picker__col_item').removeClass('yy_picker__col_item--selected').eq(itemIdx).addClass('yy_picker__col_item--selected');

        this.params.element.val(this.params.showValue.join(' '));
      }
    }

    // hide
    _hide() {
      this.pickerBox.removeClass('yy_picker--show');
      this.close = true;
      this.pickerBox[0].addEventListener('transitionend', () => {
        this.pickerBox.remove();
      }, false)
    }

    // 
    _setLinkageHtml(data, colNum = 0) {
      if (colNum > this.params.value.length || !data || !data.length) {
        return;
      }

      // 没有设置初始值
      if (!this.params.value[colNum]) {
        this.params.value[colNum] = data[0].value || data[0].name;
        this.params.showValue[colNum] = data[0].name;
      }
      this.cols[colNum] = {
        idx: -1,
        len: 0,
      }

      let flag = this.pickerBox.find('.yy_row').find('.yy_picker__col').eq(colNum).length;    // 此列是否已存在
      let colBoxWrap = $(`<div class="yy_picker__col"><div class="yy_picker__col_wrap"></div></div>`);
      if (flag) {
        colBoxWrap = this.pickerBox.find('.yy_picker__col').eq(colNum);
        colBoxWrap.find('.yy_picker__col_wrap').empty();
      }
      let colBox = '';
      data.forEach((col, idx) => {
        if (col.value === this.params.value[colNum] || col.name === this.params.value[colNum]) {
          this.params.showValue[colNum] = col.name;
          this.cols[colNum] = {
            idx: idx,
            len: data.length,
          }
        }

        colBox += `<div class="yy_picker__col_item">${col.name}</div>`;
      });
      // colBox = $(colBox);
      colBoxWrap.find('.yy_picker__col_wrap').append(colBox);

      // 初始值未找到
      if (!this.cols[colNum].len) {
        this.cols[colNum] = {
          idx: 0,
          len: data.length,
        }
        this.params.value[colNum] = data[0].value || data[0].name;
        this.params.showValue[colNum] = data[0].name;
      }

      // 可能是滑动修改父列联动要修改子列内容
      if (!flag) {
        this.pickerBox.find('.yy_row').append(colBoxWrap);
      }
      // 还有子列
      let selectIdx = this.cols[colNum]['idx'];

      colBoxWrap.find('.yy_picker__col_wrap').css('transform', `translate3d(0, ${this.initHeight - selectIdx * this.itemHeight}px, 0)`).find('.yy_picker__col_item--selected').removeClass('yy_picker__col_item--selected');
      colBoxWrap.find('.yy_picker__col_item').eq(selectIdx).addClass('yy_picker__col_item--selected');

      if (data[selectIdx].sub && data[selectIdx].sub.length) {
        colNum += 1;
        return this._setLinkageHtml(data[selectIdx].sub, colNum);
      }
    }

    // currColNum: 当前找到第currColNum层
    // colNum: 直到找到第colNum层
    _getSubValue(data, currColNum, colNum = 0, currItemIdx) {
      let itemIdx = this.cols[currColNum]['idx'];
      if (currColNum === colNum) {
        itemIdx = currItemIdx;
        return data[itemIdx];
      }
      if (data[itemIdx].sub && data[itemIdx].sub.length) {
        data = data[itemIdx].sub;
        currColNum += 1;
        return this._getSubValue(data, currColNum, colNum, currItemIdx);
      }
      return null;
    }

    // 设置每列定顶部距离
    _setTranslate() {
      this.cols.forEach((col, idx) => {
        let colBoxWrap = this.pickerBox.find('.yy_picker__col').eq(idx).find('.yy_picker__col_wrap');
        colBoxWrap.css('transform', `translate3d(0, ${this.initHeight - col.idx * this.itemHeight}px, 0)`).find('.yy_picker__col_item--selected').removeClass('yy_picker__col_item--selected');
        colBoxWrap.find('.yy_picker__col_item').eq(col.idx).addClass('yy_picker__col_item--selected');
      });
    }


  }

  window.YYPicker = YYPicker;

}(window);