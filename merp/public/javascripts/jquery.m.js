/******************* base javascript object extend ****************************************/
/**
 * window.event.cancelBubble   => ie
 * return false || event.stopPropageation() => firefox
 * (event || window.event).keyCode => ie firefox
 */
$.extend(String.prototype, {
  to_obj: function(){
    return eval('(' + this + ')');
  }    
});
$.extend(Array.prototype, {
  to_str: function() {
    return this.join('');
  },
  rm: function(v){
    var slf = this;
    this.each(function(ele, index){
      if(v == ele) slf.splice(index, 1);
    });
  },
  map: function(callback) {
    var b = [];
    this.each(function(element, i) {
      b.push(callback(element, i));
    });
    return b;
  },
  find: function(callback){
    for( var i = 0; i < this.length; i++) if(callback(this[i], i)) return this[i];
    return null;
  },
  each: function(callback) {
    for (var i = 0; i < this.length; i++) callback(this[i], i);
  }
});
/** Function.prototype.r_this = function(fn){
  var slf = this;
  return function() { return fn.apply(slf, arguments); }
}**/
var Util = {
  base_path: '',
  loading: '<div style="padding: 10px;"><div class="loading"></div></div>',
  dynamic_loading: {
    css: function(path) {
      if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.href = path;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      head.appendChild(link);
    },
    js: function(path) {
      if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
      }
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');
      script.src = path;
      script.type = 'text/javascript';
      head.appendChild(script);
    }
  },
  clear_selected_text: function(){
    //clear text selected
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
  },

  mouse_xy: function(event){
    event = event || window.event;
    if(event.pageX || event.pageY)
      return {x: event.pageX, y: event.pageY}
    else
      return {x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: event.clientY + document.body.scrollTop - document.body.clientTop}
  },

  //得到url的基本路径， 如：http://127.0.0.1:8080/vPro
  get_base_path: function() {
    var url = window.location.href;
    url = url.split('//')[1].split('/');
    var returl = "http://" + url[0] + "/";
    if (url[1] == 'vPro') returl += url[1];

    //alert(returl);
    return returl;
  },
  request_context_path: function(path) {
    if (this.base_path == '') this.base_path = this.get_base_path();
    return this.base_path + path;
  },

  hide_if_click_outside: function(slf, namespace, callback){
    var arg_length = arguments.length;

    $(window).unbind('click.'+namespace).bind('click.'+namespace, function(event){
      //alert(slf.html());
      if(!Util.inside(event, slf)){ 
        if(arg_length == 2)
          slf.hide();
        else callback();
        //$(this).unbind('click');
      }
      return false;
    });
  },
  inside: function(event, slf) {
    var offset = slf.position();
    offset.right = offset.left + slf.outerWidth();
    offset.bottom = offset.top + slf.outerHeight();
    
    //alert("right="+offset.right+":left="+offset.left+":pageX="+event.pageX+":pageY="+event.pageY);
    return event.pageY < offset.bottom &&
           event.pageY > offset.top &&
           event.pageX < offset.right &&
           event.pageX > offset.left;
  },
  get_page_height: function() {
    //if (self.innerHeight) {	// all except Explorer
      //windowHeight = self.innerHeight;
    //} else
    if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
      return document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
      return document.body.clientHeight;
    }
  },
  ajax: function(opts){
    //opts['contentType'] = 'text/json'
    opts['dataType'] = opts['dataType'] || 'json';
    $.ajax(opts);
  },
  get: function(arg1, arg2, arg3, arg4){
    //alert(arguments[0] + '::');

    var opts = {type: 'get', url: arguments[0], data: arguments[1], success: arguments[2]};

    if(arguments.length == 4)
      opts['dataType'] = arguments[3];

    this.ajax(opts);
  },
  post: function(arg1, arg2, arg3, arg4){
    var opts = {type: 'post', url: arguments[0], data: arguments[1], success: arguments[2]};
    if(arguments.length == 4)
          opts['dataType'] = arguments[3];

    this.ajax(opts);
  },
  put: function(arg1, arg2, arg3, arg4){
    arguments[1]['_method'] = 'put';
    this.post(arg1, arg2, arg3, arg4);
  },
  del_all: function(arg1, arg2, arg3, arg4){
    this.post(arg1, arg2, arg3, arg4);
  },
  del: function(arg1, arg2, arg3, arg4){
    arguments[1]['_method'] = 'delete';
    this.post(arg1, arg2, arg3, arg4);
  }
};
/**************************** jQuery menu *********************************/
(function() {
  function h_menu(el, opts) {
    $.extend(true, this, h_menu.defaultset, opts || {});
    this.menu = $(el);
    var self = this;
    this.menu.bind('click.menu', function() {
      var offset = $(this).offset();
      offset.top = parseInt($(this).parent().height());
      self.init(offset);
      return false;
    });
  }

  h_menu.defaultset = {
    json: [] //[{target: '_self', url: 'javascript:void(0)', text: 'aaa'}]
  }

  h_menu.prototype = {
    init: function(offset) {
      if($('div.h-menu').html() != null)
        $('div.h-menu').remove();
      else
        $('body').append(this.div(this.json, offset));
      Util.hide_if_click_outside($('div.h-menu'), 'h-menu', function(){
        $('div.h-menu').remove();    
      });
    },
    div: function(ary, offset) {
      return ['<div style="width: 100px; left:', offset.left, 'px; top:', offset.top, 'px;" class="h-menu">', this.ul(ary), '</div>'].to_str();
    },
    ul: function(ary) {
      var self = this;
      return ['<ul>', ary.map(function(element) {
        return self.li(element);
      }).to_str(), '</ul>'].to_str();
    },
    li: function(obj) {
      return ['<li>', '<a style="width:100px;" target="', obj.target || '_self', '" href="', obj.url || 'javascript:void(0);', '">', obj.text, '</a>', '</li>'].join('');
    }
  }

  $.fn.menu = function(opts) {
    this.each(function() {
      new h_menu(this, opts);
    });
  }

})(jQuery);
/********************************** jQuery select *********************************/
(function(){
  function select(el, opts){
    this.sel = $(el);
    $.extend(true, this, select.defaultset, opts || {});
    this.before();
    this.init(); 

    var slf = this;
    Util.hide_if_click_outside(this.sel, 'select', function(){
      slf.sel.removeClass('sel-icon-sel');
      slf.sel_menu.hide();
    });
  }
  select.defaultset = {
    dynamic: false,
    json: [], /*** [{id: '', name: ''},{id: '', name: ''}...]  ***/
    pros: [], /*** [id, name] ****/
    cache: [],
    change: function(){}
  }

  select.prototype = {
    before: function(){
    },
    init: function(){
      this.sel.append(this.head());

      this.sel_menu = $('.sel-menu', this.sel);
      // set value input
      this.inputs = $('input', this.sel);
      this.v_show = $('a[name=v_show]', this.sel);
      //this.simple_sel = $('.simple-sel', this.sel);

      this.sel_menu.html(this.ul());
      var self = this;

      this.sel.mouseover(function(){ $(this).addClass('hover');  })
        .mouseout(function(){ $(this).removeClass('hover'); })
        .click(function(){
          var my = $(this);
          if(my.hasClass('sel-icon-sel')){
            self.sel_menu.hide();
            my.removeClass('sel-icon-sel');
          }else{
            self.sel_menu.show();
            my.addClass('sel-icon-sel');
          }
          return false;
        });
      //select 
      $('ul li a', this.sel_menu).click(function(){
        var cobj = self.cache[this.name];
        $(self.inputs[0]).val(cobj.id);
        //$(self.inputs[1]).val(cobj.name);
        self.v_show.text(cobj.name);
        self.sel_menu.hide();
        //return false;
      });
     
    }, 
    ul: function(){
      /*** <span class="arrow"></span> ****/
      var self = this;
      return ['<ul>', 
       this.json.map(function(ele){ 
         self.cache[ele.id] = ele;
         return ['<li><a href="javascript:void(0);" name="', ele.id ,'">', ele.name, '</a></li>'].to_str(); 
       }).to_str(),
       '</ul>'].to_str();
    },
    head: function(){
      var offset = this.sel.offset();
      //alert(offset.left);
      var dkey = this.sel.attr('key');
      var dv = {id: '', name: ''};
      if(typeof dkey != 'undefined' || dkey != '')
        dv = this.json.find(function(ele){ return ele.id == dkey; })
      return ['<span>',
            //this.pros.map(function(ele){})
            '<input type="hidden" name="', this.sel.attr('name'),'" value="', dv.id,'"/>',
            //'<input type="hidden" name="', this.pros[1],'" value="', dv.name,'"/>',
            '<a href="javascript:void(0);" name="v_show">',dv.name,'</a>',
            '<a class="drop-icon icon-bt" href="javascript:void(0);"></a>',
          '</span>',
          '<div class="sel-menu" style="display:none; left: ',offset.left,'px; top: ',offset.top + this.sel.height() + 3,'px;"></div>'].to_str();
    }
  }

  $.fn.select = function(opts){
    this.each(function(){ 
        new select(this, $(this).attr('data').to_obj()); 
    });
  }

})(jQuery);

