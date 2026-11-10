# Halloweens Bounty

Build a small real-time strategy game called Halloweens Bounty. It plays like a tiny Warcraft III: one enemy, two resources, one hero, and a short list of buildings. The setting is Halloween, not the Warcraft factions. Do not use Human, Orc, Night Elf, Naga, blood elf, Paladin, Blademaster, footman, grunt, rifleman, or any other Warcraft character.

## Title screen

The first thing shown is a huge Headless Horseman in the moonlight, holding his flaming pumpkin head in one hand. The flame lights his coat and the pumpkins at his horse's feet. Behind him are crypts, a mix of tombstones, and dead trees. The name Halloweens Bounty is large and readable. One Begin button leaves this screen.

## Look

Simple 3D isometric view. Low, chunky models on a tilted ground plane. The camera looks down at a fixed isometric angle. Buildings are small and readable. Units are simple 3D figures, not stick drawings. Night, fog, and moonlight. Lots of pumpkins. No realistic detail, no cutscenes, and no portraits.

Each faction has its own color:

- Vampires are deep red.
- Ghosts are pale blue.
- Werewolves are brown.
- Zombies and mummies are pale green.

The hero is a larger version of that faction's soldier, with a bigger weapon and a small level number floating over them. Health bars show only when something is hurt. A short damage number floats up when a hit or a hero ability lands. Trees, gold, crypts, tombstones, and creep camps should read clearly at a glance.

## Music

Original background music only. A slow, low, minor melody. Think a quiet Nightmare Before Christmas mood meeting a Warcraft III menu, without copying either. Keep it mellow and phone-speaker friendly. No ticking, tapping, snare, or high whine. No crackle at full volume. A pause menu sets game speed, music volume, and effect volume.

## Controls

Same controls as Stickhold.

On a computer:

- W A S D and the arrow keys pan the map. The mouse wheel zooms in and out. Escape pauses.
- Drag a box with the mouse to select units. Buildings are not selected by the box.
- Double-click a unit to select every unit of that type currently on screen. Tab cycles through units of the selected type anywhere on the map.
- Control plus a number saves the current selection as a group. Pressing that number selects the group again. A unit may be in more than one group.

On a phone:

- Sliding one finger pans the camera. A pinch zooms in or out.
- Tap and hold, then drag, draws a selection box. A short tap still selects one unit or gives an order.
- Double-tap a unit to select every unit of that type on screen.

Orders:

- Tap a selected unit's button, then tap the ground, to move. Tap an enemy to attack. Tap a tree or a gold mine to gather.
- After a building button is chosen, the next ground tap places that building. A stop button cancels placement.

## Win and start

Win by destroying the enemy town hall. One enemy. The start screen picks your faction and the enemy's faction, then the enemy mood.

- Passive only fights back.
- Normal attacks if it sees you.
- Aggressive sends troops at your base.

The enemy builds workers, a barracks, an altar, and a small army, then acts by that mood.

## Map

A night field. Two resources only: gold and lumber. Workers gather both. Each player starts with a town hall, a few workers, and a nearby gold mine.

Dress the ground with:

- Pumpkins, in small patches.
- Crypts.
- Several kinds of tombstones: traditional slabs, crosses, statues, and pillars.
- Dead trees. Some of those trees wake up and attack if a unit gets too close. A woken tree is slow, hits in a short circle, and slows what it hits.

## Buildings

Every faction uses the same buildings.

- Town hall: trains workers. Losing your last town hall loses the game.
- Pumpkin patch: raises the unit cap.
- Barracks: trains the melee soldier.
- Lodge: trains the ranged unit and the caster.
- Altar: hires that faction's one hero, and revives the hero if the hero dies. Revival costs gold and takes time. A dead hero's level and items are kept.
- Tower: shoots enemies that come near.

No other buildings. No shops. No upkeep. No day and night. No second hero.

## Factions and troops

Four factions. Each has a worker, a melee soldier, a ranged unit, a caster, and one hero. Four units plus the hero.

Vampires are fragile. Their attacks give a little blood back.

- Worker: Thrall
- Melee: Knight
- Ranged: Crossbow
- Caster: Blood priest
- Hero: Vampire Lord

Ghosts are a little faster, and they pass through their own units.

- Worker: Shade
- Melee: Specter
- Ranged: Banshee
- Caster: Haunt
- Hero: Ghost Lord

