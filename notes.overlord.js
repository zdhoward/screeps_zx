/*

    OVERLORD

    Concept:
        A multi layered system to drive all logic in screeps
            Layers:
                - 1st: Creep logic [per tick]
                    - If a creep exists, this handles its logic
                - 2nd: Room logic (My Spawn Rooms) [per every few seconds]
                    - Handling spawning
                    - Handling Queueing
                    - Launching expeditions & attacks
                        - Also handles remote rooms
                    - Handling room-wide resources
                - 3rd: Game logic (Director) [per every few minutes]
                    - Plants flags to execute behaviours
                    - Handling inter room resource management via requests
                    - Basically just automates player behaviour in directing the rooms and creeps

    Ideas:
        Creeps:
            - Memory must work as a state machine
            - targets and home info set on spawn
            - Use a base creep fucntion library to share behaviors. protyping? inheritance?
            - required 'home' field for filters to see who belongs to what
            BaseCreep Memory:
                { body, name, home, state=init, fleeing=false }
            BaseCreep Functions:
                moveTowards(exit)
                collectEnergy(sources[])
                fleeHostiles()
                returnResourcesAndSuicide()
            OtherClasses:
                Harvester
                Harvester_Remote
                Upgrader
                Builder
                // Colonist (setup base in newly claimed territory) - Just needs to build 1 spawn, add into claimer
                Claimer (claims or reserves a room)
                Runner (cleanup + assist other jobs)
                Scout (flag to keep vision in room)
                Attacker_Tank
                Attacker_Ranged
                Attacker_Claimer
                Defender

        Flags:
            - Use these to drive behaviours
            - can be used by the DirectorOverlord to mimic player actions under certain conditions

        Buildings:
            - Need basic logic to place spawn
            - Need basic logic to build extensions when possible

        Room:
            - Needs to assign work to creep on spawn
            - manage everything through room memory
            - manage remote creeps from this room
            - smart_harvest to assign x workers to each source depending on available mining locations
            - respond to invaders

*/