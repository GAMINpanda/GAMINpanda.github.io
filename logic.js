//logic.js handles the drawing of organisms and the organism class itself
//Some inspiration from BrainXYZ's particle simulator

import {organism} from "./OrganismClass.js";
import {findOrganism, IterateTowardsOrganism} from "./CheckOrganism.js";

var master = document.getElementById("sim").getContext('2d')

function draw(x,y,colour,size){
    master.fillStyle = colour
    master.fillRect(x, y, size, size)
}
// ^ Draw each particle

var organisms = []
// ^ Array holding all organisms

function random(){
    return Math.random()*100 + 50
}
// random number (for location)

function create(number, rgb){
    var group=[]
    for(let i=0; i< number; i++){
        var a = Math.trunc(random())
        var b = Math.trunc(random())
        

        //var proceduraloffset = parseInt(rgb[1], 16) //non-random spawning for debugging
    /*
        var a = (i*5) + proceduraloffset
        var b = (i*5) + proceduraloffset
    */
        group.push(new organism(rgb, a, b))
        organisms.push(group[i])
    }
    return group
} //creates a number of organisms of a certain colour in random places

function createAtCoords(rgb, x, y){
    return new organism(rgb, x, y)
}

function ParentsReproduce(colourParent1, colourParent2, x, y){ //will create a new particle as a 'child'
    var intParent1 = parseInt(colourParent1.substring(1,7), 16)
    var intParent2 = parseInt(colourParent2.substring(1,7), 16)

    var hexChild = Math.trunc((intParent1 + intParent2) / 2)
    hexChild = hexChild + Math.trunc((Math.random()-0.5)*5) //random variation on result
    var colourChild = hexChild.toString(16)
    colourChild = "#" + colourChild

    return createAtCoords(colourChild, x, y)
}
//Define particles below


for (let i=0; i < 10; i++){
    let rand1 = (Math.trunc(Math.random()*255)).toString(16)
    let rand2 = (Math.trunc(Math.random()*255).toString(16))
    let rand3 = (Math.trunc(Math.random()*255).toString(16))

    let randcolour = "#" + rand1 + rand2 + rand3
    create(4, randcolour)
}

create(5, "#ffffff")//will die quick so just act as food
//Define particles above


function update(){ //updates frame
    master.clearRect(0,0, 500, 300)
    draw(0,0, "black", 500)
    
    if (organisms.length == 0){
        console.log("All particles are dead")
        return false
    }
    else{
        for(let i=0; i<organisms.length; i++){

            if (organisms[i].rgb != "#525252"){ //colour considered food - stops moving
                var valuesArray = findOrganism((organisms[i].aggro * 10) + 5, organisms[i].x, organisms[i].y)
                //returns in form 'return [x, y, colour]'

                if(valuesArray[2] == "#525252"){//found a dead pixel
                    if (organisms.length == 0){
                        console.log("All particles are eaten")
                        return false
                    }
                    else{
                        for(let j=0; j<organisms.length; j++){ //linear search to figure out the organism that is dead
                            if (organisms[j].rgb == "#525252" && organisms[j].isEaten == false){
                                if (organisms[j].x >= valuesArray[0] && organisms[j].x <= valuesArray[0] + organisms[j].size){
                                    if (organisms[j].y >= valuesArray[1] && organisms[j].y <= valuesArray[1] + organisms[j].size){ //checks coords and colour
                                        //if here organisms[j] is probably the dead pixel
                                        organisms[j].OrganismHasBeenEaten()
                                        organisms[i].Replenished(organisms[j].size)
                                    }
                                }
                            }
                        }
                    }
                }
                var colourAsDecimal = parseInt((valuesArray[2].substring(1,7)), 16)
                var friendlyrangeLow = colourAsDecimal - (5*organisms[i].aggro)
                var friendlyrangehigh = colourAsDecimal + (5*organisms[i].aggro)

                var organismColourAsDecimal = parseInt((organisms[i].rgb.substring(1,7)), 16)

                if (valuesArray[0] != 0 && valuesArray[1] != 0 && (organismColourAsDecimal <= friendlyrangeLow || organismColourAsDecimal >= friendlyrangehigh)){
                    var valuesArray2 = IterateTowardsOrganism(valuesArray[0], valuesArray[1], organisms[i])

                    organisms[i].NewCoords(valuesArray2[0], valuesArray2[1])
                }
                
                else{//moves a random amount
                    if(organismColourAsDecimal >= friendlyrangeLow && organismColourAsDecimal <= friendlyrangehigh && (organisms[i].hasReproducedRecently == false) && organisms.length < 200){ //reproduce if in friendly range
                        //hard cap of 200 organisms (for now)
                        var newOrganism = ParentsReproduce(organisms[i].rgb, valuesArray[2], organisms[i].x + 1, organisms[i].y + 1)
                        if (newOrganism != undefined){
                            organisms.push(newOrganism)
                        }
                        organisms[i].hasReproducedRecently = true
                    }
                    else{
                        organisms[i].NewCoords(organisms[i].x + Math.trunc((Math.random() - 0.5) * 5), organisms[i].y + Math.trunc((Math.random() - 0.5) * 5))
                    }
                }
                
                let xinput = organisms[i].x
                let yinput = organisms[i].y
                let colourinput = organisms[i].rgb
                let sizeinput = organisms[i].size

                //console.log("xinput: ",xinput,"yinput: ",yinput,"colourinput: ",colourinput,"sizeinput: ",sizeinput, "i: ",i)
                draw(xinput, yinput, colourinput, sizeinput)
            }
            else{
                if (organisms[i].isEaten == false){
                    draw(organisms[i].x, organisms[i].y, "#525252", organisms[i].size)
                }
                else{//organism has no reason to exist
                    organisms.splice(i,1)
                }
            }
        }
    
    }
    requestAnimationFrame(update)
}

update();