/********************************** jQuery tree ***********************************/
(function() {
  function tree(el, opts) {
    this.tree = $(el);
    $.extend(true, this, tree.defaultset, opts || {});

    this.init();
  }
  tree.defaultset = {
    root: {
      id: 'root',
      text: 'root',
      url: '',
      cls: 'j-tree-folder-open',
      leaf: 0,
      children: []
    },
    pobj: {
      level: -1
    },
    //parent obj
    dynamic: false,
    // true load more times, false load one time
    curr_click_node: null,
    cache: {},
    //key => obj.id, key => obj
    map: {},
    //key => obj.id, key => obj.parent.childrens
    before_node_click: null,
    params: {
      pid: '-1'
    },
    is_move: false,
    is_context_menu: false, //是否需要
    is_drag: false,
    is_mouse_down: false,   //mouse left key down
    //url params, default pid=-1
    click: function() {},
    append_after: function(){},
    update_after: function(){},
    move_after: function(){},
    remove_after: function(){}
  }

  tree.prototype = {
    init: function() {
      // init data
      this.node_root();
      this.loading($('#'+this.root.id, this.tree));
    },
    set_before_node_click: function(obj) {
      if (this.before_node_click != null) this.before_node_click.removeClass('j-tree-node-selected');
      this.before_node_click = $(obj);
    },
    node_mouse_event: function() {
      var obj = $('div.j-tree-node', this.tree);
      var self = this;
      obj.unbind('.tree').bind('click.tree', function() {
        self.set_before_node_click(this);
        $(this).addClass('j-tree-node-selected');
        self.click(this, self.cache[obj.attr('id')]);
        self.curr_click_node = $(this);
      }).bind('mouseenter.tree', function() {
        $(this).addClass('j-tree-node-hover');
        //alert(obj);
      }).bind('mouseleave.tree', function() {
        $(this).removeClass('j-tree-node-hover');
      }).bind('contextmenu.tree', function(event){
        //alert('contextmenu::::')
        $(this).click();
        //alert($(this).html())
        self.is_context_menu && self.context_menu(event);
        return false;
      });

      // insert div
      this.is_drag && $('span.j-tree-title', obj).bind('mousedown.tree', function(evt){
        evt = evt || window.event;
        //alert(evt.button)
        if(evt.button == 2) return;

        self.is_mouse_down = true;

        //var div_self = $(this);
        $(this).parent().click();

        $('#tree-move-tip').remove();
        var b_offset = Util.mouse_xy(evt);
        b_offset.x += 10;
        b_offset.y += 10;

        var tip = $('<div id="tree-move-tip" class="sel-menu" style="display: none; left: '+b_offset.x+'px; top: '+b_offset.y+'px"><ul><li style="padding-left: 10px;">'+$(this).text()+'</li></ul></div>');
        $(document.body).append(tip);

        $(window).unbind('mousemove.tree').bind('mousemove.tree', function(event){

          if(!self.is_mouse_down) return;

          self.is_move = true;

          Util.clear_selected_text();
          if(tip.css('display') == 'none') tip.show();

          var offset = Util.mouse_xy(event);
          if((offset.x - b_offset.x) != 0 || (offset.y - b_offset.y) != 0){
            tip.css('left', (offset.x + 10) + 'px').css('top', (offset.y + 10) + 'px');
            b_offset = offset;
          }
          //return false;
        });

        //window key_down => move => key_up
        $(window).unbind('mouseup.tree').bind('mouseup.tree', function(){
          //alert(self.is_mouse_down)
          self.is_mouse_down = false;
          if(!self.is_move) return ;
          var selected = $('div.j-tree-node-selected', self.tree);
          var hover = $('div.j-tree-node-hover', self.tree);
          var before_data_obj = self.cache[hover.attr('id')];

          self.move_after(self.cache[selected.attr('id')], before_data_obj, selected, function(obj){
            self._remove(selected);
            self._append(before_data_obj, hover, obj);
          });

          $(this).unbind('.tree');
          $('#tree-move-tip').remove();

          self.is_move = false;
        })
        //return false;
      });

    },
    context_menu: function(event){
      var self = this;
      var offset = Util.mouse_xy(event);
      remove_context();
      var context = $(['<div id="context-menu-tree" class="sel-menu" style="left: ',offset.x, 'px; top: ',offset.y, 'px;">',
        '<ul>',
          '<li><a href="javascript:void(0);" id="add">Add Child</a></li>',
          '<li><a href="javascript:void(0);" id="update">Modify Child</a></li>',
          '<li><a href="javascript:void(0);" id="remove">Remove</a></li>',
        '</ul>',
        '</div>'].to_str());
      $('a', context).click(function(){
        var id = $(this).attr('id');
        if(id == 'add'){
          self.append();
        }else if(id == 'remove'){
          self.remove();
        }else if(id = 'update'){
          self.update();
        }

        remove_context();
      });

      var cnt = 0;
      Util.hide_if_click_outside(context, 'context-menu-tree', function(){
        if(cnt++ > 0) remove_context();
      })

      $(document.body).append(context);

      function remove_context(){
        $('#context-menu-tree').remove();
      }
    },
    hit_mouse_event: function(obj) {
      var self = this;
      var pt = obj;
      var hit = $('span.j-tree-hit-icon', obj);
      var nt = hit.next();
      hit.unbind('.tree').bind('click.tree', function() {
        if (this.className.indexOf('plus') != -1) {
          this.className = this.className.replace('plus', 'minus');
          nt.removeClass('j-tree-folder');
          nt.addClass('j-tree-folder-open');
          //open
          self.loading(pt);
        } else if (this.className.indexOf('minus') != -1) {
          this.className = this.className.replace('minus', 'plus');
          nt.removeClass('j-tree-folder-open');
          nt.addClass('j-tree-folder');

          //close
          obj.next().hide();
        }
        return false;
      }).bind('mouseenter.tree', function() {
        return true;
      }).bind('mouseleave.tree', function() {
        return true;
      });
    },
    node_root: function(rt) {
      var root = ['<ul class="j-tree">'];
      root.push(this.ul(null, [this.root]));
      root.push('</ul>');
      this.tree.html(root.join(''));
      this.hit_mouse_event($('#'+this.root.id, this.tree));
    },
    load_data: function(obj) {
      var pid = obj.attr('id');
      var c = this.cache[pid];
      var url = this.root.url;
      /**if (typeof c != 'undefined') {
        url = c.url || '';
        this.pobj = c;
      }**/

      var self = this;
      this.params['pid'] = pid;
      //setTimeout(function(){
      if (obj.next().html() == '' || this.dynamic) {
        Util.get(url, this.params,
        function(json) {
          self.after(obj, json);
        }, 'json');
      } else this.after(obj);
      //}, 1000);
    },
    after: function(obj, ary) {
      if (arguments.length == 2 && ary.length > 0) obj.next().html(this.ul(obj, ary)).slideDown();
      else if (arguments.length == 1 && obj.next().html() != '') obj.next().slideDown();
      var span_icon = $('span.j-tree-icon', obj);
      span_icon.removeClass('j-tree-loading');
      span_icon.addClass('j-tree-folder-open');

      //hit event over out click
      this.node_mouse_event();

      var self = this;
      $('div', obj.next()).each(function() {
        self.hit_mouse_event($(this));
      });
    },
    loading: function(obj) {
      if (obj == null) return;
      var span_icon = $('span.j-tree-icon', obj);
      span_icon.removeClass('j-tree-folder-open');
      span_icon.addClass('j-tree-loading');
      this.load_data(obj);
    },
    ul: function(obj, ary) {
      var self = this;
      // if obj.next == null

      if(ary instanceof Array){
        return ary.map(function(element, index){ 
          return ['<li>', self.div(element, index, ary.length, obj), '</li>'].to_str();
        }).to_str();
      }else return '';
    },
    div: function(data_obj, index, size, dom_obj, is_modify_dom) {
      //obj.level = this.pobj.level + 1;
      this.cache[data_obj.id] = data_obj;

      //data_obj.level = parseInt(data_obj.level);
      var level = 0;
      if(dom_obj != null)
        level = parseInt(dom_obj.attr('level')) + 1;

      data_obj.leaf = (data_obj.leaf && parseInt(data_obj.leaf)) || 0;
      var div = ['<div class="j-tree-node" id="', data_obj.id, '" leaf="', data_obj.leaf, '" level="', level,'">'];
      //if (level > 0) div.push('<span class="j-tree-indent"></span>');
      //else div.push('<span class="j-tree-hit"></span>');


      if(dom_obj != null){
        var parent_is_leaf = true;
        //console.log(dom_obj.parent().parent().parent().next().html())
        if(dom_obj.parent().next().html() == null)  parent_is_leaf = false

        //var indent_length = dom_obj.find('span.j-tree-indent').length;
        //alert(parent_is_leaf)

        dom_obj.children().each(function(){
          //alert($(this).html())
          //alert(this.className)
          if($(this).hasClass('j-tree-indent') || $(this).hasClass('j-tree-elbow-line')){
            //alert(this.className)
            div.push('<span class="'+this.className+'"></span>')
          }
        })

        //console.log(data_obj.leaf)
        if(!parent_is_leaf){
          if(!is_modify_dom)
            div.push('<span class="j-tree-indent"></span>');
        }else{
          //if(data_obj.leaf == '0')
          if(!is_modify_dom)
            div.push('<span class="j-tree-hit j-tree-elbow-line"></span>');
        }
      }

      div.push('<span class="j-tree-hit-icon j-tree-elbow', this.elbow(data_obj.cls, data_obj.leaf, index, size), '"></span>', '<span class="j-tree-icon ', this.leaf(data_obj.cls, data_obj.leaf), '"></span>', '<span class="j-tree-title">', (data_obj.text || data_obj.name), '</span>', '</div><ul style="display:none;"></ul>');
      return div.join('');
    },
    leaf: function(cls, leaf) {
      if (leaf > 0) return cls || 'j-tree-leaf';
      else return cls || 'j-tree-folder';
    },
    elbow: function(cls, leaf, index, size) {
      if (leaf > 0) {
        if (index == size - 1) return '-end';
        else return '';
      } else {
        var str = '';
        if (index == size - 1) str = '-end';
        if (cls == 'j-tree-folder-open') str += '-minus';
        else str += '-plus';
        return str;
      }
    },
    append: function() {
      //$.subox();
      var self = this;
      var object = this.curr_click_node;
      var data_obj = this.cache[object.attr('id')];

      this.append_after(data_obj, object, function(obj){
        self._append(data_obj, object, obj);
      })

    },
    _append: function(before_data_obj, dom_obj, after_data_obj){
      if(before_data_obj.leaf == 1){
          //
        var p_object = dom_obj.parent();
        //p_object.remove();
        var p_length = p_object.parent().children().length;
        //alert(p_length+':::')
        before_data_obj.leaf = 0;
        dom_obj = $(this.div(before_data_obj, p_length - 1, p_length, dom_obj, true));
        p_object.html(dom_obj);

        //hit event over out click

      }

      var child_length = dom_obj.next().children().length;
      if(child_length > 0){
        // modify icon +
        var elbow_end = dom_obj.next().children(':last').children('div:first').find('span.j-tree-elbow-end');
        elbow_end.removeClass('j-tree-elbow-end');
        elbow_end.addClass('j-tree-elbow');
      }
      dom_obj.next().append(['<li>', this.div(after_data_obj, child_length - 1, child_length, dom_obj, false), '</li>'].to_str());

      this.node_mouse_event();
      this.hit_mouse_event(dom_obj);
    },
    update: function(){
      var obj = this.curr_click_node;
      var data_obj = this.cache[obj.attr('id')];
      this.update_after(data_obj, obj, function(json){
        obj.find('span.j-tree-title').text(json.name || json.text);
      });
    },
    remove: function(){
      var obj = this.curr_click_node;
      var self = this;
      this.remove_after(this.cache[obj.attr('id')], obj, function(){
        self._remove();
      })

    },
    _remove: function(){
      var obj = this.curr_click_node;
      if(obj.parent().next().length <= 0){
        obj.parent().prev().find('span.j-tree-hit-icon').each(function(){
          this.className = this.className.replace(/^\s*$/g, ' ');
          var ep = this.className.split(' ')[1];
          $(this).removeClass(ep)
          $(this).addClass(ep.substring(0, 12) + '-end' + ep.substr(12));
        });

      }
      obj.parent().remove();
    }
  }


  $.fn.tree = function(opts) {
    this.each(function() {
      new tree(this, opts);
    });
  }
  $.fn.full_tree = function(opts){
    opts.is_drag = true;
    opts.is_context_menu = true;
    this.each(function() {
      new tree(this, opts);
    });
  }
})(jQuery);
/******************************* jquery date *************************************/

