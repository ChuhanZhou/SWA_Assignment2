import { Board, Position, BoardListener } from './board';

let type_list = ["A","B","C","A"]
let a = new Board([5,5],type_list)
console.log()
console.log(a.toString())
let listener:BoardListener<string> = {
    isMoved(first: Position, second: Position){
        console.log(first.toString()+"<==>"+second.toString())
        a.row_decution([first,second])
    }
}
a.addListener(listener)
a.move(new Position(1,2),new Position(1,3))
a.move(new Position(1,1),new Position(2,1))
a.move(new Position(3,0),new Position(3,1))

console.log("MOVE")
console.log(a.toString())
let b = 0