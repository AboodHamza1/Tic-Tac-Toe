let disableEvents = false;

const gameBoard = ( ()=>{
    let roundsPlayed = 0;
    const Board = new Array(9).fill(0);
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const showBoard = () => console.table(Board)

    const checkWin = () =>{
        for ( let i = 0 ; i < winningCombinations.length ; i ++)
        {
            const comb = winningCombinations[i];
            if ( Board[comb[0]] === 0 || Board[comb[1]] ===0  || Board[comb[2]] === 0)
                continue;
            if( Board[comb[0]] === Board[comb[1]]  && Board[comb[1]] === Board[comb[2]] && Board[comb[0]] === Board[comb[2]] )
            {
                const winningCellOne = document.querySelector(`[data-index='${comb[0]}']`)
                const winningCellTwo = document.querySelector(`[data-index='${comb[1]}']`)
                const winningCellThree = document.querySelector(`[data-index='${comb[2]}']`)

                winningCellOne.style.backgroundColor = 'gold';
                winningCellTwo.style.backgroundColor = 'gold';
                winningCellThree.style.backgroundColor = 'gold';

                
                return Board[comb[0]]; 
            }

        }
        return false;
    }

    const playRound = (player,index) => 
    {
        if(isUsed(index) || index > 8) 
            return false;

        Board[index] = player.getSymbol()
        roundsPlayed++;
        return true;
    }

    const isDraw = () => roundsPlayed === 9;
    const restartBoard = () =>{
        setTimeout(function() {
            roundsPlayed = 0;
            Board.fill(0);
            const cells = document.querySelectorAll('[data-index]')
            cells.forEach(div =>{
                div.style.backgroundColor = 'white'
                div.innerHTML = '';
            })
        }, 1500);
        
    }
    const isUsed = (index) => Board[index] !== 0;
    return{
        showBoard,
        checkWin,
        playRound,
        restartBoard,
        isDraw
    }
})();



const gameController = (()=>{ // player1 = X , player 2 = O
    const turns = [];
    let current = 0;
    const initiateMatch = () => {
        gameBoard.restartBoard()
    }
    const play = index => {
        if (disableEvents)
            return
        const status = gameBoard.playRound(turns[current] ,index);
        if(status){
            const TargetDiv = document.querySelector(`[data-index ='${index}']`);
            TargetDiv.innerHTML = turns[current].getSymbol();
            current = (current + 1)%2;
            const winner = gameBoard.checkWin();
            if(winner!== false){
                disableEvents = true;
                turns[0].getSymbol() === winner ? console.log(turns[0].congratulate()) : console.log(turns[1].congratulate());

                gameBoard.restartBoard();
                swapSymbols();
                turns[0].getSymbol() === 'X' ? current = 0 : current = 1; 
                
            }
            console.log(gameBoard.roundsPlayed);
            if(gameBoard.isDraw())
            {
                console.log('Draw !');
                gameBoard.restartBoard();
                swapSymbols();
                turns[0].getSymbol() === 'X' ? current = 0 : current = 1;
            }

        }
    };
    const swapSymbols = () =>{
        const Player1Symbol = document.querySelector('.player-one-symbol');
        const Player2Symbol = document.querySelector('.player-two-symbol');
        const temp = turns[0].getSymbol();

        turns[0].setSymbol(turns[1].getSymbol())
        turns[1].setSymbol(temp);

        setTimeout(function() {
            Player1Symbol.textContent = turns[0].getSymbol();
            Player2Symbol.textContent = turns[1].getSymbol();
            disableEvents = false;
        }, 1500);
        
    }
    const setPlayers = (PlayerOne, PlayerTwo) =>{
        turns[0] = PlayerOne;
        turns[1] = PlayerTwo;
    }

    return {
        initiateMatch,play,setPlayers
    }

})();

const Player = (name, symbol) =>{
    const congratulate = () => {
        const ownSpan = document.querySelector(`[data-name = "${name}"]`);
        ownSpan.textContent = (Number(ownSpan.textContent)+1).toString(); 

       return  `Congratulations To ${name}, You won using ${symbol}`;
    }
    const setSymbol = (newSymbol)=> symbol = newSymbol
    const getSymbol = () => symbol
    const setName = (newName) => name = newName;
    return { congratulate , setSymbol , getSymbol,name, setName}
}

const playerOne = Player('Player One', 'X');
const playerTwo = Player('Player Two', 'O');
gameController.setPlayers(playerOne,playerTwo);


const cells = document.querySelectorAll('.cell')
cells.forEach(cell=>{
    cell.addEventListener('click' ,  e =>{
        gameController.play(cell.dataset.index);
        //gameBoard.showBoard();
        e.stopPropagation();
    })
});

const addPlayers = document.querySelector('.confirm');

const Player1Name = document.querySelector('#name');
const Player2Name = document.querySelector('#name2');


const modal = document.querySelector('.modal');
const overlay = document.querySelector('#overlay');


const Player1Span = document.querySelector('.player-one-score');
const Player2Span = document.querySelector('.player-two-score');


const Player1H3 = document.querySelector('.player-one-name');
const Player2H3 = document.querySelector('.player-two-name');
addPlayers.addEventListener('click' , e=>{
    e.preventDefault();
    playerOne.setName(Player1Name.value);
    playerTwo.setName(Player2Name.value);

    Player1Span.dataset.name = Player1Name.value;
    Player2Span.dataset.name = Player2Name.value;

    Player1H3.textContent = Player1Name.value + ' : ';
    Player2H3.textContent = Player2Name.value + ' : ';

    modal.classList.remove('active');
    overlay.classList.remove('active');
    e.stopPropagation();
});

const closeButton = document.querySelector('.close-modal');

closeButton.addEventListener('click', e=>{
    modal.classList.remove('active');
    overlay.classList.remove('active');
    e.stopPropagation();
})