
// 1. init (is fog?), board size
// 1a. if fog, give up
// 2. init piece dictionaries: location -> historical unit id, unit id -> historical piece chip information
// 3. go through each turn 1 by 1 (api calling, post (not get) on url (turnPId is not required, tested manually), then parse the results):
// 3a. every time a unit gets created (on base/airport/port, sensei, hachi) assign an arbitrary unit id
// 3b. every time a unit enters combat, use damage calculator + results of combat to get chip results and update historical piece chip information
// 3c. every time a unit gets joined or tops off, reset chip information to [0, 0]
// 3d. every time a unit gets destroyed, deleted, or joins, set chip information to [0, 0]
// 4. you are at PIT=X. how to get chip information of location=Y?
// 4a. use location -> historical unit id map to get unit id
// 4b. use unit id -> historical chip info to get chip
// 4c. surface this to ui somehow

// a point in time (PIT) of a game can be identified by thez combination of ply index + action index
// historical unit id = list of (PIT, unit id) with implied (0, null) entry at beginning of time unless denoted otherwise (e.g. predeployed unit)
// historical unit id stores the PIT when the unit id began occupying this square. e.g. (4, 1), (10, null) indicates that unit id=1 occupied
// the square from PIT=4 to PIT=9
// historical piece chip information = (PIT, chip) with chip being a range within [0, 9]. 1st index >= 0th index. [0, 0] indicates no chip.
// btw unit id is provided within the json response but idk if it's consistent between calls so maybe I'll just ignore this :S


// RE-IMPLEMENTING CALCULATOR FOR CHIP DAMAGE
// not gonna do probability distribution crap bc hard to sample/calc lol
// 1. attacker: get minroll calc by setting good luck=0 and bad luck=max. this is opponent's received min base damage
// 2. attacker: get maxroll calc by setting good luck=max and bad luck=min. this is opponent's received max base damage
// 3. attacker: clamp chip damage result based on actual outcome of attack
// 4. defender: inspect outcome of attack and repeat the above on the other side
