"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = require("./board");
$(document).ready(function(){
var type_list = ["A", "B", "C"];
var col = 5;
var row = 5;
var a = new board_1.Board([row, col], type_list);
var pieces = Array.from(document.getElementsByClassName('border-item'));
var box = document.getElementById('board');
var i = 0;
var j = 0;
for (i = 0; i < row; i++) {
    for (j = 0; j < col; j++) {
        var f = new board_1.Position(i, j);
        var board_item = document.createElement('div');
        board_item.className = 'board-item';
        var type = (_a = a.getPiece(f)) === null || _a === void 0 ? void 0 : _a.getType();
        var txt = document.createTextNode(type);
        board_item.appendChild(txt);
        box === null || box === void 0 ? void 0 : box.appendChild(board_item);
    }
}
var first_click = null;
var second_click = null;
/*a.forEach((value,i)=> {
    
});

box?.addEventListener('click',(e)=>{
    let box_item = e.target;
    

})*/
});