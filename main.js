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

    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
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
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        context.fillStyle = this.color
        context.fill()
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
};


const catWidth = 100;
const catHeight = 150;

// X, Y ДЛЯ КОТА
// const x = canvas.width / 2 - catWidth / 2;
// const y = canvas.height / 2 - catHeight / 2;

const x = canvas.width / 2;
const y = canvas.height / 2;


const player = new Player(x, y, 15, '#f4e1d2');

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
        
        
        const color = `hsl(${Math.random()*360}, 100%, 70%)`;

        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
    
        const velocity = {
            x: Math.cos(angle) *6,
            y: Math.sin(angle) *6
        }

        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000);
};

let animationId

const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    context.fillStyle = 'rgba(0, 0, 0, .1)' //цвет заливки canvas
    context.fillRect(0, 0, canvas.width, canvas.height); // очищаем кcanvas, чтоб projectiles и enemies были не сплошной линией
    // player.setPicture();
    player.draw();
    

    projectiles.forEach((projectile, index) => {
        projectile.update();

        // Delete projecriles, when it leaves the screen

        if(projectile.x + projectile.radius < 0 
            || projectile.x - projectile.radius > canvas.width 
            || projectile.y + projectile.radius < 0
            || projectile.y - projectile.radius > canvas.height 
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1)
                
            }, 0) 
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()

        // Collision with a palyer + END GAME
        const distanceToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if(distanceToPlayer - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            alert('Game over!')
        }


        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
            // Object touch
            if(distance - enemy.radius - projectile.radius < 1) {
                // Removing flash when hit an enemy
                setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                }, 0)               
            }
        })
    })
};

window.addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )

    const velocity = {
        x: Math.cos(angle) *4,
        y: Math.sin(angle) *4
    }

    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        '#f4e1d2',
        velocity
    ))    
});

animate();
spawnEnemies()