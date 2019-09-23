let gameState = true;
const tagId = 'game';

const leaderBoard = new LeaderBoard(tagId);
const game = new Game(tagId, function (seconds) {
    const username = prompt("You are win! Please enter your name:", "Harry Potter");
    if (username == null || username === '') {
        //User cancelled the prompt.
    } else {
        console.log(username + ': ' + seconds + ' sec');
        leaderBoard.add(username, seconds);
    }
});

game.start();
// leaderBoard.show();

document.getElementById('btn_solve')
    .addEventListener('click', function (e) {
        game.solve();
    });

document.getElementById('btn_mix')
    .addEventListener('click', function (e) {
        game.mix()
    });

document.getElementById('btn_change_state')
    .addEventListener('click', function (e) {
        gameState = !gameState;
        if (gameState) {
            e.target.innerText = 'Leader Board';
            document.getElementById('btn_mix').style.visibility = 'visible';
            document.getElementById('btn_solve').style.visibility = 'visible';

            game.start();
        } else {
            e.target.innerText = 'Game';
            document.getElementById('btn_mix').style.visibility = 'hidden';
            document.getElementById('btn_solve').style.visibility = 'hidden';

            game.clear();
            leaderBoard.show();
        }
    });