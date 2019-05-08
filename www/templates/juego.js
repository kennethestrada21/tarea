(function () {

    var canvas = document.getElementById('area_dibujo');
    var ctx = canvas.getContext('2d');

    var radius = 100;
    var colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99'];

    var width = 200;
    var height = 200;
    var x = canvas.width / 2 - width / 2; //Center Contrained
    var y = (canvas.height / 6) * 3.4;
 
    var rotate = 0;
  
    var juegoPerdido = false;
  
    function Ball(color, radius) {
        this.color = color;
        this.radius = radius;
        this.y = 0;
        this.x = 0;
        this.velocidad = 3;
    }

    Ball.prototype = {
        draw: function () {
            ctx.beginPath();
            ctx.arc(0, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = this.color;
            ctx.fill();
        },
        reset: function (color) {
            this.y = 0;
            this.color = color;
        }
    }

    function SquareTriangles(x, y, squareWidth, squareHeight, colors) {
        this.x = x;
        this.y = y;
        this.squareWidth = squareWidth;
        this.squareHeight = squareHeight;
        this.colors = colors;
        this.triangleTop = 0;
    }

    SquareTriangles.prototype = {
       
       colorTop: function (color) {
            var colorTop = this.colors[this.triangleTop];
            if (colorTop == color)
                return true;

            return false;
        },

        draw: function () {

            //Triangle #1.
            //Vertex 0.0 => 1.0
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.squareWidth, this.y);
            ctx.lineTo(this.x + this.squareWidth / 2, this.y + this.squareHeight / 2);
            ctx.lineTo(this.x, this.y);
            ctx.fillStyle = this.colors[0];
            ctx.fill();
 
 
            //Triangle #2.
            //Vertex 0.0 => 0.1
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.squareHeight);
            ctx.lineTo(this.x + this.squareWidth / 2, this.y + this.squareHeight / 2);
            ctx.lineTo(this.x, this.y);
            ctx.fillStyle = this.colors[1];
            ctx.fill();
 

            
            //Triangle #3.
             //Vertex 0.1 => 1.1
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.squareHeight);
            ctx.lineTo(this.x + this.squareWidth, this.y + this.squareHeight);
            ctx.lineTo(this.x + this.squareWidth / 2, this.y + this.squareHeight / 2);
            ctx.lineTo(this.x, this.y + this.squareHeight);
            ctx.fillStyle = this.colors[2];
            ctx.fill();
            

            //Triangle #4.
            //Vertex 1.0 => 1.1
            ctx.beginPath();
            ctx.moveTo(this.x + this.squareWidth, this.y);
            ctx.lineTo(this.x + this.squareWidth, this.y + this.squareHeight);
            ctx.lineTo(this.x + this.squareWidth / 2, this.y + this.squareHeight / 2);
            ctx.lineTo(this.x + this.squareWidth, this.y);
            ctx.fillStyle = this.colors[3];
            ctx.fill();
             

        }
    }

    
    function Scope(y) {
        this.scope = 0;
        this.bestScope = 0;
        this.y = y;
        this.sizeFont = 12;
        this.sizeFontNumber = 30;
        this.font = 'Verdana';
        this.color = '#9e9e9e';

    }

    Scope.prototype = {
        draw: function (color) {
            ctx.save();
            ctx.font = this.sizeFont + 'px ' + this.font;
            ctx.textAlign = "center";

            ctx.fillStyle = this.color;
            //var textWidth = ctx.measureText("Puntaje").width;
            ctx.fillText("Puntaje", (canvas.width / 4), this.y);

            ctx.font = this.sizeFontNumber + 'px ' + this.font;
            ctx.fillText(this.scope, (canvas.width / 4), this.y + this.sizeFontNumber);

            ctx.font = this.sizeFont + 'px ' + this.font;
            ctx.fillText("Mejor Puntaje", (canvas.width / 4) * 3, this.y);

            ctx.font = this.sizeFontNumber + 'px ' + this.font;
            ctx.fillText(this.bestScope, (canvas.width / 4) * 3, this.y + this.sizeFontNumber);
            ctx.restore();
        },
        update: function () {
            this.scope += 1;
            if (this.bestScope < this.scope) {
                this.bestScope = this.scope;
            }
        }
    }

    //Create 
    var square = new SquareTriangles(0, 0, width, height, colors);
    var ball = new Ball(colors[0], 20);

    var scope = new Scope(60);
  

    function rotateSquare() {
        
        rotate += 90;
        if (rotate === 360) {
              //Reset
              rotate = 0;
         }
    }
  
    function perdioJuego() {
       
        ctx.save();
        var text = "¡Upps...!";
        var sizeFont = 30;
        ctx.textAlign = "center";
        ctx.font = sizeFont+"px Verdana";
        ctx.fillStyle = "#607d8b"
        ctx.fillText(text, canvas.width / 2, canvas.height / 2-sizeFont/2);

        ctx.restore();
    }

    canvas.onclick = function (event) {
         
        if (juegoPerdido){
           //Iniciar nuevo Juego
           juegoPerdido = false;
           ball.y = 0;
           scope.scope = 0;
           window.requestAnimationFrame(play);
          
        }else{
          rotateSquare(); 
        }
         
    };
  
    function play(){
       //1. Limpiar todo el contenido del canvas
       ctx.clearRect(0, 0, canvas.width, canvas.height);  
      
       //2. Dibujar el contenido
       //Draw Ball
       ctx.save();
      
       ball.y += ball.velocidad;
       ctx.translate(canvas.width / 2, ball.radius);
       ball.draw();
       ctx.restore();

        //Draw Square
        ctx.save();
        ctx.translate(x, y);

        //Segun el angulo de rotacion, se detecta cual triangulo se encuentra
        //en la parte superior
        square.triangleTop = (rotate/90);
 
        // rotate
        ctx.translate(square.x+square.squareWidth*0.5, square.y+square.squareHeight*0.5);
        ctx.rotate((Math.PI / 180) * rotate);
        ctx.translate(-(square.x+square.squareWidth*0.5), -(square.y+square.squareHeight*0.5));

        square.draw();
        ctx.restore();
       
      
        //draw Scope
        scope.draw();
        
        //Collision
        if ((ball.y >= y && ball.y <= y + height) ||
            (ball.y + ball.radius >= y && ball.y + ball.radius <= y + height)) {
           
            //Si existe colision entre el circulo y el cuadrado,
            //Verificamos si el clor del circulo corresponde con el color 
            //del triangulo superior en el cuadrado. 
            if (square.colorTop(ball.color)) {
                //Continuar
                scope.update();
              
                ball.reset(colors[Math.floor(Math.random() * colors.length)] );
            } else {
                juegoPerdido = true;
                //Perdio el Juego
                perdioJuego();
            }
          
        }
      
        if (!juegoPerdido){
           //3. Continuar con el siguiente ciclo de animacion 
           window.requestAnimationFrame(play);  
        }

    }
  
    window.requestAnimationFrame(play);

})();