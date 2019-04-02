console.clear();

var calc = {
    accuracy: (min,max)=>math.randomInt(min || 25, max || 95)
};

function Match(numRounds) {
//     console.log('Teams:', [this.team1, this.team2]);

    // Number of rounds in total
    this.numRounds = !!numRounds ? numRounds :  14;
    // Number of rounds done
    this.numRoundsDone = 0;

    this.roundTime = 0;
    
    // We place all randomly generated numbers here, this way the client (this code will run on the server-side) can watch the match from the game's application to see what happpened
    // After awhile we can add functionality for players to watch matches live and make changes live. Using firebase as the main focal point.
    // Firebase will hold the match info that is public: match stats and the like. This way the player just has to reach into the match to watch the game.
    // ================================================================ WARNING!!!!!!!!! ============================================================================== //
    // DO NOT DO THE ABOVE. USERS COULD SEE THE CODE, DECIPHER/UNDERSTAND IT AND FIND A WAY OF EXPLOITING IT!! JUST SAVE THE MESSAGES IN THE QUEUE (LOOK AT THE CONSOLE.LOGS FOR EXAMPLES). THEN USE THE CLIENT CODE TO SHOW THESE EVENTS
    
    this.eventQueue = typeof eventQueue !== 'undefined' ? eventQueue : [];

    // These are the events that the game will run
    this.event = {
        "passToShoot": (atk, def)=> {
            let shouldContinue = true,
                hasScored = false,
                event = this.event;
// debugger;
            do {
                if (atk.ballInOwnBox) {
                    // Pass
                    console.log(atk.name, "has the ball in their own box");
                    if (event.attemptPass(atk, def)) {
                        // Move ball into next zone
                        atk.whereIsBall(true, false);
                        def.whereIsBall();
                        atk.match.central = false;
                    } //
                    else {
                        console.log(atk.name + " has lost possession of the ball!");
                        shouldContinue = false;
//                         event.counterAttack(def, atk);
                    }
                } //
                else if (atk.ballInOwnHalf && !atk.ballInOwnBox) {
                    // Pass
                    console.log(atk.name, "has the ball in their own half");
                    // If the pass is successful
                    if (event.attemptPass(atk, def)) {
                        // Move ball into next section (i.e. def.ballInOwnHalf)
                        atk.whereIsBall();
                        def.whereIsBall();
                        atk.match.central = true;
                    } //
                    else {
                        console.log(atk.name + " has lost possession of the ball!");
                        shouldContinue = false;
//                         event.counterAttack(def, atk);
                    }
                } //
                else if (atk.match.central) {
                    // Pass
                    console.log(atk.name, "has the ball in center field.");
                    // If the pass is successful
//                     console.log('Ball is in central?', atk.match.central)
//                     console.log('This:', this);
                    if (event.attemptPass(atk, def)) {
                        // Move ball into next section (i.e. def.ballInOwnHalf)
                        atk.whereIsBall();
                        def.whereIsBall(true, false);
                        atk.match.central = false;
                    } //
                    else {
                        // Return false telling the game that there isn't a goal scored
                        console.log(atk.name + " has lost possession of the ball!");
                        shouldContinue = false;
                    }
                } //
                else if (def.ballInOwnHalf && !def.ballInOwnBox) {
                    // Pass or shoot
                    console.log(atk.name, "has the ball in their opponent's half.");
                    if (math.randomBool()) {
                        // Pass
//                         console.log(atk.name + " choose to pass the ball!");
                        if (event.attemptPass(atk, def)) {
                            // Move ball into defence's box
                            atk.whereIsBall();
                            def.whereIsBall(true, true);
                        }
                        else {
                            console.log(atk.name + " has lost possession of the ball!");
                            shouldContinue = false;
                        }
                    } //
                    else {
                        // Shoot
//                         console.log(atk.name + " choose to shoot the ball!");
                        const result = event.shoot(atk, def);
                        hasScored = result.hasScored;
                        shouldContinue = result.shouldContinue;
                    }
                } //
                else if (def.ballInOwnBox) {
                    // Shoot
                    console.log(atk.name, "has the ball in their opponent's box.");
//                     console.log("They are in the opponent's box!!");
                    const result = event.shoot(atk, def);
                    hasScored = result.hasScored;
                    shouldContinue = result.shouldContinue;
                } //
                else {
                    shouldContinue = false;
                }
            }while(shouldContinue);

            return hasScored;
        },
        "counterAttack": (atk, def) => {
            let shouldCounter = false;
            if (atk.ballInOwnBox && (shouldCounter = Math.random() <= 0.7, shouldCounter)) {
                // Counter-Attack!!
                console.log("Yes!", def.name, "counter!!!");
                if (this.event.passToShoot(def, atk)) {
                    def.goals++;
//                     def.shotsOnTarget++;
                    console.log(def.name + " has scored" + math.randomChoice(["!!"," an amazing goal.", " a spectacular goal.", " a brilliant goal."]));
                    console.log("The score is now " + this.team1.goals + "-" + this.team2.goals);
                } //
                else {
                    console.log("Wow, that was close!");
                    console.log("Will",atk.name, "counter the counter?!");
                    this.event.counterAttack(def, atk);
                }
            } //
            else if (atk.ballInOwnHalf && (shouldCounter = Math.random() <= 0.52, shouldCounter)) {
                // Counter-Attack!!
                console.log("Yes!", def.name, "counter!!!");
                if (this.event.passToShoot(def, atk)) {
                    def.goals++;
//                     def.shotsOnTarget++;
                    console.log("It's a goal!!!! From outside the box!! Brilliant shot!!!!", "What" + math.randomChoice([" a goal!"," an amazing goal!!", " a spectacular goal!!", " a brilliant goal!!"]));
                    console.log("The score is now " + this.team1.goals + "-" + this.team2.goals);
                } //
                else {
                    console.log("Will",atk.name, "counter the counter?!");
                    this.event.counterAttack(def, atk);
                }
            } //
            else if ((this.central || def.ballInOwnBox || def.ballInOwnHalf) && (shouldCounter = Math.random() <= 0.25, shouldCounter)) {
                // Counter-Attack!!
                console.log("Yes!", def.name, "counter!!!");
                let counterStart = this.central ? "All the way from the center field.": (def.ballInOwnHalf && !def.ballInOwnBox ? "All the way from their own half." : (def.ballInOwnBox ? "All the way from their own box!!" : ""));
                if (this.event.passToShoot(def, atk)) {
                    def.goals++;
//                     def.shotsOnTarget++;
                    console.log("It's a goal off the counter!!", counterStart, "What" + math.randomChoice([" an amazing goal.", " a spectacular goal.", " a brilliant goal."]));
                    console.log("The score is now " + this.team1.goals + "-" + this.team2.goals);
                } //
                else {
                    console.log("Will",atk.name, "counter the counter?!");
                    this.event.counterAttack(def, atk);
                }
            } //
            else {
                console.log("No. There's no counter");
            }
        },
        "shoot": (atk, def) => {
            let result = {};
            result.hasScored = false;
            if (this.event.attemptShoot(atk, def)) {
                // Now check if the shoot was on target
                if (this.event.shootOnTarget(atk, def)) {
                    console.log("The shot is on target!!");
                    // Has goalkeeper saved the ball
                    if (this.event.isGoal(atk, def)) {
                        // Goal
                        console.log("The goalkeeper tries to save it...");
                        console.log("...the ball flies past him!!");
                        result.hasScored = true;
                    } //
                    else {
                        // Check if it's a save, corner, or shot was off target
//                         if (this.event.shootOnTarget(atk, def)) {
                            // Either save or corner
//                             console.log("The shot is on target!!");
                            console.log("The goalkeeper tries to save it!!");
                            if (math.randomBool()) {
                                // Shoot saved!
                                def.saves++;
                                console.log("Well done by the goalkeeper to save the shot!");
                            } //
                            else {
                                // Corner!!
                                console.log("The goalkeeper misses the ball!!");
                                console.log("The ball hit the crossbar! That was close!!");
                            }
//                         } //
//                         else {
//                             console.log("Oh!! What a miss. The shoot was off target!");
//                         }
                    }
                } //
                else {
                    console.log("Oh!! What a miss. The shoot was off target!");
                }
                
            } //
            else {
                console.log(atk.name + " has lost possession of the ball!");
            }
            result.shouldContinue = false;

            return result;
        },
        "shootOnTarget": (atk, def) => {
            const result = math.randomInt(0, 100) <= atk.shootingAccuracy;
            if (result) {
                atk.shotsOnTarget++;
            }
//             console.log(result ? "Shoot is on target!" : "Oh!! What a miss. The shoot was off target!");
            return result;
        },
        "isGoal": (atk, def) => {
            const result = Math.random() <= (atk.shootingAccuracy) / (atk.shootingAccuracy + def.saveAccuracy);
//             console.log("The goalkeeper tries to save it!!");
//             console.log("Pass chance:", Math.round((atk.passingAccuracy / (atk.passingAccuracy + def.tackleAccuracy)) * 100));
//             console.log(result ?  "Goalkeeper failed to save the shoot!!" : "Well done by the goalkeeper to save the shot!");
            return result;
        },
        "attemptPass": (atk, def) => {
            const result = Math.random() <= atk.passingAccuracy / (atk.passingAccuracy + def.tackleAccuracy);
            console.log("Attempts to pass!");
            atk.passes++;
            if (result) {
                atk.passesCompleted++;
            } //
            else {
                def.tackles++;
            }
//             console.log("Pass chance:", Math.round((atk.passingAccuracy / (atk.passingAccuracy + def.tackleAccuracy)) * 100));
            console.log(result ? "Great pass!" : "Pass blocked!");
            return result;
        },
        "attemptShoot": (atk, def) => {
            const result = Math.random() <= atk.shootingAccuracy / (atk.shootingAccuracy + def.blockingAccuracy);
            console.log("Tries to shoot!");
            if (!result) {
                def.blocks++;
            } //
            else {
                atk.shots++;
            }
//             console.log("Shoot chance:", Math.round((atk.shootingAccuracy / (atk.shootingAccuracy + def.blockingAccuracy)) * 100))
            console.log(result ? "Great shoot! The defender couldn't stop it!" : "Shoot blocked! Brilliant work by the defender.");
            return result;
        },
        "hasFouled": (atk, def) => {
            // Here we calculate the chance of commiting a foul. A player can commit a foul if he is very aggressive (use aggression attribute), has bad displine (i.e. 100 - displine. This way if he has a high displine attribute, then there is a very low chance of him commiting a foul), and has a bad tackling attribute (Same as discipline attribute calculations mentioned before).
        },
    };

    this.round = ()=>{
        // This is where all the checks occur for the match
        
        // time at which we started this round
        let roundTime = new Date().getTime();

        let atk = null,
            def = null,
            t1 = this.team1,
            t2 = this.team2,
            ballPosition = math.randomInt(0, 4);

        // Set the central to false
        
        // Check where the ball is in this event
        switch (ballPosition) {
            case 0:
                // Ball is in team1's box
                t1.whereIsBall(true, true);
                t2.whereIsBall();
                this.central = false;
                break;
            case 1:
                // Ball is in team1's half
                t1.whereIsBall(true, false);
                t2.whereIsBall();
                this.central = false;
                break;
            case 2:
                // Ball is in midfield/central
                this.central = true;
//                 console.log("this:", this);
                t1.whereIsBall();
                t2.whereIsBall();
                break;
            case 3:
                // Ball is in team2's half
                t1.whereIsBall();
                t2.whereIsBall(true, false);
                this.central = false;
                break;
            case 4:
                // Ball is in team2's box
                t1.whereIsBall();
                t2.whereIsBall(true, true);
                this.central = false;
                break;
            default :
                this.central = true;
                t1.whereIsBall();
                t2.whereIsBall();
                break;
        };
//         console.log(t1.name, t1);
//         console.log(t2.name, t2);
        // Check who has the ball. An alternative to passingAccuracy would...
        // ...be completed passes. Since possession percentage is calculated...
        // ...by using the total number of passes/touches in the whole game...
        // ...divided into the completed passes/touches of each team. This...
        // ...will give us a percentage to work with. We could also do this...
        // ...:Math.random() > t1.passesCompleted / (t1.passesCompleted + t2.passesCompleted)
        // The result being true would mean that t1 doesn't have the ball...
        // ...but for testing purposes we will use the passingAccuracy
        t1.hasBall = Math.random() > t1.passingAccuracy / (t1.passingAccuracy + t2.passingAccuracy);
//         t1.hasBall ? console.log("Team 1 has the ball") : console.log("Team 2 has the ball");
        // Set the atk and def variables so that we know who's attacking...
        // ...and defending
        if (t1.hasBall) {
            atk = t1;
            def = t2;
        }
        else {
            atk = t2;
            def = t1;
        }

        // Check whether we pass or shoot. And then return whether the attack...
        // ...attempt was successful
        if (this.event.passToShoot(atk, def)) {
            atk.goals++;
//             atk.shotsOnTarget++;
            console.log("It's a goal!!", atk.name + " has scored " + math.randomChoice(["a goal.","an amazing goal.", "a spectacular goal.", "a brilliant goal.", "the goal of the century."]));
            console.log("The score is now " + t1.goals + "-" + t2.goals);
        } //
        else {
            // Can we counter-attack?
            console.log("Will", def.name, "counter-attack?");
            this.event.counterAttack(atk, def);
        }
        console.log("");
        console.log("Round took:", (this.roundTime += new Date().getTime() - roundTime, this.roundTime) + "ms");
    };
    // ./ round

    this.matchDone = ()=>{
        // We are done with the match
        console.log("");
        console.log('The Match is over!!');
        console.log('The Match ended ', this.team1.goals, '-', this.team2.goals);
        console.log("");
        console.log("           Match Stats");
        console.log("           ===========");
        console.log("");
        let t1 = this.team1,
            t2 = this.team2;
        t1.calcStats();
        t2.calcStats();
        t1.possession = (t1.possession = Math.round((t1.passesCompleted / (t1.passesCompleted + t2.passesCompleted)) * 100), math.between(t1.possession, 30, 70) ? t1.possession : (t1.possession > 70 ? 70 : (t1.possession < 30 ? 30 : t1.possession)));
        t2.possession = 100 - t1.possession;
        
        console.log("           Goals:", t1.goals + "-" + t2.goals);
        console.log("      Possession:", t1.possession + "%-" + t2.possession + "%");
        console.log("           Shots:", t1.shots + "-" + t2.shots);
        console.log(" Shots on target:", t1.shotsOnTarget + "-" + t2.shotsOnTarget);
        console.log("   Shot Accuracy:", t1.shotAccuracy + "-" + t2.shotAccuracy);
        console.log("Chance Coversion:", t1.chanceConversion + "-" + t2.chanceConversion);
        console.log("          Passes:", t1.passes + "-" + t2.passes);
        console.log("Passes completed:", t1.passesCompleted + "-" + t2.passesCompleted);
        console.log("   Pass Accuracy:", t1.passAccuracy + "-" + t2.passAccuracy);
        console.log("         Tackles:", t1.tackles + "-" + t2.tackles);
        console.log(" Tackle Accuracy:", Math.round((t1.tackles / (t2.shots + t2.passes)) * 100) + "%-" + Math.round((t2.tackles / (t1.shots + t1.passes)) * 100) + "%");
        console.log("          Blocks:", t1.blocks + "-" + t2.blocks);
        console.log("           Saves:", t1.saves + "-" + t2.saves);
    };

    // This starts the match
    this.start = (numRounds)=>{
        console.clear();
        this.roundTime = 0;
        this.matchTime = new Date().getTime();
        this.numRounds = typeof numRounds !== 'undefined' ? numRounds : this.numRounds;

        // Create Teams
        this.team1 = new Team(chance.capitalize(chance.word()) + ' FC', this);
        this.team2 = new Team(chance.capitalize(chance.word()) + ' FC', this);

        // Intro for testing lol
        console.log("Welcome to the match between", this.team1.name, "and", this.team2.name);
        console.log("We hope you enjoy it.");

        // Get all the timestamps
        let time = [],
            shouldReportHalfTime = true;
        for (var i = 0, length = this.numRounds - 1; i < length; i++) {
            time.push(Math.round((90 / length) * i) + math.randomInt(0, Math.round(90 / length)));
        }

        // This is the game loop        
        for (var i = 0, length = this.numRounds; i < length; i++) {
            // Now we run the game
            console.log("");
            console.log("===Time:" + (time[i] ? time[i] : "90+") + " minutes (" + this.team1.goals + "-" + this.team2.goals + ")" + "====");
            console.log("");

            // Do some prep round setup stuff here

            this.round();
            if (time[i + 1] > 45 && shouldReportHalfTime) {
                console.log("");
                console.log("=== It's now Half time ====");
                shouldReportHalfTime = false;
            }
        }
//         console.log("Match took", (this.matchTime = new Date().getTime() - this.matchTime, this.matchTime) + "ms");
//         console.log("Rounds took", this.roundTime + "ms in total. That's", Math.round((this.roundTime / (this.roundTime + this.matchTime)) * 100) + "% of the total match time!");
        this.matchDone();
    };
}

var play = new Match();
// play.init();
play.start();
