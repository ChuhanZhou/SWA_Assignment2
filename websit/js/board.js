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
        //let type_map_sort = Array.from(this.type_num_map).sort(function () { return 0.5 - Math.random() }).sort((a, b) => { return a[1] - b[1] })
        let type_map_sort = Array.from(this.type_num_map).sort((a, b) => { return a[1] - b[1]; });
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
                if (type != null) {
                    str += type + " ";
                }
                else {
                    str += "# ";
                }
            }
            str += "]\n";
            out_str += str;
        }
        return out_str;
    }
    row_decution(l_position) {
        var _a, _b;
        let first_row = [];
        let first_col = [];
        if (l_position == null) {
            for (var row_i = 0; row_i < this.size[0]; row_i++) {
                let s_position = new Position(row_i, 0);
                let type = (_a = this.getPiece(s_position)) === null || _a === void 0 ? void 0 : _a.getType();
                first_row.push(type);
            }
            // console.log(first_row)
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                let s_position = new Position(0, col_i);
                this.vet_check(s_position);
                let type = (_b = this.getPiece(s_position)) === null || _b === void 0 ? void 0 : _b.getType();
                first_col.push(type);
            }
        }
        else {
            l_position.forEach(pos => {
                console.log(chalk.bgGreen("Start checking vet single position", pos.row, pos.col));
                this.vet_check(pos);
                console.log(chalk.bgGreen("Start checking hoi single position", pos.row, pos.col));
                this.hoi_check(pos);
            });
        }
    }
    // console.log(first_col)
    vet_check(position) {
        var _a, _b, _c;
        let x = 0;
        let position_array = [];
        let col = position.col;
        let row = position.row;
        let start_point = new Position(x, col);
        console.log(chalk.yellow("Starting VET check at ", start_point.row, start_point.col));
        position_array.push(start_point);
        for (var i = 1; i < this.size[1]; i++) {
            let check_point = new Position(i, col);
            // console.log(chalk.cyan("Checking", check_point.row, check_point.col, "|", this.getPiece(check_point)?.getType()));
            if (((_a = this.getPiece(start_point)) === null || _a === void 0 ? void 0 : _a.getType()) == ((_b = this.getPiece(check_point)) === null || _b === void 0 ? void 0 : _b.getType())) {
                position_array.push(check_point);
                console.log(chalk.green("Pushing into array, array size:", position_array.length, " pushed content:", (_c = this.getPiece(check_point)) === null || _c === void 0 ? void 0 : _c.getType(), "Array: ", position_array));
                x += 1;
            }
            else {
                if (position_array.length >= 3) {
                    //满足条件删除（>=3）
                    console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array));
                    position_array.forEach(po => {
                        this.remove(po);
                    });
                    console.log(chalk.cyan("Element removed in chart, position: ", position_array));
                }
                // console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point)?.getType(), "Not Match with ", this.getPiece(start_point)?.getType()))
                position_array = [];
                position_array.push(check_point);
                x += 1;
            }
        }
        console.log(chalk.red("Array checking compelete"));
    }
    hoi_check(position) {
        var _a, _b, _c, _d, _e, _f;
        let x = 0;
        let position_array_h = [];
        let col = position.col;
        let row = position.row;
        let start_point_h = new Position(row, x);
        console.log(chalk.yellow("Starting HOI check at ", start_point_h.row, start_point_h.col, (_a = this.getPiece(start_point_h)) === null || _a === void 0 ? void 0 : _a.getType()));
        position_array_h.push(start_point_h);
        // console.log(position_array);
        for (var i = 1; i < this.size[0]; i++) {
            let check_point_h = new Position(row, i);
            if (((_b = this.getPiece(start_point_h)) === null || _b === void 0 ? void 0 : _b.getType()) == ((_c = this.getPiece(check_point_h)) === null || _c === void 0 ? void 0 : _c.getType())) {
                position_array_h.push(check_point_h);
                console.log(chalk.green("Pushing into array, array size:", position_array_h.length, " pushed content:", (_d = this.getPiece(check_point_h)) === null || _d === void 0 ? void 0 : _d.getType(), "Array: ", position_array_h));
                x += 1;
            }
            else {
                if (position_array_h.length >= 3) {
                    //满足条件删除（>=3）
                    console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h));
                    position_array_h.forEach(po => {
                        this.remove(po);
                    });
                    console.log(chalk.cyan("Element removed in chart, position: ", position_array_h));
                }
                console.log(chalk.red("Cleaning array :", " pushed new content:", (_e = this.getPiece(check_point_h)) === null || _e === void 0 ? void 0 : _e.getType(), "Not Match with ", (_f = this.getPiece(start_point_h)) === null || _f === void 0 ? void 0 : _f.getType()));
                position_array_h = [];
                position_array_h.push(check_point_h);
                x += 1;
            }
        }
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
// //Rd logic starts here
// judge(position: Position) {
//     let isExisted = false
//     let checklist: Position[] = []
//     let p_row = position.row
//     let p_col = position.col
//     this.createOffset(position)
//     if (result.length >= 3) {
//         let offset_1 = new Position(p_row, p_col - 1)
//         let offset_2 = new Position(p_row, p_col + 1)
//         let offset_3 = new Position(p_row - 1, p_col)
//         let offset_4 = new Position(p_row + 1, p_col)
//         console.log(chalk.red("Offset Check: ", offset_1, offset_2, offset_3, offset_4))
//         console.log(chalk.green("Sucess"))
//         console.log(chalk.green("Result", result))
//         this.remove(position)
//         result.forEach((r, index) => {
//             switch (r.row, r.col) {
//                 case r.row, r.col = offset_1.row, offset_1.col:
//                     console.log(chalk.red("Offset Check: 1/2"))
//                     result.forEach(s => {
//                         if (offset_2.row === s.row && offset_2.col === s.col) {
//                             console.log(chalk.green("Offset Check passed: 1/2"))
//                             isExisted = true
//                         }
//                     })
//                     if (isExisted) {
//                         checklist.push(r)
//                         isExisted = false
//                     }
//                     break;
//                 case r.row, r.col = offset_2.row, offset_2.col:
//                     console.log(chalk.red("Offset Check: 2/1"))
//                     result.forEach(s => {
//                         if (offset_1.row === s.row && offset_1.col === s.col) {
//                             console.log(chalk.green("Offset Check passed: 2/1"))
//                             isExisted = true
//                         }
//                     })
//                     if (isExisted) {
//                         checklist.push(r)
//                         isExisted = false
//                     }
//                     break;
//                 case r.row, r.col = offset_3.row, offset_3.col:
//                     console.log(chalk.red("Offset Check: 3/4"))
//                     result.forEach(s => {
//                         if (offset_4.row === s.row && offset_4.col === s.col) {
//                             console.log(chalk.green("Offset Check passed: 3/4"))
//                             isExisted = true
//                         }
//                     })
//                     if (isExisted) {
//                         checklist.push(r)
//                         isExisted = false
//                     }
//                     break;
//                 case r.row, r.col = offset_4.row, offset_4.col:
//                     console.log(chalk.red("Offset Check: 4/3"))
//                     result.forEach(s => {
//                         if (offset_3.row === s.row && offset_3.col === s.col) {
//                             console.log(chalk.green("Offset Check passed: 4/3"))
//                             isExisted = true
//                         }
//                     })
//                     if (isExisted) {
//                         checklist.push(r)
//                         isExisted = false
//                     }
//                     break;
//             }
//         })
//         console.log(chalk.green("Checklist: ", checklist))
//         checklist.forEach(r => {
//             this.remove(r)
//         })
//         console.log("remove")
//         console.log(this.toString())
//
//         let new_type = this.chooseType(position)
//         this.getPiece(position)?.setType(new_type)
//         checklist.forEach((r, index) => {
//             let new_type = this.chooseType(r)
//             this.getPiece(r)?.setType(new_type)
//         })
//         console.log("new")
//         console.log(this.toString())
//     }
//     else {
//         console.log(chalk.red("Failed"))
//         console.log(chalk.red("Result", result))
//     }
// }
//
// createOffset(position): any {
//     let position_offset: Position[] = []
//     let p_row = position.row
//     let p_col = position.col
//     let j_type = this.getPiece(position)?.getType()
//     let isExisted = false
//     console.log("Judge Loc: ", p_row, p_col, j_type)
//     position_offset.push(new Position(p_row, p_col - 1), new Position(p_row, p_col + 1), new Position(p_row - 1, p_col), new Position(p_row + 1, p_col))
//     position_offset.forEach((o, index) => {
//         result.forEach(r => {
//             if (p_col === r.col && p_row === r.row) {
//                 isExisted = true
//             }
//         })
//         // console.log(chalk.white("Value: ", chalk.bgRed(this.getPiece(o)?.getType()), " Surrond: [", o.row, o.col, "], sequence: ", index))
//         if (this.getPiece(o)?.getType() === j_type) {
//             console.log(chalk.green("Match at: ", o.row, o.col, " Size: ", result.length))
//             // console.log(chalk.red("Bool: ",result.indexOf(o) != -1),result.includes(o),result.indexOf(o),o)
//             //if (result.length >= 3) {
//             //    console.log(chalk.bgGreen("Success",result))
//             //    return result
//             //}
//             //else {
//             console.log(chalk.blue("result array: ", result))
//             if (isExisted) {
//                 console.log(chalk.red("Size: ", result.length, " Duplicate: ", o.row, o.col))
//                 console.log(chalk.yellow("List: ", result, " Boolean: ", isExisted))
//             }
//             else {
//                 result.push(o)
//                 console.log(chalk.green("POP: ", chalk.bgGreen(o.row, o.col)), isExisted)
//                 this.createOffset(o)
//             }
//             //}
//         }
//         else {
//             //console.log(chalk.yellow("No Match: "), chalk.cyan(this.getPiece(o)?.getType(), j_type))
//         }
//     })
//     return result
// }