DateInput = (function($) { 
function DateInput(el, opts) {
  if (typeof(opts) != "object") opts = {};
  $.extend(this, DateInput.DEFAULT_OPTS, opts);
  this.input = $(el);
  this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
  this.build();
  this.selectDate();
  this.hide();
};
DateInput.DEFAULT_OPTS = {
  month_names: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], 
  short_month_names: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], 
  short_day_names: [ "日", "一", "二", "三", "四", "五", "六"], 
  start_of_week: 1
};
/** DateInput.DEFAULT_OPTS = {
  month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  short_month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  short_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  start_of_week: 1
}; **/
DateInput.prototype = {
  build: function() {
    var monthNav = $('<p class="month_nav">' +
      '<span class="button prev" title="[Page-Up]">&#171;</span>' +
      ' <span class="month_name"></span> ' +
      '<span class="button next" title="[Page-Down]">&#187;</span>' +
      '</p>');
    this.monthNameSpan = $(".month_name", monthNav);
    $(".prev", monthNav).click(this.bindToObj(function() { this.moveMonthBy(-1); }));
    $(".next", monthNav).click(this.bindToObj(function() { this.moveMonthBy(1); }));
    var yearNav = $('<p class="year_nav">' +
      '<span class="button prev" title="[Ctrl+Page-Up]">&#171;</span>' +
      ' <span class="year_name"></span> ' +
      '<span class="button next" title="[Ctrl+Page-Down]">&#187;</span>' +
      '</p>');
    this.yearNameSpan = $(".year_name", yearNav);
    $(".prev", yearNav).click(this.bindToObj(function() { this.moveMonthBy(-12); }));
    $(".next", yearNav).click(this.bindToObj(function() { this.moveMonthBy(12); }));
    var nav = $('<div class="nav"></div>').append(monthNav, yearNav);
    var tableShell = "<table><thead><tr>";
    $(this.adjustDays(this.short_day_names)).each(function() {
      tableShell += "<th>" + this + "</th>";
    });
    tableShell += "</tr></thead><tbody></tbody></table>";
    this.dateSelector = this.rootLayers = $('<div class="date_selector"></div>').append(nav, tableShell).insertAfter(this.input);
    if ($.browser.msie && $.browser.version < 7) {
      this.ieframe = $('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
      this.rootLayers = this.rootLayers.add(this.ieframe);
      $(".button", nav).mouseover(function() { $(this).addClass("hover") });
      $(".button", nav).mouseout(function() { $(this).removeClass("hover") });
    };
    this.tbody = $("tbody", this.dateSelector);
    this.input.change(this.bindToObj(function() { this.selectDate(); }));
    this.selectDate();
  },
  selectMonth: function(date) {
    var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() &&
                                this.currentMonth.getMonth() == newMonth.getMonth())) {
      this.currentMonth = newMonth;
      var rangeStart = this.rangeStart(date), rangeEnd = this.rangeEnd(date);
      var numDays = this.daysBetween(rangeStart, rangeEnd);
      var dayCells = "";
      for (var i = 0; i <= numDays; i++) {
        var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);
        if (this.isFirstDayOfWeek(currentDay)) dayCells += "<tr>";
        if (currentDay.getMonth() == date.getMonth()) {
          dayCells += '<td class="selectable_day" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>';
        } else {
          dayCells += '<td class="unselected_month" date="' + this.dateToString(currentDay) + '">' + currentDay.getDate() + '</td>';
        };
        if (this.isLastDayOfWeek(currentDay)) dayCells += "</tr>";
      };
      this.tbody.empty().append(dayCells);
      this.monthNameSpan.empty().append(this.monthName(date));
      this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
      $(".selectable_day", this.tbody).click(this.bindToObj(function(event) {
        this.changeInput($(event.target).attr("date"));
      }));
      $("td[date=" + this.dateToString(new Date()) + "]", this.tbody).addClass("today");
      $("td.selectable_day", this.tbody).mouseover(function() { $(this).addClass("hover") });
      $("td.selectable_day", this.tbody).mouseout(function() { $(this).removeClass("hover") });
    };
    $('.selected', this.tbody).removeClass("selected");
    $('td[date=' + this.selectedDateString + ']', this.tbody).addClass("selected");
  },
  selectDate: function(date) {
    if (typeof(date) == "undefined") {
      date = this.stringToDate(this.input.val());
    };
    if (!date) date = new Date();
    
    this.selectedDate = date;
    this.selectedDateString = this.dateToString(this.selectedDate);
    this.selectMonth(this.selectedDate);
  },
  changeInput: function(dateString) {
    this.input.val(dateString).change();
    this.hide();
  },
  show: function() {
    this.rootLayers.css("display", "block");
    $([window, document.body]).click(this.hideIfClickOutside);
    this.input.unbind("focus", this.show);
    $(document.body).keydown(this.keydownHandler);
    this.setPosition();
  },
  hide: function() {
    this.rootLayers.css("display", "none");
    $([window, document.body]).unbind("click", this.hideIfClickOutside);
    this.input.focus(this.show);
    $(document.body).unbind("keydown", this.keydownHandler);
  },
  hideIfClickOutside: function(event) {
    if (event.target != this.input[0] && !this.insideSelector(event)) {
      this.hide();
    };
  },
  insideSelector: function(event) {
    var offset = this.dateSelector.position();
    offset.right = offset.left + this.dateSelector.outerWidth();
    offset.bottom = offset.top + this.dateSelector.outerHeight();
    
    return event.pageY < offset.bottom &&
           event.pageY > offset.top &&
           event.pageX < offset.right &&
           event.pageX > offset.left;
  },
  keydownHandler: function(event) {
    switch (event.keyCode)
    {
      case 9: 
      case 27: 
        this.hide();
        return;
      break;
      case 13: 
        this.changeInput(this.selectedDateString);
      break;
      case 33: 
        this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
      break;
      case 34: 
        this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
      break;
      case 38: 
        this.moveDateBy(-7);
      break;
      case 40: 
        this.moveDateBy(7);
      break;
      case 37: 
        this.moveDateBy(-1);
      break;
      case 39: 
        this.moveDateBy(1);
      break;
      default:
        return;
    }
    event.preventDefault();
  },
  stringToDate: function(string) {
    var matches;
    if (matches = string.match(/^(\d{1,2}) ([^\s]+) (\d{4,4})$/)) {
      return new Date(matches[3], this.shortMonthNum(matches[2]), matches[1], 12, 00);
    } else {
      return null;
    };
  },
  dateToString: function(date) {
    var month = (date.getMonth() + 1).toString();     
    var dom = date.getDate().toString();     
    if (month.length == 1) month = "0" + month;     
    if (dom.length == 1) dom = "0" + dom;     
    return date.getFullYear() + "-" + month + "-" + dom; 
    //return date.getDate() + " " + this.short_month_names[date.getMonth()] + " " + date.getFullYear();
  },
  setPosition: function() {
    var offset = this.input.offset();
    this.rootLayers.css({
      top: offset.top + this.input.outerHeight(),
      left: offset.left
    });
    
    if (this.ieframe) {
      this.ieframe.css({
        width: this.dateSelector.outerWidth(),
        height: this.dateSelector.outerHeight()
      });
    };
  },
  moveDateBy: function(amount) {
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
    this.selectDate(newDate);
  },
  moveDateMonthBy: function(amount) {
    var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
    if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
      
      newDate.setDate(0);
    };
    this.selectDate(newDate);
  },
  moveMonthBy: function(amount) {
    var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, this.currentMonth.getDate());
    this.selectMonth(newMonth);
  },
  monthName: function(date) {
    return this.month_names[date.getMonth()];
  },
  bindToObj: function(fn) {
    var self = this;
    return function() { return fn.apply(self, arguments) };
  },
  bindMethodsToObj: function() {
    for (var i = 0; i < arguments.length; i++) {
      this[arguments[i]] = this.bindToObj(this[arguments[i]]);
    };
  },
  indexFor: function(array, value) {
    for (var i = 0; i < array.length; i++) {
      if (value == array[i]) return i;
    };
  },
  monthNum: function(month_name) {
    return this.indexFor(this.month_names, month_name);
  },
  shortMonthNum: function(month_name) {
    return this.indexFor(this.short_month_names, month_name);
  },
  shortDayNum: function(day_name) {
    return this.indexFor(this.short_day_names, day_name);
  },
  daysBetween: function(start, end) {
    start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    return (end - start) / 86400000;
  },
  changeDayTo: function(dayOfWeek, date, direction) {
    var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference);
  },
  rangeStart: function(date) {
    return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1);
  },
  rangeEnd: function(date) {
    return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1);
  },
  isFirstDayOfWeek: function(date) {
    return date.getDay() == this.start_of_week;
  },
  isLastDayOfWeek: function(date) {
    return date.getDay() == (this.start_of_week - 1) % 7;
  },
  adjustDays: function(days) {
    var newDays = [];
    for (var i = 0; i < days.length; i++) {
      newDays[i] = days[(i + this.start_of_week) % 7];
    };
    return newDays;
  }
};

