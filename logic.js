//Code taken from Brainxyz on YT @
//https://www.youtube.com/watch?v=0Kx4Y9TVMGg

m = document.getElementById("life").getContext('2d')

draw=(x,y,colour,s)=>{
    m.fillStyle = colour
    m.fillRect(x, y, s, s)
}
// ^ Draw each particle

particles = []
particle = (x,y, colour)=>{
 return{"x":x, "y":y, "vx":0, "vy":0, "colour":colour}
}
// ^ Array holding all particles

random=()=>{
    return Math.random()*400+50
}
// ^ Random number

create=(number, colour)=>{
    group=[]
    for(let i=0; i< number; i++){
        group.push(particle(random(), random(), colour))
        particles.push(group[i])
    }
    return group
}
// ^ Creates an amount of a certain colour particle

rule=(particles1, particles2, g)=>{
//rule of interaction between particle types
    for(let i=0; i < particles1.length; i++){
        fx = 0
        fy = 0

        for (let j=0; j < particles2.length; j++){
            a = particles1[i]
            b = particles2[j]
            dx = a.x - b.x
            dy = a.y - b.y
            d = Math.sqrt(dx*dx + dy*dy) //Pythagoras between each particle
            if (d > 0 && d < 80){
                F = g * 1/d
                fx += (F * dx) * 0.01
                fy += (F * dy) * 0.01
            }
        }

        a.vx = (a.vx + fx)
        a.vy = (a.vy + fy)
        a.x += a.vx
        a.y += a.vy

        if(a.x <= 0 || a.x >= 1500){ a.vx *= -1}
        if(a.y <= 0 || a.y >= 700){ a.vy *= -1}

        // if's keep particles in range
    }
}

//our various particles
yellow = create(100,"yellow")
red = create(100, "red")
blue = create(100, "blue")

update=()=>{
    //setting attraction rules (- = repel, + = attract)
    rule(yellow, yellow, -1)
    rule(red, red, -0.5)
    rule(yellow, red, 0.75)
    rule(blue, yellow, 0.3)
    rule(blue, red, -0.04)

    m.clearRect(0,0,1500,700)
    draw(0,0, "black", 1500)
    for(i=0; i<particles.length; i++){
        draw(particles[i].x, particles[i].y,
        particles[i].colour, 5)
    }
    requestAnimationFrame(update)
}

update();