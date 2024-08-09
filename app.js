const board =document.querySelector("#gameboard");// to create the gameboard selelecting the div
const display = document.querySelector("#p1");// select the div showing turn
const width = 8;
let playerGO="black"; // to know whose turn it is
display.textContent="black";//the starting display
const startPieces =[rook,knight,bishop,queen,king,bishop,knight,rook
    ,pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn
    ,'','','','','','','',''
    ,'','','','','','','',''
    ,'','','','','','','',''
    ,'','','','','','','',''
    ,pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
   rook,knight,bishop,queen,king,bishop,knight,rook
]// defiining an array with all gameboard properties
function createBoard(){
    startPieces.forEach((element,i) => {
       const square= document.createElement('div');
       square.classList.add('square');// for every element in the array create a div called square
       square.innerHTML=element;//put theses elements inside the squares which are defined in the piece.js file
       square.firstChild?.setAttribute('draggable',true);// if a first child exists like the pieces then make it draggable
       square.setAttribute('square-id',i);// setting a custom attribute for all squares
       const row = Math.floor((63-i)/8)+1;
       if(row%2===0){
        square.classList.add(i%2===0?"blue":"white1");
       }
       else{
        square.classList.add(i%2===0?"white1":"blue");

       }// to create alternate pieces
       if(i<16){
        square.firstChild.firstChild.classList.add("black");
       } 
       else if (i>48){
         square.firstChild.firstChild.classList.add("white");
       }// to create different color pieces

       
       board.append(square);// finally appending the square div inside the gameboard
        
    });
}// creating the board 
createBoard(); // function is called


const allSquare=document.querySelectorAll("#gameboard .square"); // now selecting all the squares in a nodelist
allSquare.forEach(square=>{
    square.addEventListener("dragstart",dragStart);
    square.addEventListener("dragover",dragOver);
    square.addEventListener("drop",dragDrop);
 });// for every  square if dragged then call the function dragstart, if dragged over then dragover and if dragdrop if dropped down
 let startPosition ;
 let draggedElement;
 function dragStart(e){
    draggedElement=e.target;
    startPosition=e.target.parentNode.getAttribute('square-id');
 }// gives the id of the square where we started
 function dragOver(e){
    e.preventDefault();//using this we allow piece to be dropped into elements
 }
 function dragDrop(e){
   e.stopPropagation();
   e.preventDefault();
   const taken = e.target.classList.contains("piece");//if taken is true it means the target class already had an element
   const correctGo =draggedElement.firstChild?.classList.contains(playerGO);// check if its correct go or not
   const opponentGo=playerGO==="white"?"black":"white";//oppenent go
   const takenbyOpps=e.target.firstChild?.classList.contains(opponentGo);
   const valid = checkifValid(e.target);
   if(correctGo){
      //must check this first
      if (takenbyOpps&&valid) {
         e.target.parentNode.append(draggedElement);
        e.target.remove();
        changePlayer();
        return;
         
      }
      if (taken && !takenbyOpps) {
         return;         
      }
      if(valid){
         e.target.append(draggedElement);
         changePlayer();
         return;

      }
   }
   
  
  
 }
 function changePlayer(){
   if (playerGO==="white") {
      playerGO="black";
      display.textContent="black";
      revertIds();
      checkForWin();
      
   }
   else{
      playerGO="white";
      display.textContent="white";
      reverseIds();
      checkForWin();
   }
 }// changes player after every drop
