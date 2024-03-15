kaboom({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1.0
})

setBackground(Color.fromHex('#36A6E0'))

loadAssets()

scene('world', (worldState) => setWorld(worldState))
scene('battle', (worldState) => setBattle(worldState))  

go('world')