Werewolves move faster and hit harder, and they cost more.

- Worker: Packhand
- Melee: Brute
- Ranged: Raider
- Caster: Moon shaman
- Hero: Alpha

Zombies and mummies are cheaper and weaker.

- Worker: Zombie
- Melee: Zombie soldier
- Ranged: Mummy archer
- Caster: Mummy priest
- Hero: Mummy Lord

## Heroes

Only one hero, hired at the altar. Levels 1 to 6. Experience comes from nearby kills. Enemy soldiers are worth more than creeps. Creeps stop giving experience at level 5. Each level gives one skill point and a little more health.

Each hero has four abilities. The first three can be learned before the end. The fourth unlocks at level 6. Ranks on the early abilities make them stronger. The ultimate has one rank. A hero is stronger than a normal soldier, but a group of soldiers can kill a low-level hero. The hero has six item slots. On death, those items fall on the ground. The same item does not stack in one slot.

Vampire Lord:

- Blood Tithe. Heals a hurt vampire, or wounds a living enemy if no ally needs it.
- Mist Form. Cannot be hurt for a short time.
- Blood Aura. Vampires steal a little life on hit. Always on once learned.
- Night Rising, at level 6. Brings two nearby dead allies back at partial health.

Ghost Lord:

- Wail. Damages and slows one enemy.
- Fade. Attacks miss for a short time.
- Grave Chill. Nearby enemies strike slower. Always on once learned.
- Procession, at level 6. Raises two ghosts for a short time.

Alpha:

- Moon Prowl. Vanishes for a moment. The next hit is much harder, then the vanish ends.
- Savage Strike. Claws sometimes hit twice as hard. Always on once learned.
- Two Shadows. Two pale copies fight, then fade.
- Wolfstorm, at level 6. Spins and hits everyone close.

Mummy Lord:

- Wrapping Coil. Heals your dead, or wounds the living if no ally is there to wrap.
- Consume. Destroys a nearby zombie to heal the lord.
- Rot Aura. Your dead move a little faster. Always on once learned.
- Rise Again, at level 6. Raises three zombies for a short time.

## Items

Items are Halloween relics. Three tiers. Green is common. Blue is stronger. Purple is rare. A camp's strongest body drops one item when the camp is cleared. Small camps drop green. A werewolf or a witch drops blue. The Pumpkin King drops purple.

Green:

- Witch's Brew. Drink it once to heal.
- Batwing Boots. Move faster.
- Raven Talons. A little more damage.

Blue:

- Specter Gloves. Attack faster.
- Pumpkin Mace. More damage.
- Grave Ash. Use it once to reveal anything hidden nearby.
- Ghoul Heart. More health.

Purple:

- Pumpkin Crown. More health, mana, and damage.
- Vampire's Mask. Hits heal you.
- Horseman's Seal. Once, when you would die, you stay up with a little health. The seal is then gone.

Weapons, armor, and jewelry should look gothic and Halloween: pumpkin heads, skulls, bones, bats, ravens, and grave dust. Not steel knight gear.

## Creeps

Neutral camps stand between the bases. They do not respawn. Hurting one wakes the whole camp. They do not chase forever. They return home if you leave.

A camp's color comes from how dangerous it is:

- Green: a few ghouls, ravens, or grave ghosts.
- Orange: a feral werewolf with ghosts, or a witch on a broomstick with feral vampires.
- Red: the Pumpkin King, the Headless Horseman, and a feral vampire together.

Bosses are the same creatures, only bigger, and each has one trick.

- Pumpkin King. A smash around himself that slows. When he is badly hurt, he pulls nearby enemies in.
- Headless Horseman. Charges in a line and hits whatever he reaches. He runs faster when he is badly hurt. He is the figure on the title screen, not a player hero.
- Feral Werewolf. Pounces onto one target and slows it.
- Witch. A hex that slows and hurts. She would rather hex a soldier than a hero.
- Feral Vampire. A bite that also heals the vampire.
- Waking Tree. A slow slam that roots and slows. Some stand in a grove. Others are ordinary dead trees until someone walks up to them.

Killing a camp gives a little gold and the one item from its strongest body.

## Leave out

No Night Elves, no Naga, no blood elves, and no Warcraft hero names. No second hero. No item recipes. No merchant. No upkeep. No day and night cycle. No more buildings than the list above.
