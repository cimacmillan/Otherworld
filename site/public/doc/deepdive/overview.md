
Otherworld is completely [open source](https://github.com/cimacmillan/Otherworld). It's written in TypeScript, but compiled into JavaScript for execution on the browser. GLSL is used with WebGL for the game's 3D rendering. JSX and React is used to render the website and the user interface. The user interface uses React Hooks and [Refunc](https://github.com/cimacmillan/Refunc) for state management. Tiled is used to design the game's map. Aseprite is used for its graphics. Logic and Pocket Operator Voice was used for its audio. The website and game are both hosted on AWS Amplify, with Route 53 for the domain name. Google analytics is used 
to track how many people are visiting the website. It uses Git for version control.

The game is written in 14K lines of Typescript and 213 files. It was written over the course of 2 years, with over 500 commits. The game uses a purpose-built engine. These deep dives detail how various parts of the engine work and why they're built that way. 

The overarching pattern of the engine is to use component composition for the game entities (enemies, items) and service interfaces for them to interact with the world (physics, rendering). 
