const canvas= document.querySelector('canvas');

const context = canvas.getContext('2d');

const cat = document.querySelector('#cat');

canvas.width = innerWidth;
canvas.height = innerHeight;


class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    setPicture() {
        context.drawImage(cat, x, y, catWidth, catHeight);
    }
};

class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
};

class Enemy {
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
};


const catWidth = 100;
const catHeight = 150;
const x = canvas.width / 2 - catWidth / 2;
const y = canvas.height / 2 - catHeight / 2;


const player = new Player(x, y, 30, 'red');

const projectiles = [];

const enemies = [];

const spawnEnemies = () => {
    setInterval(() => {

        const radius = Math.random() * (40 - 10) + 10;
        let x;
        let y;

        if(Math.random() < .5) {
            x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        }
        
        
        const color = 'green';

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
    
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000);
};

const animate = () => {

    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.setPicture();
    console.log('animate');

    projectiles.forEach(projectile => {
        projectile.update();
    })

    enemies.forEach((enemy) => {
        enemy.update()
    })
};

window.addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'red',
        velocity
    ))    
});

animate();
spawnEnemies()