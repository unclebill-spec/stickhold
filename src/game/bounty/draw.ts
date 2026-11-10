import type { Sim } from "./sim";
import { COLS, FACTION_META, ITEM_META, ROWS, TH, TIER_COLOR, TW, type Building } from "./types";

type Cam = { x: number; y: number; z: number };

export function worldToScreen(x: number, y: number, cam: Cam, vw: number, vh: number) {
  const z = cam.z;
  const sx = (x - y) * (TW / 2) * z - cam.x * z + vw * 0.5;
  const sy = (x + y) * (TH / 2) * z - cam.y * z + vh * 0.28;
  return { x: sx, y: sy };
}

export function screenToWorld(sx: number, sy: number, cam: Cam, vw: number, vh: number) {
  const z = cam.z;
  const x = (sx - vw * 0.5 + cam.x * z) / z;
  const y = (sy - vh * 0.28 + cam.y * z) / z;
  const wx = (x / (TW / 2) + y / (TH / 2)) / 2;
  const wy = (y / (TH / 2) - x / (TW / 2)) / 2;
  return { x: wx, y: wy };
}

const TILE: Record<number, string> = {
  0: "#1c2a22",
  1: "#3a342c",
  2: "#1a1e24",
  3: "#1c2a22",
  4: "#1c2a22",
  5: "#243028",
  6: "#1c2a22",
  7: "#1c2a22",
  8: "#1c2a22",
  9: "#1c2a22",
  10: "#1c2a22",
  11: "#2a261f",
};

