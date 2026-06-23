import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function createCrcTable() {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i += 1) {
    let crc = i;

    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) !== 0 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }

    table[i] = crc >>> 0;
  }

  return table;
}

const crcTable = createCrcTable();

function crc32(buffer) {
  let crc = 0xffffffff;

  for (let index = 0; index < buffer.length; index += 1) {
    crc = crcTable[(crc ^ buffer[index]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeUInt32BE(data.length, 0);

  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

class RasterImage {
  constructor(size) {
    this.width = size;
    this.height = size;
    this.data = new Uint8Array(size * size * 4);
  }

  setPixel(x, y, color) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return;
    }

    const offset = (y * this.width + x) * 4;
    this.data[offset] = color[0];
    this.data[offset + 1] = color[1];
    this.data[offset + 2] = color[2];
    this.data[offset + 3] = color[3];
  }

  fill(color) {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.setPixel(x, y, color);
      }
    }
  }

  writePng(filePath) {
    const raw = Buffer.alloc((this.width * 4 + 1) * this.height);

    for (let y = 0; y < this.height; y += 1) {
      const rowStart = y * (this.width * 4 + 1);
      raw[rowStart] = 0;

      for (let x = 0; x < this.width; x += 1) {
        const source = (y * this.width + x) * 4;
        const target = rowStart + 1 + x * 4;
        raw[target] = this.data[source];
        raw[target + 1] = this.data[source + 1];
        raw[target + 2] = this.data[source + 2];
        raw[target + 3] = this.data[source + 3];
      }
    }

    const header = Buffer.alloc(13);
    header.writeUInt32BE(this.width, 0);
    header.writeUInt32BE(this.height, 4);
    header[8] = 8;
    header[9] = 6;
    header[10] = 0;
    header[11] = 0;
    header[12] = 0;

    const png = Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", header),
      chunk("IDAT", deflateSync(raw)),
      chunk("IEND", Buffer.alloc(0)),
    ]);

    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, png);
  }
}

function mix(left, right, ratio) {
  return [
    Math.round(left[0] + (right[0] - left[0]) * ratio),
    Math.round(left[1] + (right[1] - left[1]) * ratio),
    Math.round(left[2] + (right[2] - left[2]) * ratio),
    Math.round(left[3] + (right[3] - left[3]) * ratio),
  ];
}

function fillRoundedRect(image, x, y, width, height, radius, colorTop, colorBottom) {
  const maxX = x + width;
  const maxY = y + height;

  for (let py = y; py < maxY; py += 1) {
    for (let px = x; px < maxX; px += 1) {
      const dx = px < x + radius ? x + radius - px : px > maxX - radius ? px - (maxX - radius) : 0;
      const dy = py < y + radius ? y + radius - py : py > maxY - radius ? py - (maxY - radius) : 0;

      if (dx * dx + dy * dy <= radius * radius) {
        const ratio = (py - y) / Math.max(1, height);
        image.setPixel(px, py, mix(colorTop, colorBottom, ratio));
      }
    }
  }
}

function strokeCircle(image, centerX, centerY, radius, thickness, color) {
  const outer = radius + thickness / 2;
  const inner = Math.max(0, radius - thickness / 2);
  const startX = Math.floor(centerX - outer - 1);
  const endX = Math.ceil(centerX + outer + 1);
  const startY = Math.floor(centerY - outer - 1);
  const endY = Math.ceil(centerY + outer + 1);

  for (let py = startY; py <= endY; py += 1) {
    for (let px = startX; px <= endX; px += 1) {
      const distance = Math.hypot(px - centerX, py - centerY);

      if (distance >= inner && distance <= outer) {
        image.setPixel(px, py, color);
      }
    }
  }
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSquared = abx * abx + aby * aby;

  if (lengthSquared === 0) {
    return Math.hypot(px - ax, py - ay);
  }

  const projection = clamp(((px - ax) * abx + (py - ay) * aby) / lengthSquared, 0, 1);
  const nearestX = ax + abx * projection;
  const nearestY = ay + aby * projection;
  return Math.hypot(px - nearestX, py - nearestY);
}

