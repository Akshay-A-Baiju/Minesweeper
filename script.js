// Display/ UI

// 1. populate the board
// 2. Left click on tiles -> reveal tiles
// 3. right click on tiles -> mark tiles
// 4. check win/lose

import {createBoard, markTile, revealTile, TILE_STATUS, checkWin, checkLose} from './minesweeper.js'

const BOARD_SIZE=10;
const NO_OF_MINES=10;

const board=createBoard(BOARD_SIZE,NO_OF_MINES);
const boardElement=document.querySelector('.board');            // now add each board elements to the board
const minesLeftText=document.querySelector('#data-mine-count'); // change the mine left count
const messageText=document.querySelector('.subtext');           // change text to win/lose on game end

console.log(board);

boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent=NO_OF_MINES;                  // change the no of mines left

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);                  // now each element/tile is appended to boardElement
        tile.element.addEventListener("click", () => {      // for left click
            revealTile(board,tile);
            checkGameEnd();
        })
        tile.element.addEventListener("contextmenu", e=> {
            e.preventDefault();
            markTile(tile);     // mark the tile
            listMinesLeft();    // count the no of tiles marked in the board
        })
    })
})

function listMinesLeft()
{
    const markedTilesCount=board.reduce((count,row) => {
        return count+row.filter(tile => tile.status==TILE_STATUS.MARKED).length;
    },0);       // 0 is the default count
    minesLeftText.textContent=NO_OF_MINES-markedTilesCount;
}

function checkGameEnd()
{
    const win=checkWin(board);
    const lose=checkLose(board);
    if (win || lose)
    {
        boardElement.addEventListener("click",stopPropagation, {capture: true});
        boardElement.addEventListener("contextmenu",stopPropagation, {capture: true});
    }
    if (win)
    {
        messageText.textContent="You WIN!!!";
    }
    else if (lose)
    {
        messageText.textContent="YOU LOSE!!!";
        // reveal all the mines in the board
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status==TILE_STATUS.MARKED)
                {
                    markTile(tile);
                }
                if (tile.mine)
                {
                    revealTile(board,tile);
                }
            })
        })
    }
}

function stopPropagation(e)
{
    e.stopImmediatePropagation();
}