const board =document.querySelector("#gameboard");
const player = document.querySelector("#s1");
const display = document.querySelector("#p1");
const width = 8;
const startPieces =[rook,knight,bishop,queen,king,bishop,knight,rook
    ,pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn
    ,'','','','','','','',''
    ,'','','','','','','',''
    ,'','','','','','','',''
    ,'','','','','','','',''
    ,pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
   rook,knight,bishop,queen,king,bishop,knight,rook
]
function createBoard(){
    startPieces.forEach((element,i) => {
       const square= document.createElement('div');
       square.classList.add('square');
       square.innerHTML=element;
       square.firstChild?.setAttribute('draggable',true);
       square.setAttribute('square-id',i);
       const row = Math.floor((63-i)/8)+1;
       if(row%2===0){
        square.classList.add(i%2===0?"blue":"white");
       }
       else{
        square.classList.add(i%2===0?"white":"blue");

       }
       if(i<16){
        square.firstChild.firstChild.classList.add("black");
       }

       
       board.append(square);
        
    });
}
createBoard();


const allSquare=document.querySelectorAll("#gameboard.square"); 
allSquare.array.forEach( square => {
    square.addEventListener('dragstart',dragStart);

});
function dragStart(e){
    console.log(e);
}

    