function fillThickLine(image, ax, ay, bx, by, thickness, startColor, endColor) {
  const minX = Math.floor(Math.min(ax, bx) - thickness);
  const maxX = Math.ceil(Math.max(ax, bx) + thickness);
  const minY = Math.floor(Math.min(ay, by) - thickness);
  const maxY = Math.ceil(Math.max(ay, by) + thickness);
  const length = Math.hypot(bx - ax, by - ay) || 1;

  for (let py = minY; py <= maxY; py += 1) {
    for (let px = minX; px <= maxX; px += 1) {
      if (distanceToSegment(px, py, ax, ay, bx, by) <= thickness / 2) {
        const progress = clamp(Math.hypot(px - ax, py - ay) / length, 0, 1);
        image.setPixel(px, py, mix(startColor, endColor, progress));
      }
    }
  }
}

function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const area = (x1, y1, x2, y2, x3, y3) => (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
  const full = Math.abs(area(ax, ay, bx, by, cx, cy));
  const first = Math.abs(area(px, py, bx, by, cx, cy));
  const second = Math.abs(area(ax, ay, px, py, cx, cy));
  const third = Math.abs(area(ax, ay, bx, by, px, py));
  return Math.abs(full - (first + second + third)) < 0.8;
}

function fillTriangle(image, ax, ay, bx, by, cx, cy, color) {
  const minX = Math.floor(Math.min(ax, bx, cx));
  const maxX = Math.ceil(Math.max(ax, bx, cx));
  const minY = Math.floor(Math.min(ay, by, cy));
  const maxY = Math.ceil(Math.max(ay, by, cy));

  for (let py = minY; py <= maxY; py += 1) {
    for (let px = minX; px <= maxX; px += 1) {
      if (pointInTriangle(px, py, ax, ay, bx, by, cx, cy)) {
        image.setPixel(px, py, color);
      }
    }
  }
}

function renderIcon(size) {
  const image = new RasterImage(size);
  image.fill([0, 0, 0, 0]);

  fillRoundedRect(
    image,
    Math.round(size * 0.08),
    Math.round(size * 0.08),
    Math.round(size * 0.84),
    Math.round(size * 0.84),
    Math.round(size * 0.2),
    [20, 34, 43, 255],
    [7, 16, 21, 255],
  );

  strokeCircle(
    image,
    size * 0.5,
    size * 0.5,
    size * 0.24,
    size * 0.07,
    [90, 224, 196, 255],
  );

  strokeCircle(
    image,
    size * 0.5,
    size * 0.5,
    size * 0.17,
    size * 0.025,
    [216, 181, 95, 240],
  );

  fillThickLine(
    image,
    size * 0.25,
    size * 0.67,
    size * 0.71,
    size * 0.31,
    size * 0.1,
    [35, 142, 118, 255],
    [154, 255, 240, 255],
  );

  fillTriangle(
    image,
    size * 0.66,
    size * 0.22,
    size * 0.84,
    size * 0.18,
    size * 0.78,
    size * 0.37,
    [154, 255, 240, 255],
  );

  fillThickLine(
    image,
    size * 0.5,
    size * 0.28,
    size * 0.5,
    size * 0.72,
    size * 0.03,
    [246, 229, 165, 255],
    [215, 181, 95, 255],
  );

  fillThickLine(
    image,
    size * 0.43,
    size * 0.39,
    size * 0.59,
    size * 0.39,
    size * 0.03,
    [246, 229, 165, 255],
    [215, 181, 95, 255],
  );

  fillThickLine(
    image,
    size * 0.41,
    size * 0.61,
    size * 0.57,
    size * 0.61,
    size * 0.03,
    [246, 229, 165, 255],
    [215, 181, 95, 255],
  );

  return image;
}

const outputFiles = [
  { size: 32, path: resolve("public/favicon-32x32.png") },
  { size: 180, path: resolve("public/apple-touch-icon.png") },
  { size: 192, path: resolve("public/icon-192.png") },
  { size: 512, path: resolve("public/icon-512.png") },
];

for (const file of outputFiles) {
  renderIcon(file.size).writePng(file.path);
}

console.log("Site icons generated.");
