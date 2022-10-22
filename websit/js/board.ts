const chalk = require("chalk");

export class Board<T>{
    piece_list: Array<Array<Piece<T>>>
    type_list: Array<T>
    type_num_map: Map<T,number>
    size: [number,number]
    listener_list:Array<BoardListener<T>>

    constructor(size: [number,number], type_list: Array<T>) { 
        let row_size = size[0]
        let col_size = size[1]
        this.size = [row_size,col_size]
        this.piece_list = []
        this.type_list = type_list
        this.type_num_map = new Map<T,number>()
        this.listener_list = []
        for (var i = 0; i < type_list.length; i++){
            this.type_num_map.set(type_list[i],0)
        }

        for (var row_i = 0; row_i < row_size; row_i++){
            this.piece_list.push([])
            for(var col_i = 0; col_i < col_size; col_i++){
                let position = new Position(row_i,col_i)
                let type = this.chooseType(position)
                this.type_num_map.set(type,(this.type_num_map.get(type)??0)+1)
                let piece = new Piece(type,position)
                this.piece_list[row_i].push(piece)
            }
        }
    }

    private chooseType(position:Position):T{
        let neighbour_type_list = new Map<T|null,number>()
        let position_list = [[0,1],[0,-1],[1,0],[-1,0]]
        for (var i = 0; i < position_list.length; i++){
            let neighbour_position = new Position(position.getRow()+position_list[i][0],position.getCol()+position_list[i][1])
            let neighbour = this.getPiece(neighbour_position)
            if (neighbour != undefined){
                neighbour_type_list.set(neighbour.getType(),1+(neighbour_type_list.get(neighbour.getType())??0))
            }
        }

        let type_map_sort = Array.from(this.type_num_map).sort(function(){return 0.5-Math.random()}).sort((a,b) => { return a[1] - b[1]})
        let out_type = type_map_sort[0][0]
        let type_num = type_map_sort[0][1]
        for (var i = 0; i < type_map_sort.length; i++){
            let type = type_map_sort[i][0]
            let num = type_map_sort[i][1]
            if (!neighbour_type_list.has(type)){
                out_type = type
                break
            }
        }
        return out_type
    }

    getPiece(position:Position):Piece<T>|undefined{
        if (this.piece_list.length>position.getRow()&&position.getRow()>=0){
            if (this.piece_list[position.getRow()].length>position.getCol()&&position.getCol()>=0){
                return this.piece_list[position.getRow()][position.getCol()]
            }
        }
        return undefined
    }

    setPiece(piece:Piece<T>){
        let target_piece = this.getPiece(piece.getPosition())
        if (target_piece!=undefined){
            target_piece.setType(piece.getType())
        }
    }

    remove(position:Position){
        let target = this.getPiece(position)
        if (target!=undefined){
            target.setType(null)
        }
    }

    canMove(first: Position, second: Position): boolean {
        let first_piece = this.getPiece(first)
        let second_piece = this.getPiece(second)
        if (first_piece != undefined && second_piece != undefined){
            if (first_piece.isNeighbour(second_piece)){
                return true
            }
        }
        return false
    }
    
    move(first: Position, second: Position) {
        if (this.canMove(first,second)){
            let first_piece = this.getPiece(first)
            let second_piece = this.getPiece(second)
            let first_copy = first_piece?.copy()
            first_piece?.setType(second_piece?.getType() ?? first_piece.getType())
            second_piece?.setType(first_copy?.getType() ?? second_piece.getType())
            this.judge(second)
            for (var i = 0; i < this.listener_list.length; i++) {
                this.listener_list[i].isMoved(first, second)
            }
        }
    }

    addListener(listener: BoardListener<T>) {
        this.listener_list.push(listener)
    }

    toString():string{
        let out_str = ""
        for (var row_i = 0; row_i < this.size[0]; row_i++){
            let str = "[ "
            for(var col_i = 0; col_i < this.size[1]; col_i++){
                let position = new Position(row_i,col_i)
                let type = this.getPiece(position)?.getType()
                str+=type+" "
            }
            str += "]\n"
            out_str+=str
        }
        return out_str
    }

    //Rd logic starts here
    judge(position: Position){
        let position_offset: Position[] = []
        position_offset.push(new Position(position.getRow(),position.getCol()-1),new Position(position.getRow(),position.getCol()+1),new Position(position.getRow()-1,position.getCol()),new Position(position.getRow()+1,position.getCol()))
        console.log("Judge Loc: ",position.row,position.col)
        console.log("Judge Val: ",this.getPiece(position)," Surrund: +-1, +-1 ")
        position_offset.forEach((o,index) => {
            console.log(chalk.white("Value: ",chalk.bgRed(this.getPiece(o)?.getType())," Offset: [",o.row,o.col,"], sequence: ",index))
            console.log("CEC")
        })
    }
}

export type BoardListener<T> = {
    isMoved(first: Position, second: Position)
}

export class Piece<T>{
    type: T|null;
    position: Position;

    constructor(type: T, position: Position) { 
        this.type = type
        this.position = position
    }

    getType():T|null{
        return this.type
    }

    getPosition():Position{
        return this.position
    }

    setType(type: T|null){
        this.type = type
    }

    setPosition(position: Position){
        this.position = position
    }

    isNeighbour(other:Piece<T>):boolean{
        let other_position = other.getPosition()
        let length = Math.sqrt(Math.pow(this.position.getCol()-other_position.getCol(),2)+Math.pow(this.position.getRow()-other_position.getRow(),2))
        return length==1
    }

    copy():Piece<T|null>{
        return new Piece(this.type,this.position.copy())
    }

}   

export class Position{
    row: number;
    col: number;

    constructor(row: number, col: number) { 
        this.row = row
        this.col = col
    } 

    getRow():number {
        return this.row
    }

    getCol():number {
        return this.col
    }

    set(row: number, col: number):void{
        this.row = row
        this.col = col
    }

    copy():Position{
        return new Position(this.row,this.col)
    }

    toString():string{
        return "["+this.row+","+this.col+"]"
    }
}