export function drawWorld(ctx: CanvasRenderingContext2D, sim: Sim, vw: number, vh: number) {
  const cam = sim.cam;
  ctx.clearRect(0, 0, vw, vh);
  const sky = ctx.createLinearGradient(0, 0, 0, vh);
  sky.addColorStop(0, "#121826");
  sky.addColorStop(1, "#0c1218");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, vw, vh);

  const pad = 2;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const p = worldToScreen(x, y, cam, vw, vh);
      if (p.x < -80 || p.y < -80 || p.x > vw + 80 || p.y > vh + 80) continue;
      const t = sim.tiles[y * COLS + x];
      diamond(ctx, p.x, p.y, (TW / 2) * cam.z, (TH / 2) * cam.z, TILE[t] ?? "#1c2a22");
      if ((x + y) % 7 === 0 && t === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.015)";
        diamond(ctx, p.x, p.y, (TW / 2) * cam.z, (TH / 2) * cam.z, "rgba(255,255,255,0.03)");
      }
      drawProp(ctx, t, p.x, p.y, cam.z, sim, x, y);
    }
  }

  const sprites: { y: number; draw: () => void }[] = [];
  for (const b of sim.buildings) {
    const p = worldToScreen(b.x + b.w / 2, b.y + b.h / 2, cam, vw, vh);
    sprites.push({ y: b.x + b.y + b.h, draw: () => drawBuilding(ctx, b, p.x, p.y, cam.z, sim) });
  }
  for (const u of sim.units) {
    if (u.hp <= 0) continue;
    const p = worldToScreen(u.x, u.y, cam, vw, vh);
    sprites.push({ y: u.x + u.y, draw: () => drawUnit(ctx, u, p.x, p.y, cam.z, sim) });
  }
  for (const d of sim.drops) {
    const p = worldToScreen(d.x, d.y, cam, vw, vh);
    sprites.push({
      y: d.x + d.y - 0.1,
      draw: () => {
        ctx.fillStyle = TIER_COLOR[ITEM_META[d.item].tier];
        ctx.beginPath();
        ctx.arc(p.x, p.y - 8 * cam.z, 5 * cam.z, 0, Math.PI * 2);
        ctx.fill();
      },
    });
  }
  sprites.sort((a, b) => a.y - b.y);
  for (const s of sprites) s.draw();

  for (const pr of sim.projs) {
    const p = worldToScreen(pr.x, pr.y, cam, vw, vh);
    ctx.fillStyle = pr.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y - 16 * cam.z, 3.5 * cam.z, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const f of sim.fx) {
    const p = worldToScreen(f.x, f.y, cam, vw, vh);
    ctx.globalAlpha = Math.max(0, f.life);
    ctx.fillStyle = f.color;
    ctx.font = `${12 * cam.z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(f.text, p.x, p.y - 28 * cam.z);
    ctx.globalAlpha = 1;
  }

  if (sim.place) {
    const specW = sim.place === "hall" ? 3 : 2;
    const tx = Math.floor(sim.hover.x);
    const ty = Math.floor(sim.hover.y);
    const ok = sim.footOk(tx, ty, specW, specW);
    const p = worldToScreen(tx + specW / 2, ty + specW / 2, cam, vw, vh);
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = ok ? "#e07a2f" : "#9a3040";
    diamond(ctx, p.x, p.y + 8, (TW / 2) * specW * cam.z, (TH / 2) * specW * cam.z, ok ? "rgba(224,122,47,0.35)" : "rgba(154,48,64,0.4)");
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = "rgba(12,18,24,0.18)";
  ctx.fillRect(0, 0, vw, 28);
  void pad;
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, hw: number, hh: number, color: string) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + hw, y + hh);
  ctx.lineTo(x, y + hh * 2);
  ctx.lineTo(x - hw, y + hh);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawProp(
  ctx: CanvasRenderingContext2D,
  t: number,
  x: number,
  y: number,
  z: number,
  sim: Sim,
  tx: number,
  ty: number,
) {
  if (t === 3 || t === 4) {
    ctx.fillStyle = "#1a120e";
    ctx.fillRect(x - 2 * z, y + 6 * z, 4 * z, 16 * z);
    ctx.fillStyle = t === 4 ? "#3d4a44" : "#243028";
    ctx.beginPath();
    ctx.arc(x, y - 4 * z, (t === 4 ? 13 : 11) * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a120e";
    ctx.fillRect(x - 1 * z, y - 10 * z, 2 * z, 6 * z);
    if (t === 4) {
      ctx.fillStyle = "#0c1218";
      ctx.fillRect(x - 4 * z, y - 6 * z, 2 * z, 2 * z);
      ctx.fillRect(x + 2 * z, y - 6 * z, 2 * z, 2 * z);
    }
    const left = sim.woodLeft[ty * COLS + tx];
    if (left > 0 && left < 40) {
      ctx.fillStyle = "#3a342c";
      ctx.fillRect(x - 6 * z, y + 20 * z, 12 * z * (left / 40), 2 * z);
    }
  } else if (t === 5) {
    ctx.fillStyle = "#2d4a28";
    ctx.fillRect(x - 1 * z, y + 6 * z, 2 * z, 5 * z);
    ctx.fillStyle = "#e07a2f";
    ctx.beginPath();
    ctx.ellipse(x, y + 8 * z, 6 * z, 4.5 * z, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#9a4e16";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 4 * z);
    ctx.lineTo(x, y + 12 * z);
    ctx.stroke();
  } else if (t === 6) {
    ctx.fillStyle = "#3a4250";
    ctx.fillRect(x - 12 * z, y - 6 * z, 24 * z, 16 * z);
    ctx.fillStyle = "#2a313c";
    ctx.beginPath();
    ctx.moveTo(x - 14 * z, y - 6 * z);
    ctx.lineTo(x, y - 16 * z);
    ctx.lineTo(x + 14 * z, y - 6 * z);
    ctx.fill();
    ctx.fillStyle = "#0c1218";
    ctx.fillRect(x - 3 * z, y, 6 * z, 10 * z);
    ctx.fillStyle = "#f2c14d";
    ctx.fillRect(x + 7 * z, y - 2 * z, 2 * z, 3 * z);
  } else if (t === 7) {
    ctx.fillStyle = "#6d7582";
    ctx.fillRect(x - 5 * z, y, 10 * z, 12 * z);
    ctx.beginPath();
    ctx.arc(x, y, 5 * z, Math.PI, 0);
    ctx.fill();
  } else if (t === 8) {
    ctx.strokeStyle = "#8b939e";
    ctx.lineWidth = Math.max(2, 2 * z);
    ctx.beginPath();
    ctx.moveTo(x, y - 8 * z);
    ctx.lineTo(x, y + 12 * z);
    ctx.moveTo(x - 6 * z, y);
    ctx.lineTo(x + 6 * z, y);
    ctx.stroke();
  } else if (t === 9) {
    ctx.fillStyle = "#7d868f";
    ctx.fillRect(x - 3 * z, y, 6 * z, 10 * z);
    ctx.beginPath();
    ctx.arc(x, y - 2 * z, 4 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 6 * z, y + 8 * z, 12 * z, 3 * z);
  } else if (t === 10) {
    ctx.fillStyle = "#5c656e";
    ctx.fillRect(x - 3 * z, y - 10 * z, 6 * z, 22 * z);
    ctx.fillRect(x - 5 * z, y - 12 * z, 10 * z, 3 * z);
  } else if (t === 11) {
    ctx.fillStyle = "#2a241c";
    ctx.beginPath();
    ctx.moveTo(x, y - 10 * z);
    ctx.lineTo(x + 16 * z, y + 8 * z);
    ctx.lineTo(x - 8 * z, y + 14 * z);
    ctx.fill();
    ctx.fillStyle = "#f2c14d";
    ctx.fillRect(x + 1 * z, y + 2 * z, 2 * z, 2 * z);
    ctx.fillRect(x - 3 * z, y + 6 * z, 2 * z, 2 * z);
  }
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  b: Building,
  x: number,
  y: number,
  z: number,
  sim: Sim,
) {
  const color = FACTION_META[b.faction].color;
  const h = (b.kind === "hall" ? 34 : b.kind === "tower" ? 48 : 26) * z * (b.progress < 1 ? 0.35 + b.progress * 0.65 : 1);
  const hw = b.w * 12 * z;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 8 * z, hw, 8 * z, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a313c";
  ctx.fillRect(x - hw, y - h, hw * 2, h);
  ctx.fillStyle = color;
  ctx.fillRect(x - hw, y - h, hw * 2, 6 * z);
  ctx.fillStyle = "#1a120e";
  ctx.beginPath();
  ctx.moveTo(x - hw - 4 * z, y - h);
  ctx.lineTo(x, y - h - 18 * z - (b.tier > 1 ? 12 * z : 0));
  ctx.lineTo(x + hw + 4 * z, y - h);
  ctx.fill();
  ctx.fillStyle = "#14110e";
  ctx.beginPath();
  ctx.moveTo(x - hw * 0.55, y - h - 6 * z);
  ctx.lineTo(x, y - h - 18 * z - (b.tier > 1 ? 12 * z : 0));
  ctx.lineTo(x + hw * 0.15, y - h - 4 * z);
  ctx.fill();
  if (b.kind === "tower") {
    ctx.fillStyle = "#2a313c";
    ctx.fillRect(x - hw * 0.45, y - h - 28 * z, hw * 0.9, 14 * z);
    for (const mx of [-1, 1]) {
      ctx.fillRect(x + mx * hw * 0.4, y - h - 34 * z, 4 * z, 8 * z);
    }
    ctx.fillStyle = "#f2c14d";
    ctx.beginPath();
    ctx.arc(x, y - h - 30 * z, 3 * z, 0, Math.PI * 2);
    ctx.fill();
  }
  if (b.kind === "hall") {
    ctx.fillStyle = color;
    ctx.fillRect(x + hw + 4 * z, y - h * 0.2, 2 * z, 16 * z);
    ctx.fillRect(x + hw + 2 * z, y - h * 0.2, 6 * z, 2 * z);
    ctx.fillRect(x + hw + 3 * z, y - 2 * z, 8 * z, 10 * z);
  }
  if (b.kind === "barracks") {
    ctx.strokeStyle = "#cfd6de";
    ctx.lineWidth = 2 * z;
    ctx.beginPath();
    ctx.moveTo(x + hw * 0.2, y - h * 0.55);
    ctx.lineTo(x + hw * 0.55, y - h * 0.25);
    ctx.stroke();
  }
  if (b.kind === "lodge") {
    ctx.strokeStyle = "#d7c4a8";
    ctx.lineWidth = 1.5 * z;
    ctx.beginPath();
    ctx.moveTo(x - hw * 0.2, y - h * 0.35);
    ctx.quadraticCurveTo(x, y - h * 0.7, x + hw * 0.25, y - h * 0.35);
    ctx.moveTo(x + hw * 0.05, y - h * 0.55);
    ctx.lineTo(x + hw * 0.35, y - h * 0.2);
    ctx.stroke();
  }
  ctx.fillStyle = "#0c1218";
  ctx.fillRect(x - 4 * z, y - 10 * z, 8 * z, 12 * z);
  if (b.hp < b.maxHp && b.progress >= 1) {
    const lost = 1 - b.hp / b.maxHp;
    const flames = Math.max(1, Math.ceil(lost * 5));
    for (let i = 0; i < flames; i++) {
      ctx.fillStyle = i % 2 ? "#f2c14d" : "#e07a2f";
      ctx.beginPath();
      ctx.arc(x - 8 * z + i * 5 * z, y - 8 * z - (i % 3) * 4 * z, (2 + lost * 3) * z, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (b.progress < 1) {
    ctx.fillStyle = "#0c1218";
    ctx.fillRect(x - hw, y - 6 * z, hw * 2, 3 * z);
    ctx.fillStyle = "#7dcea0";
    ctx.fillRect(x - hw, y - 6 * z, hw * 2 * b.progress, 3 * z);
  } else if (b.hp < b.maxHp) {
    ctx.fillStyle = "#3a1820";
    ctx.fillRect(x - hw, y - h - 8 * z, hw * 2, 3 * z);
    ctx.fillStyle = "#9a3040";
    ctx.fillRect(x - hw, y - h - 8 * z, hw * 2 * (b.hp / b.maxHp), 3 * z);
  }
  const sel = sim.selection.some((s) => s.t === "b" && s.id === b.id);
  if (sel) {
    ctx.strokeStyle = "#f2c14d";
    ctx.strokeRect(x - hw - 2, y - h - 2, hw * 2 + 4, h + 4);
  }
  if (b.queue.length) {
    const q = b.queue[0];
    ctx.fillStyle = "#d5e4f2";
    ctx.font = `${10 * z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(`${q.kind} ${Math.ceil(q.need - q.t)}s`, x, y - h - 18 * z);
  }
}

