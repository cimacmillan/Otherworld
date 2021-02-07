
### Milestone 2
Puzzle maps to escape prison

### Doing
* Proper map loader and serialiser
* New map to test deserialising

### Polish 
* Improve head bob to not make noise when standing still (frequency?)

### Audio
* Don't start audio until button pressed (onGameStart?)
* Item collect sound
* BPM sequencer for syncing song change


### Maps
* Build map metadata with builder
* Map service?

### Serialiser
* Map loader and serialiser uses same entity factory (?) but serialiser passes state in as an argument - what about multiple entity creation
* Implement serialise / deserialise functions again
* Serialise into saved map, changing map loads serialised version

### Gameplay
* Destroy / remove key on door use?
* Item removed key hint
* Add some enemies to the game again?
* Add weapons to the game, with equiped inventory?

### Refactors
* Quiet entities list
* Use glm vec everywhere
* Audio metadata with gain 
* Refactor audio service to take Audio string
* Refactor graphics service to take sprite string?
* Remove manifest everywhere


-------


### Milestone 3 
NPCs & NPC Dialog
Quests


