document.addEventListener('DOMContentLoaded', () => {
    const dino = document.querySelector('.dino')
    const grid = document.querySelector('.grid')
    const body = document.querySelector('body')
    const alert = document.getElementById('alert')
    const scoreText = document.getElementById('scoreText')
    const highScoreText = document.getElementById('highScoreText')
    scoreText.innerHTML = "Score: " + 0
    highScoreText.innerHTML = "Highscore: " + 0
    alert.innerHTML = "Press the spacebar to start!"
    let isJumping = false
    let isGameOver = true
    let returned = true
    let slideSpeed = 2
    let spawnMaxInterval = 3500
    let tryToJump = 0
    let intervalSet = false
    let score = 0
    let highScore = 0

    function control(e) {
        if (e.keyCode === 32) {
            if (intervalSet === false) {
                tryToJump = setInterval(function () {
                    intervalSet = true;
                    if (!isJumping && isGameOver === false) {
                        isJumping = true
                        jump()
                        clearInterval(tryToJump)
                        return
                    } else if (!isJumping && isGameOver === true) {
                        isJumping = true
                        returned = false;
                        document.querySelectorAll('.obstacle').forEach(e => e.remove());
                        isGameOver = false;
                        slideBackground()
                        generateObstacles()
                        jump()
                        alert.innerHTML = ''
                        clearInterval(tryToJump)
                        score = 0
                        scoreText.innerHTML = "Score: " + score;
                        return
                    }
                }, 1)
            } else if (!isJumping && isGameOver === false) {
                isJumping = true
                jump()
            } else if (!isJumping && isGameOver === true) {
                isJumping = true
                returned = false;
                document.querySelectorAll('.obstacle').forEach(e => e.remove());
                isGameOver = false;
                slideBackground()
                generateObstacles()
                jump()
                alert.innerHTML = ''
                score = 0
                scoreText.innerHTML = "Score: " + score;
            }
        }
    }

    function controlRelease(e) {
        if (e.keyCode === 32) {
            clearInterval(tryToJump)
            intervalSet = false
        }
    }

    document.addEventListener('keydown', control)
    document.addEventListener('keyup', controlRelease)

    let position = 1
    function jump() {
        let gravity = 1
        let speed = 13
        position = 1
        // let count = 0
        let timerId = setInterval(function () {

            //move down
            if (speed < 3) {
                gravity = 1
                clearInterval(timerId)
                let downTimerId = setInterval(function () {
                    gravity = gravity * 1.02
                    speed = speed * gravity
                    position = position - speed
                    if (position > 1)
                        dino.style.bottom = position + 'px'
                    else {
                        dino.style.bottom = 1 + 'px'
                        clearInterval(downTimerId)
                        isJumping = false
                    }
                }, 20)

            }
            gravity = gravity / 1.02
            speed = speed * gravity
            position = position + speed
            if (position > 1)
                dino.style.bottom = position + 'px'
        }, 20)
    }
    let timeout = 0

    function generateObstacles() {
        if (isGameOver === false) {
            let randomTime = randomIntFromInterval(400, spawnMaxInterval)
            let obstaclePosition = 1000
            const obstacle = document.createElement('div')
            obstacle.classList.add('obstacle')
            obstacleRemoved = false

            let whichObstacle = randomIntFromInterval(1, 3)
            obstacle.style.backgroundImage = "url('images/obstacle_" + whichObstacle + ".png')"

            grid.appendChild(obstacle)
            obstacle.style.left = obstaclePosition + 'px'

            if (isGameOver === false) {
                let timerId = setInterval(function () {
                    if (obstaclePosition > 0 && obstaclePosition < 50 && position < 50) {
                        clearInterval(timerId)
                        alert.innerHTML = 'Game Over. Press the spacebar to try again!'
                        isGameOver = true
                        clearTimeout(timeout)
                        return
                    }
                    if (obstaclePosition < -120) {
                        obstacle.remove()
                        score++
                        if(score >= highScore){
                            highScore = score
                            highScoreText.innerHTML = "Highscore: " + highScore
                        }
                        scoreText.innerHTML = "Score: " + score
                        obstacleRemoved = true
                        clearInterval(timerId)
                        return
                    }
                    if (!isGameOver) {
                        obstaclePosition -= slideSpeed
                        obstacle.style.left = obstaclePosition + 'px'
                    } else {
                        clearTimeout(timeout)
                        obstaclePosition = 1000
                        clearInterval(timerId)
                        return
                    }
                }, 1)
            } else return
            if (isGameOver === false) timeout = setTimeout(generateObstacles, randomTime)
            else {
                clearTimeout(timeout)
            }
        } else {
            clearTimeout(timeout)
            obstaclePosition = 1000
            returned = true
            return true
        }
    }

    const slidingBackground = document.querySelector('.slidingBackground')

    let bPosition = 0;
    function slideBackground() {
        {
            let interval = setInterval(function () {
                bPosition -= slideSpeed;
                slidingBackground.style.backgroundPosition = bPosition + "px 0px"
                if (isGameOver) {
                    clearInterval(interval)
                    slideSpeed = 2
                    spawnMaxInterval = 3500
                }
                if (spawnMaxInterval >= 1200) {
                    spawnMaxInterval -= 0.04
                }
                slideSpeed += 0.0001
            }, 1);
        }
    }

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
})