layui.define(['jquery'], function (exports) {
    var $ = layui.$
    var defaultOption = {
        num: 2,
        array: null,
        display: 'name',
        shortcut: 'pinyin',
        url: null,
        query: {},
        resArray: 'data',
        element: null,
        count: 10,
        done: null
    }

    function init(tmpOption) {
        var $el = $(tmpOption.element)
        var option = {}
        if ($el.data('option')) {
            option = $.extend($el.data('option'), tmpOption)
        } else {
            option = $.extend({}, defaultOption, tmpOption)
            var $out = $('<div></div>')
            $out.css('position','relative')

            $el.after($out)
            $el.remove()
            $out.append($el)
            var $panel = $('<div class="layui-anim-upbit layui-anim" style="position: absolute;' +
                'top: 36px;' +
                'display: none;' +
                'border: 1px solid #eee;' +
                'padding: 10px;' +
                'z-index: 1000;' +
                'background-color: white;' +
                'margin-top: 5px;"></div>')
            $out.append($panel)
            $panel.on('click', '.layui-autocomplete-item', function (e) {
                select(e.target)
                e.preventDefault()
            })          

            function display(tempArray) {
                $panel.css('top', $el.height()).css('width', $el.width() - 10)
                $panel.empty()
                for (var i = 0; i < tempArray.length && i < option.count; i++) {
                    var temp
                    if (option.display != null) {
                        temp = $('<div class="layui-autocomplete-item">' + tempArray[i][option.display] + '</div>')
                    } else {
                        temp = $('<div class="layui-autocomplete-item">' + tempArray[i] + '</div>')
                    }
                    temp.data('item', tempArray[i])
                    $panel.append(temp)
                }
                if (tempArray.length != 0) {
                    $panel.show()
                } else {
                    $panel.hide()
                }
            }

            function select(item) {
                if (option.display) {
                    $el.val($(item).data("item")[option.display])
                } else {
                    $el.val($(item).data("item"))
                }
                if (option.done != null && typeof option.done == 'function') {
                    option.done($(item).data("item"))
                }
                $panel.hide()
            }
            var debounceTimeout;
            $el.keyup(function (e) {
                if (e.which == 40 && $panel.css('display') != 'none') {
                    var $active = $panel.find('.layui-autocomplete-active')
                    if ($active.length > 0 && $active.next().length > 0) {
                        var $next = $active.next()
                        $next.addClass('layui-autocomplete-active')
                        $active.removeClass('layui-autocomplete-active')
                        $next.focus()
                    } else {
                        $panel.find('.layui-autocomplete-active').removeClass('layui-autocomplete-active')
                        var $next = $($panel.find('.layui-autocomplete-item').get(0))
                        $next.addClass('layui-autocomplete-active')
                        $next.focus()
                    }
                    return
                } else if (e.which == 38 && $panel.css('display') != 'none') {
                    var $active = $panel.find('.layui-autocomplete-active')
                    if ($active.length > 0 && $active.prev().length > 0) {
                        var $next = $active.prev()
                        $next.addClass('layui-autocomplete-active')
                        $active.removeClass('layui-autocomplete-active')
                        $next.focus()
                    }
                    return false;
                } else if (e.which == 13 && $panel.find('.layui-autocomplete-active').length > 0) {
                    select($panel.find('.layui-autocomplete-active'))
                    return false;
                }
                var value = $el.val()
                if (value.length >= option.num) {
                    if (option.array != null) {
                        var tempArray = []
                        for (var i = 0; i < option.array.length; i++) {
                            var item = option.array[i]
                            if (item[option.display].toLowerCase().search(value.toLowerCase()) > -1 || (option.shortcut && item[option.shortcut].toLowerCase().search(value.toLowerCase()) > -1)) {
                                tempArray.push(item)
                            }
                        }
                        display(tempArray)
                    } else {
                        clearTimeout(debounceTimeout)
                        debounceTimeout=setTimeout(function(){
                            $.post(option.url, $.extend({search:value},option.query), function (res) {
                                display(res[resArray])
                            })
                        },500);
                    }
                } else {
                    $panel.empty()
                    $panel.hide()
                }
            })

            $el.blur(function () {
                setTimeout(function(){
                    $panel.hide(500)
                },100)                
            })
        }
        $el.data('option', option)
    }
    exports('autocomplete', init)
})