function reverseIds(){
   const allSquare = document.querySelectorAll(".square");
   allSquare.forEach((square,i)=> square.setAttribute("square-id",width*width-i-1)); // changed the setId attribute 
}
function revertIds(){
   const allSquare = document.querySelectorAll(".square");
   allSquare.forEach((square,i)=> square.setAttribute("square-id",i)); // make it change again
}
function checkifValid(target){
   const targetId = Number(target.getAttribute("square-id"))||Number(target.parentNode.getAttribute("square-id"));
   const startId=Number(startPosition);
   const piece= draggedElement.id;
   console.log(startId);
   console.log(targetId);

   switch (piece) {
      case "pawn":
         const starterRow=[8,9,10,11,12,13,14,15];
         if (starterRow.includes(startId)&&startId + width*2===targetId||
      startId+width===targetId||startId+width-1===targetId&&document.querySelector(`[square-id="${startId+width-1}"]`).firstChild||startId+width+1===targetId&&document.querySelector(`[square-id="${startId+width+1}"]`).firstChild){
            return true;
            
         }
         
         break;
      case "knight":
         if (startId+width*2-1===targetId||startId+width*2+1===targetId||startId+width-2===targetId||startId+width+2===targetId||startId-width*2-1===targetId||startId-width*2+1===targetId||startId-width-2===targetId||startId-width+2===targetId) {
            return true;
         }
         break;
      case "bishop":
         // Convert linear IDs to (row, column)
      const startRow = Math.floor(startId / width);
      const startCol = startId % width;
      const targetRow = Math.floor(targetId / width);
      const targetCol = targetId % width;

      // Check if the move is on the same diagonal
      if (Math.abs(startRow - targetRow) === Math.abs(startCol - targetCol)) {
         // Determine the direction of the move
         const rowStep = startRow < targetRow ? 1 : -1;
         const colStep = startCol < targetCol ? 1 : -1;

         // Check each square along the path
         let currentRow = startRow + rowStep;
         let currentCol = startCol + colStep;
         while (currentRow !== targetRow && currentCol !== targetCol) {
            const squareId = currentRow * width + currentCol;
            if (document.querySelector(`[square-id="${squareId}"]`).firstChild) {
               // There is a piece blocking the path
               return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
         }
         return true;
      }
         break; 
       case "rook":
            // Convert linear IDs to (row, column)
            const rookStartRow = Math.floor(startId / width);
            const rookStartCol = startId % width;
            const rookTargetRow = Math.floor(targetId / width);
            const rookTargetCol = targetId % width;
      
            // Check if the move is on the same row or column
            if (rookStartRow === rookTargetRow || rookStartCol === rookTargetCol) {
               // Determine the direction of movement
               const rowStep = rookStartRow === rookTargetRow ? 0 : (rookStartRow < rookTargetRow ? 1 : -1);
               const colStep = rookStartCol === rookTargetCol ? 0 : (rookStartCol < rookTargetCol ? 1 : -1);
      
               // Check each square along the path
               let currentRow = rookStartRow + rowStep;
               let currentCol = rookStartCol + colStep;
               while (currentRow !== rookTargetRow || currentCol !== rookTargetCol) {
                  const squareId = currentRow * width + currentCol;
                  if (document.querySelector(`[square-id="${squareId}"]`).firstChild) {
                     // There is a piece blocking the path
                     return false;
                  }
                  currentRow += rowStep;
                  currentCol += colStep;
               }
               return true;
            }
            break;  
       case "queen":
               // Convert linear IDs to (row, column)
               const queenStartRow = Math.floor(startId / width);
               const queenStartCol = startId % width;
               const queenTargetRow = Math.floor(targetId / width);
               const queenTargetCol = targetId % width;
         
               // Check if the move is horizontal, vertical, or diagonal
               if (queenStartRow === queenTargetRow || queenStartCol === queenTargetCol ||
                   Math.abs(queenStartRow - queenTargetRow) === Math.abs(queenStartCol - queenTargetCol)) {
                  // Determine the direction of movement
                  const rowStep = queenStartRow === queenTargetRow ? 0 : (queenStartRow < queenTargetRow ? 1 : -1);
                  const colStep = queenStartCol === queenTargetCol ? 0 : (queenStartCol < queenTargetCol ? 1 : -1);
         
                  // Check each square along the path
                  let currentRow = queenStartRow + rowStep;
                  let currentCol = queenStartCol + colStep;
                  while (currentRow !== queenTargetRow || currentCol !== queenTargetCol) {
                     const squareId = currentRow * width + currentCol;
                     if (document.querySelector(`[square-id="${squareId}"]`).firstChild) {
                        // There is a piece blocking the path
                        return false;
                     }
                     currentRow += rowStep;
                     currentCol += colStep;
                  }
                  return true;
               }
               break;
       case "king":
                  // Convert linear IDs to (row, column)
                  const kingStartRow = Math.floor(startId / width);
                  const kingStartCol = startId % width;
                  const kingTargetRow = Math.floor(targetId / width);
                  const kingTargetCol = targetId % width;
            
                  // Check if the move is one square in any direction
                  if (Math.abs(kingStartRow - kingTargetRow) <= 1 && Math.abs(kingStartCol - kingTargetCol) <= 1) {
                     return true;
                  }
                  break;          
      default:
         break;
   }
 
}
function checkForWin(){
   const kings =Array.from(document.querySelectorAll("#king"));
   if(!kings.some(king=>king.firstChild.classList.contains("white"))){
      display.textContent="black won";
      const allSquare= document.querySelectorAll(".square");
      allSquare.forEach(square=>square.firstChild?.setAttribute('draggable',false));
   }
   if(!kings.some(king=>king.firstChild.classList.contains("black"))){
      display.textContent="white won";
      const allSquare= document.querySelectorAll(".square");
      allSquare.forEach(square=>square.firstChild?.setAttribute('draggable',false));
   }

   

}


 