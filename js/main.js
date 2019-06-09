const game = {

    ctx: undefined,
    canvas: undefined,
    frames: 0,
    frames_estavel: 0,
    frames_forced: false,
    in_progress: false,
    segundos: 0,
    bola: {
        x: 0,
        y: 0,
        radius: 50
    },
    gameMaxX: 0,
    gameMaxY:0,

    init(forcaFps = false) {
        this.frames_forced = forcaFps;
        console.log("Iniciando jogo...");
        console.log(" - Forçar os 120fps: " + (forcaFps ? "Ativado" : "Desativado"));
        this.canvas = document.getElementById("game-js");
        this.ctx = this.canvas.getContext("2d");
        this.gameMaxX = this.canvas.width;
        this.gameMaxY = this.canvas.height;
        this.start();
        console.log("Jogo iniciado.");
    },

    start() {
        console.log(" - Configurando posição inicial da bola...");
        this.tratarMovimentoBola(this.gameMaxX / 2, this.gameMaxY / 2);
        console.log(" - Renderizando jogo...");
        this.atualizar();
        console.log(" - Configurando visualização de fps...");
        setInterval(() => {
            this.frames_estavel = this.frames;
            this.frames = 0;
        }, 1000);
    },

    atualizar() {
        this.frames++;
        this.desenhar();
        if (this.frames_forced) {
            setTimeout(() => this.atualizar(), 1000 / 120);
        } else {
            window.webkitRequestAnimationFrame(() => this.atualizar());
        }
    },

    desenhar() {
        this.limparCtx();
        this.contadorDeFrames();
        this.criarBola();
    },

    contadorDeFrames() {
        this.ctx.font = "30px Comic Sans MS"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("FPS: " + this.frames_estavel,
            this.canvas.width - 115,
            25);
    },

    limparCtx() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    criarBola() {
        this.ctx.beginPath();
        this.ctx.arc(this.bola.x, this.bola.y, this.bola.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
    },

    tratarMovimentoBola(x, y) {
        this.bola.x += x;
        this.bola.y += y;

        if (this.bola.x < this.bola.radius) {
            this.bola.x = this.bola.radius;
        }
        if (this.bola.y < this.bola.radius) {
            this.bola.y = this.bola.radius;
        }

        if (this.bola.x > (this.gameMaxX - this.bola.radius)) {
            this.bola.x = this.gameMaxX - this.bola.radius;
        }
        if (this.bola.y > (this.gameMaxY - this.bola.radius)) {
            this.bola.y = this.gameMaxY - this.bola.radius;
        }
    },
};

let teclasPressionadas = {};

document.onkeydown = function(e) {
    e = e || window.event;
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'ArrowRight':
        case 'd':
        case 'ArrowDown':
        case 's':
        case 'ArrowLeft':
        case 'a':
            e.preventDefault();
            teclasPressionadas[e.key] = true;
            andar();
            break;
    }
}

document.onkeyup = function(e) {
    e = e || window.event;
    delete teclasPressionadas[e.key];
    andar();
}
function andar() {
    Object.keys(teclasPressionadas)
        .filter(k => teclasPressionadas[k] === true)
        .forEach(k => {
            switch (k) {
                case 'ArrowUp':
                case 'w':
                    game.tratarMovimentoBola(0, -15);
                    break;
                case 'ArrowRight':
                case 'd':
                    game.tratarMovimentoBola(+15, 0);
                    break;
                case 'ArrowDown':
                case 's':
                    game.tratarMovimentoBola(0, +15);
                    break;
                case 'ArrowLeft':
                case 'a':
                    game.tratarMovimentoBola(-15, 0);
                    break;
            }
        });
}
