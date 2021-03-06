/**
 * @name  event.js
 * @description  事件模块
 * @date  2015.5.25
 */

var Event = {}

// 添加事件
Event.addEvent = function(target, type, handler) {

    if (target.addEventListener) {
        target.addEventListener(type, handler, false)

    } else {

        target.attachEvent('on' + type, function(event) {
            // 把处理和程序作为时间目标的方法调用
            // 传递事件对象
            return handler.call(target, event)
        })
    }
}

// 移除事件
// TODO: handler应该是可选项，如果没有传入，清除所有事件函数
Event.removeEvent = function(target, type, handler) {

    // 对handler进行判断，如果不存在，按照type使用dom 0方式清除事件
    if (handler === undefined) {

        target['on' + type] = null

        return 
    }
    
    if (target.removeEventListener) {
        target.removeEventListener(type, handler, false)

    } else {

        target.detachEvent('on' + type, handler)
    }
}

// 将事件绑定在document上，然后根据selector来判断是否执行
// TODO: 缺少ie9以下的处理，事件委托的选择器不完善
Event.live = function(type, handler) {

    var selector = this.selector

    // live的实现，模仿jquery。但内部调用queryselector来匹配对象
    document.addEventListener(type, function(e) {

        var nodes = document.querySelectorAll(selector)

        for (var i = 0; i < nodes.length; i++) {

            if (nodes[i] === e.target) {

                return handler.call(e.target, e)
            }
        }
    })
}

// 对外暴露的事件绑定api
Event.on = function(type, handler) {

    // 根据nodeName判断单个绑定或循环绑定
    // target可能是window或document对象，判断条件从nodeName改成是否是array
    for (var i = 0; i < this.length; i++) {

        Event.addEvent(this[i], type, handler)
    }
}

// domReady
Event.ready = function(handler) {


    var eventFn = W3C ? 'DOMContentLoaded' : 'readystatechange'
    var handle = handler

    if (this[0] !== document) {

        return
    }
    
    // 如果domReady已经结束，直接执行回调
    if (DOC.readyState !== 'complete') {

        //console.log(DOC.readyState)
        if (eventFn === 'readystatechange') {

            handle = function() {

                if (DOC.readyState === 'complete') {

                    Function.call(handler)
                }
            }

        }
        
        Event.addEvent(this[0], eventFn, handle)

    } else {

        handle.call(null)
    }
}

// TODO: 还没做
Event.off = function() {}

/**
 * 2015.5.25
 * 创建模块
 * 添加了addEvent和removeEvent函数
 * TODO: 添加了live函数，但不完善
 * 添加了on函数，此函数将对外暴
 * 2015.5.26
 * 重写了live函数，初步测试可用，但事件通过document绑定，还有优化空间
 * 添加了ready函数
 * 2015.6.5
 * 将unbind更名为off
 */
