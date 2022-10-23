"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./board");
let type_list = ["A", "B", "C", "A"];
let a = new board_1.Board([5, 5], type_list);
console.log();
console.log(a.toString());
let listener = {
    isMoved(first, second) {
        console.log(first.toString() + "<==>" + second.toString());
    }
};
a.addListener(listener);
a.move(new board_1.Position(1, 2), new board_1.Position(1, 3));
a.move(new board_1.Position(1, 1), new board_1.Position(2, 1));
a.move(new board_1.Position(3, 0), new board_1.Position(3, 1));
console.log(a.row_decution(null));
console.log("MOVE");
console.log(a.toString());
let b = 0;
