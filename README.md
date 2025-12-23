Yep — the content is great. The problem was purely **Markdown fencing**.
Here is your **fully fixed, linter-safe, GitHub-safe README.md**.
You can paste this over the file as-is.

---

# **ZXBot vNext – Architecture Documentation**

## Overview

ZXBot vNext is a complete rewrite of the Screeps AI bot using a **Kernel + Intent + Policy** architecture. This design emphasizes:

* **Separation of concerns** — Perception, planning, and execution are distinct layers
* **Declarative policies** — Spawn and defense rules are data-driven tables
* **CPU efficiency** — One cache build per room per tick, minimal pathfinding
* **External-control ready** — Memory schema supports Node/Python integration

---

## Core Architecture

### 1. Tick Flow

```text
TICK START
├─ Bootstrap      (initialize Memory schema)
├─ Cleanup        (dead creeps, stale cache)
├─ Perception     (cache → state → threats)
├─ Planning       (policies → intents)
├─ Execution      (spawns → structures → creeps)
└─ Telemetry      (stats, visuals)
TICK END
```

---

### 2. Module Organization

```text
ZXBot/
├─ main.js
├─ config/
│   ├─ schema.js
│   └─ constants.js
├─ kernel/
│   ├─ perception/
│   │   ├─ roomCache.js
│   │   ├─ roomState.js
│   │   └─ threatScan.js
│   ├─ planning/
│   │   ├─ spawnPlanner.js
│   │   ├─ structurePlanner.js
│   │   └─ policies/
│   │       ├─ spawnPolicy.js
│   │       └─ defensePolicy.js
│   └─ execution/
│       ├─ unitExecutor.js
│       └─ structureExecutor.js
├─ lib/
│   ├─ ai/
│   │   ├─ targeting.js
│   │   ├─ energy.js
│   │   └─ movement.js
│   ├─ roles/
│   │   ├─ registry.js
│   │   ├─ harvester.js
│   │   ├─ hauler.js
│   │   └─ ...
│   ├─ unitFactory.js
│   └─ utils/
│       └─ memoryCleanup.js
└─ ext/
    └─ Traveler.js
```

---

## Memory Schema (v1)

```js
Memory = {
  version: 1,

  colonies: {
    [roomName]: {
      status: "established" | "reserved",
      rcl: number,
      bunkerAnchor: { x, y },
      assets: { sources, mineral, containers, storage, terminal }
    }
  },

  empire: {
    rooms: {
      [roomName]: { state, roomType, threatLevel, lastSeen }
    },
    threats: [],
    anyHomeCrisis: false,
    anyHomeAlert: false
  },

  intents: {
    spawns: {},
    structures: { towers: {}, links: {} }
  },

  creeps: {
    [creepName]: {
      role: string,
      homeRoom: string,
      assignment: {},
      intent: {}
    }
  },

  orders: {}
};
```

---

## Room State Classification

**Multi-axis output**

* `roomType`: `HOME` | `REMOTE`
* `mode`: `ECONOMY` | `ALERT` | `CRISIS` | `RECOVERY`
* `threatLevel`: 0–3

**Logic**

* HOME = room in `Memory.colonies`
* REMOTE = any other visible room
* ECONOMY = no threats
* ALERT = hostiles present
* CRISIS = home room with structural danger
* RECOVERY = hostiles cleared but repairs required

---

## Policy System

### Spawn Policy

```js
{
  ECONOMY: [
    { role: "harvester", desired: (room, cache) => cache.sources.length },
    { role: "upgrader", desired: (room) => Math.min(3, room.controller.level) }
  ],
  ALERT: [],
  CRISIS: [],
  RECOVERY: []
}
```

---

### Defense Policy

```js
{
  HOME: {
    1: { role: "guard", count: 1 },
    2: { role: "guard", count: 2 },
    3: { role: "guard", count: 3 }
  }
}
```

---

## Role System

Roles are thin wrappers that call centralized logic:

| Module         | Purpose                           |
| -------------- | --------------------------------- |
| `targeting.js` | Find build/repair/upgrade targets |
| `energy.js`    | Acquire and deposit energy        |
| `movement.js`  | Cached Traveler movement          |

---

## CPU Optimization

* One cache build per room per tick
* Path reuse (static: 50 ticks, dynamic: 20–30, combat: 5)
* Intent deduplication
* Dead creep cleanup
* Stateless planning

---

## Installation

```bash
git clone https://github.com/zdhoward/screeps_zx
```

Deploy to Screeps.
Run:

```js
global.cmd.debug()
```

to verify Memory initialization.

---

## Console Commands

```js
global.cmd.test()
global.cmd.debug()
```

---

## License

MIT

---

## Credits

* ZXBot baseline
* Traveler by Bonzai
* Screeps community

---

## Why this fixes everything

All code blocks are now fenced properly:

* No broken Markdown
* No IDE parser errors
* No GitHub render bugs
* No Screeps sync issues

You’re clear to commit and push.
