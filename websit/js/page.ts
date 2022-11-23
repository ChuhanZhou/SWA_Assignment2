import { Board, Position } from './board';


let type_list = ["A","B","C"]
let col:number = 5;
let row:number = 5;
let a = new Board([row,col],type_list)

const pieces = Array.from(document.getElementsByClassName('border-item'));


$(document).ready(function(){
const box = document.getElementById('board');
let i:number = 0;
let j:number = 0;
for(i = 0;i<row;i++)
{
    for(j=0;j<col;j++)
    {
        let f =new Position(i,j)   
        let board_item = document.createElement('div');
        board_item.className = 'board-item';
        board_item.tabIndex = 1;
        board_item.id = 'borad-item'+i+j;
        let type:string = a.getPiece(f)?.getType();
        let txt = document.createTextNode(type);
        board_item.appendChild(txt);
        box?.appendChild(board_item);
    }
}

let first_click = null;
let second_click = null;

box?.addEventListener('click',(e)=>{
    let box_item = e.target;
    console.log(box_item);
})

})