$.fn.date_input = function(opts) {
  return this.each(function() { new DateInput(this, opts); });
};
/** $.date_input = { initialize: function(opts) {
  $("input.date_input").date_input(opts);
} }; **/

return DateInput;
})(jQuery);

/**
 * myliangbox
 */
(function(){

  function myliang_box(opts){
    $.extend(true, this, myliang_box.defaultset, opts || {});
    this.box = $(this.wrap_html);

    this.init();
  };

  myliang_box.TYPE_TEXT = 0;
  myliang_box.TYPE_URL  = 1;

  myliang_box.defaultset = {
    wrap_html: '<div id="myliang-open-boxing" class="box"><div class="sub"><div class="title"></div><div class="content"></div><div class="foot"></div></div></div>',
    width: 400,
    height: 200,
    title: 'TipInfo',
    type: 0,  // 0 => text, 1 => url
    message: '',
    url: '',
    params: {},
    iframeScroll: 'auto',
    customer_btns: [] // [id, text, function(){}, auto_remove(true|false :default=>false), auto_loading(true|false :default => true)]
  };

  myliang_box.prototype =  {
    init: function(){
      this.position();
      this.content();
      this.event();
      $('#myliang-open-boxing').remove();
      $(document.body).append(this.box);
    },
    position: function(){
      var top = (Util.get_page_height() - this.height)/4;
      var left = ($(document.body).width() - this.width)/2;
      this.box.css({'width': this.width, 'left': left, 'top': top});
    },
    content: function(){
      var slf = this;
      $('.title', this.box).html(this.title);

      var content = $('.content', this.box);

      if(this.type == myliang_box.TYPE_TEXT)
        content.html(this.wrap_message());
      else if(this.type == myliang_box.TYPE_URL){
        //add loading div

        var iframe = $(['<iframe name="open_iframe" style="width: ',this.width - 2,'px; height: ',this.height,'px" src="',this.url,
          '" frameborder="0" marginheight="0" marginwidth="0" scrolling="',
          this.iframeScroll,'"></iframe>'].to_str());

        var iframeDiv = $('<div style="display: block;"></div>').append(iframe);
        //setTimeout(function(){ content.html(iframe); }, 500);

        //iframe.load(function(){
          //alert('iframe load finish!!!');
          //loading.hide();
          //iframeDiv.show();
        //});

        content.html(iframeDiv);

      }else{
        //other
      }

      $('.foot', this.box).html(this.customer_btns.map(function(btn){
        return ['<a id="',btn[0],'" class="button" href="javascript:void(0):">',btn[1],'</a>'].to_str();
      }).to_str());
    },
    event: function(){
      var slf = this;
      var content = $('.content', this.box);
      this.customer_btns.map(function(btn){
        if(btn.length == 4)
          btn[4] = true;

        $('#'+btn[0], slf.box).unbind('click.openbox').bind('click.openbox', function(){
          //type => text
          if(btn[4] && slf.type == myliang_box.TYPE_TEXT){
            content.html(Util.loading);
            btn[2](function(message){ content.html(slf.wrap_message(message)); });
          }else if(btn[4] && slf.type == myliang_box.TYPE_URL){
            // type => url(iframe)
            btn[2]();
          }

          //auto_remove => false
          if(btn[3]){
            //alert('remove');
            slf.cancel();
            return false;
          }
        });
      });
      //esc close
      $(window).unbind('keyup.openbox').bind('keyup.openbox', function(event){
        event = event || window.event;
        //alert('dd')
        if(event.keyCode == 27)
          slf.cancel();

      });
    },
    wrap_message: function(message){
      return ['<div style="padding: 10px;">',message || this.message, '</div>'].to_str();
    },
    cancel: function(){
      this.box.remove();
      delete window.frames['open_iframe']; //firefox remove iframe
    }
  }

  $.myliangbox = function(opts){
    opts.customer_btns = opts.customer_btns || [];
    opts.customer_btns.push(['cancel', 'Cancel', function(){}, true, false]);

    new myliang_box(opts);
  }

  $.loading = function(message){
    new myliang_box({message: message});
  }

  $.alert = function(message){
    $.myliangbox({message: message});
  }

  $.confirm = function(message, callback){
    $.myliangbox({customer_btns: [['ok', 'OK', callback, false]], message: message});
  }

  $.openbox = function(title, width, height, url, params){
    var opts = {title: arguments[0], width: arguments[1], height: arguments[2], type: myliang_box.TYPE_URL, url: arguments[3]};

    if(arguments.length == 5)
      opts.params = params || {};

    $.myliangbox(opts);

  }

  // save and update box
  $.save_update_box = function(args){
    var box_arguments = arguments;
    var opts = {title: arguments[0], width: arguments[1], height: arguments[2],
      type: myliang_box.TYPE_URL, url: arguments[3],
      customer_btns: [['ok', 'OK', function(){
        //alert(window.frames['open_iframe'])
        //return ;
        window.frames['open_iframe'].button_ok(function(){
          //if(typeof box_arguments[4] != 'undefined')
          box_arguments[4] && box_arguments[4]();
        }, function(obj){
          //alert(box_arguments[5])
          //if(typeof box_arguments[5] != 'undefined')
          box_arguments[5] && box_arguments[5](obj);
        }, box_arguments[6] || {});

        //callback();
      }, false]]};

    //if(arguments.length == 5)
      opts.params = {};

    $.myliangbox(opts);
  }

})(jQuery);

