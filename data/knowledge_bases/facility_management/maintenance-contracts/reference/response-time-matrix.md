---
type: Reference
title: Response-Time Matrix
description: Every maintenance contract's priority/response-time service levels, side by side.
tags: [sla, response-time]
timestamp: 2026-09-07T00:00:00Z
---

# Response-Time Matrix

| Contract | Priority | Definition | Response time |
|---|---|---|---|
| [Passenger Elevators (ELEV-1 & ELEV-2)](/contracts/01-elevators-meridianvt.md) | Emergency (entrapment) | Person(s) trapped in a stationary car | 60 minutes, 24-7 |
| [Passenger Elevators (ELEV-1 & ELEV-2)](/contracts/01-elevators-meridianvt.md) | Urgent (car out of service) | One car unavailable, building operational | 4 business hours |
| [Passenger Elevators (ELEV-1 & ELEV-2)](/contracts/01-elevators-meridianvt.md) | Routine | Non-safety-critical fault (e.g. cosmetic) | 5 business days |
| [Central HVAC Plant & Room A/C Supply Valves](/contracts/02-hvac-northwind.md) | Emergency (total plant failure) | No heating/cooling to the Building | 2 hours |
| [Central HVAC Plant & Room A/C Supply Valves](/contracts/02-hvac-northwind.md) | Urgent (single floor affected) | One floor's VAV valves malfunctioning | 4 business hours |
| [Central HVAC Plant & Room A/C Supply Valves](/contracts/02-hvac-northwind.md) | Routine (single room) | One room too hot/cold | 3 business days |
| [Fire Extinguishers, Emergency Signage & Emergency Lighting](/contracts/03-firesafety-safeguard.md) | Emergency (discharged/missing unit) | Extinguisher used or removed, floor under-provisioned | 24 hours |
| [Fire Extinguishers, Emergency Signage & Emergency Lighting](/contracts/03-firesafety-safeguard.md) | Urgent (exit sign/light failure) | Exit sign or emergency light not illuminating | 48 hours |
| [Fire Extinguishers, Emergency Signage & Emergency Lighting](/contracts/03-firesafety-safeguard.md) | Routine | Scheduled inspection items | 5 business days |
| [Fire-Rated Stairwell Doors & Panic Hardware](/contracts/04-firedoors-ironclad.md) | Emergency (door will not close/latch) | Fire door compromised | 24 hours |
| [Fire-Rated Stairwell Doors & Panic Hardware](/contracts/04-firedoors-ironclad.md) | Routine | Minor adjustment needed | 5 business days |
| [Kitchen / Break Room Fridges](/contracts/05-kitchenfridges-coldstream.md) | Urgent (not cooling) | Unit not maintaining 2–5 °C | 48 hours |
| [Kitchen / Break Room Fridges](/contracts/05-kitchenfridges-coldstream.md) | Routine | Noise, minor fault | 5 business days |
| [Drinking Water Fountains / Bottle-Fill Stations](/contracts/06-waterfountains-pureflow.md) | Urgent (no water flow) | Unit not dispensing water | 3 business days |
| [Drinking Water Fountains / Bottle-Fill Stations](/contracts/06-waterfountains-pureflow.md) | Routine (not cold) | Chiller underperforming | 5 business days |
| [Managed Print Service — Shared Printers/Copiers](/contracts/07-printers-inkpoint.md) | Urgent (unit down, no alternate on floor) | Both units on a floor unavailable | 4 business hours |
| [Managed Print Service — Shared Printers/Copiers](/contracts/07-printers-inkpoint.md) | Routine (one unit down) | One of two units unavailable | 1 business day |
| [Main Electrical Switchgear & Building Power](/contracts/08-electrical-voltarc.md) | Emergency (building-wide power loss) | No power to the Building | 2 hours, 24-7 |
| [Main Electrical Switchgear & Building Power](/contracts/08-electrical-voltarc.md) | Urgent (partial loss) | One floor or system affected | 4 business hours |
| [Main Electrical Switchgear & Building Power](/contracts/08-electrical-voltarc.md) | Routine | Non-critical fault | 5 business days |
| [Meeting Room Video-Conferencing Systems](/contracts/09-meetingroomav-clearlink.md) | Urgent (room unusable for VC) | Display or camera not functioning | 1 business day |
| [Meeting Room Video-Conferencing Systems](/contracts/09-meetingroomav-clearlink.md) | Routine | Minor audio/video quality issue | 3 business days |
| [Badge Access Control & CCTV](/contracts/10-security-secureaccess.md) | Emergency (system down) | Access control or CCTV offline building-wide | 2 hours, 24-7 |
| [Badge Access Control & CCTV](/contracts/10-security-secureaccess.md) | Urgent (partial outage) | Single door/camera affected | 1 business day |
| [Badge Access Control & CCTV](/contracts/10-security-secureaccess.md) | Routine | Minor configuration change | 5 business days |

## Related

- [Contracts index](/contracts/index.md)
- [Vendor directory](/reference/vendor-directory.md)
