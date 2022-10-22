"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./board");
let type_list = ["A", "B", "C"];
let a = new board_1.Board([5, 5], type_list);
console.log(a.toString());
let listener = {
    isMoved(first, second) {
        a.judge(second);
        console.log(first.toString() + "<==>" + second.toString());
    }
};
a.addListener(listener);
a.move(new board_1.Position(2, 0), new board_1.Position(2, 1));
// a.remove(new Position(1,0))
// a.remove(new Position(1,1))
console.log(a.toString());
let b = 0;
