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
        //a.row_decution([first,second])
    }
};
a.addListener(listener);
//a.move(new Position(1,2),new Position(1,3))
//a.move(new Position(1,1),new Position(2,1))
//a.move(new Position(3,0),new Position(3,1))
//console.log(a.toString())
a.remove(new board_1.Position(1, 0));
a.remove(new board_1.Position(1, 1));
a.remove(new board_1.Position(1, 2));
a.remove(new board_1.Position(1, 3));
a.remove(new board_1.Position(1, 4));
a.pieceDropDown();
console.log(a.toString());
a.moveInRule(new board_1.Position(1, 0), new board_1.Position(1, 1));
a.moveInRule(new board_1.Position(0, 1), new board_1.Position(1, 1));
a.moveInRule(new board_1.Position(1, 1), new board_1.Position(1, 2));
console.log(a.toString());
//
let b = 0;
