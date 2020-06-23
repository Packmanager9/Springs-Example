
window.addEventListener('DOMContentLoaded', (event) =>{


    
    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });

    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.lens = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            //friction
            if(this.x > tutorial_canvas.width){
                if(this.xmom > 0){
                this.xmom*=-1
                }
            }
            if(this.y > tutorial_canvas.height){
                if(this.ymom > 0){
                this.ymom*=-1
                }
            }
            if(this.x < 0){
                if(this.xmom < 0){
                this.xmom*=-1
                }
            }
            if(this.y < 0){
                if(this.ymom < 0){
                    this.ymom*=-1
                }
            }
            this.xmom*=.999
            this.ymom*=.999
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }
    }
    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }

    class Spring{
        constructor(body = 0){
            if(body == 0){
                this.body = new Circle(350, 350, 5, "red",10,10)
                this.anchor = new Circle(this.body.x, this.body.y+5, 5, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = 100
            }else{
                this.body = body
                this.anchor = new Circle(this.body.x, this.body.y+10, 5, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = 60
            }

        }
        balance(){
            // this.length-=.5
            // if(this.length <=2){
            //     this.length = 2
            // }
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)

            let xmomentumaverage = (this.body.xmom+this.anchor.xmom)/2
            let ymomentumaverage = (this.body.ymom+this.anchor.ymom)/2

            this.body.xmom = (this.body.xmom+xmomentumaverage)/2
            this.body.ymom = (this.body.ymom+ymomentumaverage)/2

            this.anchor.xmom = (this.anchor.xmom+xmomentumaverage)/2
            this.anchor.ymom = (this.anchor.ymom+ymomentumaverage)/2

            if(this.beam.hypotenuse() < this.length){
                this.body.xmom += (this.body.x-this.anchor.x)/this.length
                this.body.ymom += (this.body.y-this.anchor.y)/this.length
                this.anchor.xmom -= (this.body.x-this.anchor.x)/this.length
                this.anchor.ymom -= (this.body.y-this.anchor.y)/this.length
            }else{
                this.body.xmom -= (this.body.x-this.anchor.x)/this.length
                this.body.ymom -= (this.body.y-this.anchor.y)/this.length
                this.anchor.xmom += (this.body.x-this.anchor.x)/this.length
                this.anchor.ymom += (this.body.y-this.anchor.y)/this.length
            }
        }
        draw(){
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move(){
            // this.body.move()
            // if(Math.random()<.01){
            //     this.anchor.xmom-=1
            // }
            this.anchor.ymom+=.1
            this.anchor.move()
        }

    }

    class Badspring{   
        constructor(){
            this.body = new Circle(350,350, 5, "red")
            this.anchor = new Circle(500, 350, 5, "red")
            this.angle = Math.random()
            this.length = 20

            this.anchor.x = (this.length*(Math.sin(this.angle)))+this.body.x
            this.anchor.y = (this.length*(Math.cos(this.angle)))+this.body.y
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
        }
        balance(){
            let angleaverage = 0
            for(let t=0; t<badsprings.length; t++){
                angleaverage+=(badsprings[t].angle/badsprings.length)
            }
            for(let t=0; t<badsprings.length; t++){
                badsprings[t].angle = ((badsprings[t].angle*100)+angleaverage)/101
            }
        }
        draw(){

            this.imbalance()
            this.anchor.x = (this.length*(Math.sin(this.angle)))+this.body.x
            this.anchor.y = (this.length*(Math.cos(this.angle)))+this.body.y
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            this.anchor.draw()
            this.body.draw()
            this.beam.draw()
        }
        imbalance(){
            if(keysPressed['h']){
                let index = badsprings.indexOf(this)

                if(index%2==0){
                    this.angle-.5
                }else{
                    this.angle+=.5
                }

            }
        }

        


    }

    let badsprings = []

    let springs = []


    let pin = new Circle(600,350, 10, "blue")
    let pin2 = new Circle(100,350, 10, "blue")

    let spring = new Spring(pin)
    springs.push(spring)
    for(let k = 0; k<3;k++){
        spring = new Spring(spring.anchor)
        if(k<2){
            springs.push(spring)
        }else{
            spring.anchor = pin
        springs.push(spring)
        }
    }

    let badspring = new Badspring()
    badsprings.push(badspring)
    for(let k = 0; k<11; k++){

    badspring = new Badspring()
    badspring.body = badsprings[badsprings.length-1].anchor
    badsprings.push(badspring)
    }
    

    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)

        for(let t = 0; t<badsprings.length;t++){
            badsprings[t].balance()
            badsprings[t].draw()
        }



        // pin.draw()
        // for(let s = 0; s<springs.length; s++){

        //     pin.xmom = 0
        //     pin.ymom = 0
        //     pin2.xmom = 0
        //     pin2.ymom = 0
        //     springs[s].balance()
        //     pin.xmom = 0
        //     pin.ymom = 0
        //     pin2.xmom = 0
        //     pin2.ymom = 0
        //     springs[s].move()
        //     springs[s].draw()
        // }
        // if(keysPressed['w']){
        //     pin.y -= 5
        // }

        // if(keysPressed['a']){
        //     pin.x -= 5
        // }

        // if(keysPressed['s']){
        //     pin.y += 5
        // }

        // if(keysPressed['d']){
        //     pin.x += 5
        // }
        // pin.xmom = 0
        // pin.ymom = 0
        // // pin2.xmom = 0
        // // pin2.ymom = 0

    }, 28) 



        
})