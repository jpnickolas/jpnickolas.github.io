let c = document.getElementById('bg-effects');
c.width = c.clientWidth;
c.height = c.clientHeight;
let ctx = c.getContext('2d');
// ctx.shadowColor = '#000000aa';
// ctx.shadowBlur = 10;

const points = [];
let focalPoint = {x:0, y:0};
let center = {x: c.width / 2, y: c.height / 2, radius: Math.sqrt(c.height*c.height/4 + c.width*c.width/4)};

c.addEventListener('mousemove', (e) => {
  focalPoint.x = e.clientX;
  focalPoint.y = e.clientY;
});
c.addEventListener('mouseleave', () => {
  focalPoint.x = 0;
  focalPoint.y = 0;
});

function randomVel(lastVel=1) {
  return Math.floor(1 + Math.random() * 5) * -1 * Math.sign(lastVel);
}

for (let i = 0; i < 18; i++) {
  points.push({
    x: c.width * 0.1 + Math.floor(c.width * 0.8 * Math.random()),
    y: c.height * 0.1 +  Math.floor(c.height * 0.8 * Math.random()),
    velX: randomVel(Math.random() - 0.5),
    velY: randomVel(Math.random() - 0.5),
  });
}

setInterval(updatePoints, 30);

function distanceSqr(p1, p2) {
  return Math.pow(Math.abs(p1.x - p2.x), 2)
    + Math.pow(Math.abs(p1.y - p2.y), 2);
}

function calcPerimeterSqr(triangle) {
  return distanceSqr(triangle[0], triangle[1])
   + distanceSqr(triangle[1], triangle[2])
   + distanceSqr(triangle[2], triangle[3])
   + distanceSqr(triangle[3], triangle[0]);
}

function drawMesh() {
  const triangles = [];
  for (let i = 0; i < points.length - 3; i += 4) {
    triangles.push(points.slice(i, i + 4));
  }

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#eaab65';
  ctx.strokeStyle = '#eaab65aa';

  for (let triangle of triangles) {
    const perimeterSqr = calcPerimeterSqr(triangle);
    ctx.shadowBlur = Math.floor(Math.log10(perimeterSqr) * 3);
    ctx.beginPath();
    ctx.moveTo(triangle[3].x, triangle[3].y);
    for (let i = 0; i < triangle.length; i++) {
      ctx.lineTo(triangle[i].x, triangle[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (let i = 0; i < triangle.length; i++) {
      const p1 = triangle[i];
      const p2 = triangle[(i + 1) % 4];
      const p3 = triangle[(i + 2) % 4];
      ctx.fillStyle = genGradient(i * 0.2);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);

      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      ctx.fill();
    }
  }
}

function updatePoints() {
  for (let point of points) {
    const startX = point.x;
    const startY = point.y;
    let newVelX = false;
    let newVelY = false;

    point.x += point.velX;
    if (point.x < 0 || point.x > c.width) {
      point.x = point.x <= 0 ? Math.abs(point.x) : 2 * c.width - point.x;
      newVelX = true;
    };
    
    point.y += point.velY;
    if (point.y < 0 || point.y > c.height) {
      point.y = point.y <= 0 ? Math.abs(point.y) : 2 * c.height - point.y;
      newVelY = true;
    };

    if (focalPoint.x !== 0 || focalPoint.y !== 0) {
      const distX = focalPoint.x - point.x;
      const distY = focalPoint.y - point.y;
      const forceX = Math.min(5, Math.max(0, Math.floor(-1 * Math.log2(Math.abs(distX) / c.width) - 2)));
      const forceY = Math.min(5, Math.max(0, Math.floor(-1 * Math.log2(Math.abs(distY) / c.height) - 2)));
      point.x += -1 * forceX * (Math.sign(distX) || 1);
      point.y += -1 * forceY * (Math.sign(distY) || 1);
    }

    if (Math.floor(startX) === Math.floor(point.x)) {
      newVelX = true;
    }
    if (Math.floor(startY) === Math.floor(point.y)) {
      newVelY = true;
    }

    if (newVelX) {
      point.velX = randomVel(point.velX);
    }
    if (newVelY) {
      point.velY = randomVel(point.velY);
    }
  }

  drawMesh();
};

const gradientMemo = {};
function genGradient(opacity) {
  if (gradientMemo[opacity] != null) {
    return gradientMemo[opacity];
  }

  const gradient = ctx.createRadialGradient(
    center.x, center.y, 0,
    center.x, center.y, center.radius,
  );

  const opacityOffset = Math.floor(255*opacity);
  const opacityMin = (Math.min(255, 0 + opacityOffset)).toString(16).padStart(2, '0');
  gradient.addColorStop(0, `#ffb058ff`);
  gradient.addColorStop(0.66, `#eaab65${opacityMin}`);
  gradient.addColorStop(1, `#eaab6500`);
  gradientMemo[opacity] = gradient;
  return gradient;
}