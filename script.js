const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restart-button');
const scoreS = document.getElementById('score-s');
const scoreO = document.getElementById('score-o');
const boardSize = 9; // Change to 9x9 grid
let currentPlayer = 'S';
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
let pointsS = 0;
let pointsO = 0;
let moves = 0;

// Create the game cells
for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (board[row][col] !== '') return;

    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    moves++;

    let sosCount = countSOS(row, col, currentPlayer);

    if (sosCount > 0) {
        if (currentPlayer === 'S') {
            pointsS += sosCount;
            scoreS.textContent = pointsS;
        } else {
            pointsO += sosCount;
            scoreO.textContent = pointsO;
        }
    }

    if (moves === boardSize * boardSize) {
        determineWinner();
    } else {
        currentPlayer = currentPlayer === 'S' ? 'O' : 'S';
    }

    console.log(`Player ${currentPlayer} clicked cell (${row}, ${col}).`);
    console.log(`Points - Player S: ${pointsS}, Player O: ${pointsO}`);
}

function countSOS(row, col, player) {
    let sosCount = 0;
    sosCount += checkDirection(row, col, 0, 1, player); // Horizontal
    sosCount += checkDirection(row, col, 1, 0, player); // Vertical
    sosCount += checkDirection(row, col, 1, 1, player); // Diagonal down-right
    sosCount += checkDirection(row, col, 1, -1, player); // Diagonal down-left
    return sosCount;
}

function checkDirection(row, col, rowDir, colDir, player) {
    let sosFound = 0;
    if (player === 'S') {
        if (
            isValid(row - rowDir, col - colDir) && isValid(row + rowDir, col + colDir) &&
            board[row][col] === 'S' && board[row - rowDir][col - colDir] === 'O' && board[row + rowDir][col + colDir] === 'S'
        ) {
            sosFound++;
        }
        if (
            isValid(row - 2 * rowDir, col - 2 * colDir) && isValid(row - rowDir, col - colDir) &&
            board[row][col] === 'S' && board[row - rowDir][col - colDir] === 'O' && board[row - 2 * rowDir][col - 2 * colDir] === 'S'
        ) {
            sosFound++;
        }
        if (
            isValid(row + rowDir, col + colDir) && isValid(row + 2 * rowDir, col + 2 * colDir) &&
            board[row][col] === 'S' && board[row + rowDir][col + colDir] === 'O' && board[row + 2 * rowDir][col + 2 * colDir] === 'S'
        ) {
            sosFound++;
        }
    } else if (player === 'O') {
        if (
            isValid(row - rowDir, col - colDir) && isValid(row + rowDir, col + colDir) &&
            board[row - rowDir][col - colDir] === 'S' && board[row][col] === 'O' && board[row + rowDir][col + colDir] === 'S'
        ) {
            sosFound++;
        }
    }
    return sosFound;
}

function isValid(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}

function resetGame() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
    currentPlayer = 'S';
    pointsS = 0;
    pointsO = 0;
    moves = 0;
    scoreS.textContent = pointsS;
    scoreO.textContent = pointsO;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.textContent = '');
}

function determineWinner() {
    if (pointsS > pointsO) {
        alert('Player S wins!');
    } else if (pointsO > pointsS) {
        alert('Player O wins!');
    } else {
        alert('It\'s a tie!');
    }
}

// Add event listener to the restart button
restartButton.addEventListener('click', resetGame);
