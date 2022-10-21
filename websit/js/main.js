"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./board");
let type_list = ["A", "B", "C","D","E"];
let a = new board_1.Board([5, 5], type_list);
console.log(a.toString());
let listener = {
    isMoved(first, second) {
        console.log(first.toString() + "<==>" + second.toString());
    }
};
a.addListener(listener);
a.move(new board_1.Position(1, 0), new board_1.Position(1, 1));
console.log(a.toString());
let b = 0;