/**************************************** jquery pagination *************************************/
(function(){
  function pagination(el, opts){
    this.pg = $(el);
    $.extend(this, pagination.settings, opts || {});
    this.rows = parseInt(this.rows);
    this.init();
  }

  pagination.settings = {
    position: 'bottom',  // 'bottom' or 'top'
    prev: null,          // 
    next: null,
    first: null,
    last: null,
    click_after: function(type, after_func){ after_func(); },
    current: null,
    c_page: 1,
    pages: 1,
    rows: 0,
    page_rows: 15,
    syn: true
  };

  pagination.prototype = {
    init: function(){
      this._before();
      this.loading();
      this.syn && this._after();
    },
    event_mouse: function(){
      var slf = this;
      this.prev.click(function(){ 
        slf.c_page--;    
        slf._click_after();
      });             
      this.first.click(function(){ 
        slf.c_page = 1;    
        slf._click_after();
      });             
      this.next.click(function(){ 
        slf.c_page++;
        slf._click_after();
      });             
      this.last.click(function(){ 
        slf.c_page = slf.pages;
        slf._click_after();
      });             
    },
    _click_after: function(){
      var slf = this;
      this.click_after({index: this.c_page, size: this.page_rows}, function(){ slf._after(); });
    },
    loading: function(){
      this.pg.html(
          ['<div class="pagination">',
          this._total(),
          this._span('disabled', '首页'),
          this._span('disabled', '上页'),
          '<span class="current loading">&nbsp;&nbsp;loading...&nbsp;&nbsp;</span>',
          this._span('disabled', '下页'),
          this._span('disabled', '末页'),
          '</div>'].to_str());         
    },
    /** s_c_page(index){
      this._c_page = index;
      this._after();
    },**/
    _before: function(){
      this.pages = this.rows == 0 ? this.pages : parseInt(this.rows / this.page_rows);
      if(parseInt(this.rows % this.page_rows) > 0) this.pages++;
    },
    _after: function(){
      this.pg.html(this._div());

      this.prev = $('a.prev', this.pg); 
      this.first = $('a.first', this.pg);
      this.next = $('a.next', this.pg);
      this.last = $('a.last', this.pg);
      this.current = $($('a.current', this.pg)[1]);

      this.event_mouse();
    },
    _div: function(){
      return ['<div class="pagination ', this.position ,'">', 
        this._total(), this._first(), this._prev(), this._current(), this._next(), this._last(), 
        '</div>'].to_str();      
    },
    _current: function(){
      return this._span('current', this.c_page);         
    },
    _total: function(){
      return this._span('current', this.rows);       
    },
    _first: function(){
      return this._prev_('first', '首页');
    },
    _prev: function(){
      return this._prev_('prev', '上页');       
    },
    _last: function(){
      return this._next_('last', '末页');
    },
    _next: function(){
      return this._next_('next', '下页');
    },
    _prev_: function(cls, txt){
      if(this.c_page == 1) return this._span('disabled', txt);        
      return this._a(cls, txt);
    },
    _next_: function(cls, txt){
      if(this.c_page == this.pages) return this._span('disabled', txt);        
      return this._a(cls, txt);
    },
    _span: function(cls, txt){
      return ['<span class="', cls ,'">', txt ,'</span>'].to_str();
    },
    _a: function(cls, txt){
      return ['<a class="', cls ,'" href="javascript:void(0);">', txt, '</a>'].to_str();    
    }
  }

  $.fn.page = function(opts){
    var ret = null;
    this.each(function(){ ret = new pagination(this, opts);  });
    return ret;
  }

})(jQuery);

