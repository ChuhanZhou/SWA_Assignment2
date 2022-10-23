"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = exports.Piece = exports.Board = void 0;
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
    moveInRule(first, second) {
        if (this.canMove(first, second)) {
            this.move(first, second);
            console.log(this.toString());
            if (this.row_decution([first, second])) {
                console.log(this.toString());
                this.pieceDropDown();
                console.log(this.toString());
                while (this.row_decution(null)) {
                    console.log(this.toString());
                    this.pieceDropDown();
                    console.log(this.toString());
                }
                return true;
            }
            else {
                this.move(first, second);
            }
        }
        return false;
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
    pieceDropDown() {
        let need_type_list = [];
        for (var col_i = 0; col_i < this.size[1]; col_i++) {
            let drop_type_list = [];
            let drop = false;
            let drop_position = new Position(-1, col_i);
            for (var row_i = this.size[0] - 1; row_i >= 0; row_i--) {
                let position = new Position(row_i, col_i);
                let piece = this.getPiece(position);
                let type = piece === null || piece === void 0 ? void 0 : piece.getType();
                if (type == null && !drop) {
                    drop = true;
                    drop_position = position;
                }
                else if (type != null && drop) {
                    drop_type_list.push(type);
                    piece === null || piece === void 0 ? void 0 : piece.setType(null);
                }
            }
            let n = 0;
            for (var row_i = drop_position.getRow(); row_i >= 0; row_i--) {
                let position = new Position(row_i, col_i);
                let piece = this.getPiece(position);
                if (n < drop_type_list.length) {
                    piece === null || piece === void 0 ? void 0 : piece.setType(drop_type_list[n]);
                    n++;
                }
                else if (piece != undefined) {
                    need_type_list.push(piece);
                }
            }
        }
        need_type_list.forEach(piece => {
            piece.setType(this.chooseType(piece.getPosition()));
        });
    }
    row_decution(l_position) {
        var _a, _b;
        let first_row = [];
        let first_col = [];
        let opt = false;
        if (l_position == null) {
            for (var row_i = 0; row_i < this.size[0]; row_i++) {
                let s_position = new Position(row_i, 0);
                let cpt = (this.hoi_check(s_position));
                if (cpt) {
                    opt = true;
                }
                let type = (_a = this.getPiece(s_position)) === null || _a === void 0 ? void 0 : _a.getType();
                first_row.push(type);
            }
            // console.log(first_row)
            for (var col_i = 0; col_i < this.size[1]; col_i++) {
                let s_position = new Position(0, col_i);
                let cpt = (this.vet_check(s_position));
                if (cpt) {
                    opt = true;
                }
                let type = (_b = this.getPiece(s_position)) === null || _b === void 0 ? void 0 : _b.getType();
                first_col.push(type);
            }
        }
        else {
            l_position.forEach(pos => {
                //console.log(chalk.bgGreen("Start checking vet single position", pos.row, pos.col))
                let cpt = (this.vet_check(pos));
                if (cpt) {
                    opt = true;
                }
                //console.log(chalk.bgBlue("Start checking hoi single position", pos.row, pos.col))
                let kpt = (this.hoi_check(pos));
                if (kpt) {
                    opt = true;
                }
            });
        }
        return opt;
    }
    // console.log(first_col)
    vet_check(position) {
        var _a, _b;
        let removed = false;
        let x = 0;
        let position_array = [];
        let col = position.col;
        let row = position.row;
        let start_point = new Position(x, col);
        //console.log(chalk.yellow("Starting VET check at ", start_point.row, start_point.col));
        position_array.push(start_point);
        for (var i = 1; i < this.size[1]; i++) {
            // console.log(chalk.bgRed("SEQ",x));
            let check_point = new Position(i, col);
            // console.log(chalk.cyan("Checking", check_point.row, check_point.col, "|", this.getPiece(check_point)?.getType()));
            if (((_a = this.getPiece(start_point)) === null || _a === void 0 ? void 0 : _a.getType()) == ((_b = this.getPiece(check_point)) === null || _b === void 0 ? void 0 : _b.getType())) {
                position_array.push(check_point);
                //console.log(chalk.bgRed(check_point.col + 1 >= this.size[1] && position_array.length >= 3 || check_point.col - 1 <= 0 && position_array.length >= 3 || check_point.row + 1 >= this.size[0] && position_array.length >= 3 || check_point.row - 1 <= 0 && position_array.length >= 3));
                if (check_point.col + 1 >= this.size[1] && position_array.length >= 3 || check_point.col - 1 <= 0 && position_array.length >= 3 || check_point.row + 1 >= this.size[0] && position_array.length >= 3 || check_point.row - 1 <= 0 && position_array.length >= 3) {
                    //console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array))
                    position_array.forEach(po => {
                        this.remove(po);
                    });
                    removed = true;
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array))
                    position_array = [];
                    x += 1;
                    start_point = new Position(x, col);
                }
                else {
                    //console.log(chalk.green("Pushing into array, array size:", position_array.length, " pushed content:", this.getPiece(check_point)?.getType(), "Array: ", position_array))
                    x += 1;
                    start_point = new Position(x, col);
                }
            }
            else {
                if (position_array.length >= 3) {
                    //满足条件删除（>=3）
                    //console.log(chalk.green("Array compelete, size: ", position_array.length, "| Array content: ", position_array))
                    position_array.forEach(po => {
                        this.remove(po);
                    });
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array))
                    position_array = [];
                    x += 1;
                    start_point = new Position(x, col);
                }
                //console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point)?.getType(), "Not Match with ", this.getPiece(start_point)?.getType()))
                position_array = [];
                position_array.push(check_point);
                //console.log(chalk.cyan("EXM", check_point.row, check_point.col, this.getPiece(check_point)?.getType(), "|", start_point.row, start_point.col, this.getPiece(start_point)?.getType()))
                x += 1;
                start_point = new Position(x, col);
            }
        }
        return removed;
        //console.log(chalk.red("Array checking compelete"))
    }
    hoi_check(position) {
        var _a, _b;
        let removed = false;
        let x = 0;
        let position_array_h = [];
        let col = position.col;
        let row = position.row;
        let start_point_h = new Position(row, x);
        //console.log(chalk.yellow("Starting HOI check at ", start_point_h.row, start_point_h.col, this.getPiece(start_point_h)?.getType()));
        position_array_h.push(start_point_h);
        // console.log(position_array);
        for (var i = 1; i < this.size[0]; i++) {
            let check_point_h = new Position(row, i);
            if (((_a = this.getPiece(start_point_h)) === null || _a === void 0 ? void 0 : _a.getType()) == ((_b = this.getPiece(check_point_h)) === null || _b === void 0 ? void 0 : _b.getType())) {
                position_array_h.push(check_point_h);
                if (check_point_h.col + 1 >= this.size[1] && position_array_h.length >= 3 || check_point_h.col - 1 <= 0 && position_array_h.length >= 3 || check_point_h.row + 1 >= this.size[0] && position_array_h.length >= 3 || check_point_h.row - 1 <= 0 && position_array_h.length >= 3) {
                    //console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h))
                    position_array_h.forEach(po => {
                        this.remove(po);
                    });
                    removed = true;
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array_h))
                    position_array_h = [];
                    x += 1;
                    start_point_h = new Position(row, x);
                }
                else {
                    //console.log(chalk.green("Pushing into array, array size:", position_array_h.length, " pushed content:", this.getPiece(check_point_h)?.getType(), "Array: ", position_array_h))
                    x += 1;
                    start_point_h = new Position(row, x);
                }
            }
            else {
                if (position_array_h.length >= 3) {
                    //满足条件删除（>=3）
                    //console.log(chalk.green("Array compelete, size: ", position_array_h.length, "| Array content: ", position_array_h))
                    position_array_h.forEach(po => {
                        this.remove(po);
                    });
                    x += 1;
                    start_point_h = new Position(row, x);
                    //console.log(chalk.cyan("Element removed in chart, position: ", position_array_h))
                }
                //console.log(chalk.red("Cleaning array :", " pushed new content:", this.getPiece(check_point_h)?.getType(), "Not Match with ", this.getPiece(start_point_h)?.getType()))
                position_array_h = [];
                position_array_h.push(check_point_h);
                x += 1;
                start_point_h = new Position(row, x);
            }
        }
        return removed;
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
