/**
 * Created by yishide on 2020/9/5.
 */
import $ from '../../util/dom-core.js'
import {isContentditor,getNodeToArray,isDOMList} from '../../util/util.js'
import DropList from '../droplist.js'

// 构造函数  段落字号
function LineFontSize(editor) {
    var _this = this

    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-text-heigh"></i></div>')
    this.type = 'droplist'

    // 当前是否 active 状态
    this._active = false

    // 初始化 droplist
    this.droplist = new DropList(this, {
        width: 160,
        $title: $('<p>字号</p>'),
        type: 'list', // droplist 以列表形式展示
        list: [
            { $elem: $('<span style="font-size: x-small;">x-small</span>'), value: [1,'x-small'] },
            { $elem: $('<span style="font-size: small;">small</span>'), value: [2,'small'] },
            { $elem: $('<span>normal</span>'), value: [3,'16px'] },
            { $elem: $('<span style="font-size: large;">large</span>'), value: [4,'large'] },
            { $elem: $('<span style="font-size: x-large;">x-large</span>'), value: [5,'x-large'] },
            { $elem: $('<span style="font-size: xx-large;">xx-large</span>'), value: [6,'xx-large'] }
        ],
        onClick: function onClick(value) {
            // 注意 this 是指向当前的 FontSize 对象
            _this._command(value)
        }
    })
}

// 原型  段落字号
LineFontSize.prototype = {
    constructor: LineFontSize,

    // 执行命令
    _command: function _command(value) {
        var editor = this.editor
        // 使用 styleWithCSS
        const isSeleEmpty = editor.selection.isSelectionEmpty()
        if(!isSeleEmpty){
            editor.cmd.do('fontSize', value[0])
            return
        }
        if (!editor._useStyleWithCSS) {
            document.execCommand('styleWithCSS', null, true)
            editor._useStyleWithCSS = true
        }

        // 如果无选区，忽略
        if (!editor.selection.getRange()) {
            return
        }

        // 恢复选取
        // editor.selection.restoreSelection()
        var $parent = editor.selection.getSelectionContainerElem()[0]
        // console.log($parent.nodeName, 444)
        if($parent.nodeName === 'SPAN'){
            // console.log($parent.innerHTML)
            if($parent.innerHTML.length == 1){
                $parent.parentNode.removeChild($parent)
            }
            var p =document.createElement('span')
            p.style.fontSize= value[1]
        }
        else{
            p =document.createElement('span')
            p.style.fontSize= value[1]
        }
        // console.log(editor.selection.getSelectionContainerElem()[0])

        // p.innerHTML =`<span style='font-size:16px'></span>`
        // $parent.append(p)
        // console.log(editor)
        editor.selection.createElementRange(p)




        //1. 处理选区节点样式
        // var $parent = editor.selection.getSelectionContainerElem()[0]
        // //1.1 如果选区只有一行
        // if (isDOMList($parent) === false && $parent.nodeType === 1 && isContentditor($parent) == false) {
        //     // while ($parent.nodeName != 'P') {
        //     //     //提升节点至外层p段落
        //     //     $parent = $parent.parentNode;
        //     // }
        //     // console.log($parent)
        //     $parent.style.fontSize = value[1]
        //     //1.1.1 一行的选区也可能有嵌套元素
        //     var nodeArray = new Array()
        //     getNodeToArray($parent, nodeArray)
        //     nodeArray.shift()
        //     for (var node of nodeArray) {
        //         node.style.fontSize = value[1]
        //     }
        // } else {
        //     //1.2 如果选区有多行
        //     var $start = editor.selection.getSelectionStartElem()[0]
        //     var $end = editor.selection.getSelectionEndElem()[0]
        //
        //     var startNodeIndex
        //     var endNodeIndex
        //
        //     //获取编辑区域下的所有节点
        //     nodeArray = new Array()
        //     getNodeToArray($parent, nodeArray)
        //     nodeArray.shift()
        //
        //     //1.3 处理选区内的节点及其子节点
        //     var $pNodes = nodeArray
        //     for (var i = 0; i < $pNodes.length; i++) {
        //         if ($pNodes[i] == $start) {
        //             startNodeIndex = i
        //             break
        //         }
        //     }
        //     for (i = 0; i < $pNodes.length; i++) {
        //         if ($pNodes[i] == $end) {
        //             endNodeIndex = i
        //             break
        //         }
        //     }
        //     var rangeNodes = new Array()
        //     for (i = startNodeIndex; i <= endNodeIndex; i++) {
        //         rangeNodes.push($pNodes[i])
        //     }
        //
        //     for (node of rangeNodes) {
        //         node.style.fontSize = value[1]
        //     }
        // }

        // 修改菜单状态
        editor.menus.changeActive()

        // 最后，恢复选取保证光标在原来的位置闪烁
        editor.selection.saveRange()
        editor.selection.restoreSelection()

        // 触发 onchange
        editor.change && editor.change()
    }
}



export default LineFontSize