/************************** jquery table *********************************************/
(function(){
  function table(el, opts){
    this.tb = $(el);
    $.extend(this, table.settings, opts || {}, true);
    this.init();
  } 
  table.settings = {
    header: [],                   //display header
    title: 'Model',
    url: '',
    params: {},
    body: null,
    is_display: [true, true, true, true, true],   //tipinfo, topbar btn, foot, table header, page
    tip_info: 'not record',
    tb_tr: null,
    ids: [],                  // ids array
    cache: [],
    /**btn_add: function(obj){},
    btn_update: function(obj){},
    btn_del: function(obj){},**/
    btn_customer: [],
    tr_click: function(ele){ },
    tr_dbclick: function(ele){ },
    load_after: function(){}
  };
  table.prototype = {
    init: function(){
      this.tb.html(this._t());
      //this.page = $('#pagination', this.tb);:w
      this.body = $('tbody', this.tb);

      this.search();
      // stop bubble 
      $('.center-table', this.tb).click(function() { return false; });
    },
    reload: function(){ this.search(); },
    search: function(){
      var slf = this;
      this.load_data(function(json){
        slf.t_b(json.v);
        slf._page(json.k);

      });
    },
    current_tr: function(keyCode){
      var tr = this.tb.find('tbody > tr.visit');
      //alert(tr.length);
      if(tr.length <= 0){
        this.tb.find('tbody > tr:first').click();
        return ;
      }

      if(keyCode == 38 || keyCode == 37){
        tr.prev().click();
      }else if(keyCode == 40 || keyCode == 39){
        tr.next().click();
      }else if(keyCode == 13){
        var id = tr.attr('obj_id');
        this.tr_dbclick(this.cache[id], this);
      }else{
        tr.click();
      }
    },
    event_mouse: function(){
      var slf = this;
      if(this.cache.length > 0){
        this.tr_event();
        this.tr_key_up();
      }
      this.btn_a_foot();
      this.btn_a_head();
    },
    tr_key_up: function(){
      var self = this;
      $(window).unbind('keyup.table_1').bind('keyup.table_1', function(event){
        event = event || window.event;
        //alert(event.keyCode);
        if(event.keyCode == 38 ||event.keyCode == 40 ||event.keyCode == 37 ||event.keyCode == 39 ||event.keyCode == 13)
          self.current_tr(event.keyCode);
      });
    },
    tr_event: function(){
      var slf = this;
      this.tb_tr.unbind('mouseenter').bind('mouseenter', function(){ if(this.className != 'visit') this.className = 'hover'; })
        .unbind('mouseleave').bind('mouseleave', function(){ if(this.className != 'visit') this.className = ''; })
        .unbind('click').bind('click', function(event){

          event = event || window.event;
          //alert(event.ctrlKey + '::' + event.altKey + '::' + event.shiftKey + '::' + $(this).attr('index'));
          if(event.ctrlKey){
            //ctrl
            set_selected.apply(this);
          }else if(event.altKey){
            //alt
          }else if(event.shiftKey){
            //shift

          }else{
            //only selected
            $(this).parent().find('tr').each(function(){
              slf.is_select_and_ids(this, '');
            });
            set_selected.apply(this);
          }

          function set_selected(){
            if(this.className != 'visit'){
              slf.is_select_and_ids(this, 'visit');
            }else{
              slf.is_select_and_ids(this, '');
            }
          }

          var id = $(this).attr('obj_id');
          slf.tr_click(slf.cache[id]);
          return false;

        }).unbind('dblclick').bind('dblclick', function(){
          var id = $(this).attr('obj_id');
          slf.tr_dbclick(slf.cache[id], slf);
          Util.clear_selected_text();
          return false;
        });             
    },
    btn_a_head: function(){
      var slf = this;

      this.btn_customer.each(function(ary){
        $('a#'+ary[0], this.tb).unbind('click').bind('click', function(){
          // ids => [tr1, tr2, tr3], objs => [{obj1}, {obj2}, {obj3}], slf => table self
          ary[2](slf.ids, slf.selected_objs(), slf);
        });
      });
    },
    btn_a_foot: function(){
      var slf = this;
      $('.foot a#all', this.tb).click(function(){ 
        slf.tb_tr.each(function(){ slf.is_select_and_ids(this, 'visit'); }); 
      });            
      $('.foot a#rall', this.tb).click(function(){ 
        slf.tb_tr.click();
      });            
      $('.foot a#nall', this.tb).click(function(){ 
        slf.tb_tr.each(function(){ slf.is_select_and_ids(this, ''); }); 
      });            
    },
    selected_objs: function(){
      var slf = this;
      return this.ids.map(function(id){
        return slf.cache[id];
      });
    },
    is_select_and_ids: function(thisobj, className){
      var id = $(thisobj).attr('obj_id');
      thisobj.className = className;
      if(className == '') this.ids.rm(id);
      else this.ids.push(id);
      //alert(this.ids.join(','));
    },
    load_data: function(after){
      this.params['random'] = Math.random() * 1000;
      Util.get(this.url, this.params, function(json){ after(json); }, 'json');
    },
    _page: function(rows){
      //not show page
      if(!this.is_display[4]){
        $('#pagination', this.tb).remove();
        return ;
      }
      var slf = this;
      $('#pagination', this.tb).page({rows: rows, click_after: function(page, callback){
        // page.index ; page.size;
        //alert('index='+page.index+'::size='+page.size);
        slf.params['page[index]'] = page.index - 1;
        //slf.params['page[page_rows]'] = page.size;
        slf.load_data(function(json){
          slf.t_b(json.v);
          callback();
        });
      }});       
    },
    _t: function(){
      return ['<div class="center-table">', this._h(), this.is_tip_info(),'<div class="content"><table>', 
        this._t_h(), this._t_b(), 
        '</table>', this.is_t_foot(),'</div><div class="bar bottom" id="pagination"></div></div>'].to_str();
    },
    _t_h: function(){
      if(!this.is_display[3]) return ;
      return ['<thead><tr>', this.is_checkbox(),
        this.header.map(function(ele) { return ['<td>&nbsp;', ele,'</td>'].to_str(); }).to_str(), 
        '</tr></thead>'].to_str();      
    },
    t_b: function(data){
      this.body.html(this._t_b(data));
      this.tb_tr = $('.content table tbody tr', this.tb);
      this.event_mouse();
      //this.load_after();
    },
    _t_b: function(data){
      if(typeof data == 'undefined') return this.t_b_tip('loading...');
      if(data.length == 0) return this.t_b_tip('Not Found Records...');
      var slf = this;
      return [ 
        data.map(function(ele, index){
          //for(var p in ele){
            //ele = ele[p];
            slf.cache[ele['id']] = ele;
            return ['<tr obj_id="', ele['id'],'" index="',index,'">', slf.is_checkbox(),
              slf.header.map(function(e){
                return ['<td>&nbsp;', ele[e], '</td>'].to_str();
              }).to_str(),
            '</tr>'].to_str();

            //break;
          //}

        }).to_str()
      ].to_str();      
    },
    t_b_tip: function(info){
      return ["<tr><td colspan='",this.header.length + 1,"'>&nbsp;", info,"&nbsp;</td></tr>"].to_str();       
    },
    is_checkbox: function(){
      if(!this.is_display[1]) return '';
      return '<td style="width: 20px; border-left: none;">&nbsp</td>';
      //return  ? '<td style="width: 20px; border-left: none;">&nbsp<input type="checkbox"/></td>' : '<td style="width: 20px; border-left: none;">&nbsp</td>';             
    },
    is_tip_info: function(){
      return this.is_display[0] ? this._tip_info() : ''; 
    },
    is_t_foot: function(){
      return this.is_display[2] ? this._f() : '';          
    },
    _tip_info: function(){
      return ['<div class="tipinfo">', this.tip_info ,'</div>'].to_str();           
    },
    _h: function(){
      /** this._h_a_add(),
        this._h_a_update(),
        this._h_a_del(),**/
      return this.is_display[1] ? ['<div class="bar top"><div class="title">', this.title,'</div>',
        this._h_a_customer(),
        '</div>'].to_str() : '';
    },
    _f: function(){
      return ['<div class="foot">选择：',
        this._f_a_all(),'-',
        this._f_a_rall(),'-',
        this._f_a_nall(),
        '</div>'].to_str();    
    },
    _f_a_all: function(){
      return this._f_a('all', '全部');
    },
    _f_a_rall: function(){
      return this._f_a('rall', '反选');
    },
    _f_a_nall: function(){
      return this._f_a('nall', '不选');
    },
    _h_a_customer: function(){
      var slf = this;
      return this.btn_customer.map(function(ary){
        //return ele.map(function(ele){}).to_str();
        return slf._h_a(ary[0], ary[1]);
      }).to_str();
    },
    /**_h_a_add: function(){
      return this._h_a('add', 'Add');
    },
    _h_a_update: function(){
      return this._h_a('update', 'Update');
    },
    _h_a_show: function(){
      return this._h_a('show', 'Show');
    },
    _h_a_del: function(){
      return this._h_a('del', 'Delete');
    },**/
    _h_a: function(a_id, txt){
      return ['<a class="button" href="javascript:void(0);" id="', a_id, '">', txt, '</a>'].to_str();
    },
    _f_a: function(a_id, txt){
      return ['<a href="javascript:void(0);" id="', a_id, '">', txt, '</a>'].to_str();      
    }
  }
  $.fn.table = function(opts){
    var buf = [];
    this.each(function(){ buf.push(new table(this, opts)); });
    return buf;
  }
  $.fn.c_table = function(opts){
    //opts => {header: [], base_url: '', btn_customer: [], width: 600, height: 600, title: 'country'}
    //opts.base_url += '/';

    return this.table(opts);
  }
  $.fn.s_table = function(opts){ 
    opts.is_display = [false, false, false, false, false];
    opts.header = ['name'];
    return this.table(opts);
    //this.each(function(){ new table(this, opts); });
  }
})(jQuery);

