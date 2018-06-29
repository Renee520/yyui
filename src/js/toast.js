"use scrict"

+$(function() {
  let option = {
    title: '',
    icon: '',
    render: '',
    duration: 2000,
    onOk: {},
  }
  $.toast = function(param) {
    param = Object.assign(option, param);
    
  }
});