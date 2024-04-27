function setBattle(worldState) {
    add([
        sprite('battle-background'),
        scale(window.innerWidth / 800),
        pos(0,0)
    ])

    const enemyMon = add([
        sprite(worldState.enemyName + '-mon'),
        scale(6),
        pos(window.innerWidth, window.innerHeight / 5),
        opacity(1), 
        {
            fainted: false
        }
    ])
    enemyMon.flipX = true

    tween(
        enemyMon.pos.x, 
        window.innerWidth * 0.7, 
        0.3,
        (val) => enemyMon.pos.x = val,
        easings.easeInSine
    )

    const playerMon = add([
        sprite('player-mon'),
        scale(9),
        pos(0, window.innerHeight / 3),
        opacity(1),
        {
            fainted: false
        }
    ])

    tween(
        playerMon.pos.x, 
        window.innerWidth * 0.2, 
        0.3, 
        (val) => playerMon.pos.x = val, 
        easings.easeInSine
    )

    const playerMonHealthBox = add([
       rect(400, 100),
       outline(4),
       pos(0, window.innerHeight / 9)
    ])

    playerMonHealthBox.add([
        text('PLAYER', {size: 32}),
        color(10,10,10),
        pos(10, 10)
    ])

    playerMonHealthBox.add([
        rect(370, 10),
        color(200,200,200),
        pos(15, 50)
    ])

    const playerMonHealthBar = playerMonHealthBox.add([
        rect(370, 10),
        color(0,200,0),
        pos(15, 50)
    ])

    tween(playerMonHealthBox.pos.x, (window.innerWidth * 0.2) - 60, 0.3, (val) => playerMonHealthBox.pos.x = val, easings.easeInSine)

    const enemyMonHealthBox = add([
        rect(400, 100),
        outline(4),
        pos(window.innerWidth, window.innerHeight * 0.5) 
    ])

    enemyMonHealthBox.add([
        text(worldState.enemyName.toUpperCase(), {size: 32}),
        color(10,10,10),
        pos(10, 10)
    ])

    enemyMonHealthBox.add([
        rect(370, 10),
        color(200,200,200),
        pos(15, 50)
    ])

    const enemyMonHealthBar = enemyMonHealthBox.add([
        rect(370, 10),
        color(0,200,0),
        pos(15, 50)
    ])

    tween(enemyMonHealthBox.pos.x, (window.innerWidth * 0.7) - 80, 0.3, (val) => enemyMonHealthBox.pos.x = val, easings.easeInSine)

    const box = add([
        rect(window.innerWidth - 50, window.innerHeight * 0.3),
        outline(4),
        pos(25, window.innerHeight * 0.7 - 25)
    ])

    const content = box.add([
        text('PLAYER is ready to battle!', { size: 42}),
        color(10,10,10),
        pos(20,20)
    ])

    function reduceHealth(healthBar, damageDealt) {
        tween(
            healthBar.width,
            healthBar.width - damageDealt,
            0.5,
            (val) => healthBar.width = val,
            easings.easeInSine
        )
    }

    function makeMonFlash(mon) {
        tween(
            mon.opacity,
            0,
            0.3,
            (val) => {
                mon.opacity = val
                if (mon.opacity === 0) {
                    mon.opacity = 1
                }
            },
            easings.easeInBounce
        )
    }

    let phase = 'player-selection'
    onKeyPress('space', () => {
        if (playerMon.fainted || enemyMon.fainted) return

        if (phase === 'player-selection') {
            content.text = '=> Attack!'
            phase = 'player-turn'
            return
        }

        if (phase === 'enemy-turn') {
            content.text = worldState.enemyName.toUpperCase() + ' attacked you!!'
            const damageDealt = Math.random() * 50

            if (damageDealt > 80) {
                content.text = worldState.enemyName.toUpperCase() + " attacked you with a critical hit!"
            }

            reduceHealth(playerMonHealthBar, damageDealt)
            makeMonFlash(playerMon)

            phase = 'player-selection'
            return
        }

        if (phase === 'player-turn') {
            const damageDealt = Math.random() * 300

            if (damageDealt > 250) {
                content.text = "You attacked a critical hit!"
            } else {
                content.text = 'PLAYER used attack.'
            }

            reduceHealth(enemyMonHealthBar, damageDealt)
            makeMonFlash(enemyMon)

            phase = 'enemy-turn'
        }
    })

    function colorizeHealthBar(healthBar) {
        if (healthBar.width < 200) {
            healthBar.use(color(250, 150, 0))
        }

        if (healthBar.width < 100) {
            healthBar.use(color(200, 0, 0))
        }

    }

    function makeMonDrop(mon) {
        tween(
            mon.pos.y,
            1600,
            0.5,
            (val) => mon.pos.y = val,
            easings.easeInSine
        )
    }

    onUpdate(() => {
        colorizeHealthBar(playerMonHealthBar)
        colorizeHealthBar(enemyMonHealthBar)

        if (enemyMonHealthBar.width < 0 && !enemyMon.fainted) {
            makeMonDrop(enemyMon)
            content.text = worldState.enemyName.toUpperCase() + ' fainted!'
            enemyMon.fainted = true
            setTimeout(() => {
                content.text = 'Player won the battle!'
            }, 2000)
            setTimeout(() => {
                content.text = 'going to the page'
            }, 4000)
            setTimeout(() => {
                worldState.faintedMons.push(worldState.enemyName)
                go('world', worldState)

                if(worldState.enemyName === "cat"){
                    //window.open("https://www.naver.com/", '_blank')
                    alert("You defeated cat!");
                }
                if(worldState.enemyName === "spider"){
                    //window.open("https://moonhair.co.kr/", '_blank')
                    alert("You defeated spider!");
                }
                if(worldState.enemyName === "centipede"){
                    //window.open("https://www.youtube.com/", '_blank')
                    alert("You defeated centipede!");
                }
                if(worldState.enemyName === "grass"){
                    //window.open("https://jinjood.com/", '_blank')
                    alert("You defeated grass!");
                }
            }, 6000)
        }

        if (playerMonHealthBar.width < 0 && !playerMon.fainted) {
            makeMonDrop(playerMon)
            content.text = 'PLAYER fainted!'
            playerMon.fainted = true
            setTimeout(() => {
                content.text = 'You rush to get PLAYER healed!'
            }, 2000)
            setTimeout(() => {
                worldState.playerPos = vec2(500,700)
                go('world', worldState)
            }, 4000)
        }
    })
}
