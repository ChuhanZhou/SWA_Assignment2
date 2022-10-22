"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = exports.Piece = exports.Board = void 0;
const chalk = require("chalk");
class Board {
    constructor(size, type_list) {
        var _a;
        let row_size = size[0];
        let col_size = size[1];
        this.size = [row_size, col_size];
        this.piece_list = [];
        this.type_list = type_list;
        this.type_num_map = new Map();
        this.listener_list = [];
        for (var i = 0; i < type_list.length; i++) {
            this.type_num_map.set(type_list[i], 0);
        }
        for (var row_i = 0; row_i < row_size; row_i++) {
            this.piece_list.push([]);
            for (var col_i = 0; col_i < col_size; col_i++) {
                let position = new Position(row_i, col_i);
                let type = this.chooseType(position);
                this.type_num_map.set(type, ((_a = this.type_num_map.get(type)) !== null && _a !== void 0 ? _a : 0) + 1);
                let piece = new Piece(type, position);
                this.piece_list[row_i].push(piece);
            }
        }
    }
    chooseType(position) {
        var _a;
        let neighbour_type_list = new Map();
        let position_list = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (var i = 0; i < position_list.length; i++) {
            let neighbour_position = new Position(position.getRow() + position_list[i][0], position.getCol() + position_list[i][1]);
            let neighbour = this.getPiece(neighbour_position);
            if (neighbour != undefined) {
                neighbour_type_list.set(neighbour.getType(), 1 + ((_a = neighbour_type_list.get(neighbour.getType())) !== null && _a !== void 0 ? _a : 0));
            }
        }
        let type_map_sort = Array.from(this.type_num_map).sort(function () { return 0.5 - Math.random(); }).sort((a, b) => { return a[1] - b[1]; });
        let out_type = type_map_sort[0][0];
        let type_num = type_map_sort[0][1];
        for (var i = 0; i < type_map_sort.length; i++) {
            let type = type_map_sort[i][0];
            let num = type_map_sort[i][1];
            if (!neighbour_type_list.has(type)) {
                out_type = type;
                break;
            }
        }
        return out_type;
    }
    getPiece(position) {
        if (this.piece_list.length > position.getRow() && position.getRow() >= 0) {
            if (this.piece_list[position.getRow()].length > position.getCol() && position.getCol() >= 0) {
                return this.piece_list[position.getRow()][position.getCol()];
            }
        }
        return undefined;
    }
    setPiece(piece) {
        let target_piece = this.getPiece(piece.getPosition());
        if (target_piece != undefined) {
            target_piece.setType(piece.getType());
        }
    }
    remove(position) {
        let target = this.getPiece(position);
        if (target != undefined) {
            target.setType(null);
        }
    }
    canMove(first, second) {
        let first_piece = this.getPiece(first);
        let second_piece = this.getPiece(second);
        if (first_piece != undefined && second_piece != undefined) {
            if (first_piece.isNeighbour(second_piece)) {
                return true;
            }
        }
        return false;
    }
    move(first, second) {
        var _a, _b;
        if (this.canMove(first, second)) {
            let first_piece = this.getPiece(first);
            let second_piece = this.getPiece(second);
            let first_copy = first_piece === null || first_piece === void 0 ? void 0 : first_piece.copy();
            first_piece === null || first_piece === void 0 ? void 0 : first_piece.setType((_a = second_piece === null || second_piece === void 0 ? void 0 : second_piece.getType()) !== null && _a !== void 0 ? _a : first_piece.getType());
            second_piece === null || second_piece === void 0 ? void 0 : second_piece.setType((_b = first_copy === null || first_copy === void 0 ? void 0 : first_copy.getType()) !== null && _b !== void 0 ? _b : second_piece.getType());
            this.judge(second);
            for (var i = 0; i < this.listener_list.length; i++) {
                this.listener_list[i].isMoved(first, second);
            }
        }
    }
    addListener(listener) {
        this.listener_list.push(listener);
    }
    toString() {
        var _a;
        let out_str = "";
        for (var row_i = 0; row_i < this.size[0]; row_i++) {
            let str = "[ ";
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                let position = new Position(row_i, col_i);
                let type = (_a = this.getPiece(position)) === null || _a === void 0 ? void 0 : _a.getType();
                str += type + " ";
            }
            str += "]\n";
            out_str += str;
        }
        return out_str;
    }
    //Rd logic starts here
    judge(position) {
        let position_offset = [];
        position_offset.push(new Position(position.getRow(), position.getCol() - 1), new Position(position.getRow(), position.getCol() + 1), new Position(position.getRow() - 1, position.getCol()), new Position(position.getRow() + 1, position.getCol()));
        console.log("Judge Loc: ", position.row, position.col);
        console.log("Judge Val: ", this.getPiece(position), " Surrund: +-1, +-1 ");
        position_offset.forEach((o, index) => {
            var _a;
            console.log(chalk.white("Value: ", chalk.bgRed((_a = this.getPiece(o)) === null || _a === void 0 ? void 0 : _a.getType()), " Offset: [", o.row, o.col, "], sequence: ", index));
            console.log("CEC");
        });
    }
}
exports.Board = Board;
class Piece {
    constructor(type, position) {
        this.type = type;
        this.position = position;
    }
    getType() {
        return this.type;
    }
    getPosition() {
        return this.position;
    }
    setType(type) {
        this.type = type;
    }
    setPosition(position) {
        this.position = position;
    }
    isNeighbour(other) {
        let other_position = other.getPosition();
        let length = Math.sqrt(Math.pow(this.position.getCol() - other_position.getCol(), 2) + Math.pow(this.position.getRow() - other_position.getRow(), 2));
        return length == 1;
    }
    copy() {
        return new Piece(this.type, this.position.copy());
    }
}
exports.Piece = Piece;
class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    getRow() {
        return this.row;
    }
    getCol() {
        return this.col;
    }
    set(row, col) {
        this.row = row;
        this.col = col;
    }
    copy() {
        return new Position(this.row, this.col);
    }
    toString() {
        return "[" + this.row + "," + this.col + "]";
    }
}
exports.Position = Position;