/***
 * ajax form
 */
(function(){
  function form(el, opts){

    this.fm = $(el);
    $.extend(this, form.settings, opts || {});
    // $.param(obj); {a:11,b:22} => a=11&b=222
    this.init();

  }

  form.settings = {
    params: {},
    before: function(){ return true; },
    after: function(msg){}
  }

  form.prototype = {
    init: function(){
      var self = this;
      this.fm.submit(function(){
        return false;
        //return self.submit();
      });
    },
    submit: function(e){
      var self = this;

      if(this.before()){
        var loading = this.loading();
        var url = this.fm.attr('action');
        var method = this.fm.attr('method');
        var params = this.wrap();
        //alert(url + '::' + method + '::' + $.param(params));
        Util.ajax({
          type: method,
          url: url,
          data: params,
          cache: false,
          success: function(json){
            loading.remove();
            //alert(msg);
            //self.tip(json);
            //setTimeout(function(){ tip.remove(); }, 5000);
            //self.after(json);
            self.success(json);
          }
        });
      }
      //stop default submit event
      return false;
    },
    wrap: function(){
      //alert(this.params['menu[parent_id]'])
      var params = this.params;
      //first search input(type = (hidden || text || password...))
      this.fm.find('input').each(function(){
        if(is_name(this.name)){
          params[this.name] = this.value;
        }
      });
      //second search textarea
      this.fm.find('textarea').each(function(){
        if(is_name(this.name)){
          params[this.name] = this.text;
        }
      });

      function is_name(name){
        if(typeof this.name == 'undefined'){
          console.log('attribute name is undefined');
          return false;
        }else if(this.name == null){
          console.log('attribute name is null');
          return false;
        }else if(/^\s.$/g.test(this.name)){
          console.log('attribute name is empty');
          return false;
        }else
          return true;
      }

      return params;
    },
    body_offset: function(){
      var body = $(document.body);
      var left = body.width()/2;
      var top = 10; //body.height()/4;
      return {left: left, top: top};
    },
    flow_div: function(color, content){
      $('#flow_div').remove();
      var offset = this.body_offset();
      var loading = $(['<div id="flow_div" style="background: ',color, ';padding: 10px; position: absolute; z-index: 100; left: ',offset.left,'px; top: ',offset.top,'px;">', content,'</div>'].to_str());
      $(document.body).append(loading);
      return loading;
    },
    loading: function(){
      return this.flow_div('#fff','<div class="loading"></div>')
    },
    success: function(json){
      if(json.k == '1'){
        this.tip(json.v);
        this.after(json);
      }else if(json.k == '0'){
        var body = $(document.body);
        var left = body.width() - 200;

        var error = ['<ul>'];
        var i = 1;
        for(var p in json.v){
          error.push(['<li style="height:20px;">', i++, ', ', p, ': ', json.v[p].join("; "), '</li>'].to_str());
        }
        error.push('</ul>');
        //alert(error.to_str());

        this.tip(error.to_str()).offset({left: left});
      }else
        alert('ajax form result error !');

    },
    tip: function(message){
      return this.flow_div('#FFFFCA', message);
    }

  }

  $.fn.ajax_form = function(opts){
    var fms = [];
    this.each(function(){ fms.push(new form(this, opts)); });
    return fms;
  }
})(jQuery);


