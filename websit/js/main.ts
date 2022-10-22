import { Board, Position, BoardListener } from './board';

let type_list = ["A","B","C"]
let a = new Board([5,5],type_list)
console.log(a.toString())
let listener:BoardListener<string> = {
    isMoved(first: Position, second: Position){
        a.judge(second)
        console.log(first.toString()+"<==>"+second.toString())
    }
}
a.addListener(listener)
a.move(new Position(2,0),new Position(2,1))
// a.remove(new Position(1,0))
// a.remove(new Position(1,1))
console.log(a.toString())
let b = 0