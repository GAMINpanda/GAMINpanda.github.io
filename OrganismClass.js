var master = document.getElementById("sim").getContext('2d')
export class organism{ //logic for class organism
    constructor(rgb, x, y){
        //rgb string is hex format (#-_-_-_), (x,y) is just the starting coordinate
        this.redhex = rgb.substring(1,3)
        this.greenhex = rgb.substring(4,6)
        this.bluehex = rgb.substring(6,8)

        this.x = x
        this.y = y
        this.rgb = rgb

        this.aggro = (parseInt(this.redhex, 16) / 255) //finds agressiveness of an organism
        this.speed = parseInt(this.greenhex, 16) / 255 //finds speed of an organism
        this.rr = parseInt(this.bluehex, 16) / 255 //finds reproduction rate of an organism

        let avg = (this.aggro + this.speed + this.rr) / 3

        this.size = Math.trunc(avg * 5) + 1 //finds size of an organism (higher stats = larger)
        this.life = Math.trunc(100 - (avg * 100)) + 1 //maximum lifespan is 100 seconds (lower stats = live longer)
        this.hungertime = (1/avg) * 3//longer hunger time the lower the stats (less need to eat) --> x3 to be a bit more generous
        this.isEaten = false
        this.hasReproducedRecently = true
        this.RecentReproductionCount = (1 / this.rr * 5) //5 times smaller initially to allow for a larger window to reproduce
    }

    NewCoords(x, y){ //updates x & y position -- makes sure to keep within canvas
        var tempx = this.x
        var tempy = this.y
        if (x < 100 && x> 0){
            this.x = x
        }
        if (y < 100 && y > 0){
            this.y = y
        }
        this.HungerCalc()
    }

    HungerCalc(){
        this.hungertime = this.hungertime - 0.01 //removes hunger every 'tick'
        this.RecentReproductionCount = this.RecentReproductionCount - 0.02

        if(this.RecentReproductionCount <= 0){
            this.hasReproducedRecently = false
            this.RecentReproductionCount = 1 / this.rr
        }

        if (this.hungertime <= 0){
            this.rgb = "#525252"//nice grey - colour considered 'food' and can be eaten
        }
    }

    Replenished(deadSize){
        this.hungertime = this.hungertime + (deadSize * (5 / this.size))
    }

    OrganismHasBeenEaten(){
        this.isEaten = true
    }
}