/***
 * advance select
 * **/
(function(){
  /**
    <div class="searchbox" style="top: 100px; left: 200px; width: 500px; height: 200px;">
      <div class="title">Header</div>
      <div style=""></div>
    </div>
   **/
  function searchbox(el, opts){
    this.p_box = $(el);
    $.extend(this, searchbox.settings, opts || {});
    this._before();
    this.init();

  }

  searchbox.settings = {
    width: 300,
    border_none: '',
    url: '',
    params: {},
    pros: [],
    table: null,
    attr_name: null,
    attr_value: '',
    after: function(){}
  }
  searchbox.prototype = {
    _before: function(){
      //this.p_box.html('');
      this.p_box.append(['<input type="text" name="', this.attr_name,
        '" class="input-text border-none" autocomplete="off" value="',this.attr_value,'"/>',
        '<a href="javascript:void(0);" class="drop-icon icon-rt"/>'].to_str());
      this.s_box = $('input.input-text', this.p_box);
    },
    init: function(){
      var slf = this;
      this.s_box.bind('keyup', function(event){
        event = event || window.event;
        //alert(event.keyCode+':::')
        if(event.keyCode >= 37 && event.keyCode <= 40)
          return true;
        else if(event.keyCode == 13){
          //console.log('ddd')
          slf.select_after(slf.table[0].selected_objs());
          return true;
        }else if(event.keyCode == 27)
          return true;
        slf.load();
        //return false;
      }).focus(function(){
        slf.load();
        return false;
      }).click(function(){
        return false;
      }).blur(function(){
        //$('.searchbox', this.p_box).hide();
        //$('.searchbox', this.p_box).hide();
      });
      //$('.searchbox', this.p_box).click(function(event){ alert('click.searbhox'); event.stopPropagation(); return false; });
    },
    select_after: function(eles){
      var cele = eles;
      //alert(eles instanceof Array)
      if(eles instanceof Array){
        if(eles.length <= 0) return ;
        else cele = eles[0]
      }

      $('input[name='+this.attr_name+']', this.p_box).val(cele[this.pros]);
      $('.searchbox', this.p_box).hide();
      this.after(eles);
    },
    load: function(){
      var slf = this;
      this._offset();
      this.p_box.append(this.div());
      var params = this.params + "=" + this.s_box.val();
      this.table = $('#sb-content', this.p_box).s_table({url: this.url, params: params,
        tr_dbclick: function(ele){
          slf.select_after(ele);
        }});
      Util.hide_if_click_outside($('.searchbox', this.p_box), 'searchbox');
    },
    div: function(){
      $('.searchbox', this.p_box).remove();
      var offset = this.p_box.offset();
      return ['<div class="searchbox" style="top: ', offset.top + this.p_box.height() + 3,'px; left: ', offset.left,'px; width: ',
        (this.width + 2),'px;', this.border_none,'">',
        '<div class="searchbox-c" style="width:',this.width,'px;',
          '"><div id="sb-content"></div></div>',
        ,'</div>'].to_str();
      //<div class="title">Title-content</div>
    },
    _offset: function(){
      this.doc_width = $(document).width()/2;
      this.doc_height = $(document).height()/2;

      /**
      var hght = this.s_box.height()/2 + this.s_box.offset().top;
      var wth = this.s_box.width()/2 + this.s_box.offset().left;
      //alert("input pointer:::x="+wth+";y="+hght+"document_width="+this.doc_width+"::document_height="+this.doc_height);
      if(this.doc_width >= wth){
        this._left = this.s_box.position().left - 1;
        this.border_none = " border-left: none;";
      }else{
        this._left = (this.s_box.position().left + this.p_box.width() - 2) - this.width;
        this.border_none = " border-right: none;";
      }
      if(this.doc_height >= hght){
        this._top = this.s_box.height() + 8;
        this.border_none += " border-top: none;";
      }else{
        //this._top = -($('.searchbox', this.p_box).height() + 5);
        this.border_none += " border-bottom: none;";
      }
      **/
        this._left = this.s_box.position().left - 1;
        this.border_none = " border-left: none;";
        this._top = this.s_box.height() + 6;
        this.border_none += " border-top: none;";
    }
  }
  $.fn.searchbox = function(opts){
    this.each(function(){ new searchbox(this, opts); });
  }
  $.fn.search_box = function(opts){
    this.each(function(){
      //alert($(this).attr('key'))
      opts = opts || {}
      opts.pros = $(this).attr('pros');
      opts.url = $(this).attr('url');
      opts.params = $(this).attr('params');
      opts.attr_name = $(this).attr('name');
      opts.attr_value = $(this).attr('key');
      new searchbox(this, opts);
    });
  }
})(jQuery);


$(function(){

  $('#more').menu({
    json: [{
      text: 'Manager'
    },{
      text: 'Felling'
    },{
      text: 'Hello'
    },{
      text: 'VIP Mail'
    }]
  });

  //setTimeout(function(){
    $('div.simple-sel').select();
    $("input.date_input").date_input();
    $('.adv-search-input').search_box();
  //}, 1000);

});