function drawUnit(
  ctx: CanvasRenderingContext2D,
  u: Sim["units"][number],
  x: number,
  y: number,
  z: number,
  sim: Sim,
) {
  if (u.stealth > 0 && u.team !== 0 && u.revealed <= 0 && sim.reveal <= 0) return;
  const color = u.name === "Grave Peddler" ? "#8b7355" : u.team === 2 ? "#8d9aa8" : FACTION_META[u.faction].color;
  const bob = Math.sin(u.anim) * (u.path.length ? 2 : 0.4) * z;
  const s = (u.kind === "hero" || u.boss === "king" || u.boss === "horse" ? 1.35 : 1) * z;
  ctx.globalAlpha = u.stealth > 0 ? 0.45 : u.evade > 0 ? 0.55 : 1;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + 2, 8 * s, 3.5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  if (u.boss === "horse") {
    ctx.fillStyle = "#1a120e";
    ctx.fillRect(x - 10 * s, y - 10 * s + bob, 16 * s, 8 * s);
    ctx.beginPath();
    ctx.arc(x + 8 * s, y - 12 * s + bob, 4 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = color;
  ctx.globalAlpha = u.faction === "ghost" && u.team !== 2 ? 0.72 : ctx.globalAlpha;
  ctx.fillRect(x - 5 * s, y - 16 * s + bob, 10 * s, 14 * s);
  if (u.name === "Scarecrow") {
    ctx.strokeStyle = "#6d7582";
    ctx.beginPath();
    ctx.moveTo(x - 10 * s, y - 12 * s);
    ctx.lineTo(x + 10 * s, y - 12 * s);
    ctx.stroke();
  }
  if (u.name === "Witch") {
    ctx.fillStyle = "#1a120e";
    ctx.beginPath();
    ctx.moveTo(x - 6 * s, y - 22 * s);
    ctx.lineTo(x, y - 32 * s);
    ctx.lineTo(x + 6 * s, y - 22 * s);
    ctx.fill();
  }
  if (u.boss === "horse") {
    ctx.fillStyle = "#f2c14d";
    ctx.beginPath();
    ctx.arc(x + 10 * s, y - 18 * s, 3 * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = u.boss === "king" ? "#e07a2f" : "#d7c4a8";
  ctx.beginPath();
  ctx.arc(x + u.facing * 1 * s, y - 20 * s + bob, u.boss === "king" ? 7 * s : 4.5 * s, 0, Math.PI * 2);
  ctx.fill();
  if (u.boss === "king") {
    ctx.fillStyle = "#f2c14d";
    ctx.fillRect(x - 2 * s, y - 28 * s + bob, 4 * s, 4 * s);
  }
  ctx.strokeStyle = "#cfc6b8";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  const swing = Math.sin(u.anim * 2) * 4 * s;
  ctx.moveTo(x + 4 * s, y - 12 * s + bob);
  ctx.lineTo(x + 12 * s * u.facing, y - 8 * s + bob + swing);
  ctx.stroke();
  if (u.invuln > 0) {
    ctx.strokeStyle = "rgba(242,193,77,0.8)";
    ctx.strokeRect(x - 10 * s, y - 30 * s, 20 * s, 32 * s);
  }
  if (u.hp < u.maxHp) {
    ctx.fillStyle = "#1a1014";
    ctx.fillRect(x - 8 * s, y - 34 * s + bob, 16 * s, 3 * s);
    ctx.fillStyle = u.team === 0 ? "#7dcea0" : "#9a3040";
    ctx.fillRect(x - 8 * s, y - 34 * s + bob, 16 * s * (u.hp / u.maxHp), 3 * s);
  }
  const sel = sim.selection.some((seln) => seln.t === "u" && seln.id === u.id);
  if (sel) {
    ctx.strokeStyle = "#f2c14d";
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 10 * s, 4 * s, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (u.kind === "hero" && u.team !== 2) {
    ctx.fillStyle = "#d5e4f2";
    ctx.font = `${10 * z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(String(u.level), x, y - 40 * s);
  }
  ctx.globalAlpha = 1;
}

export function drawHorseman(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#151c2b");
  g.addColorStop(1, "#0c1218");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#d5e4f2";
  ctx.beginPath();
  ctx.arc(w * 0.78, h * 0.22, Math.min(w, h) * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a120e";
  const bx = w * 0.5;
  const by = h * 0.46;
  ctx.fillRect(bx - 70, by, 120, 28);
  ctx.beginPath();
  ctx.ellipse(bx + 70, by + 8, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(bx - 54, by - 8, 8, 36);
  ctx.fillRect(bx + 20, by - 8, 8, 36);
  ctx.fillStyle = "#241910";
  ctx.fillRect(bx - 18, by - 78, 36, 78);
  ctx.fillStyle = "#3a2a22";
  ctx.fillRect(bx - 10, by - 86, 8, 16);
  const glow = 0.65 + Math.sin(t * 4) * 0.2;
  ctx.fillStyle = `rgba(224,122,47,${glow})`;
  ctx.beginPath();
  ctx.arc(bx + 28, by - 70, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a160c";
  ctx.beginPath();
  ctx.moveTo(bx + 22, by - 74);
  ctx.lineTo(bx + 26, by - 70);
  ctx.lineTo(bx + 22, by - 66);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx + 34, by - 74);
  ctx.lineTo(bx + 30, by - 70);
  ctx.lineTo(bx + 34, by - 66);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx + 22, by - 62);
  ctx.lineTo(bx + 28, by - 56);
  ctx.lineTo(bx + 34, by - 62);
  ctx.fill();
  ctx.fillStyle = "rgba(255,180,60,0.25)";
  ctx.beginPath();
  ctx.arc(bx + 28, by - 70, 28 + Math.sin(t * 6) * 2, 0, Math.PI * 2);
  ctx.fill();
}
