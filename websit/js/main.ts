import { Board, Position, BoardListener } from './board';

let type_list = ["A","B","C"]
let a = new Board([3,3],type_list)
console.log(a.toString())
let listener:BoardListener<string> = {
    isMoved(first: Position, second: Position){
        console.log(first.toString()+"<==>"+second.toString())
    }
}
a.addListener(listener)
a.move(new Position(1,0),new Position(1,1))
a.remove(new Position(1,0))
a.remove(new Position(1,1))
console.log(a.toString())
let b = 0