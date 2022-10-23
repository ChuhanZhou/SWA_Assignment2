import { Board, Position, BoardListener } from './board';

let type_list = ["A","B","C"]
let a = new Board([5,5],type_list)
console.log()
console.log(a.toString())
let listener:BoardListener<string> = {
    isMoved(first: Position, second: Position){
        console.log(first.toString()+"<==>"+second.toString())
        //a.row_decution([first,second])
    }
}
a.addListener(listener)
//a.move(new Position(1,2),new Position(1,3))
//a.move(new Position(1,1),new Position(2,1))
//a.move(new Position(3,0),new Position(3,1))
//console.log(a.toString())

a.remove(new Position(1,0))
a.remove(new Position(1,1))
a.remove(new Position(1,2))
a.remove(new Position(1,3))
a.remove(new Position(1,4))
a.pieceDropDown()
console.log(a.toString());
a.moveInRule(new Position(1, 0), new Position(1, 1));
a.moveInRule(new Position(0, 1), new Position(1, 1));
a.moveInRule(new Position(1, 1), new Position(1, 2));
console.log(a.toString());
//
let b = 0
let f =new Position(0,0)
a.getPiece(f)