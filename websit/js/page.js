"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board_1 = require("./board");
var type_list = ["A", "B", "C"];
var col = 5;
var row = 5;
var a = new board_1.Board([row, col], type_list);
var pieces = Array.from(document.getElementsByClassName('border-item'));
$(document).ready(function () {
    var _a;
    var box = document.getElementById('board');
    var i = 0;
    var j = 0;
    for (i = 0; i < row; i++) {
        for (j = 0; j < col; j++) {
            var f = new board_1.Position(i, j);
            var board_item = document.createElement('div');
            board_item.className = 'board-item';
            board_item.tabIndex = 1;
            board_item.id = 'borad-item' + i + j;
            var type = (_a = a.getPiece(f)) === null || _a === void 0 ? void 0 : _a.getType();
            var txt = document.createTextNode(type);
            board_item.appendChild(txt);
            box === null || box === void 0 ? void 0 : box.appendChild(board_item);
        }
    }
    var first_click = null;
    var second_click = null;
    box === null || box === void 0 ? void 0 : box.addEventListener('click', function (e) {
        var box_item = e.target;
        console.log(box_item);
    });
});
