function setWorld(worldState) {
    function makeTile(type) {
        return [
            sprite('tile'),
            {type}
        ]
    }

    const map = [
        addLevel([
            '                               ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            ' 0000000000000000000000000000  ',
            '      b                        ',
            '     b      b    ',
            ' b             b '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => makeTile('grass-m'),
                '1': () => makeTile('grass-water'),
                '2': () => makeTile('grass-r'),
                '3': () => makeTile('grass-l'),
                '4': () => makeTile('ground-m'),
                '5': () => makeTile('ground-r'),
                '6': () => makeTile('ground-l'),
                '7': () => makeTile('sand-1'),
                '8': () => makeTile('grass-mb'),
                '9': () => makeTile('grass-br'),
                'a': () => makeTile('grass-bl'),
                'b': () => makeTile('rock-water'),
                'c': () => makeTile('grass-tl'),
                'd': () => makeTile('grass-tm'),
                'e': () => makeTile('grass-tr'),
                'z': () => makeTile('ground-block'),
            }
        }),
        addLevel([
            '      12       ',
            '      34       ',
            ' 000    00  12 ',
            ' 00   00    34 ',
            ' 0    0        ',
            '      0  0     ',
            '           5   ',
            '           6   ',
            '     5         ',
            '     6   0     ',
            '               ',
            '               ',
            '               '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => makeTile(),
                '1': () => makeTile('bigtree-pt1'),
                '2': () => makeTile('bigtree-pt2'),
                '3': () => makeTile('bigtree-pt3'),
                '4': () => makeTile('bigtree-pt4'),
                '5': () => makeTile('tree-t'),
                '6': () => makeTile('tree-b'),
            }
        }),
        addLevel([
            '000000000000000000000000000000',
            '0     11                     0',
            '0           11               0',
            '0           11               0',
            '0                            0',
            '0                            0',
            '0          1                 0',
            '0          1                 0',
            '0    1                       0',
            '0    1                       0',
            '0                            0',
            '0                            0',
            '0                            0',
            '000000000000000000000000000000',
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => [
                    area({shape: new Rect(vec2(0), 16, 16)}),
                    body({isStatic: true})
                ],
                '1': () => [
                    area({
                        shape: new Rect(vec2(0), 8, 8),
                        offset: vec2(4, 4)
                    }),
                    body({isStatic: true})
                ],
                '2': () => [
                    area({shape: new Rect(vec2(0), 2, 16)}),
                    body({isStatic: true})
                ],
                '3': () => [
                    area({
                    shape: new Rect(vec2(0), 16, 20),
                    offset: vec2(0, -4)
                    }),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of map) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    
    add([sprite('mini-mons'), area(), body({isStatic: true}), pos(100,700), scale(4), 'cat'])

    const spiderMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(400,300), scale(4), 'spider'])
    spiderMon.play('spider')
    spiderMon.flipX = true

    const centipedeMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(100,100), scale(4), 'centipede'])
    centipedeMon.play('centipede')

    const grassMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(900, 570), scale(4), 'grass'])
    grassMon.play('grass')

    add([ sprite('npc'), scale(4), pos(600,700), area(), body({isStatic: true}), 'npc'])

    const player = add([
        sprite('player-down'),
        pos(500,700),
        scale(4),
        area(),
        body(),
        {
            currentSprite: 'player-down',
            speed: 300,
            isInDialogue: false
        },
    ])

    let tick = 0
    onUpdate(() => {
        camPos(player.pos)
        tick++
        if ((isKeyDown('down') || isKeyDown('up')) 
        && tick % 20 === 0 
        && !player.isInDialogue) {
            player.flipX = !player.flipX
        }
    })

    function setSprite(player, spriteName) {
        if (player.currentSprite !== spriteName) {
            player.use(sprite(spriteName))
            player.currentSprite = spriteName
        }
    }

    onKeyDown('down', () => {
        if (player.isInDialogue) return
        setSprite(player, 'player-down')
        player.move(0, player.speed)
    })

    onKeyDown('up', () => {
        if (player.isInDialogue) return
        setSprite(player, 'player-up')
        player.move(0, -player.speed)
    })

    onKeyDown('left', () => {
        if (player.isInDialogue) return
        player.flipX = false
        if (player.curAnim() !== 'walk') {
            setSprite(player, 'player-side')
            player.play('walk')
        }
        player.move(-player.speed, 0)

    })

    onKeyDown('right', () => {
        if (player.isInDialogue) return
        player.flipX = true
        if (player.curAnim() !== 'walk') {
            setSprite(player, 'player-side')
            player.play('walk')
        }
        player.move(player.speed, 0)
    })


    onKeyRelease('left', () => {
        player.stop()
    })

    onKeyRelease('right', () => {
        player.stop()
    })

    if (!worldState) {
        worldState = {
            playerPos : player.pos,
            faintedMons: []
        }
    }

    player.pos = vec2(worldState.playerPos)
    for (const faintedMon of worldState.faintedMons) {
        destroy(get(faintedMon)[0])
    }

    player.onCollide('npc', () => {
        player.isInDialogue = true
        const dialogueBoxFixedContainer = add([fixed()])
        const dialogueBox = dialogueBoxFixedContainer.add([
            rect(window.innerWidth - 50, window.innerHeight * 0.3),
            outline(5),
            pos(25, window.innerHeight * 0.7 - 25),
            fixed()
        ])
        const dialogue = "Defeat all monsters on this island and be the champion!!"
        const content = dialogueBox.add([
            text('', 
            {
                size: 42,
                width: window.innerWidth - 100,
                lineSpacing: 15,
            }),
            color(10,10,10),
            pos(40,30),
            fixed()
        ])
        
        if (worldState.faintedMons.length === 0) {
            content.text = dialogue
        }
        else if(worldState.faintedMons.length === 1){
            content.text = "You've got three more left to defeat!"
        }
        else if(worldState.faintedMons.length === 2){
            content.text = "You've got two more left to defeat!"
        }
        else if(worldState.faintedMons.length === 3){
            content.text = "You've got last one left to defeat!"
        }
        else {
            content.text = "You're the champion!"
        }
        onUpdate(() => {
            if (isKeyDown('space')) {
                destroy(dialogueBox)
                player.isInDialogue = false
            }
        })
    })

    function flashScreen() {
        const flash = add([rect(2500, 1400), color(10,10,10), fixed(), opacity(0)])
        tween(flash.opacity, 1, 0.5, (val) => flash.opacity = val, easings.easeInBounce)
    }

    function onCollideWithPlayer(enemyName, player, worldState) {
        player.onCollide(enemyName, () => {
            player.isInDialogue = true
            flashScreen()
            setTimeout(() => {
                worldState.playerPos = player.pos
                worldState.enemyName = enemyName
                go('battle', worldState) 
            }, 1000)
        })
    }

    onCollideWithPlayer('cat', player, worldState)
    onCollideWithPlayer('spider', player, worldState)
    onCollideWithPlayer('centipede', player, worldState)
    onCollideWithPlayer('grass', player, worldState)
}