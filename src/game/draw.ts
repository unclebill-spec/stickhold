// @ts-nocheck
import {
  AGE3_TIME,
  AGE4_TIME,
  AGE5_TIME,
  AGE_TIME,
  BLDS,
  MAP_H,
  MAP_W,
  TH,
  TW,
  UNITS,
  beastOf,
  BOSSES,
  ITEMS
} from "./engine";
const INK = "#1c1915";
const GRASS = ["#6aaa52", "#64a64e"];
const WOOD = "#7a4e2d";
const BUILD_LOOK = {
  townhall: { wall: "#efe2c6", roof: "#b5523a" },
  house: { wall: "#f0d56a", roof: "#d0892f" },
  dump: { wall: "#6e8f55", roof: "#3e5c34" },
  barracks: { wall: "#c45b4a", roof: "#7c2e2a" },
  range: { wall: "#5c8fbf", roof: "#2c5278" },
  stable: { wall: "#c4a15a", roof: "#6b4630" },
  school: { wall: "#efe6f6", roof: "#5c3d86" },
  smith: { wall: "#8d939b", roof: "#3e342f" },
  husbandry: { wall: "#e7d7a4", roof: "#6d8f45" },
  tower: { wall: "#9aa8b8", roof: "#5d6e86" },
  farm: { wall: "#d2b15a", roof: "#5c8a32" },
  wall: { wall: "#c47a3a", roof: "#8a5424" },
  altar: { wall: "#3e3a44", roof: "#c6a15a" },
  shop: { wall: "#e7c56a", roof: "#8a3e4a" },
  keep: { wall: "#d8d2c4", roof: "#6e2c2a" },
  temple: { wall: "#f7f3ea", roof: "#c6a15a" },
  yard: { wall: "#c4a574", roof: "#5c4030" }
};
const TIMBER = "#6b4630";
function hash(x, y) {
  return Math.abs((Math.imul(x * 374761393 + y * 668265263, 1274126177) | 0) >>> 0);
}
function diamond(ctx, cx, cy, hw, hh) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - hh);
  ctx.lineTo(cx + hw, cy);
  ctx.lineTo(cx, cy + hh);
  ctx.lineTo(cx - hw, cy);
  ctx.closePath();
}
function shadeDiamond(ctx, cx, cy, hw, hh) {
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.moveTo(cx, cy - hh);
  ctx.lineTo(cx + hw, cy);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx - hw, cy);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(20,24,16,0.12)";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + hw, cy);
  ctx.lineTo(cx, cy + hh);
  ctx.lineTo(cx - hw, cy);
  ctx.closePath();
  ctx.fill();
}
function drawRealm(realm, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#16301c";
  ctx.fillRect(0, 0, w, h);
  const z = realm.zoom;
  const corners = [
    realm.screenToWorld(-TW * z, -TH * z),
    realm.screenToWorld(w + TW * z, -TH * z),
    realm.screenToWorld(-TW * z, h + TH * 2 * z),
    realm.screenToWorld(w + TW * z, h + TH * 2 * z)
  ];
  let x0 = MAP_W;
  let y0 = MAP_H;
  let x1 = 0;
  let y1 = 0;
  for (const c of corners) {
    x0 = Math.min(x0, c.x);
    y0 = Math.min(y0, c.y);
    x1 = Math.max(x1, c.x);
    y1 = Math.max(y1, c.y);
  }
  x0 = Math.max(0, Math.floor(x0) - 2);
  y0 = Math.max(0, Math.floor(y0) - 2);
  x1 = Math.min(MAP_W - 1, Math.ceil(x1) + 2);
  y1 = Math.min(MAP_H - 1, Math.ceil(y1) + 2);
  const snowing = typeof realm.weather === "function" && realm.weather().snow;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const p = realm.worldToScreen(x, y);
      if (p.sx < -TW * z || p.sy < -TH * z || p.sx > w + TW * z || p.sy > h + TH * 2 * z) continue;
      const tile = realm.tiles[y * MAP_W + x];
      const hw = TW / 2 * z;
      const hh = TH / 2 * z;
      if (realm.phase !== "menu" && !realm.seen(x, y)) {
        ctx.fillStyle = "#0c1810";
        diamond(ctx, p.sx, p.sy, hw, hh);
        ctx.fill();
        continue;
      }
      if (tile.terrain === "water") {
        ctx.fillStyle = "#2b6eaf";
        diamond(ctx, p.sx, p.sy, hw, hh);
        ctx.fill();
        shadeDiamond(ctx, p.sx, p.sy, hw, hh);
        ctx.strokeStyle = "rgba(255,255,255,0.28)";
        ctx.lineWidth = 1;
        const wave = Math.sin(realm.time * 1.6 + x * 0.7 + y) * 2;
        const wave2 = Math.sin(realm.time * 1.1 + x * 0.4 - y) * 1.5;
        ctx.beginPath();
        ctx.moveTo(p.sx - hw * 0.42, p.sy + wave);
        ctx.quadraticCurveTo(p.sx, p.sy - 3 + wave, p.sx + hw * 0.42, p.sy + wave);
        ctx.moveTo(p.sx - hw * 0.28, p.sy + 3 + wave2);
        ctx.quadraticCurveTo(p.sx, p.sy + wave2, p.sx + hw * 0.28, p.sy + 3 + wave2);
        ctx.stroke();
        continue;
      }
      const g = GRASS[hash(x, y) % GRASS.length];
      const snowTile = tile.terrain === "snow";
      const graveTile = tile.terrain === "grave";
      const marshTile = tile.terrain === "marsh";
      ctx.fillStyle = snowTile ? (hash(x, y) % 2 ? "#f7fafc" : "#e3eef6") : marshTile ? (hash(x, y) % 2 ? "#3a5534" : "#2c4630") : graveTile ? (hash(x, y) % 2 ? "#4e4856" : "#3c3644") : tile.terrain === "sand" ? "#e7d3a2" : tile.terrain === "dirt" ? "#c6a56f" : tile.terrain === "rock" ? "#8e959c" : g;
      diamond(ctx, p.sx, p.sy, hw, hh);
      ctx.fill();
      if (tile.terrain !== "grass") {
        shadeDiamond(ctx, p.sx, p.sy, hw, hh);
        diamond(ctx, p.sx, p.sy, hw, hh);
        ctx.strokeStyle = "rgba(28,25,21,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      const wet = tile.terrain !== "rock" && (x > 0 && realm.tiles[y * MAP_W + x - 1]?.terrain === "water" || x + 1 < MAP_W && realm.tiles[y * MAP_W + x + 1]?.terrain === "water" || y > 0 && realm.tiles[(y - 1) * MAP_W + x]?.terrain === "water" || y + 1 < MAP_H && realm.tiles[(y + 1) * MAP_W + x]?.terrain === "water");
      if (wet) {
        ctx.fillStyle = "rgba(231,211,162,0.45)";
        diamond(ctx, p.sx, p.sy, hw * 0.72, hh * 0.72);
        ctx.fill();
      }
      if (tile.terrain === "rock") {
        ctx.fillStyle = tile.deco === 1 ? "#d7b23a" : "#b7bdc2";
        ctx.beginPath();
        ctx.arc(p.sx - 4 * z, p.sy - 2 * z, 5 * z, 0, Math.PI * 2);
        ctx.arc(p.sx + 5 * z, p.sy + 1 * z, 4 * z, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (snowTile) {
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.fillRect(p.sx - 4 * z, p.sy - 1 * z, 2.2 * z, 1.3 * z);
        ctx.fillStyle = "rgba(176, 196, 214, 0.9)";
        ctx.fillRect(p.sx + 3 * z, p.sy + 1 * z, 2 * z, 1.2 * z);
      } else if (marshTile) {
        ctx.fillStyle = "rgba(18, 32, 22, 0.45)";
        ctx.beginPath();
        ctx.ellipse(p.sx, p.sy + 1 * z, 7 * z, 2.4 * z, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (graveTile) {
        ctx.fillStyle = "#d9d3c4";
        ctx.fillRect(p.sx - 5 * z, p.sy - 4 * z, 2 * z, 5 * z);
        ctx.fillRect(p.sx + 3 * z, p.sy - 2 * z, 1.6 * z, 4 * z);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1;
        ctx.strokeRect(p.sx - 5 * z, p.sy - 4 * z, 2 * z, 5 * z);
      } else if (snowing && tile.terrain === "grass") {
        ctx.fillStyle = "rgba(236, 244, 250, 0.42)";
        diamond(ctx, p.sx, p.sy, hw * 0.86, hh * 0.86);
        ctx.fill();
      }
    }
  }
  for (const u of realm.units) {
    if (u.kind !== "hero" || u.hp <= 0) continue;
    if (realm.phase !== "menu" && !realm.seen(Math.floor(u.x), Math.floor(u.y))) continue;
    drawAura(ctx, realm, u.x, u.y, 3.6, "rgba(226,179,64,0.95)");
  }
  for (const n of realm.nodes) {
    if (!n.alive || n.amount <= 0) continue;
    if (realm.phase !== "menu" && !realm.seen(n.x, n.y)) continue;
    const aura = auraFor(n);
    if (!aura) continue;
    drawAura(ctx, realm, n.x + 0.5, n.y + 0.5, aura.r, aura.color);
  }
  const sprites = [];
  for (const n of realm.nodes) {
    if (n.kind === "farm") continue;
    if (realm.phase !== "menu" && !realm.seen(n.x, n.y)) continue;
    if (n.amount <= 0 && n.kind !== "tree") continue;
    const anchor = n.kind === "berry" || n.kind === "fish" || n.kind === "sheep" || n.kind === "nest" || n.kind === "cart" || n.kind === "den" || beastOf(n.kind) ? realm.worldToScreen(n.x + 0.5, n.y + 0.5) : realm.worldToScreen(n.x, n.y);
    if (anchor.sx < -40 || anchor.sy < -80 || anchor.sx > w + 40 || anchor.sy > h + 40) continue;
    sprites.push({
      key: n.kind === "den" ? n.x + n.y : n.x + n.y + 0.1,
      draw: () => drawNode(ctx, realm, n, anchor.sx, anchor.sy)
    });
  }
  for (const d of realm.drops || []) {
    const gx = Math.floor(d.x);
    const gy = Math.floor(d.y);
    if (realm.phase !== "menu" && !realm.seen(gx, gy)) continue;
    const anchor = realm.worldToScreen(d.x, d.y);
    if (anchor.sx < -20 || anchor.sy < -20 || anchor.sx > w + 20 || anchor.sy > h + 20) continue;
    sprites.push({
      key: d.y + d.x + 0.2,
      draw: () => drawGear(ctx, realm, d, anchor.sx, anchor.sy)
    });
  }
  for (const b of realm.buildings) {
    const def = BLDS[b.kind];
    if (realm.phase !== "menu" && !realm.footSeen(b)) continue;
    const depth = b.x + def.w + b.y + def.h;
    sprites.push({
      key: depth,
      draw: () => drawBuilding(ctx, realm, b)
    });
  }
  for (const u of realm.units) {
    if (u.held) continue;
    if (realm.phase !== "menu" && u.team !== realm.playerTeam && !realm.inSight(u.x, u.y)) continue;
    if (u.team !== realm.playerTeam && !realm.scoutSeen(u)) continue;
    let key = u.x + u.y + 0.2;
    if (u.path.length === 0 && u.order.type === "gather") {
      const n = realm.nodes[u.order.nodeId];
      if (n) key = Math.max(key, n.x + n.y + (n.kind === "gold" || n.kind === "stone" ? 2.4 : 1.5));
    } else if (u.path.length === 0 && (u.order.type === "build" || u.order.type === "repair" || u.order.type === "drop")) {
      key += 1.4;
    }
    sprites.push({
      key,
      draw: () => drawUnit(ctx, realm, u)
    });
  }
  sprites.sort((a, b) => a.key - b.key);
  for (const s of sprites) s.draw();
  for (const shot of realm.shots) {
    if (realm.phase !== "menu" && !realm.inSight(shot.x, shot.y) && !realm.inSight(shot.tx, shot.ty)) continue;
    const k = Math.min(1, shot.t / shot.dur);
    const p = realm.worldToScreen(shot.x + (shot.tx - shot.x) * k, shot.y + (shot.ty - shot.y) * k);
    const z2 = realm.zoom;
    if (shot.bolt === "lightning") {
      const a = realm.worldToScreen(shot.x, shot.y);
      const ang = Math.atan2(p.sy - a.sy, p.sx - a.sx);
      const lift = shot.high ? 48 * z2 : 16 * z2;
      ctx.save();
      ctx.translate(p.sx, p.sy - lift);
      ctx.rotate(ang);
      ctx.strokeStyle = "#f4f1ff";
      ctx.lineWidth = 1.6 * z2;
      ctx.beginPath();
      ctx.moveTo(-16 * z2, 0);
      ctx.lineTo(-10 * z2, -3 * z2);
      ctx.lineTo(-6 * z2, 2.5 * z2);
      ctx.lineTo(-1 * z2, -2 * z2);
      ctx.lineTo(6 * z2, 0);
      ctx.stroke();
      ctx.strokeStyle = "#d7b23a";
      ctx.lineWidth = 0.8 * z2;
      ctx.stroke();
      ctx.restore();
    } else if (shot.bolt === "fire") {
      ctx.fillStyle = "#f25a1a";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 3.2 * z2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd36a";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 1.5 * z2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shot.bolt === "frost") {
      ctx.strokeStyle = INK;
      ctx.fillStyle = "#9fd4f0";
      ctx.lineWidth = 1.2 * z2;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 2.6 * z2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shot.bolt === "shadow") {
      ctx.strokeStyle = INK;
      ctx.fillStyle = "#2a1d38";
      ctx.lineWidth = 1.2 * z2;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 3 * z2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (shot.bolt === "arcane") {
      ctx.fillStyle = "#6d3fa8";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 3.1 * z2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e6dcff";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 1.3 * z2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shot.bolt === "rock") {
      ctx.fillStyle = "#6e6258";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 3.4 * z2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1 * z2;
      ctx.stroke();
    } else if (shot.bolt === "curse") {
      ctx.fillStyle = "#6a1020";
      ctx.beginPath();
      ctx.moveTo(p.sx, p.sy - 20 * z2);
      ctx.lineTo(p.sx + 3 * z2, p.sy - 16 * z2);
      ctx.lineTo(p.sx, p.sy - 12 * z2);
      ctx.lineTo(p.sx - 3 * z2, p.sy - 16 * z2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#e7b2a4";
      ctx.lineWidth = 1 * z2;
      ctx.stroke();
    } else if (shot.bolt === "holy" || shot.bolt === "heal") {
      ctx.strokeStyle = "#e2b340";
      ctx.lineWidth = 1.4 * z2;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 3 * z2, 0, Math.PI * 2);
      ctx.stroke();
      line(ctx, p.sx, p.sy - 19 * z2, p.sx, p.sy - 13 * z2);
    } else if (shot.arrow) {
      const a = realm.worldToScreen(shot.x, shot.y);
      const b = realm.worldToScreen(shot.tx, shot.ty);
      const ang = Math.atan2(b.sy - a.sy, b.sx - a.sx);
      ctx.save();
      ctx.translate(p.sx, p.sy - 14 * z2);
      ctx.rotate(ang);
      ctx.strokeStyle = "#6b4630";
      ctx.lineWidth = 1.5 * z2;
      ctx.beginPath();
      ctx.moveTo(-9 * z2, 0);
      ctx.lineTo(5 * z2, 0);
      ctx.stroke();
      ctx.fillStyle = "#d7b23a";
      ctx.beginPath();
      ctx.moveTo(8 * z2, 0);
      ctx.lineTo(3 * z2, -2.3 * z2);
      ctx.lineTo(3 * z2, 2.3 * z2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1 * z2;
      ctx.stroke();
      ctx.strokeStyle = "#f2e2a8";
      ctx.beginPath();
      ctx.moveTo(-9 * z2, 0);
      ctx.lineTo(-5 * z2, -2.6 * z2);
      ctx.moveTo(-9 * z2, 0);
      ctx.lineTo(-5 * z2, 2.6 * z2);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle = "#f2e2a8";
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 16 * z2, 3 * z2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  }
  const rallyHome = realm.buildings.find((b) => b.id === realm.selectedBuilding && b.hp > 0);
  if (rallyHome?.rally) {
    const p = realm.worldToScreen(rallyHome.rally.x, rallyHome.rally.y);
    const z2 = realm.zoom;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4 * z2;
    ctx.beginPath();
    ctx.moveTo(p.sx, p.sy);
    ctx.lineTo(p.sx, p.sy - 16 * z2);
    ctx.stroke();
    ctx.fillStyle = "#2a5bd7";
    ctx.beginPath();
    ctx.moveTo(p.sx, p.sy - 16 * z2);
    ctx.lineTo(p.sx + 8 * z2, p.sy - 13 * z2);
    ctx.lineTo(p.sx, p.sy - 10 * z2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  drawSky(ctx, realm, w, h);
  for (const f of realm.floaters) {
    const p = realm.worldToScreen(f.x, f.y);
    const rise = (1 - f.life / f.max) * 18;
    ctx.globalAlpha = Math.max(0, f.life / f.max);
    ctx.fillStyle = f.gold ? "#e2b340" : f.edge ? "#2f8f4a" : f.dmg ? "#d24a32" : INK;
    ctx.font = `700 ${(f.gold ? 13 : f.dmg ? 9 : 14) * realm.zoom}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(f.text, p.sx, p.sy - (f.dmg ? 16 : 28) * realm.zoom - rise);
    ctx.globalAlpha = 1;
  }
  if (realm.placing && realm.hover) {
    const def = BLDS[realm.placing];
    const ok = realm.canPlace(realm.placing, realm.hover.x, realm.hover.y);
    drawFoot(ctx, realm, realm.hover.x, realm.hover.y, def.w, def.h, ok ? "rgba(42,91,215,0.35)" : "rgba(196,80,42,0.4)");
  }
  const box = realm.boxRect();
  if (box) {
    ctx.strokeStyle = "#2a5bd7";
    ctx.fillStyle = "rgba(42,91,215,0.15)";
    const x = Math.min(box.x, box.x2);
    const y = Math.min(box.y, box.y2);
    ctx.fillRect(x, y, Math.abs(box.x2 - box.x), Math.abs(box.y2 - box.y));
    ctx.strokeRect(x, y, Math.abs(box.x2 - box.x), Math.abs(box.y2 - box.y));
  }
  for (const id of realm.selectedUnits) {
    const u = realm.units.find((n) => n.id === id);
    if (!u) continue;
    const p = realm.worldToScreen(u.x, u.y);
    ctx.strokeStyle = teamColor(u.team, realm);
    const dynasty = dynastySide(realm, u.team);
    const coven = covenSide(realm, u.team);
    ctx.fillStyle = dynasty ? "rgba(122,20,36,0.16)" : coven ? "rgba(109,63,168,0.16)" : u.team === 2 ? "rgba(47,122,69,0.16)" : u.team === 0 ? "rgba(42,91,215,0.16)" : "rgba(196,80,42,0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(p.sx, p.sy + 2, 14 * realm.zoom, 6 * realm.zoom, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  for (const m of realm.marks || []) {
    const p = realm.worldToScreen(m.x, m.y);
    const a = Math.max(0, m.life / 0.55);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = "#2a5bd7";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.sx, p.sy, (1.15 - a) * 18 * realm.zoom + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  if (realm.phase === "play" && realm.mouse && typeof realm.orderHint === "function") {
    const text = realm.orderHint(realm.mouse.x, realm.mouse.y);
    if (text) {
      ctx.save();
      ctx.font = "600 12px \"Source Sans 3\", sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const pad = 6;
      const tw = ctx.measureText(text).width;
      const x = Math.min(w - tw - pad * 2 - 4, realm.mouse.x + 16);
      const y = Math.min(h - 22, realm.mouse.y + 18);
      ctx.fillStyle = "rgba(28,25,21,0.88)";
      ctx.fillRect(x, y, tw + pad * 2, 20);
      ctx.fillStyle = "#f4efe4";
      ctx.fillText(text, x + pad, y + 10);
      ctx.restore();
    }
  }
}
function drawSky(ctx, realm, w, h) {
  if (!realm || realm.phase === "menu" || typeof realm.sun !== "function") return;
  const sun = realm.sun();
  const night = 1 - realm.daylight();
  const dusk = Math.max(0, 0.34 - Math.abs(sun) * 0.85);
  if (dusk > 0.02) {
    ctx.fillStyle = `rgba(214, 118, 42, ${dusk.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (night > 0.04) {
    ctx.fillStyle = `rgba(7, 14, 42, ${(night * 0.62).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (night > 0.42 && !(typeof realm.weather === "function" && (realm.weather().rain || realm.weather().fog || realm.weather().snow))) {
    ctx.fillStyle = "#f4efe4";
    for (let i = 0; i < 26; i++) {
      const sx = ((i * 97) % 100) / 100 * w;
      const sy = ((i * 57) % 62) / 100 * h * 0.5;
      ctx.globalAlpha = night * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(realm.time * 1.3 + i)));
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;
  }
  if (night > 0.3) {
    for (const b of realm.buildings) {
      if (b.hp <= 0) continue;
      if (!realm.seen(b.x, b.y)) continue;
      const p = realm.worldToScreen(b.x + 0.5, b.y + 0.8);
      if (p.sx < -30 || p.sy < -30 || p.sx > w + 30 || p.sy > h + 30) continue;
      const rad = 18 * realm.zoom;
      const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad);
      glow.addColorStop(0, "rgba(255, 190, 96, 0.42)");
      glow.addColorStop(1, "rgba(255, 190, 96, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawWeather(ctx, realm, w, h);
}
function drawWeather(ctx, realm, w, h) {
  if (!realm || typeof realm.weather !== "function") return;
  const sky = realm.weather();
  if (!sky || sky.name === "Clear") return;
  if (sky.fog) {
    ctx.fillStyle = `rgba(206, 214, 210, ${(0.26 * sky.fog).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (sky.storm) {
    ctx.fillStyle = "rgba(16, 26, 44, 0.2)";
    ctx.fillRect(0, 0, w, h);
  }
  if (sky.rain) {
    ctx.strokeStyle = sky.storm ? "rgba(226, 236, 244, 0.62)" : "rgba(186, 208, 224, 0.45)";
    ctx.lineWidth = sky.storm ? 1.5 : 1;
    const n = sky.storm ? 72 : 40;
    const fall = (realm.time * 420) % (h + 48);
    for (let i = 0; i < n; i++) {
      const x = (i * 97 + fall * 0.2) % w;
      const y = (i * 41 + fall) % (h + 36) - 24;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 7, y + 16);
      ctx.stroke();
    }
  }
  if (sky.snow) {
    ctx.fillStyle = "rgba(226, 236, 244, 0.16)";
    ctx.fillRect(0, 0, w, h);
    const fall = (realm.time * 42) % (h + 24);
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 78; i++) {
      const x = (i * 89 + Math.sin(realm.time * 0.55 + i) * 14) % w;
      const y = (i * 47 + fall) % (h + 20) - 10;
      ctx.globalAlpha = 0.4 + (i % 5) * 0.1;
      const s = (i % 3) + 1;
      ctx.fillRect((x + w) % w, y, s, s);
    }
    ctx.globalAlpha = 1;
  }
  if (sky.storm && Math.sin(realm.time * 1.7) > 0.985) {
    ctx.fillStyle = "rgba(244, 246, 255, 0.32)";
    ctx.fillRect(0, 0, w, h);
  }
}
function drawFoot(ctx, realm, ax, ay, w, h, fill) {
  const n = realm.worldToScreen(ax - 0.5, ay - 0.5);
  const e = realm.worldToScreen(ax + w - 0.5, ay - 0.5);
  const s = realm.worldToScreen(ax + w - 0.5, ay + h - 0.5);
  const wv = realm.worldToScreen(ax - 0.5, ay + h - 0.5);
  ctx.beginPath();
  ctx.moveTo(n.sx, n.sy);
  ctx.lineTo(e.sx, e.sy);
  ctx.lineTo(s.sx, s.sy);
  ctx.lineTo(wv.sx, wv.sy);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
const MONSTER_LOOK = {
  wolf: { body: "#8d939a", mark: "#d7dbe0", scale: 1 },
  boar: { body: "#6b4a32", mark: "#f3efe6", scale: 1.05 },
  spider: { body: "#2a2830", mark: "#d23b3b", scale: 0.85 },
  troll: { body: "#3f7a4a", mark: "#c8d6a8", scale: 1.35 },
  harpy: { body: "#c4b07a", mark: "#f4efe2", scale: 1 },
  minotaur: { body: "#6a3a28", mark: "#e6d2a8", scale: 1.3 },
  cyclops: { body: "#7a8470", mark: "#f2e36b", scale: 1.55 },
  gorgon: { body: "#2f6b4a", mark: "#9ad17a", scale: 1.1 }
};
function teamColor(team, realm) {
  if (realm && realm.faction === "dynasty" && team === realm.playerTeam) return "#7a1424";
  if (realm && realm.faction === "coven" && team === realm.playerTeam) return "#6d3fa8";
  if (realm && realm.faction === "egypt" && team === realm.playerTeam) return "#1a4f7a";
  return team === 0 ? "#2a5bd7" : team === 2 ? "#2f7a45" : team === 3 ? "#6e7380" : "#c4502a";
}
function dynastySide(realm, team) {
  return !!(realm && realm.faction === "dynasty" && team === realm.playerTeam);
}
function covenSide(realm, team) {
  return !!(realm && realm.faction === "coven" && team === realm.playerTeam);
}
function egyptSide(realm, team) {
  return !!(realm && realm.faction === "egypt" && team === realm.playerTeam);
}
function sideOf(realm, team) {
  if (dynastySide(realm, team)) return "dynasty";
  if (covenSide(realm, team)) return "coven";
  if (egyptSide(realm, team)) return "egypt";
  if (team === 0) return "blue";
  if (team === 1) return "red";
  return "";
}
function heroTool(realm, u) {
  if (u.kind !== "hero") return "";
  const side = sideOf(realm, u.team);
  if (side === "coven") return "staff";
  if (side === "dynasty") return "spear";
  if (side === "egypt") return "khopesh";
  if (side === "red") return "club";
  return "sword";
}
function auraFor(n) {
  if (n.kind === "alpha") return { r: 3.2, color: "rgba(126,176,220,0.95)" };
  if (n.kind === "brood") return { r: 2.8, color: "rgba(168,96,214,0.95)" };
  if (n.kind === "gore") return { r: 3.4, color: "rgba(196,70,48,0.95)" };
  if (n.kind === "chief") return { r: 3.6, color: "rgba(72,150,86,0.95)" };
  if (n.rare) return { r: 2.6, color: "rgba(226,179,64,0.95)" };
  return null;
}
function drawAura(ctx, realm, x, y, radius, color) {
  const p = realm.worldToScreen(x, y);
  const edge = realm.worldToScreen(x + radius, y);
  const rx = Math.max(10, Math.hypot(edge.sx - p.sx, edge.sy - p.sy));
  const pulse = 0.72 + Math.sin(realm.time * 2.4 + x) * 0.18;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(p.sx, p.sy, rx * pulse, rx * 0.52 * pulse, 0, 0, Math.PI * 2);
  ctx.fillStyle = color.replace("0.95", "0.14");
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
function stickHead(ctx, x, y, r) {
  ctx.fillStyle = "#f7f1e4";
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(x + r * 0.28, y - r * 0.05, Math.max(0.6, r * 0.16), 0, Math.PI * 2);
  ctx.fill();
}
function drawFallenStick(ctx, sx, sy, z, sc) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6 * z;
  ctx.lineCap = "round";
  line(ctx, sx - 10 * sc * z, sy - 3 * z, sx + 8 * sc * z, sy - 2 * z);
  stickHead(ctx, sx + 12 * sc * z, sy - 3 * z, 3.4 * sc * z);
}
function drawStickQuad(ctx, sx, sy, z, bob, sc, color) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6 * z;
  ctx.lineCap = "round";
  const by = sy - 8 * sc * z - bob;
  const back = sx - 8 * sc * z;
  const front = sx + 7 * sc * z;
  line(ctx, back, by, front, by);
  line(ctx, back + 2 * z, by, back + 1 * z, sy);
  line(ctx, back + 6 * z, by, back + 7 * z, sy);
  line(ctx, front - 5 * z, by, front - 4 * z, sy);
  line(ctx, front - 1 * z, by, front + 1 * z, sy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(sx, by - 3 * z);
  ctx.lineTo(sx + 3 * z, by);
  ctx.lineTo(sx, by + 2 * z);
  ctx.lineTo(sx - 3 * z, by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  stickHead(ctx, front + 3 * sc * z, by - 4 * sc * z, 3.6 * sc * z);
  return { by, front, back };
}
function drawStickFolk(ctx, sx, sy, z, bob, sc, color) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6 * z;
  ctx.lineCap = "round";
  const hip = sy - 9 * sc * z - bob;
  const shoulder = sy - 18 * sc * z - bob;
  const head = sy - 24 * sc * z - bob;
  line(ctx, sx - 4 * z, hip, sx - 5 * z, sy);
  line(ctx, sx + 4 * z, hip, sx + 5 * z, sy);
  line(ctx, sx, shoulder, sx, hip);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(sx, shoulder + 2 * z);
  ctx.lineTo(sx + 5 * sc * z, shoulder + 8 * z);
  ctx.lineTo(sx, hip);
  ctx.lineTo(sx - 5 * sc * z, shoulder + 8 * z);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  stickHead(ctx, sx, head, 4.2 * sc * z);
  return { hip, shoulder, head };
}
function drawBeast(ctx, realm, n, sx, sy, z) {
  const look = MONSTER_LOOK[n.kind];
  const stat = beastOf(n.kind);
  if (!look || !stat) return;
  const sc = look.scale;
  if (!n.alive) {
    drawFallenStick(ctx, sx, sy, z, sc);
    return;
  }
  const bob = Math.abs(Math.sin(realm.time * (n.kind === "spider" ? 8 : 3) + n.x)) * 1.4 * z;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6 * z;
  ctx.lineCap = "round";
  if (n.kind === "spider") {
    const body = sy - 8 * z - bob;
    for (const [dx, dy] of [
      [-11, 2],
      [-8, 8],
      [-4, -6],
      [4, -6],
      [8, 8],
      [11, 2]
    ]) {
      line(ctx, sx, body, sx + dx * z, body + dy * z);
    }
    stickHead(ctx, sx, body, 3.2 * z);
    ctx.strokeStyle = look.mark;
    line(ctx, sx - 2 * z, body - 2 * z, sx - 5 * z, body - 5 * z);
    line(ctx, sx + 2 * z, body - 2 * z, sx + 5 * z, body - 5 * z);
    ctx.strokeStyle = INK;
  } else if (n.kind === "troll" || n.kind === "harpy" || n.kind === "minotaur" || n.kind === "cyclops" || n.kind === "gorgon") {
    const folk = drawStickFolk(ctx, sx, sy, z, bob, sc, look.body);
    if (n.kind === "troll") {
      ctx.strokeStyle = TIMBER;
      ctx.lineWidth = 2 * z;
      line(ctx, sx + 6 * z, folk.shoulder, sx + 16 * z, sy - 2 * z);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.6 * z;
    } else if (n.kind === "harpy") {
      ctx.strokeStyle = look.mark;
      line(ctx, sx, folk.shoulder, sx - 14 * z, folk.shoulder - 8 * z);
      line(ctx, sx, folk.shoulder, sx + 14 * z, folk.shoulder - 8 * z);
      line(ctx, sx - 14 * z, folk.shoulder - 8 * z, sx - 8 * z, folk.shoulder - 2 * z);
      line(ctx, sx + 14 * z, folk.shoulder - 8 * z, sx + 8 * z, folk.shoulder - 2 * z);
      ctx.strokeStyle = INK;
    } else if (n.kind === "minotaur") {
      ctx.strokeStyle = look.mark;
      line(ctx, sx - 2 * z, folk.head - 3 * z, sx - 6 * z, folk.head - 9 * z);
      line(ctx, sx + 2 * z, folk.head - 3 * z, sx + 6 * z, folk.head - 9 * z);
      ctx.strokeStyle = INK;
    } else if (n.kind === "gorgon") {
      ctx.strokeStyle = look.mark;
      ctx.beginPath();
      ctx.moveTo(sx - 2 * z, folk.head - 2 * z);
      ctx.quadraticCurveTo(sx - 8 * z, folk.head - 8 * z, sx - 4 * z, folk.shoulder);
      ctx.moveTo(sx + 2 * z, folk.head - 2 * z);
      ctx.quadraticCurveTo(sx + 9 * z, folk.head - 7 * z, sx + 5 * z, folk.shoulder);
      ctx.stroke();
      ctx.strokeStyle = INK;
    }
  } else {
    const q = drawStickQuad(ctx, sx, sy, z, bob, sc, look.body);
    if (n.kind === "boar") {
      ctx.strokeStyle = look.mark;
      line(ctx, q.front + 4 * z, q.by - 2 * z, q.front + 9 * z, q.by + 1 * z);
      line(ctx, q.front + 4 * z, q.by - 4 * z, q.front + 9 * z, q.by - 1 * z);
      ctx.strokeStyle = INK;
    } else if (n.kind === "wolf") {
      line(ctx, q.back, q.by, q.back - 7 * z, q.by - 5 * z);
      line(ctx, q.front + 2 * z, q.by - 8 * z, q.front - 1 * z, q.by - 12 * z);
      line(ctx, q.front + 5 * z, q.by - 8 * z, q.front + 8 * z, q.by - 12 * z);
    }
  }
  if (n.ally && n.alive) {
    ctx.strokeStyle = "#2a5bd7";
    ctx.lineWidth = 1.5 * z;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * z, 12 * z, 4 * z, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (n.yield && n.alive) {
    ctx.fillStyle = "#e2b340";
    ctx.font = `700 ${8 * z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Yields", sx, sy - 30 * z);
  } else if (n.rare && n.alive) {
    ctx.fillStyle = "#e2b340";
    ctx.font = `700 ${8 * z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Rare", sx, sy - 30 * z);
  }
  const maxHp = n.rare ? stat.hp * 1.55 : stat.hp;
  if (n.hp < maxHp - 0.5) {
    ctx.fillStyle = "rgba(28,25,21,0.35)";
    ctx.fillRect(sx - 8 * z, sy - 32 * sc * z, 16 * z, 2.5 * z);
    ctx.fillStyle = "#c4502a";
    ctx.fillRect(sx - 8 * z, sy - 32 * sc * z, 16 * z * Math.max(0, Math.min(1, n.hp / maxHp)), 2.5 * z);
  }
}
function drawGear(ctx, realm, d, sx, sy) {
  const z = realm.zoom;
  const it = ITEMS[d.item];
  const bob = Math.sin(realm.time * 3 + sx) * 1.5 * z;
  ctx.fillStyle = "rgba(28,25,21,0.2)";
  ctx.beginPath();
  ctx.ellipse(sx, sy + 2 * z, 4 * z, 1.6 * z, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = it?.color || "#e2b340";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * z;
  ctx.beginPath();
  ctx.moveTo(sx, sy - 8 * z + bob);
  ctx.lineTo(sx + 4 * z, sy - 3 * z + bob);
  ctx.lineTo(sx, sy + 2 * z + bob);
  ctx.lineTo(sx - 4 * z, sy - 3 * z + bob);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
function drawBoss(ctx, realm, n, sx, sy, z) {
  const stat = BOSSES[n.kind];
  const bob = Math.abs(Math.sin(realm.time * 2.2 + n.x)) * 1.6 * z;
  const color = n.kind === "chief" ? "#3f7a4a" : n.kind === "brood" ? "#2a2438" : n.kind === "gore" ? "#6b3a28" : "#4a4e55";
  const sc = 1.45;
  if (!n.alive) {
    drawFallenStick(ctx, sx, sy, z, sc);
    return;
  }
  let crownY = sy - 28 * z - bob;
  if (n.kind === "brood") {
    const body = sy - 10 * z - bob;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8 * z;
    ctx.lineCap = "round";
    for (const [dx, dy] of [
      [-16, 4],
      [-12, 12],
      [-6, -8],
      [6, -8],
      [12, 12],
      [16, 4]
    ]) {
      line(ctx, sx, body, sx + dx * z, body + dy * z);
    }
    stickHead(ctx, sx, body, 5 * z);
    ctx.strokeStyle = "#d23b3b";
    line(ctx, sx - 3 * z, body - 3 * z, sx - 8 * z, body - 8 * z);
    line(ctx, sx + 3 * z, body - 3 * z, sx + 8 * z, body - 8 * z);
    crownY = body - 12 * z;
  } else if (n.kind === "chief") {
    const folk = drawStickFolk(ctx, sx, sy, z, bob, sc, color);
    ctx.strokeStyle = TIMBER;
    ctx.lineWidth = 2.4 * z;
    line(ctx, sx + 8 * z, folk.shoulder, sx + 22 * z, sy - 2 * z);
    ctx.lineWidth = 1.6 * z;
    crownY = folk.head - 8 * z;
  } else {
    const q = drawStickQuad(ctx, sx, sy, z, bob, sc, color);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.6 * z;
    if (n.kind === "gore") {
      ctx.strokeStyle = "#f3efe6";
      line(ctx, q.front + 6 * z, q.by - 2 * z, q.front + 13 * z, q.by + 2 * z);
      line(ctx, q.front + 6 * z, q.by - 5 * z, q.front + 13 * z, q.by - 1 * z);
    } else {
      line(ctx, q.back, q.by, q.back - 10 * z, q.by - 7 * z);
      line(ctx, q.front + 4 * z, q.by - 10 * z, q.front, q.by - 16 * z);
      line(ctx, q.front + 8 * z, q.by - 10 * z, q.front + 12 * z, q.by - 16 * z);
    }
    crownY = q.by - 16 * z;
  }
  ctx.fillStyle = "#e2b340";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.4 * z;
  ctx.beginPath();
  ctx.moveTo(sx - 4 * z, crownY);
  ctx.lineTo(sx, crownY - 7 * z);
  ctx.lineTo(sx + 4 * z, crownY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(28,25,21,0.35)";
  ctx.fillRect(sx - 14 * z, crownY - 6 * z, 28 * z, 3 * z);
  ctx.fillStyle = "#c4502a";
  ctx.fillRect(sx - 14 * z, crownY - 6 * z, 28 * z * Math.max(0, n.hp / stat.hp), 3 * z);
}
function drawDen(ctx, n, sx, sy, z) {
  const lair = n.lair || "alpha";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.5 * z;
  if (lair === "brood") {
    line(ctx, sx - 10 * z, sy, sx - 10 * z, sy - 16 * z);
    line(ctx, sx + 10 * z, sy, sx + 10 * z, sy - 16 * z);
    ctx.strokeStyle = "rgba(230,230,236,0.95)";
    for (const [x1, y1, x2, y2] of [
      [-10, -14, 10, -4],
      [-10, -8, 10, -14],
      [-10, -3, 0, -16],
      [0, -16, 10, -3],
      [-10, -16, 10, -16]
    ]) line(ctx, sx + x1 * z, sy + y1 * z, sx + x2 * z, sy + y2 * z);
    stickHead(ctx, sx - 3 * z, sy - 9 * z, 2.2 * z);
    stickHead(ctx, sx + 4 * z, sy - 7 * z, 1.8 * z);
    return;
  }
  if (lair === "gore") {
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 2 * z;
    ctx.beginPath();
    ctx.ellipse(sx, sy - 2 * z, 12 * z, 5 * z, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = TIMBER;
    ctx.lineWidth = 1.6 * z;
    line(ctx, sx - 11 * z, sy, sx - 6 * z, sy - 9 * z);
    line(ctx, sx + 4 * z, sy - 1 * z, sx + 12 * z, sy - 6 * z);
    ctx.strokeStyle = "#f3efe6";
    line(ctx, sx - 8 * z, sy - 1 * z, sx - 8 * z, sy - 8 * z);
    line(ctx, sx + 7 * z, sy - 1 * z, sx + 7 * z, sy - 8 * z);
    ctx.strokeStyle = INK;
    stickHead(ctx, sx - 8 * z, sy - 9 * z, 1.6 * z);
    stickHead(ctx, sx + 7 * z, sy - 9 * z, 1.6 * z);
    return;
  }
  if (lair === "chief") {
    ctx.fillStyle = "#c4a574";
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.moveTo(sx - 12 * z, sy);
    ctx.lineTo(sx + 4 * z, sy);
    ctx.lineTo(sx - 2 * z, sy - 14 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    line(ctx, sx + 8 * z, sy, sx + 8 * z, sy - 12 * z);
    ctx.strokeStyle = TIMBER;
    ctx.lineWidth = 2.2 * z;
    line(ctx, sx + 8 * z, sy - 10 * z, sx + 16 * z, sy - 2 * z);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4 * z;
    ctx.beginPath();
    ctx.arc(sx - 8 * z, sy - 2 * z, 2.4 * z, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  ctx.strokeStyle = TIMBER;
  ctx.lineWidth = 1.6 * z;
  line(ctx, sx - 12 * z, sy, sx - 8 * z, sy - 12 * z);
  line(ctx, sx - 8 * z, sy - 12 * z, sx + 8 * z, sy - 12 * z);
  line(ctx, sx + 8 * z, sy - 12 * z, sx + 12 * z, sy);
  line(ctx, sx - 4 * z, sy, sx - 2 * z, sy - 8 * z);
  line(ctx, sx + 5 * z, sy, sx + 2 * z, sy - 9 * z);
  ctx.fillStyle = "#1c1915";
  ctx.beginPath();
  ctx.ellipse(sx, sy - 5 * z, 5 * z, 3.2 * z, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f7f1e4";
  line(ctx, sx - 7 * z, sy - 1 * z, sx - 3 * z, sy - 4 * z);
  line(ctx, sx - 3 * z, sy - 1 * z, sx - 7 * z, sy - 4 * z);
  ctx.strokeStyle = INK;
}
function drawNode(ctx, realm, n, sx, sy) {
  const z = realm.zoom;
  ctx.lineWidth = 1.6 * z;
  ctx.strokeStyle = INK;
  ctx.lineJoin = "round";
  if (n.kind === "den") {
    drawDen(ctx, n, sx, sy, z);
    return;
  }
  if (n.kind === "tree") {
    ctx.fillStyle = "rgba(20,24,16,0.18)";
    ctx.beginPath();
    ctx.ellipse(sx + 2 * z, sy + 2 * z, 8 * z, 3 * z, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = WOOD;
    ctx.fillRect(sx - 2.4 * z, sy - 12 * z, 4.8 * z, 14 * z);
    ctx.strokeRect(sx - 2.4 * z, sy - 12 * z, 4.8 * z, 14 * z);
    ctx.fillStyle = "#a56b3e";
    ctx.fillRect(sx - 1 * z, sy - 11 * z, 1.4 * z, 12 * z);
    if (n.amount <= 0) return;
    const scale = 0.55 + 0.45 * (n.amount / n.max);
    ctx.fillStyle = "#24632c";
    ctx.beginPath();
    ctx.arc(sx + 3 * z, sy - 16 * z * scale, 10 * z * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#2f7a34";
    ctx.beginPath();
    ctx.arc(sx - 2 * z, sy - 20 * z * scale, 12 * z * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#49a24c";
    ctx.beginPath();
    ctx.arc(sx - 5 * z, sy - 24 * z * scale, 6 * z * scale, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (n.kind === "berry") {
    ctx.fillStyle = "#2f7a34";
    ctx.beginPath();
    ctx.arc(sx, sy - 8 * z, 11 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#d23b3b";
    for (const [ox, oy] of [
      [-4, -10],
      [3, -12],
      [0, -6],
      [5, -7]
    ]) {
      ctx.beginPath();
      ctx.arc(sx + ox * z, sy + oy * z, 1.7 * z, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  if (BOSSES[n.kind]) {
    drawBoss(ctx, realm, n, sx, sy, z);
    return;
  }
  if (n.kind === "nest") {
    ctx.strokeStyle = TIMBER;
    ctx.lineWidth = 1.5 * z;
    ctx.lineCap = "round";
    for (const [x1, y1, x2, y2] of [
      [-12, 0, -2, -10],
      [11, 1, 1, -9],
      [-8, 1, 6, -8],
      [-2, 0, 8, -6]
    ]) {
      line(ctx, sx + x1 * z, sy + y1 * z, sx + x2 * z, sy + y2 * z);
    }
    ctx.strokeStyle = INK;
    stickHead(ctx, sx - 3 * z, sy - 8 * z, 2.4 * z);
    stickHead(ctx, sx + 3 * z, sy - 7 * z, 2.4 * z);
    if (n.hp < 90) {
      ctx.fillStyle = "rgba(28,25,21,0.35)";
      ctx.fillRect(sx - 10 * z, sy - 20 * z, 20 * z, 2.5 * z);
      ctx.fillStyle = "#c4502a";
      ctx.fillRect(sx - 10 * z, sy - 20 * z, 20 * z * Math.max(0, n.hp / 90), 2.5 * z);
    }
    return;
  }
  if (n.kind === "cart") {
    ctx.fillStyle = "#8a5a32";
    ctx.fillRect(sx - 10 * z, sy - 8 * z, 20 * z, 8 * z);
    ctx.strokeRect(sx - 10 * z, sy - 8 * z, 20 * z, 8 * z);
    ctx.fillStyle = "#e2b340";
    ctx.beginPath();
    ctx.arc(sx + 4 * z, sy - 11 * z, 4 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1c1915";
    ctx.beginPath();
    ctx.arc(sx - 6 * z, sy, 2.4 * z, 0, Math.PI * 2);
    ctx.arc(sx + 6 * z, sy, 2.4 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e2b340";
    ctx.font = `700 ${8 * z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("Treasure", sx, sy - 18 * z);
    if (n.hp < 28) {
      ctx.fillStyle = "rgba(28,25,21,0.35)";
      ctx.fillRect(sx - 10 * z, sy - 16 * z, 20 * z, 2.5 * z);
      ctx.fillStyle = "#c4502a";
      ctx.fillRect(sx - 10 * z, sy - 16 * z, 20 * z * Math.max(0, n.hp / 28), 2.5 * z);
    }
    return;
  }
  if (n.kind === "sheep") {
    if (!n.alive) {
      drawFallenStick(ctx, sx, sy, z, 0.9);
      return;
    }
    const hop = Math.abs(Math.sin(realm.time * 4 + n.x)) * 1.5 * z;
    drawStickQuad(ctx, sx, sy, z, hop, 0.85, "#f7f4ee");
    if (n.hp < 15) {
      ctx.fillStyle = "rgba(28,25,21,0.35)";
      ctx.fillRect(sx - 8 * z, sy - 24 * z, 16 * z, 2.5 * z);
      ctx.fillStyle = "#c4502a";
      ctx.fillRect(sx - 8 * z, sy - 24 * z, 16 * z * Math.max(0, n.hp / 15), 2.5 * z);
    }
    return;
  }
  if (n.kind === "lion") {
    if (!n.alive) {
      drawFallenStick(ctx, sx, sy, z, 1);
      return;
    }
    const prowl = Math.abs(Math.sin(realm.time * 3 + n.x)) * 1.2 * z;
    const q = drawStickQuad(ctx, sx, sy, z, prowl, 1, "#c4893a");
    ctx.strokeStyle = "#a86428";
    ctx.lineWidth = 1.4 * z;
    line(ctx, q.front + 2 * z, q.by - 8 * z, q.front - 2 * z, q.by - 14 * z);
    line(ctx, q.front + 5 * z, q.by - 9 * z, q.front + 5 * z, q.by - 15 * z);
    line(ctx, q.front + 8 * z, q.by - 8 * z, q.front + 11 * z, q.by - 13 * z);
    line(ctx, q.back, q.by, q.back - 8 * z, q.by - 4 * z);
    ctx.strokeStyle = INK;
    if (n.hp < 36) {
      ctx.fillStyle = "rgba(28,25,21,0.35)";
      ctx.fillRect(sx - 8 * z, sy - 26 * z, 16 * z, 2.5 * z);
      ctx.fillStyle = "#c4502a";
      ctx.fillRect(sx - 8 * z, sy - 26 * z, 16 * z * Math.max(0, n.hp / 36), 2.5 * z);
    }
    return;
  }
  if (MONSTER_LOOK[n.kind]) {
    drawBeast(ctx, realm, n, sx, sy, z);
    return;
  }
  if (n.kind === "fish") {
    const bob = Math.sin(realm.time * 3 + n.x) * 2 * z;
    const y = sy - 2 * z + bob;
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(sx, sy + bob, 9 * z, 3 * z, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5 * z;
    ctx.lineCap = "round";
    line(ctx, sx - 6 * z, y, sx + 5 * z, y);
    line(ctx, sx - 6 * z, y, sx - 11 * z, y - 3 * z);
    line(ctx, sx - 6 * z, y, sx - 11 * z, y + 3 * z);
    stickHead(ctx, sx + 6 * z, y, 2.2 * z);
  }
}
function drawBuilding(ctx, realm, b) {
  const def = BLDS[b.kind];
  const z = realm.zoom;
  const mid = realm.worldToScreen(b.x + def.w / 2, b.y + def.h / 2);
  const scale = b.kind === "tower" ? 0.7 : b.kind === "townhall" ? 0.4 : b.kind === "farm" ? 0.55 : b.kind === "barracks" || b.kind === "range" ? 0.4 : 0.4;
  const shrink = (p) => ({
    sx: mid.sx + (p.sx - mid.sx) * scale,
    sy: mid.sy + (p.sy - mid.sy) * scale
  });
  const n = shrink(realm.worldToScreen(b.x - 0.5, b.y - 0.5));
  const e = shrink(realm.worldToScreen(b.x + def.w - 0.5, b.y - 0.5));
  const s = shrink(realm.worldToScreen(b.x + def.w - 0.5, b.y + def.h - 0.5));
  const wv = shrink(realm.worldToScreen(b.x - 0.5, b.y + def.h - 0.5));
  const age = realm.age[b.team] ?? 0;
  const mageTower = b.kind === "tower" && realm.hasSchool(b.team);
  const liftBase = b.kind === "tower" ? mageTower ? 78 : 52 : b.kind === "school" ? 130 : b.kind === "temple" ? 72 : b.kind === "townhall" ? age >= 4 ? 64 : age >= 1 ? 52 : 26 : b.kind === "farm" ? 0 : 24;
  const lift = (b.progress < 1 ? liftBase * (0.4 + 0.6 * b.progress) : liftBase) * z;
  const up = (p) => ({ sx: p.sx, sy: p.sy - lift });
  const team = teamColor(b.team, realm);
  const dynasty = dynastySide(realm, b.team);
  const coven = covenSide(realm, b.team);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 1.4 * z;
  ctx.strokeStyle = INK;
  if (b.kind === "wall") {
    const gn = realm.worldToScreen(b.x, b.y);
    const ge = realm.worldToScreen(b.x + 1, b.y);
    const gs = realm.worldToScreen(b.x + 1, b.y + 1);
    const gw = realm.worldToScreen(b.x, b.y + 1);
    drawPalisade(ctx, gn, ge, gs, gw, z, b.hit > 0, b.progress);
    const burn = b.progress >= 1 ? flameLevel(b.hp, realm.bldMax(b.kind, b.team)) : 0;
    if (burn) drawFlames(ctx, mid.sx, mid.sy - 14 * z, z, burn, realm.time);
    drawStatusBar(ctx, mid.sx, mid.sy - 18 * z, 16 * z, z, statusFill(b, realm));
    return;
  }
  ctx.save();
  ctx.translate(2 * z, 6 * z);
  poly(ctx, [n, e, s, wv]);
  ctx.fillStyle = "rgba(20,16,12,0.28)";
  ctx.fill();
  ctx.restore();
  if (b.progress < 1) drawFoot(ctx, realm, b.x, b.y, def.w, def.h, "rgba(196,146,18,0.22)");
  poly(ctx, [n, e, s, wv]);
  ctx.fillStyle = "rgba(28,25,21,0.12)";
  ctx.fill();
  const look = BUILD_LOOK[b.kind] ?? BUILD_LOOK.house;
  const wallColor = b.kind === "temple" ? "#f7f3ea" : mageTower ? "#6d4ea3" : dynasty ? "#f4ead2" : coven ? "#f3eefe" : egyptSide(realm, b.team) ? "#e6d3a1" : look.wall;
  const roofColor = b.kind === "temple" ? team : mageTower ? "#3c2468" : dynasty ? "#8e1c2c" : coven ? "#3a2266" : egyptSide(realm, b.team) ? "#c4a15a" : look.roof;
  if (b.kind === "farm") {
    drawFarm(ctx, realm, b, n, e, s, wv, z, team);
  } else if (b.progress < 1) {
    drawFrame(ctx, n, e, s, wv, up, z, b.progress);
  } else if (b.kind === "tower") {
    drawTower(ctx, n, e, s, wv, up, z, b.hit > 0, wallColor, mageTower ? 3 : 2, mageTower, realm.time);
  } else if (b.kind === "crypt") {
    drawTower(ctx, n, e, s, wv, up, z, b.hit > 0, "#241c2e", 2, false, realm.time);
    const top = roofMiddle([up(n), up(e), up(s), up(wv)]);
    const glow = ctx.createRadialGradient(top.sx, top.sy - 10 * z, 0, top.sx, top.sy - 10 * z, 16 * z);
    glow.addColorStop(0, "rgba(150, 90, 220, 0.85)");
    glow.addColorStop(1, "rgba(150, 90, 220, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 10 * z, 16 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4efe4";
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 18 * z, 3.2 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#1a1420";
    ctx.beginPath();
    ctx.arc(top.sx - 1.1 * z, top.sy - 18.4 * z, 0.6 * z, 0, Math.PI * 2);
    ctx.arc(top.sx + 1.1 * z, top.sy - 18.4 * z, 0.6 * z, 0, Math.PI * 2);
    ctx.fill();
  } else if (b.kind === "school") {
    const cx = b.x + def.w / 2 - 0.5;
    const cy = b.y + def.h / 2 - 0.5;
    const side = 1.15;
    const fit = (p) => ({
      sx: mid.sx + (p.sx - mid.sx) * 0.72,
      sy: mid.sy + (p.sy - mid.sy) * 0.72
    });
    drawSchool(
      ctx,
      fit(realm.worldToScreen(cx - side, cy - side)),
      fit(realm.worldToScreen(cx + side, cy - side)),
      fit(realm.worldToScreen(cx + side, cy + side)),
      fit(realm.worldToScreen(cx - side, cy + side)),
      up,
      z,
      b.hit > 0,
      realm.time
    );
  } else {
    drawHut(ctx, n, e, s, wv, up, z, b.hit > 0, b.kind === "townhall", age, b.kind, realm.time, wallColor, roofColor, team);
    if (dynasty && b.kind !== "tower" && b.kind !== "school") drawEaves(ctx, [up(n), up(e), up(s), up(wv)], z);
  }
  if (b.progress >= 1 && b.kind !== "farm" && b.kind !== "crypt") {
    const top = b.kind === "tower" || b.kind === "townhall" || b.kind === "school" ? roofMiddle([up(n), up(e), up(s), up(wv)]) : hutApex([up(n), up(e), up(s), up(wv)], 7, z);
    const pole = b.kind === "school" ? { sx: top.sx, sy: top.sy - 36 * z } : b.kind === "tower" || b.kind === "townhall" ? { sx: top.sx, sy: top.sy - 16 * z } : top;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.3 * z;
    ctx.beginPath();
    ctx.moveTo(pole.sx, pole.sy);
    ctx.lineTo(pole.sx, pole.sy - 14 * z);
    ctx.stroke();
    ctx.fillStyle = team;
    ctx.beginPath();
    ctx.moveTo(pole.sx, pole.sy - 14 * z);
    ctx.lineTo(pole.sx + 8 * z, pole.sy - 10 * z);
    ctx.lineTo(pole.sx, pole.sy - 6 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (coven) {
      const pulse = 1.6 + Math.sin(realm.time * 3) * 0.35;
      ctx.fillStyle = "#d9ccff";
      ctx.beginPath();
      ctx.arc(pole.sx, pole.sy - 16 * z, pulse * z, 0, Math.PI * 2);
      ctx.fill();
    }
    if (egyptSide(realm, b.team) && (b.kind === "townhall" || b.kind === "temple")) drawSunDisk(ctx, pole.sx, pole.sy - 28 * z, z);
  }
  if (b.progress >= 1) {
    const burn = flameLevel(b.hp, realm.bldMax(b.kind, b.team));
    if (burn) {
      const top = b.kind === "tower" || b.kind === "townhall" || b.kind === "school" ? roofMiddle([up(n), up(e), up(s), up(wv)]) : hutApex([up(n), up(e), up(s), up(wv)], b.kind === "farm" ? 2 : 7, z);
      drawFlames(ctx, top.sx, top.sy + 8 * z, z, burn, realm.time);
    }
  }
  if (b.progress >= 1 && b.kind === "townhall") {
    const pole = realm.worldToScreen(b.x + def.w + 0.35, b.y + def.h * 0.62);
    drawCampBanner(ctx, pole.sx, pole.sy, z, team, dynasty);
  }
  drawStatusBar(ctx, mid.sx, mid.sy - lift - 10 * z, 22 * z, z, statusFill(b, realm));
}
function statusFill(b, realm) {
  const maxHp = realm.bldMax(b.kind, b.team);
  const age = realm.age[b.team] ?? 0;
  if (b.progress < 1) return { ratio: b.progress, color: "#3d9a45" };
  if (b.kind === "townhall" && b.ageT > 0) {
    const total = age <= 0 ? AGE_TIME : age === 1 ? AGE3_TIME : age === 2 ? AGE4_TIME : AGE5_TIME;
    return { ratio: Math.max(0, Math.min(1, 1 - b.ageT / total)), color: "#3d9a45" };
  }
  if (b.queue.length) {
    const total = UNITS[b.queue[0]]?.time || 1;
    return { ratio: Math.max(0, Math.min(1, 1 - b.trainT / total)), color: "#d24a32" };
  }
  if (b.hp < maxHp - 0.5) {
    return { ratio: Math.max(0, b.hp / maxHp), color: teamColor(b.team, realm) };
  }
  return null;
}
function drawStatusBar(ctx, sx, sy, barW, z, fill) {
  if (!fill) return;
  const action = fill.color === "#3d9a45" || fill.color === "#d24a32";
  const w = action ? barW * 2 : barW;
  const h = (action ? 6 : 3) * z;
  const top = action ? sy - 3 * z : sy;
  ctx.fillStyle = "rgba(28,25,21,0.35)";
  ctx.fillRect(sx - w / 2, top, w, h);
  ctx.fillStyle = fill.color;
  ctx.fillRect(sx - w / 2, top, w * fill.ratio, h);
}
function flameLevel(hp, max) {
  if (max <= 0 || hp >= max - 0.5) return 0;
  const missing = Math.min(1, Math.max(0, 1 - hp / max));
  return 1 + Math.min(4, Math.floor(missing / 0.2));
}
function drawFlames(ctx, sx, sy, z, level, time) {
  const count = Math.min(5, level);
  const h = (5 + level * 3.2) * z;
  const w = (2.2 + level * 0.7) * z;
  for (let i = 0; i < count; i++) {
    const ox = (i - (count - 1) / 2) * (3.2 + level * 0.8) * z;
    const flick = Math.sin(time * 11 + i * 1.7) * 1.6 * z;
    ctx.fillStyle = i % 2 === 0 ? "#f25a1a" : "#ffb020";
    ctx.beginPath();
    ctx.moveTo(sx + ox - w * 0.45, sy);
    ctx.quadraticCurveTo(sx + ox - w, sy - h * 0.55 + flick, sx + ox, sy - h + flick);
    ctx.quadraticCurveTo(sx + ox + w, sy - h * 0.5, sx + ox + w * 0.45, sy);
    ctx.closePath();
    ctx.fill();
  }
}
function drawCampBanner(ctx, sx, sy, z, team, dynasty) {
  const top = sy - 38 * z;
  const bar = top + 10 * z;
  ctx.strokeStyle = INK;
  ctx.fillStyle = "#6b4630";
  ctx.lineWidth = 1.7 * z;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx, top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx - 3 * z, bar);
  ctx.lineTo(sx + 16 * z, bar);
  ctx.stroke();
  ctx.fillStyle = team;
  ctx.fillRect(sx + 1.5 * z, bar, 13 * z, 16 * z);
  ctx.strokeRect(sx + 1.5 * z, bar, 13 * z, 16 * z);
  if (dynasty) {
    ctx.fillStyle = "#e2b340";
    ctx.beginPath();
    ctx.arc(sx + 8 * z, bar + 8 * z, 3.2 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (team === "#6d3fa8") {
    ctx.fillStyle = "#d9ccff";
    ctx.beginPath();
    ctx.arc(sx + 8 * z, bar + 8 * z, 2.6 * z, 0, Math.PI * 2);
    ctx.fill();
  }
}
function drawPalisade(ctx, n, e, s, wv, z, hit, progress) {
  const h = (16 + 20 * progress) * z;
  ctx.lineCap = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.3 * z;
  const at = (t) => ({
    sx: wv.sx + (s.sx - wv.sx) * t,
    sy: wv.sy + (s.sy - wv.sy) * t
  });
  ctx.strokeStyle = hit ? "#e7b2a4" : TIMBER;
  ctx.beginPath();
  ctx.moveTo(at(0.12).sx, at(0.12).sy - h * 0.55);
  ctx.lineTo(at(0.88).sx, at(0.88).sy - h * 0.55);
  ctx.stroke();
  ctx.strokeStyle = INK;
  for (const t of [0.18, 0.42, 0.66, 0.88]) {
    const p = at(t);
    ctx.fillStyle = hit ? "#e7b2a4" : BUILD_LOOK.wall.wall;
    ctx.fillRect(p.sx - 1.6 * z, p.sy - h, 3.2 * z, h);
    ctx.strokeRect(p.sx - 1.6 * z, p.sy - h, 3.2 * z, h);
  }
}
function drawEaves(ctx, corners, z) {
  const c = roofMiddle(corners);
  ctx.strokeStyle = "#e2b340";
  ctx.lineWidth = 1.5 * z;
  ctx.lineCap = "round";
  for (const p of corners) {
    const dx = p.sx - c.sx;
    const dy = p.sy - c.sy;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    ctx.beginPath();
    ctx.moveTo(p.sx - ux * 7 * z, p.sy - uy * 3 * z);
    ctx.quadraticCurveTo(p.sx + ux * 2 * z, p.sy + uy * 3 * z, p.sx + ux * 8 * z, p.sy - 6 * z);
    ctx.stroke();
  }
}
function drawNemes(ctx, x, y, z, kind) {
  const royal = kind === "hero" || kind === "god" || kind === "avatar" || kind === "demigod";
  ctx.save();
  ctx.lineWidth = 1.15 * z;
  ctx.strokeStyle = INK;
  ctx.fillStyle = royal ? "#e2b340" : "#1a4f7a";
  ctx.beginPath();
  ctx.moveTo(x - 6 * z, y - 1.2 * z);
  ctx.quadraticCurveTo(x, y - 11 * z, x + 6 * z, y - 1.2 * z);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillRect(x - 6.5 * z, y - 1.5 * z, 2 * z, 8 * z);
  ctx.fillRect(x + 4.5 * z, y - 1.5 * z, 2 * z, 8 * z);
  ctx.strokeRect(x - 6.5 * z, y - 1.5 * z, 2 * z, 8 * z);
  ctx.strokeRect(x + 4.5 * z, y - 1.5 * z, 2 * z, 8 * z);
  ctx.fillStyle = "#e2b340";
  ctx.fillRect(x - 5 * z, y - 4.4 * z, 10 * z, 1.3 * z);
  ctx.restore();
}
function drawSunDisk(ctx, x, y, z) {
  ctx.save();
  ctx.strokeStyle = "#e2b340";
  ctx.fillStyle = "#f2d36b";
  ctx.lineWidth = 1.2 * z;
  ctx.beginPath();
  ctx.arc(x, y, 2.3 * z, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    line(ctx, x + Math.cos(a) * 3.1 * z, y + Math.sin(a) * 3.1 * z, x + Math.cos(a) * 5 * z, y + Math.sin(a) * 5 * z);
  }
  ctx.restore();
}
function drawKhopesh(ctx, x, y, s, z, swing) {
  const ang = swing ? 0.85 : -1.05;
  const hx = x + Math.cos(ang) * s * 2.4 * z;
  const hy = y + Math.sin(ang) * 2.4 * z;
  ctx.strokeStyle = "#6b4630";
  ctx.lineWidth = 1.5 * z;
  line(ctx, x, y, hx, hy);
  ctx.fillStyle = "#e7eef3";
  ctx.strokeStyle = "#e2b340";
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.quadraticCurveTo(hx + s * 7 * z, hy - 9 * z, hx + s * 3 * z, hy + 7 * z);
  ctx.quadraticCurveTo(hx + s * 0.6 * z, hy + 1.2 * z, hx, hy);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * z;
}
function drawChariot(ctx, sx, sy, dir, z) {
  const s = dir;
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.3 * z;
  ctx.fillStyle = "#3e342f";
  ctx.beginPath();
  ctx.ellipse(sx - s * 5 * z, sy, 3.1 * z, 1.5 * z, 0, 0, Math.PI * 2);
  ctx.ellipse(sx + s * 5 * z, sy, 3.1 * z, 1.5 * z, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#6b4630";
  ctx.lineWidth = 2 * z;
  line(ctx, sx - s * 6 * z, sy - 5 * z, sx + s * 6 * z, sy - 5 * z);
  ctx.strokeStyle = "#e2b340";
  ctx.lineWidth = 1.4 * z;
  line(ctx, sx - s * 4 * z, sy - 5 * z, sx - s * 4 * z, sy - 11 * z);
  line(ctx, sx + s * 3 * z, sy - 5 * z, sx + s * 3 * z, sy - 11 * z);
  line(ctx, sx - s * 4 * z, sy - 11 * z, sx + s * 3 * z, sy - 11 * z);
  ctx.restore();
}
function drawDynastyHat(ctx, x, y, z, kind) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * z;
  if (kind === "villager" || kind === "spear") {
    ctx.fillStyle = "#e2c98a";
    ctx.beginPath();
    ctx.moveTo(x, y - 10 * z);
    ctx.lineTo(x - 7.5 * z, y - 2 * z);
    ctx.lineTo(x + 7.5 * z, y - 2 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  ctx.fillStyle = "#1c1915";
  ctx.fillRect(x - 6.5 * z, y - 8.5 * z, 13 * z, 3.2 * z);
  ctx.strokeRect(x - 6.5 * z, y - 8.5 * z, 13 * z, 3.2 * z);
  ctx.fillStyle = "#e2b340";
  ctx.fillRect(x - 6.5 * z, y - 5.6 * z, 13 * z, 1.1 * z);
  line(ctx, x - 6.5 * z, y - 7 * z, x - 11 * z, y - 9 * z);
  line(ctx, x + 6.5 * z, y - 7 * z, x + 11 * z, y - 9 * z);
}
function drawDeityMark(ctx, x, y, z, role, tier) {
  ctx.save();
  ctx.lineWidth = 1.3 * z;
  ctx.strokeStyle = INK;
  if (role === "heal") {
    ctx.strokeStyle = "#e2b340";
    ctx.beginPath();
    ctx.arc(x, y - 1.5 * z, (6.2 + tier) * z, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else if (role === "curse") {
    ctx.strokeStyle = "#6a1020";
    ctx.lineWidth = 1.7 * z;
    line(ctx, x - 3 * z, y - 3 * z, x - (5 + tier) * z, y - (8 + tier) * z);
    line(ctx, x + 3 * z, y - 3 * z, x + (5 + tier) * z, y - (8 + tier) * z);
  } else if (role === "bless") {
    ctx.fillStyle = "#e2b340";
    ctx.beginPath();
    ctx.arc(x, y - (9 + tier) * z, (1.3 + tier * 0.35) * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = "#d9ccff";
    ctx.beginPath();
    ctx.arc(x, y - (10 + tier) * z, (1.5 + tier * 0.4) * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
function drawCovenHood(ctx, x, y, z) {
  ctx.fillStyle = "#4a2a72";
  ctx.beginPath();
  ctx.moveTo(x, y - 12 * z);
  ctx.lineTo(x - 6.5 * z, y + 1 * z);
  ctx.lineTo(x + 6.5 * z, y + 1 * z);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e4d8ff";
  ctx.beginPath();
  ctx.arc(x, y - 11 * z, 1.5 * z, 0, Math.PI * 2);
  ctx.fill();
}
function hutApex(eaves, rise, z) {
  const n = eaves.length || 1;
  return {
    sx: eaves.reduce((sum, p) => sum + p.sx, 0) / n,
    sy: eaves.reduce((sum, p) => sum + p.sy, 0) / n - rise * z
  };
}
function drawHutRoof(ctx, eaves, peak, z, hit, roofColor) {
  const faces = eaves.map((a, i) => {
    const b = eaves[(i + 1) % eaves.length];
    return { a, b, depth: (a.sy + b.sy) / 2 };
  });
  faces.sort((p, q) => p.depth - q.depth);
  const cy = eaves.reduce((sum, p) => sum + p.sy, 0) / eaves.length;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * z;
  for (const face of faces) {
    const back = face.depth < cy;
    poly(ctx, [face.a, face.b, peak]);
    ctx.fillStyle = hit ? "#e7b2a4" : back ? darken(roofColor) : roofColor;
    ctx.fill();
    ctx.stroke();
  }
}
function roofMiddle(eaves) {
  const n = eaves.length || 1;
  return {
    sx: eaves.reduce((sum, p) => sum + p.sx, 0) / n,
    sy: eaves.reduce((sum, p) => sum + p.sy, 0) / n
  };
}
function drawWing(ctx, a, b, center, z, hit, wall, roof, height, t0 = 0.28, t1 = 0.72) {
  const dx = b.sx - a.sx;
  const dy = b.sy - a.sy;
  const alongX = Math.abs(dx + dy * 0.5);
  const alongY = Math.abs(-dx + dy * 0.5);
  let px = alongX >= alongY ? -1 : 1;
  let py = 0.5;
  const plen = Math.hypot(px, py) || 1;
  px /= plen;
  py /= plen;
  const mx = (a.sx + b.sx) / 2;
  const my = (a.sy + b.sy) / 2;
  if ((mx - center.sx) * px + (my - center.sy) * py < 0) {
    px = -px;
    py = -py;
  }
  const span = Math.hypot(dx, dy) || 1;
  const out = span * 0.55;
  const a0 = lerpPt(a, b, t0);
  const b0 = lerpPt(a, b, t1);
  const a1 = { sx: a0.sx + px * out, sy: a0.sy + py * out };
  const b1 = { sx: b0.sx + px * out, sy: b0.sy + py * out };
  const upP = (p) => ({ sx: p.sx, sy: p.sy - height });
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * z;
  const faces = [
    { pts: [a0, a1, upP(a1), upP(a0)], depth: (a0.sy + a1.sy) / 2 },
    { pts: [b0, b1, upP(b1), upP(b0)], depth: (b0.sy + b1.sy) / 2 },
    { pts: [a1, b1, upP(b1), upP(a1)], depth: (a1.sy + b1.sy) / 2 }
  ];
  faces.sort((p, q) => p.depth - q.depth);
  for (const face of faces) {
    poly(ctx, face.pts);
    ctx.fillStyle = hit ? "#e7b2a4" : face.depth > (a0.sy + b0.sy) / 2 ? darken(wall) : wall;
    ctx.fill();
    ctx.stroke();
  }
  poly(ctx, [upP(a0), upP(b0), upP(b1), upP(a1)]);
  ctx.fillStyle = hit ? "#e7b2a4" : roof;
  ctx.fill();
  ctx.stroke();
}
function drawTorches(ctx, s, e, upS, upE, z, time) {
  ctx.lineWidth = 1.2 * z;
  for (const t of [0.16, 0.8]) {
    const foot = lerpPt(s, e, t);
    const head = lerpPt(upS, upE, t);
    const base = lerpPt(foot, head, 0.42);
    const top = { sx: base.sx, sy: base.sy - 8 * z };
    ctx.strokeStyle = TIMBER;
    line(ctx, base.sx, base.sy, top.sx, top.sy);
    const flick = Math.sin(time * 9 + t * 8) * 1.1 * z;
    ctx.fillStyle = "#f25a1a";
    ctx.beginPath();
    ctx.moveTo(top.sx - 1.7 * z, top.sy);
    ctx.quadraticCurveTo(top.sx - 2.6 * z, top.sy - 3 * z + flick, top.sx, top.sy - 6 * z + flick);
    ctx.quadraticCurveTo(top.sx + 2.6 * z, top.sy - 2.6 * z, top.sx + 1.7 * z, top.sy);
    ctx.fill();
    ctx.fillStyle = "#ffe08a";
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 2.2 * z, 1.1 * z, 0, Math.PI * 2);
    ctx.fill();
  }
}
function drawCrystalTorches(ctx, s, e, upS, upE, z, time) {
  ctx.lineWidth = 1.2 * z;
  for (const t of [0.16, 0.8]) {
    const foot = lerpPt(s, e, t);
    const head = lerpPt(upS, upE, t);
    const base = lerpPt(foot, head, 0.42);
    const top = { sx: base.sx, sy: base.sy - 8 * z };
    const pulse = 0.85 + Math.sin(time * 4 + t * 6) * 0.15;
    ctx.strokeStyle = TIMBER;
    line(ctx, base.sx, base.sy, top.sx, top.sy);
    ctx.fillStyle = `rgba(90, 150, 255, ${0.28 * pulse})`;
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 2.4 * z, 5.2 * z * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7eb6ff";
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 2.4 * z, 2.4 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eef6ff";
    ctx.beginPath();
    ctx.arc(top.sx - 0.6 * z, top.sy - 3.1 * z, 0.8 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 2.4 * z, 2.4 * z, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function drawSideMark(ctx, a, b, upA, upB, z, kind, tint) {
  const c = lerpPt(lerpPt(a, b, 0.55), lerpPt(upA, upB, 0.55), 0.45);
  ctx.save();
  ctx.translate(c.sx, c.sy);
  ctx.scale(z, z);
  ctx.strokeStyle = INK;
  ctx.fillStyle = "#efe6d2";
  ctx.lineWidth = 1.25;
  ctx.lineCap = "round";
  const magic = tint === "#6d3fa8";
  if (kind === "keep") {
    ctx.strokeStyle = "#6e2c2a";
    ctx.lineWidth = 1.3;
    line(ctx, 0, 3.2, 0, -4.2);
    ctx.fillStyle = tint || "#2a5bd7";
    ctx.beginPath();
    ctx.moveTo(0, -4.2);
    ctx.lineTo(5.2, -2.6);
    ctx.lineTo(0, -1.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (kind === "shop") {
    ctx.fillStyle = "#e2b340";
    ctx.beginPath();
    ctx.arc(0, 0, 3.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = "700 4.2px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("G", 0, 1.5);
    ctx.restore();
    return;
  }
  if (kind === "altar") {
    ctx.fillStyle = "#e2b340";
    ctx.beginPath();
    ctx.moveTo(0, -3.2);
    ctx.lineTo(2.2, 0);
    ctx.lineTo(0, 3.2);
    ctx.lineTo(-2.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (kind === "temple") {
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.4;
    line(ctx, 0, 4, 0, -2.4);
    ctx.fillStyle = tint || "#c6a15a";
    ctx.beginPath();
    ctx.arc(0, -3.6, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (kind === "yard") {
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.5;
    line(ctx, -4, 2, 3, 2);
    line(ctx, 3, 2, 5, -3);
    ctx.fillStyle = tint || "#8a6a45";
    ctx.beginPath();
    ctx.arc(5, -3.4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (kind === "barracks") {
    if (magic) {
      ctx.strokeStyle = "#6b4630";
      ctx.lineWidth = 1.5;
      line(ctx, 0, 3.4, 0, -2.2);
      ctx.fillStyle = "#d9ccff";
      ctx.beginPath();
      ctx.arc(0, -3.3, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.stroke();
    } else {
    ctx.fillStyle = "#d5dde6";
    ctx.strokeStyle = "#8e99a6";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-1.1, -0.7);
    ctx.lineTo(4.4, -0.55);
    ctx.lineTo(5.8, 0);
    ctx.lineTo(4.4, 0.55);
    ctx.lineTo(-1.1, 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#c5ced8";
    ctx.beginPath();
    ctx.moveTo(-1.7, -1.7);
    ctx.lineTo(-0.6, -1.7);
    ctx.lineTo(-0.6, 1.7);
    ctx.lineTo(-1.7, 1.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.7;
    line(ctx, -2.1, 0, -4.3, 0);
    }
  } else if (kind === "range") {
    if (magic) {
      ctx.strokeStyle = "#6b4630";
      ctx.lineWidth = 1.5;
      line(ctx, -1.2, 3.2, 0.6, -2.4);
      ctx.fillStyle = "#9fd4f0";
      ctx.beginPath();
      ctx.arc(0.8, -3.4, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.stroke();
    } else {
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-3.6, -4.1);
    ctx.quadraticCurveTo(-0.2, 0, -3.6, 4.1);
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 0.85;
    line(ctx, -3.6, -4.1, -3.6, 4.1);
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.25;
    line(ctx, 1.5, 3.4, 1.5, -1.6);
    ctx.fillStyle = "#d5dde6";
    ctx.beginPath();
    ctx.moveTo(1.5, -3.5);
    ctx.lineTo(0.35, -1.5);
    ctx.lineTo(2.65, -1.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1;
    ctx.stroke();
    line(ctx, 1.5, 3.4, 0.45, 2.3);
    line(ctx, 1.5, 3.4, 2.55, 2.3);
    }
  } else if (kind === "school") {
    ctx.strokeStyle = "#6b4630";
    line(ctx, 0, 4.2, 0.4, -3.2);
    ctx.fillStyle = "#7b4bb8";
    ctx.beginPath();
    ctx.arc(0.5, -4.2, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
  } else if (kind === "smith") {
    ctx.scale(1.55, 1.55);
    ctx.fillStyle = "#5e646c";
    ctx.beginPath();
    ctx.moveTo(-3.4, 0.8);
    ctx.lineTo(0.8, 0.8);
    ctx.lineTo(1.5, 0.1);
    ctx.lineTo(0.2, 0.1);
    ctx.lineTo(-0.2, 1.5);
    ctx.lineTo(-0.7, 2.4);
    ctx.lineTo(-2.5, 2.4);
    ctx.lineTo(-2.2, 1.5);
    ctx.lineTo(-2.8, 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.05;
    line(ctx, -1.6, 0.2, 0.8, -2.6);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.25;
    ctx.fillStyle = "#3f454c";
    ctx.beginPath();
    ctx.moveTo(-0.2, -3.5);
    ctx.lineTo(2.2, -2.2);
    ctx.lineTo(1.4, -0.8);
    ctx.lineTo(-1, -2.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (kind === "husbandry") {
    ctx.scale(1.45, 1.45);
    ctx.fillStyle = "#f7f3e8";
    ctx.beginPath();
    ctx.ellipse(-0.6, 0.5, 2.7, 1.45, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(2.1, -0.2, 1.25, 1.05, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    line(ctx, 1.5, -1.1, 0.9, -2.3);
    line(ctx, 2.5, -1.1, 3.1, -2.3);
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(2.55, -0.25, 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    line(ctx, -3, 0.15, -3.9, -0.9);
    line(ctx, -1.6, 1.6, -1.9, 3);
    line(ctx, -0.5, 1.75, -0.5, 3.15);
    line(ctx, 0.7, 1.45, 0.9, 2.9);
    line(ctx, 1.5, 0.7, 2, 2.1);
  } else {
    line(ctx, -3.2, 1.1, 3.2, 1.1);
    line(ctx, -2.2, 1.1, -2.8, 3.6);
    line(ctx, -0.4, 1.1, -0.8, 3.6);
    line(ctx, 1.4, 1.1, 1.8, 3.6);
    line(ctx, 2.8, 1.2, 3.6, 3.6);
    line(ctx, 3.2, 1.1, 4.6, -0.4);
    ctx.beginPath();
    ctx.arc(4.8, -1.4, 1.15, 0, Math.PI * 2);
    ctx.stroke();
    line(ctx, 0.2, 0.8, 0.2, -1.6);
    ctx.beginPath();
    ctx.arc(0.2, -2.5, 1.05, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}
function drawWindows(ctx, a, b, aTop, bTop, z) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.1 * z;
  for (const t of [0.3, 0.7]) {
    const c = lerpPt(lerpPt(a, b, t), lerpPt(aTop, bTop, t), 0.55);
    const w = 3.6 * z;
    const h = 4.8 * z;
    ctx.fillStyle = "#9fd4ef";
    ctx.fillRect(c.sx - w / 2, c.sy - h / 2, w, h);
    ctx.strokeRect(c.sx - w / 2, c.sy - h / 2, w, h);
    ctx.beginPath();
    ctx.moveTo(c.sx, c.sy - h / 2);
    ctx.lineTo(c.sx, c.sy + h / 2);
    ctx.moveTo(c.sx - w / 2, c.sy);
    ctx.lineTo(c.sx + w / 2, c.sy);
    ctx.stroke();
  }
}
function drawCrenelRoof(ctx, top, z, hit, wallColor, crystal, time) {
  poly(ctx, top);
  ctx.fillStyle = hit ? "#e7b2a4" : darken(wallColor);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.stroke();
  const merlon = 5 * z;
  const mw = 2.6 * z;
  for (const p of top) {
    ctx.fillStyle = hit ? "#e7b2a4" : wallColor;
    ctx.fillRect(p.sx - mw / 2, p.sy - merlon, mw, merlon);
    ctx.strokeRect(p.sx - mw / 2, p.sy - merlon, mw, merlon);
  }
  const c = roofMiddle(top);
  if (crystal !== "none") drawRoofTorch(ctx, c.sx, c.sy, z, time, crystal === true);
}
function drawHut(ctx, n, e, s, wv, up, z, hit, hall, age, kind, time, wallColor, roofColor, tint) {
  const wall = hit ? "#e7b2a4" : wallColor;
  const stories = hall && age >= 1 ? 2 : 1;
  const mid = (p) => ({ sx: (p.sx + up(p).sx) / 2, sy: (p.sy + up(p).sy) / 2 });
  const band = (low, high) => {
    poly(ctx, [low(wv), low(s), high(s), high(wv)]);
    ctx.fillStyle = wall;
    ctx.fill();
    ctx.stroke();
    poly(ctx, [low(s), low(e), high(e), high(s)]);
    ctx.fillStyle = hit ? "#e7b2a4" : darken(wall);
    ctx.fill();
    ctx.stroke();
  };
  const ground = (p) => p;
  if (stories === 2) {
    band(ground, mid);
    ctx.strokeStyle = TIMBER;
    ctx.lineWidth = 1.4 * z;
    line(ctx, mid(wv).sx, mid(wv).sy, mid(s).sx, mid(s).sy);
    line(ctx, mid(s).sx, mid(s).sy, mid(e).sx, mid(e).sy);
    ctx.strokeStyle = INK;
    band(mid, up);
  } else band(ground, up);
  const peak = hutApex([up(n), up(e), up(s), up(wv)], hall ? 9 : 7, z);
  const eaves = [up(n), up(e), up(s), up(wv)];
  if (hall && age >= 2) {
    const low = stories === 2 ? mid : ground;
    drawWindows(ctx, low(wv), low(s), up(wv), up(s), z);
    drawWindows(ctx, low(s), low(e), up(s), up(e), z);
  }
  if (hall) drawCrenelRoof(ctx, eaves, z, hit, wallColor, true, time);
  if (hall && age >= 4) {
    const c = roofMiddle(eaves);
    const tier = eaves.map((p) => ({ sx: c.sx + (p.sx - c.sx) * 0.38, sy: c.sy + (p.sy - c.sy) * 0.38 - 12 * z }));
    poly(ctx, tier);
    ctx.fillStyle = hit ? "#e7b2a4" : darken(roofColor);
    ctx.fill();
    ctx.stroke();
    drawRoofTorch(ctx, c.sx, c.sy - 12 * z, z, time, false);
  } else drawHutRoof(ctx, eaves, peak, z, hit, roofColor);
  const doorHigh = stories === 2 ? mid : up;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.3 * z;
  stickDoor(ctx, s, e, doorHigh(s), doorHigh(e), z);
  if (hall) drawTorches(ctx, s, e, doorHigh(s), doorHigh(e), z, time);
  if (kind === "school") drawCrystalTorches(ctx, s, e, doorHigh(s), doorHigh(e), z, time);
  if (kind === "barracks" || kind === "range" || kind === "stable" || kind === "school" || kind === "smith" || kind === "husbandry" || kind === "altar" || kind === "shop" || kind === "keep" || kind === "temple" || kind === "yard") {
    drawSideMark(ctx, wv, s, (stories === 2 ? mid : up)(wv), (stories === 2 ? mid : up)(s), z, kind, tint);
  }
}
function drawTower(ctx, n, e, s, wv, up, z, hit, wallColor, stories, crystal, time) {
  const lift = s.sy - up(s).sy;
  const at = (p, t) => ({ sx: p.sx, sy: p.sy - lift * t });
  const cuts = stories >= 3 ? [0, 1 / 3, 2 / 3, 1] : [0, 0.5, 1];
  ctx.strokeStyle = INK;
  for (let i = 0; i < cuts.length - 1; i++) {
    const low = (p) => at(p, cuts[i]);
    const high = (p) => at(p, cuts[i + 1]);
    poly(ctx, [low(wv), low(s), high(s), high(wv)]);
    ctx.fillStyle = hit ? "#e7b2a4" : wallColor;
    ctx.fill();
    ctx.stroke();
    poly(ctx, [low(s), low(e), high(e), high(s)]);
    ctx.fillStyle = hit ? "#e7b2a4" : darken(wallColor);
    ctx.fill();
    ctx.stroke();
    if (i < cuts.length - 2) {
      ctx.strokeStyle = TIMBER;
      ctx.lineWidth = 1.3 * z;
      line(ctx, high(wv).sx, high(wv).sy, high(s).sx, high(s).sy);
      line(ctx, high(s).sx, high(s).sy, high(e).sx, high(e).sy);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.4 * z;
    }
  }
  const top = [up(n), up(e), up(s), up(wv)];
  drawCrenelRoof(ctx, top, z, hit, wallColor, crystal, time);
  stickDoor(ctx, s, e, at(s, cuts[1]), at(e, cuts[1]), z);
}
function drawHoverBall(ctx, sx, sy, z, time) {
  const y = sy + Math.sin(time * 2) * 2.4 * z;
  const pulse = 0.88 + Math.sin(time * 4) * 0.12;
  ctx.fillStyle = `rgba(90, 150, 255, ${0.38 * pulse})`;
  ctx.beginPath();
  ctx.arc(sx, y, 14 * z * pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7eb6ff";
  ctx.beginPath();
  ctx.arc(sx, y, 7.6 * z, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.4 * z;
  ctx.stroke();
  ctx.fillStyle = "#eef6ff";
  ctx.beginPath();
  ctx.arc(sx - 2 * z, y - 2.4 * z, 2.1 * z, 0, Math.PI * 2);
  ctx.fill();
}
function drawSchool(ctx, n, e, s, wv, up, z, hit, time) {
  const wall = "#efe6f6";
  const lift = s.sy - up(s).sy;
  const at = (p, t) => ({ sx: p.sx, sy: p.sy - lift * t });
  const cuts = [0, 0.2, 0.4, 0.6, 0.8, 1];
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.4 * z;
  for (let i = 0; i < cuts.length - 1; i++) {
    const low = (p) => at(p, cuts[i]);
    const high = (p) => at(p, cuts[i + 1]);
    poly(ctx, [low(wv), low(s), high(s), high(wv)]);
    ctx.fillStyle = hit ? "#e7b2a4" : wall;
    ctx.fill();
    ctx.stroke();
    poly(ctx, [low(s), low(e), high(e), high(s)]);
    ctx.fillStyle = hit ? "#e7b2a4" : darken(wall);
    ctx.fill();
    ctx.stroke();
    if (i < cuts.length - 2) {
      ctx.strokeStyle = TIMBER;
      ctx.lineWidth = 1.3 * z;
      line(ctx, high(wv).sx, high(wv).sy, high(s).sx, high(s).sy);
      line(ctx, high(s).sx, high(s).sy, high(e).sx, high(e).sy);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.4 * z;
    }
    if (i === 1 || i === 3) {
      drawWindows(ctx, low(wv), low(s), high(wv), high(s), z);
      drawWindows(ctx, low(s), low(e), high(s), high(e), z);
    }
  }
  const top = [up(n), up(e), up(s), up(wv)];
  drawCrenelRoof(ctx, top, z, hit, "#6d4ea3", "none", time);
  stickDoor(ctx, s, e, at(s, cuts[1]), at(e, cuts[1]), z);
  drawCrystalTorches(ctx, s, e, at(s, cuts[1]), at(e, cuts[1]), z, time);
  drawSideMark(ctx, wv, s, at(wv, cuts[1]), at(s, cuts[1]), z, "school");
  const c = roofMiddle(top);
  drawHoverBall(ctx, c.sx, c.sy - 22 * z, z, time);
}
function drawRoofTorch(ctx, sx, sy, z, time, crystal) {
  const top = { sx, sy: sy - 7 * z };
  ctx.strokeStyle = TIMBER;
  ctx.lineWidth = 1.2 * z;
  line(ctx, sx, sy, top.sx, top.sy);
  if (crystal) {
    const pulse = 0.85 + Math.sin(time * 4) * 0.15;
    ctx.fillStyle = `rgba(90, 150, 255, ${0.28 * pulse})`;
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 2.2 * z, 5 * z * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7eb6ff";
    ctx.beginPath();
    ctx.arc(top.sx, top.sy - 2.2 * z, 2.3 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.fillStyle = "#eef6ff";
    ctx.beginPath();
    ctx.arc(top.sx - 0.6 * z, top.sy - 2.9 * z, 0.7 * z, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const flick = Math.sin(time * 9) * 1.1 * z;
  ctx.fillStyle = "#f25a1a";
  ctx.beginPath();
  ctx.moveTo(top.sx - 1.8 * z, top.sy);
  ctx.quadraticCurveTo(top.sx - 2.8 * z, top.sy - 3.2 * z + flick, top.sx, top.sy - 6.2 * z + flick);
  ctx.quadraticCurveTo(top.sx + 2.8 * z, top.sy - 2.8 * z, top.sx + 1.8 * z, top.sy);
  ctx.fill();
  ctx.fillStyle = "#ffe08a";
  ctx.beginPath();
  ctx.arc(top.sx, top.sy - 2.2 * z, 1.15 * z, 0, Math.PI * 2);
  ctx.fill();
}
function drawFarm(ctx, realm, b, n, e, s, wv, z, team) {
  poly(ctx, [n, e, s, wv]);
  ctx.fillStyle = b.progress < 1 ? "#c4a15a" : BUILD_LOOK.farm.wall;
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = BUILD_LOOK.farm.roof;
  ctx.lineWidth = 1.2 * z;
  const grown = b.progress >= 1 ? 1 : b.progress;
  for (let row = 0; row < 3; row++) {
    const a = realm.worldToScreen(b.x + 0.15, b.y + 0.35 + row * 0.45);
    const c = realm.worldToScreen(b.x + BLDS.farm.w - 0.7, b.y + 0.35 + row * 0.45);
    const mid = realm.worldToScreen(b.x + BLDS.farm.w / 2, b.y + BLDS.farm.h / 2);
    const pull = (p) => ({
      sx: mid.sx + (p.sx - mid.sx) * 0.62,
      sy: mid.sy + (p.sy - mid.sy) * 0.62
    });
    const u = pull(a);
    const v = pull(c);
    line(ctx, u.sx, u.sy, v.sx, v.sy - 14 * z * grown);
  }
  const shed = pullPt(s, wv, e, n, 0.22);
  const shedTop = { sx: shed.sx, sy: shed.sy - 16 * z * Math.max(0.4, grown) };
  ctx.strokeStyle = TIMBER;
  ctx.lineWidth = 1.5 * z;
  line(ctx, shed.sx - 5 * z, shed.sy, shedTop.sx, shedTop.sy);
  line(ctx, shed.sx + 5 * z, shed.sy, shedTop.sx, shedTop.sy);
  line(ctx, shed.sx - 5 * z, shed.sy, shed.sx + 5 * z, shed.sy);
  ctx.strokeStyle = team;
  line(ctx, shedTop.sx, shedTop.sy, shedTop.sx, shedTop.sy - 8 * z);
}
function drawFrame(ctx, n, e, s, wv, up, z, progress) {
  ctx.strokeStyle = TIMBER;
  ctx.lineWidth = 1.6 * z;
  for (const p of [n, e, s, wv]) line(ctx, p.sx, p.sy, up(p).sx, up(p).sy);
  line(ctx, up(n).sx, up(n).sy, up(e).sx, up(e).sy);
  line(ctx, up(e).sx, up(e).sy, up(s).sx, up(s).sy);
  line(ctx, up(s).sx, up(s).sy, up(wv).sx, up(wv).sy);
  line(ctx, up(wv).sx, up(wv).sy, up(n).sx, up(n).sy);
  if (progress > 0.45) {
    const peak = {
      sx: (up(n).sx + up(e).sx + up(s).sx + up(wv).sx) / 4,
      sy: Math.min(up(n).sy, up(e).sy, up(s).sy, up(wv).sy) - 10 * z
    };
    ctx.strokeStyle = TIMBER;
    for (const a of [up(n), up(e), up(s), up(wv)]) line(ctx, peak.sx, peak.sy, a.sx, a.sy);
  }
  if (progress > 0.7) stickDoor(ctx, s, e, up(s), up(e), z);
}
function stickDoor(ctx, s, e, upS, upE, z) {
  const dx = e.sx - s.sx;
  const dy = e.sy - s.sy;
  const len = Math.hypot(dx, dy) || 1;
  const half = Math.min(len * 0.28, 5 * z);
  const ux = dx / len * half;
  const uy = dy / len * half;
  const t = 0.42;
  const mid = lerpPt(s, e, t);
  const midUp = lerpPt(upS, upE, t);
  const left = { sx: mid.sx - ux, sy: mid.sy - uy };
  const right = { sx: mid.sx + ux, sy: mid.sy + uy };
  const leftTop = lerpPt(left, { sx: midUp.sx - ux, sy: midUp.sy - uy }, 0.72);
  const rightTop = lerpPt(right, { sx: midUp.sx + ux, sy: midUp.sy + uy }, 0.72);
  ctx.fillStyle = "#1c1915";
  poly(ctx, [left, right, rightTop, leftTop]);
  ctx.fill();
  ctx.strokeStyle = TIMBER;
  ctx.lineWidth = 1.6 * z;
  ctx.stroke();
  line(ctx, left.sx - ux * 0.4, leftTop.sy, right.sx + ux * 0.4, rightTop.sy);
  ctx.fillStyle = "#d7b23a";
  ctx.beginPath();
  ctx.arc(right.sx - ux * 0.35, (right.sy + rightTop.sy) / 2, 1.3 * z, 0, Math.PI * 2);
  ctx.fill();
}
function lerpPt(a, b, t) {
  return { sx: a.sx + (b.sx - a.sx) * t, sy: a.sy + (b.sy - a.sy) * t };
}
function pullPt(s, wv, e, n, t) {
  return lerpPt(lerpPt(s, wv, t), lerpPt(e, n, t), t);
}
function darken(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c * 0.78)));
  const r = f(n >> 16 & 255);
  const g = f(n >> 8 & 255);
  const b = f(n & 255);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
function poly(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].sx, pts[0].sy);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
  ctx.closePath();
}
function drawSiege(ctx, realm, u) {
  const z = realm.zoom;
  const p = realm.worldToScreen(u.x, u.y);
  const s = u.right ? 1 : -1;
  const team = teamColor(u.team, realm);
  const side = sideOf(realm, u.team);
  const dynasty = dynastySide(realm, u.team);
  const coven = covenSide(realm, u.team);
  const roll = Math.sin((u.anim || 0) * 8) * 1.1 * z;
  const gy = p.sy;
  const bed = gy - 7 * z;
  const rear = p.sx - s * 8 * z;
  const nose = p.sx + s * 7 * z;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.4 * z;
  const wheel = (x, kick) => {
    ctx.fillStyle = "#3e342f";
    ctx.beginPath();
    ctx.ellipse(x, gy - kick, 3.2 * z, 1.6 * z, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  wheel(rear, roll);
  wheel(nose, -roll);
  ctx.strokeStyle = "#6b4630";
  ctx.lineWidth = 2.1 * z;
  line(ctx, rear, bed, nose, bed);
  ctx.strokeStyle = dynasty ? "#f4ead2" : coven ? "#f3eefe" : team;
  ctx.lineWidth = side === "red" ? 4 * z : 3.2 * z;
  line(ctx, rear + s * 1.5 * z, bed - 2 * z, nose - s * 1.5 * z, bed - 2 * z);
  if (u.kind === "ram") {
    const tip = nose + s * (side === "dynasty" ? 6 : 9) * z;
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = (side === "red" ? 3.6 : 2.6) * z;
    line(ctx, p.sx, bed - 2 * z, tip, bed - 4 * z);
    ctx.fillStyle = side === "red" ? "#6a1020" : coven ? "#d9ccff" : "#c4a574";
    ctx.beginPath();
    ctx.arc(tip, bed - 4 * z, (side === "red" ? 3.2 : 2.2) * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.2 * z;
    ctx.strokeStyle = INK;
    ctx.stroke();
    if (side === "red") {
      ctx.beginPath();
      ctx.moveTo(tip, bed - 7 * z);
      ctx.lineTo(tip + s * 3 * z, bed - 4 * z);
      ctx.lineTo(tip, bed - 1 * z);
      ctx.stroke();
    }
  } else if (u.kind === "catapult") {
    const arm = dynasty ? 14 : 10;
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.8 * z;
    line(ctx, p.sx, bed - 2 * z, p.sx + s * arm * z, bed - (dynasty ? 16 : 12) * z);
    ctx.fillStyle = coven ? "#d9ccff" : side === "red" ? "#5c4030" : "#6e6258";
    ctx.beginPath();
    ctx.arc(p.sx + s * arm * z, bed - (dynasty ? 16 : 12) * z, (side === "red" ? 3.3 : 2.3) * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
  } else {
    ctx.strokeStyle = coven ? "#d9ccff" : "#c5ccd1";
    ctx.lineWidth = 1.7 * z;
    line(ctx, rear, bed - 3 * z, nose + s * (dynasty ? 12 : 8) * z, bed - 6 * z);
    ctx.strokeStyle = INK;
    line(ctx, rear - s * 2 * z, bed, nose - s * 2 * z, bed - 5 * z);
  }
  if (dynasty) {
    ctx.strokeStyle = "#8e1c2c";
    ctx.lineWidth = 1.3 * z;
    line(ctx, rear, bed - 2 * z, p.sx, bed - 9 * z);
    line(ctx, p.sx, bed - 9 * z, nose, bed - 2 * z);
  }
  if (coven) {
    ctx.fillStyle = "#7eb6ff";
    ctx.beginPath();
    ctx.arc(p.sx, bed - 7 * z, 1.7 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
  }
  if (side === "egypt") {
    ctx.strokeStyle = "#e2b340";
    ctx.lineWidth = 1.3 * z;
    line(ctx, rear, bed - 4 * z, nose, bed - 4 * z);
  }
  const hx = rear + s * 2 * z;
  ctx.strokeStyle = INK;
  ctx.fillStyle = "#f7f1e4";
  ctx.lineWidth = 1.3 * z;
  ctx.beginPath();
  ctx.arc(hx, bed - 11 * z, 2.2 * z, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  line(ctx, hx, bed - 9 * z, hx, bed - 2 * z);
  if (u.hp > 0) {
    const maxHp = realm.unitMax(u.kind, u.team, u.level || 1, realm.gearOf(u).hp);
    if (u.hp < maxHp - 0.5) {
      const bw = 18 * z;
      ctx.fillStyle = "rgba(28,25,21,0.35)";
      ctx.fillRect(p.sx - bw / 2, bed - 20 * z, bw, 3 * z);
      ctx.fillStyle = team;
      ctx.fillRect(p.sx - bw / 2, bed - 20 * z, bw * Math.max(0, u.hp / maxHp), 3 * z);
    }
  }
  ctx.restore();
}
function drawUnit(ctx, realm, u) {
  if (u.kind === "ram" || u.kind === "catapult" || u.kind === "ballista") {
    drawSiege(ctx, realm, u);
    return;
  }
  const z = realm.zoom;
  const p = realm.worldToScreen(u.x, u.y);
  const pose = poseOf(realm, u);
  const dir = u.right ? 1 : -1;
  const team = teamColor(u.team, realm);
  const dynasty = dynastySide(realm, u.team);
  const egypt = egyptSide(realm, u.team);
  const ph = u.anim * (pose === "walk" ? 1.7 : 1.15) % 1;
  const step = Math.sin(ph * Math.PI * 2);
  const bob = (pose === "walk" ? Math.abs(step) * 1.05 : pose === "pick" ? 3 + Math.abs(step) * 2 : Math.sin(u.anim * 2) * 0.6) * z;
  ctx.save();
  if (u.captive && pose !== "fall") {
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.5 * z;
    ctx.strokeRect(p.sx - 9 * z, p.sy - 24 * z, 18 * z, 24 * z);
    ctx.beginPath();
    ctx.moveTo(p.sx - 4 * z, p.sy - 24 * z);
    ctx.lineTo(p.sx - 4 * z, p.sy);
    ctx.moveTo(p.sx + 4 * z, p.sy - 24 * z);
    ctx.lineTo(p.sx + 4 * z, p.sy);
    ctx.stroke();
  }
  if ((u.kind === "hero" || u.kind === "avatar" || u.kind === "god" || u.kind === "demigod") && pose !== "fall") {
    const scale = u.kind === "god" ? 1.7 : u.kind === "avatar" ? 1.32 : u.kind === "demigod" ? 1.08 : 1.24;
    ctx.translate(p.sx, p.sy);
    ctx.scale(scale, scale);
    ctx.translate(-p.sx, -p.sy);
    if ((u.cry || 0) > 0) {
      ctx.strokeStyle = "rgba(226,179,64,0.85)";
      ctx.lineWidth = 1.5 * z;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy - 8 * z, 16 * z, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (pose === "fall") {
    const k = 1 - Math.max(0, u.down) / 0.55;
    ctx.translate(p.sx, p.sy);
    ctx.rotate(dir * k * 1.35);
    ctx.translate(-p.sx, -p.sy);
    ctx.globalAlpha = Math.max(0.2, 1 - k);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.8 * z;
  ctx.fillStyle = "rgba(20,16,12,0.2)";
  ctx.beginPath();
  ctx.ellipse(p.sx + 1.5 * z, p.sy + 3 * z, 9 * z, 3.2 * z, 0, 0, Math.PI * 2);
  ctx.fill();
  const chariot = egypt && (u.kind === "cavalry" || u.kind === "knight");
  const mount = chariot ? 8 * z : u.kind === "cavalry" || u.kind === "knight" ? 13 * z : 0;
  const hipY = p.sy - 9 * z + (pose === "pick" ? bob : 0) - mount;
  const shoulderY = p.sy - 20 * z + bob * 0.35 - mount;
  const headY = p.sy - 26 * z + bob * 0.2 - mount;
  const lean = pose === "slash" ? dir * 2 * z : 0;
  if (u.stealth) {
    const haze = 0.28 + Math.sin(realm.time * 2.2 + u.x) * 0.07;
    ctx.fillStyle = `rgba(168, 168, 174, ${haze})`;
    ctx.beginPath();
    ctx.ellipse(p.sx, headY + 6 * z, 12 * z, 16 * z, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(210, 210, 214, ${haze * 0.7})`;
    ctx.beginPath();
    ctx.ellipse(p.sx + dir * 4 * z, headY - 2 * z, 7 * z, 5 * z, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "rgba(92, 94, 98, 0.55)";
  }
  const reach = strikeReach(u, pose);
  let legA = 3.2;
  let legB = 3.2;
  if (pose === "walk") {
    legA = 3.2 + step * 5.5;
    legB = 3.2 - step * 5.5;
  } else if (pose === "pick") {
    legA = 5;
    legB = 4;
  } else if (pose === "fall") {
    legA = 7;
    legB = 2;
  }
  if (chariot) drawChariot(ctx, p.sx, p.sy, dir, z);
  else if (u.kind === "cavalry" || u.kind === "knight") {
    drawHorse(ctx, p.sx, p.sy, dir, z, step, pose === "walk");
    const saddle = p.sy - 12 * z;
    line(ctx, p.sx + lean, hipY, p.sx + dir * 3 * z, saddle);
    line(ctx, p.sx + lean, hipY, p.sx - dir * 2 * z, saddle);
  } else if (pose === "walk") {
    stickLeg(ctx, p.sx + lean, hipY, p.sy, dir * step * 7 * z, Math.max(0, step) * 3.4 * z, z);
    stickLeg(ctx, p.sx + lean, hipY, p.sy, -dir * step * 7 * z, Math.max(0, -step) * 3.4 * z, z);
  } else if (u.kind === "villager" && pose === "chop") {
    stickLeg(ctx, p.sx + lean, hipY, p.sy, dir * 5 * z, 0, z);
    stickLeg(ctx, p.sx + lean, hipY, p.sy, -dir * 3.2 * z, 0, z);
  } else {
    line(ctx, p.sx + lean, hipY, p.sx - dir * legA * z, p.sy);
    line(ctx, p.sx + lean, hipY, p.sx + dir * legB * z, p.sy);
  }
  line(ctx, p.sx + lean, shoulderY + 2 * z, p.sx + lean, hipY);
  if (pose !== "fall" && u.kind !== "skeleton") {
    const cloth = u.kind === "hero" ? 6.2 : 4.4;
    ctx.fillStyle = u.kind === "zombie" ? "#6f8f5a" : team;
    ctx.beginPath();
    ctx.moveTo(p.sx + lean, shoulderY + 3 * z);
    ctx.lineTo(p.sx + lean + dir * cloth * z, shoulderY + 9 * z);
    ctx.lineTo(p.sx + lean, hipY);
    ctx.lineTo(p.sx + lean - dir * cloth * z, shoulderY + 9 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (dynasty) {
      ctx.strokeStyle = "#e2b340";
      ctx.lineWidth = 1.1 * z;
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.8 * z;
    }
    if (egypt) {
      ctx.strokeStyle = "#e2b340";
      ctx.lineWidth = 1.3 * z;
      line(ctx, p.sx + lean - 3 * z, shoulderY + 6 * z, p.sx + lean + 3 * z, shoulderY + 6 * z);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.8 * z;
    }
    if (u.kind === "hero" || u.kind === "god" || u.kind === "avatar") {
      ctx.fillStyle = team === "#2a5bd7" ? "#17388a" : team === "#2f7a45" ? "#1c4a2c" : team === "#7a1424" ? "#3d0c16" : team === "#6d3fa8" ? "#3a2260" : team === "#1a4f7a" ? "#0e2c46" : "#8a2e18";
      ctx.beginPath();
      ctx.moveTo(p.sx + lean - dir * 1.5 * z, shoulderY + 3 * z);
      ctx.lineTo(p.sx + lean - dir * 8 * z, hipY + 2 * z);
      ctx.lineTo(p.sx + lean - dir * 2 * z, hipY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }
  if (pose !== "fall" && u.kind === "skeleton") {
    ctx.strokeStyle = "#f7f4ee";
    ctx.lineWidth = 1.1 * z;
    line(ctx, p.sx + lean - 3 * z, shoulderY + 6 * z, p.sx + lean + 3 * z, shoulderY + 6 * z);
    line(ctx, p.sx + lean - 2.4 * z, shoulderY + 8.2 * z, p.sx + lean + 2.4 * z, shoulderY + 8.2 * z);
    line(ctx, p.sx + lean - 1.6 * z, shoulderY + 10.2 * z, p.sx + lean + 1.6 * z, shoulderY + 10.2 * z);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8 * z;
  }
  ctx.fillStyle = u.kind === "skeleton" ? "#f7f4ee" : u.kind === "zombie" ? "#9bb07a" : "#f7f1e4";
  ctx.beginPath();
  ctx.arc(p.sx + lean, headY, 5 * z, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (dynasty && pose !== "fall") drawDynastyHat(ctx, p.sx + lean, headY, z, u.kind);
  else if (egypt && pose !== "fall") drawNemes(ctx, p.sx + lean, headY, z, u.kind);
  else if (covenSide(realm, u.team) && pose !== "fall") drawCovenHood(ctx, p.sx + lean, headY, z);
  else if (pose !== "fall" && sideOf(realm, u.team) === "blue") {
    ctx.strokeStyle = team;
    ctx.lineWidth = 2 * z;
    ctx.beginPath();
    ctx.arc(p.sx + lean, headY - 1.5 * z, 5.4 * z, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8 * z;
  } else if (pose !== "fall" && sideOf(realm, u.team) === "red") {
    ctx.strokeStyle = "#c4502a";
    ctx.lineWidth = 2 * z;
    line(ctx, p.sx + lean - 5 * z, headY - 1 * z, p.sx + lean + 5 * z, headY - 1 * z);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8 * z;
  }
  if (pose !== "fall" && (u.kind === "demigod" || u.kind === "avatar" || u.kind === "god")) {
    const role = covenSide(realm, u.team) ? "omen" : dynasty || egypt ? "bless" : sideOf(realm, u.team) === "blue" ? "heal" : "curse";
    const tier = u.kind === "god" ? 3 : u.kind === "avatar" ? 2 : 1;
    if (egypt) drawSunDisk(ctx, p.sx + lean, headY - (14 + tier) * z, z * (0.65 + tier * 0.12));
    else drawDeityMark(ctx, p.sx + lean, headY, z, role, tier);
  }
  if (u.kind === "skeleton") {
    ctx.fillStyle = "#1a1420";
    ctx.beginPath();
    ctx.arc(p.sx + lean + dir * 1.5 * z, headY - 0.6 * z, 0.7 * z, 0, Math.PI * 2);
    ctx.arc(p.sx + lean - dir * 1.2 * z, headY - 0.6 * z, 0.7 * z, 0, Math.PI * 2);
    ctx.fill();
  } else {
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(p.sx + lean + dir * 1.7 * z, headY - 0.3 * z, 0.75 * z, 0, Math.PI * 2);
  ctx.fill();
  }
  const shoulderX = p.sx + lean;
  const arms = armsFor(pose, ph, step, reach, dir, z, u.kind);
  line(ctx, shoulderX - dir * 3 * z, shoulderY + 3 * z, shoulderX + arms.offX, shoulderY + arms.offY);
  line(ctx, shoulderX, shoulderY + 2 * z, shoulderX + arms.x, shoulderY + arms.y);
  let held = pose;
  if ((u.kind === "hero" || u.kind === "demigod" || u.kind === "avatar" || u.kind === "god" || pose === "walk" || pose === "idle") && pose !== "fall") {
    const c = carried(realm, u);
    held = c === "chop" ? "axe" : c || pose;
  }
  if (egypt && (held === "slash" || held === "warrior" || held === "sword") && (u.kind === "warrior" || u.kind === "sword" || u.kind === "hero" || u.kind === "cavalry" || u.kind === "knight" || u.kind === "guard")) held = "khopesh";
  drawHeld(ctx, held, u, shoulderX + arms.x, shoulderY + arms.y, dir, z, pose === "walk" || pose === "idle" ? 0.5 : ph, reach);
  if (u.kind === "warrior" && pose !== "fall" && !covenSide(realm, u.team)) drawShield(ctx, shoulderX + arms.offX, shoulderY + arms.offY, z);
  if (u.carry > 0.5 && u.carryKind && pose !== "fall" && (pose === "walk" || pose === "idle")) {
    drawBundle(ctx, shoulderX - dir * 7 * z, shoulderY + 4 * z, u.carryKind, z);
  }
  const maxHp = realm.unitMax(u.kind, u.team, u.level || 1, realm.gearOf(u).hp);
  const lv = Math.max(1, u.level || 1);
  if (lv > 1 && pose !== "fall") {
    ctx.fillStyle = "#e2b340";
    ctx.font = `700 ${10 * z}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(String(lv), p.sx + 9 * z, headY - 2 * z);
  }
  if (u.hp > 0 && u.hp < maxHp - 0.5) {
    const bw = 16 * z;
    ctx.fillStyle = "rgba(28,25,21,0.35)";
    ctx.fillRect(p.sx - bw / 2, headY - 10 * z, bw, 3 * z);
    ctx.fillStyle = team;
    ctx.fillRect(p.sx - bw / 2, headY - 10 * z, bw * Math.max(0, u.hp / maxHp), 3 * z);
  }
  if (u.hp > 0 && pose !== "fall" && u.gear?.length) {
    u.gear.forEach((id, i) => {
      ctx.fillStyle = ITEMS[id]?.color || "#e2b340";
      ctx.beginPath();
      ctx.arc(p.sx - 8 * z + i * 3.2 * z, p.sy - 2 * z, 1.3 * z, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}
function strikeReach(u, pose) {
  if (pose !== "slash" && pose !== "thrust" && pose !== "bow" && pose !== "staff") return 0;
  const cd = UNITS[u.kind].cd;
  if (u.attackCd <= 0) return pose === "bow" || pose === "staff" ? 1 : 0.15;
  const age = (cd - u.attackCd) / cd;
  if (pose === "bow") return Math.min(1, age / 0.72);
  return age < 0.22 ? 1 - age / 0.22 : 0.12;
}
function armsFor(pose, ph, step, reach, dir, z, kind) {
  const s = dir * z;
  if (pose === "walk") {
    return { x: s * (2.2 - step * 4.2), y: z * 7, offX: -s * (2.2 + step * 4.2), offY: z * 7 };
  }
  if (pose === "chop") {
    const a = chopSwing(ph);
    return { x: Math.cos(a) * s * 11, y: Math.sin(a) * 11 * z, offX: -s * 4, offY: z * 6 };
  }
  if (pose === "mine" || pose === "hammer") {
    const up = ph < 0.62;
    return up ? { x: -s * 2, y: -z * 12, offX: -s * 5, offY: z * 6 } : { x: s * 8, y: z * (pose === "mine" ? 8 : 2), offX: -s * 4, offY: z * 7 };
  }
  if (pose === "farm") {
    const sweep = Math.sin(ph * Math.PI * 2);
    return { x: s * (8 + sweep * 4), y: z * (2 + sweep * 3), offX: -s * 4, offY: z * 6 };
  }
  if (pose === "pick") {
    return { x: s * 7, y: z * 10, offX: -s * 3, offY: z * 8 };
  }
  if (pose === "hunt" || pose === "thrust") {
    const jab = pose === "thrust" ? reach : ph > 0.72 ? 1 : 0.2;
    return { x: s * (4 + jab * 8), y: z * (2 - jab * 4), offX: -s * 4, offY: z * 6 };
  }
  if (pose === "slash") {
    return reach > 0.4 ? { x: s * 10, y: z * 4, offX: -s * 3, offY: z * 5 } : { x: -s * 1, y: -z * 8, offX: -s * 4, offY: z * 6 };
  }
  if (pose === "fish") {
    const cast = ph < 0.22;
    return cast ? { x: -s * 3, y: -z * 11, offX: -s * 4, offY: z * 6 } : { x: s * 9, y: z * 1, offX: -s * 3, offY: z * 7 };
  }
  if (pose === "bow") {
    return { x: s * (6 + reach * 2), y: z * 2, offX: s * (2 - reach * 5), offY: z * 3 };
  }
  if (pose === "staff") {
    return reach > 0.4 ? { x: s * 5, y: -z * 12, offX: -s * 3, offY: z * 6 } : { x: s * 2, y: -z * 4, offX: -s * 4, offY: z * 7 };
  }
  if (pose === "fall") return { x: s * 6, y: z * 4, offX: -s * 6, offY: z * 2 };
  return { x: s * 4, y: z * 6, offX: -s * 4, offY: z * 7 };
}
function drawHeld(ctx, pose, u, x, y, dir, z, ph, reach) {
  ctx.lineWidth = 1.4 * z;
  ctx.strokeStyle = INK;
  const s = dir;
  if (u.kind === "skeleton") {
    ctx.strokeStyle = "#f4f1ea";
    ctx.lineWidth = 1.6 * z;
    line(ctx, x, y, x + s * 11 * z, y - 3 * z);
    ctx.strokeStyle = INK;
    return;
  }
  if (u.kind === "zombie") {
    ctx.strokeStyle = "#6a8f52";
    ctx.lineWidth = 1.3 * z;
    line(ctx, x, y, x + s * 6 * z, y + 2 * z);
    line(ctx, x, y, x + s * 5 * z, y + 4 * z);
    ctx.strokeStyle = INK;
    return;
  }
  if (pose === "whip") {
    ctx.strokeStyle = "#6b4630";
    ctx.lineWidth = 1.3 * z;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + s * 5 * z, y - 7 * z, x + s * 12 * z, y + 1 * z);
    ctx.stroke();
    ctx.strokeStyle = INK;
    return;
  }
  if ((u.kind === "spear" || u.kind === "halberd" || pose === "spear") && pose !== "staff") {
    const reachOut = reach > 0.4 || pose === "slash" && ph > 0.45;
    const long = u.kind === "halberd" || u.kind === "hero" ? 1.35 : 1;
    const tipX = x + s * (reachOut ? 16 : 11) * z * long;
    const tipY = y - (reachOut ? 2 : 8) * z;
    ctx.strokeStyle = "#6b4630";
    line(ctx, x, y, tipX, tipY);
    ctx.fillStyle = "#d7dbe0";
    ctx.beginPath();
    ctx.moveTo(tipX + s * 3.2 * z, tipY);
    ctx.lineTo(tipX - s * 0.4 * z, tipY - 2.4 * z);
    ctx.lineTo(tipX - s * 0.4 * z, tipY + 2.4 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (u.kind === "mage" || u.kind === "frost" || u.kind === "priest" || u.kind === "warlock" || pose === "staff") {
    const orb = u.kind === "frost" ? "#9fd4f0" : u.kind === "priest" ? "#f3e27a" : u.kind === "warlock" ? "#3a2458" : u.kind === "demigod" || u.kind === "avatar" || u.kind === "god" ? "#e2b340" : "#7b4bb8";
    ctx.strokeStyle = "#6b4630";
    line(ctx, x, y + 4 * z, x + s * 1.5 * z, y - 12 * z);
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(x + s * 1.5 * z, y - 13.5 * z, 2.2 * z, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    return;
  }
  if (pose === "axe") {
    ctx.strokeStyle = "#6b4630";
    line(ctx, x, y, x + s * 1.5 * z, y + 7 * z);
    ctx.fillStyle = "#c5ccd1";
    ctx.beginPath();
    ctx.moveTo(x + s * 1.5 * z, y + 8 * z);
    ctx.lineTo(x + s * 5 * z, y + 6 * z);
    ctx.lineTo(x + s * 2 * z, y + 4 * z);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    return;
  }
  if (pose === "chop") {
    const a = chopSwing(ph);
    const len = 8 * z;
    const tx = x + Math.cos(a) * s * len;
    const ty = y + Math.sin(a) * len;
    ctx.strokeStyle = "#6b4630";
    line(ctx, x, y, tx, ty);
    const bx = -Math.sin(a) * s;
    const by = Math.cos(a);
    ctx.fillStyle = "#c5ccd1";
    ctx.beginPath();
    ctx.moveTo(tx + Math.cos(a) * s * 2 * z, ty + Math.sin(a) * 2 * z);
    ctx.lineTo(tx + bx * 5.5 * z, ty + by * 5.5 * z);
    ctx.lineTo(tx - bx * 1.2 * z, ty - by * 1.2 * z);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.stroke();
    if (ph > 0.68 && ph < 0.8) chip(ctx, tx + Math.cos(a) * s * 3 * z, ty + Math.sin(a) * 3 * z, z);
    return;
  }
  if (pose === "mine") {
    line(ctx, x, y, x + s * z, y - 10 * z);
    ctx.fillStyle = "#9aa1a8";
    ctx.beginPath();
    ctx.moveTo(x - 4 * z, y - 10 * z);
    ctx.lineTo(x + 5 * z, y - 13 * z);
    ctx.lineTo(x + 2 * z, y - 7 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (ph > 0.62 && ph < 0.78) chip(ctx, x + s * 2 * z, y + 6 * z, z);
    return;
  }
  if (pose === "hammer") {
    line(ctx, x, y, x, y - 8 * z);
    ctx.fillStyle = "#b7bdc4";
    ctx.fillRect(x - 4 * z, y - 11 * z, 8 * z, 3.5 * z);
    ctx.strokeRect(x - 4 * z, y - 11 * z, 8 * z, 3.5 * z);
    if (ph > 0.62 && ph < 0.75) chip(ctx, x + s * 6 * z, y + 4 * z, z);
    return;
  }
  if (pose === "farm") {
    line(ctx, x, y, x + s * 8 * z, y + 2 * z);
    ctx.strokeStyle = "#8a8f6a";
    ctx.beginPath();
    ctx.arc(x + s * 8 * z, y + 2 * z, 5 * z, s > 0 ? -1.4 : 1.7, s > 0 ? 1.2 : -1.2);
    ctx.stroke();
    return;
  }
  if (pose === "pick") {
    ctx.fillStyle = "#d23b3b";
    ctx.beginPath();
    ctx.arc(x + s * 2 * z, y + 1 * z, 1.8 * z, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (pose === "hunt" || pose === "thrust") {
    line(ctx, x - s * 2 * z, y + 6 * z, x + s * 4 * z, y - 12 * z);
    ctx.fillStyle = "#d7b23a";
    ctx.beginPath();
    ctx.moveTo(x + s * 4 * z, y - 12 * z);
    ctx.lineTo(x + s * 7 * z, y - 8 * z);
    ctx.lineTo(x + s * 2 * z, y - 8 * z);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (pose === "slash" || pose === "knife" || pose === "club" || pose === "warrior" || pose === "sword" || pose === "khopesh") {
    if (pose === "khopesh") {
      drawKhopesh(ctx, x, y, s, z, reach > 0.4);
      return;
    }
    if (u.kind === "club" || pose === "club") {
      drawClub(ctx, x, y, s, z, reach > 0.4);
      return;
    }
    if (u.kind === "warrior" || pose === "warrior") {
      drawSword(ctx, x, y, s, z, 9, reach > 0.4);
      return;
    }
    if (u.kind === "sword") {
      drawSword(ctx, x, y, s, z, 14, reach > 0.4);
      drawSword(ctx, x - s * 4 * z, y + 2 * z, s, z, 14, !(reach > 0.4));
      return;
    }
    if (u.kind === "guard") {
      drawSword(ctx, x, y, s, z, 18, reach > 0.4);
      ctx.fillStyle = "#e2b340";
      ctx.fillRect(x - s * 6 * z, y - 10 * z, 2.2 * z, 5 * z);
      return;
    }
    if (u.kind === "cavalry" || u.kind === "knight" || pose === "sword") {
      drawSword(ctx, x, y, s, z, u.kind === "knight" ? 16 : 11, reach > 0.4);
      return;
    }
    if (pose === "knife" || u.kind === "scout") {
      ctx.strokeStyle = "#6b4630";
      line(ctx, x, y, x + s * 1.2 * z, y + 3 * z);
      ctx.fillStyle = "#e4eaf0";
      ctx.strokeStyle = "#b7c0c8";
      ctx.beginPath();
      ctx.moveTo(x + s * 1.2 * z, y + 3 * z);
      ctx.lineTo(x + s * 2.4 * z, y - 7 * z);
      ctx.lineTo(x + s * 0.2 * z, y - 5 * z);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      return;
    }
    const tipX = x + s * (pose === "slash" && reach > 0.4 ? 10 : 3) * z;
    const tipY = y + (pose === "slash" && reach > 0.4 ? 6 : -10) * z;
    line(ctx, x, y, tipX, tipY);
    return;
  }
  if (pose === "fish") {
    const cast = ph < 0.22;
    const tipX = cast ? x - s * 2 * z : x + s * 12 * z;
    const tipY = cast ? y - 8 * z : y + 2 * z;
    ctx.strokeStyle = "#6b4630";
    line(ctx, x, y, tipX, tipY);
    if (!cast) {
      const bob = Math.sin(u.anim * 5) * 2 * z;
      ctx.strokeStyle = "rgba(28,25,21,0.45)";
      line(ctx, tipX, tipY, tipX + s * 2 * z, tipY + 10 * z + bob);
      ctx.fillStyle = "#c4502a";
      ctx.beginPath();
      ctx.arc(tipX + s * 2 * z, tipY + 10 * z + bob, 1.7 * z, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  if (pose === "bow" || u.kind === "archer" || u.kind === "crossbow") {
    const pull = pose === "bow" ? reach : 0.35;
    if (u.kind === "crossbow") {
      ctx.strokeStyle = "#3e342f";
      ctx.lineWidth = 2.2 * z;
      line(ctx, x - s * 7 * z, y, x + s * 7 * z, y);
      ctx.lineWidth = 1.4 * z;
      ctx.strokeStyle = "#6b4630";
      line(ctx, x - s * 6 * z, y - 4 * z, x + s * 2 * z, y - 4 * z);
      line(ctx, x - s * 6 * z, y - 4 * z, x - s * 6 * z, y + 4 * z);
      line(ctx, x - s * 6 * z, y + 4 * z, x + s * 2 * z, y + 4 * z);
      ctx.strokeStyle = "#c5ccd1";
      line(ctx, x - s * pull * 2 * z, y, x + s * 8 * z, y);
      return;
    }
    ctx.strokeStyle = "#6b4630";
    ctx.beginPath();
    ctx.arc(x, y, 7 * z, s > 0 ? -1.15 : Math.PI - 1.15, s > 0 ? 1.15 : Math.PI + 1.15);
    ctx.stroke();
    ctx.strokeStyle = INK;
    line(ctx, x, y - 6 * z, x - s * pull * 5 * z, y);
    line(ctx, x - s * pull * 5 * z, y, x, y + 6 * z);
    if (pull > 0.45) {
      ctx.strokeStyle = "#d7b23a";
      line(ctx, x - s * pull * 5 * z, y, x + s * 8 * z, y);
    }
    return;
  }
  if (u.kind === "villager" && pose === "walk") return;
}
function drawBundle(ctx, x, y, kind, z) {
  ctx.fillStyle = kind === "wood" ? "#7a4e2d" : kind === "gold" ? "#d7b23a" : kind === "stone" ? "#9aa1a8" : "#c4502a";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.2 * z;
  ctx.beginPath();
  ctx.roundRect?.(x - 4 * z, y - 3 * z, 8 * z, 6 * z, 1.5 * z);
  if (!ctx.roundRect) ctx.rect(x - 4 * z, y - 3 * z, 8 * z, 6 * z);
  ctx.fill();
  ctx.stroke();
}
function chip(ctx, x, y, z) {
  ctx.save();
  ctx.fillStyle = "#f4ead7";
  ctx.fillRect(x, y, 2 * z, 2 * z);
  ctx.fillRect(x + 3 * z, y - 3 * z, 1.6 * z, 1.6 * z);
  ctx.restore();
}
function stickLeg(ctx, hx, hy, ground, footDx, lift, z) {
  const fx = hx + footDx;
  const fy = ground - lift;
  const kneeX = hx + footDx * 0.45;
  const kneeY = hy + (fy - hy) * 0.48 - (2.2 * z + lift * 0.35);
  line(ctx, hx, hy, kneeX, kneeY);
  line(ctx, kneeX, kneeY, fx, fy);
}
function chopSwing(ph) {
  if (ph < 0.55) return lerp(-0.3, -2.35, (ph / 0.55) ** 1.35);
  if (ph < 0.74) return lerp(-2.35, 1.05, ((ph - 0.55) / 0.19) ** 0.55);
  return lerp(1.05, -0.3, (ph - 0.74) / 0.26);
}
function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}
function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function drawClub(ctx, x, y, s, z, swing) {
  const len = 8 * z;
  const ang = swing ? 0.7 : -1.05;
  const tx = x + Math.cos(ang) * s * len;
  const ty = y + Math.sin(ang) * len;
  ctx.strokeStyle = "#6b4630";
  line(ctx, x, y, tx, ty);
  ctx.fillStyle = "#5c4030";
  ctx.beginPath();
  ctx.arc(tx, ty, 2.5 * z, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}
function drawSword(ctx, x, y, s, z, len, swing) {
  const ang = swing ? 0.85 : -1.15;
  const tx = x + Math.cos(ang) * s * len * z;
  const ty = y + Math.sin(ang) * len * z;
  ctx.strokeStyle = "#6b4630";
  line(ctx, x, y, x + Math.cos(ang) * s * 2.2 * z, y + Math.sin(ang) * 2.2 * z);
  ctx.strokeStyle = "#d5dde6";
  ctx.fillStyle = "#eef3f7";
  ctx.beginPath();
  ctx.moveTo(x + Math.cos(ang) * s * 2 * z, y + Math.sin(ang) * 2 * z);
  ctx.lineTo(tx, ty);
  ctx.lineTo(tx - Math.sin(ang) * s * 1.4 * z, ty + Math.cos(ang) * 1.4 * z);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
function drawShield(ctx, x, y, z) {
  ctx.fillStyle = "#e7d3a2";
  ctx.strokeStyle = "#6b4630";
  ctx.lineWidth = 1.2 * z;
  ctx.beginPath();
  ctx.ellipse(x, y, 3.3 * z, 4.4 * z, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}
function drawHorse(ctx, sx, sy, dir, z, step, walking) {
  ctx.save();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 1.6 * z;
  const s = dir;
  const backY = sy - 12 * z;
  const rearX = sx - s * 8 * z;
  const chestX = sx + s * 7 * z;
  line(ctx, rearX, backY, chestX, backY);
  line(ctx, chestX, backY, chestX + s * 3 * z, backY - 7 * z);
  line(ctx, chestX + s * 3 * z, backY - 7 * z, chestX + s * 7 * z, backY - 6 * z);
  line(ctx, rearX, backY, rearX - s * 3 * z, backY + 4 * z);
  const kick = walking ? step * 3 * z : 0;
  const legs = [
    [sx - s * 5 * z, kick],
    [sx - s * 2 * z, -kick],
    [sx + s * 2 * z, kick],
    [sx + s * 5 * z, -kick]
  ];
  for (const [lx, k] of legs) line(ctx, lx, backY, lx + k, sy);
  ctx.restore();
}
function carried(realm, u) {
  if (u.kind === "hero") return heroTool(realm, u);
  if (u.order.type === "build" || u.order.type === "repair") return "hammer";
  if (u.order.type === "attack") {
    if (u.kind === "skeleton" || u.kind === "zombie") return u.kind;
    if (u.kind === "tamer") return "whip";
    if (u.kind === "halberd" || u.kind === "spear") return "spear";
    return u.kind === "archer" || u.kind === "crossbow" ? "bow" : "slash";
  }
  if (u.order.type === "gather") {
    const node = realm.nodes[u.order.nodeId];
    if (node?.kind === "tree") return "chop";
    if (node?.kind === "gold" || node?.kind === "stone") return "mine";
    if (node?.kind === "farm") return "farm";
    if (node?.kind === "sheep" || node?.kind === "nest" || node?.kind === "cart" || beastOf(node?.kind)) return u.kind === "tamer" && node.alive ? "whip" : node.alive ? "hunt" : "pick";
    if (node?.kind === "fish") return "fish";
    if (node?.kind === "berry") return "pick";
  }
  if (u.kind === "tamer") return "whip";
  if (u.kind === "demigod" || u.kind === "avatar" || u.kind === "god") return "staff";
  if (covenSide(realm, u.team) && u.kind !== "villager") return "staff";
  if (u.kind === "scout") return "knife";
  if (u.kind === "spear" || u.kind === "halberd") return "spear";
  if (u.kind === "club") return "club";
  if (u.kind === "warrior") return egyptSide(realm, u.team) ? "khopesh" : "warrior";
  if (u.kind === "sword" || u.kind === "cavalry" || u.kind === "knight" || u.kind === "guard") return egyptSide(realm, u.team) ? "khopesh" : "sword";
  if (u.kind === "archer" || u.kind === "crossbow") return "bow";
  if (u.kind === "mage" || u.kind === "frost" || u.kind === "priest" || u.kind === "warlock") return "staff";
  return "";
}
function poseOf(realm, u) {
  if (u.hp <= 0) return "fall";
  const traveling = u.order.type === "move" || u.order.type === "rally" || u.order.type === "drop" || u.order.type === "enter" || u.path.length > 0 && u.pathI < u.path.length;
  if (u.order.type === "idle") return "idle";
  if (traveling) return "walk";
  if (u.order.type === "build" || u.order.type === "repair") return "hammer";
  if (u.order.type === "attack") {
    if ((covenSide(realm, u.team) && u.kind !== "villager") || u.kind === "demigod" || u.kind === "avatar" || u.kind === "god") return "staff";
    if (u.kind === "tamer") return "slash";
    if (u.kind === "archer" || u.kind === "crossbow") return "bow";
    if (u.kind === "mage" || u.kind === "frost" || u.kind === "priest" || u.kind === "warlock") return "staff";
    return "slash";
  }
  if (u.order.type === "gather") {
    const node = realm.nodes[u.order.nodeId];
    if (!node) return "idle";
    if (node.kind === "tree") return "chop";
    if (node.kind === "gold" || node.kind === "stone") return "mine";
    if (node.kind === "berry") return "pick";
    if (node.kind === "farm") return "farm";
    if (node.kind === "sheep" || node.kind === "nest" || node.kind === "cart" || beastOf(node.kind)) return node.alive ? "hunt" : "pick";
    if (node.kind === "fish") return "fish";
  }
  return "idle";
}
export {
  drawRealm
};
