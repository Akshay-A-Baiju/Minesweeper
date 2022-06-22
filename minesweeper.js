// Game logic

export const TILE_STATUS=
{
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

export function createBoard(boardSize, numberOfMines)
{
    const board=[];
    const minePositions=generateMines(boardSize,numberOfMines); // generate mines
    console.log(minePositions);
    for (let x=0;x<boardSize;x++)
    {
        const row=[];
        for (let y=0;y<boardSize;y++)
        {
            const element=document.createElement('div');    // create element: tile
            element.dataset.status=TILE_STATUS.HIDDEN;      // by default status of tile is hidden

            const tile=
            {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null,{x,y})),   // sets the mine status of the element
                get status()                                // get status of tile
                {
                    return this.element.dataset.status;
                },
                set status(value)                           // set status of tile from hidden to value
                {
                    this.element.dataset.status=value;
                }
            }
            row.push(tile);
        }
        board.push(row);
    }
    return board;
}

function generateMines(boardSize, numberOfMines)
{
    const positions=[];
    while (positions.length<numberOfMines)
    {
        const position=
        {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }
        if (!positions.some(positionMatch.bind(null, position)))    // checks if position is already present in positions or not
        {
            positions.push(position);
        }
    }
    return positions;
}

function positionMatch(a,b)
{
    return (a.x==b.x && a.y==b.y);
}

function randomNumber(size)
{
    return Math.floor(Math.random()*size);
}

export function markTile(tile)
{
    if (tile.status!=TILE_STATUS.HIDDEN && tile.status!=TILE_STATUS.MARKED) // if invalid right click, return
    {
        return
    }
    if (tile.status==TILE_STATUS.MARKED)
    {
        tile.status=TILE_STATUS.HIDDEN;
    }
    else
    {
        tile.status=TILE_STATUS.MARKED;
    }
}

export function revealTile(board, tile)
{
    console.log(tile);
    if (tile.status!=TILE_STATUS.HIDDEN)        // if invalid left click, return
    {
        return;
    }
    if (tile.mine)
    {
        tile.status=TILE_STATUS.MINE;
        return;
    }
    tile.status=TILE_STATUS.NUMBER;
    const adjacentTiles=nearbyTiles(board,tile);    // gets all the adjacentTiles to tile
    const mines=adjacentTiles.filter(t => t.mine);  // filter all adjacent tiles which are mines
    if (mines.length==0)
    {
        adjacentTiles.forEach(revealTile.bind(null,board));
    }
    else
    {
        tile.element.textContent=mines.length;
    }
}

function nearbyTiles(board, {x,y})
{
    const tiles = [];
    for (let xOffset = -1; xOffset <= 1; xOffset++)
    {
        for (let yOffset = -1; yOffset <= 1; yOffset++)
        {
            if (xOffset==0 && yOffset==0)
            {
                continue;
            }
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile)
            {
                tiles.push(tile)
            }
        }
    }
    return tiles;
}

export function checkWin(board)
{
    // if every unrevealed tile is mine, we win
    return board.every(row => {
        return row.every(tile => {
            return (tile.status==TILE_STATUS.NUMBER || (tile.mine && (tile.status==TILE_STATUS.HIDDEN || tile.status==TILE_STATUS.MARKED)));
        })
    })
}

export function checkLose(board)
{
    // if any tile status is mine, we lose
    return board.some(row => {
        return row.some(tile => {
            return tile.status==TILE_STATUS.MINE;
        })
    })
}