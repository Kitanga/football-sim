function Team(name, match) {
    this.name = name;
    this.match = match;

    // Stats
    this.goals = 0;
    this.possession = 0;
    this.passes = 0;
    this.passesCompleted = 0;
    this.shotsOnTarget = 0;
    this.shots = 0;
    this.tackles = 0;
    this.saves = 0;
    this.blocks = 0;
    this.passAccuracy = 0;
    this.shotAccuracy = 0;
    this.chanceConversion = 0;

    this.ballInOwnHalf = false;
    this.ballInOwnBox = false;
    this.whereIsBall = (inThird, inBox) => {
        if (inThird) {
            this.ballInOwnHalf = inThird;
            this.ballInOwnBox = inBox;
            //     console.log("In own half:", this.ballInOwnHalf);
            //     console.log("In own box:", this.ballInOwnBox);
        } else {
            this.ballInOwnHalf = false;
            this.ballInOwnBox = false;
        }
    };
    this.verifyAccuracy = (accuracy) => {
        return (typeof accuracy === NaN || accuracy === Infinity || accuracy === NaN || isNaN(accuracy)) ? "0%" : accuracy + "%";
    };
    this.calcStats = () => {
        // Pass Accuracy
        this.passAccuracy = Math.round((this.passesCompleted / this.passes) * 100);
        // this.passAccuracy = (typeof this.passAccuracy === NaN || this.passAccuracy === Infinity || this.passAccuracy === NaN || isNaN(this.passAccuracy)) ? "0%" : this.passAccuracy + "%";
        this.passAccuracy = this.verifyAccuracy(this.passAccuracy);
        // Shot Accuracy
        this.shotAccuracy = Math.round((this.shotsOnTarget / this.shots) * 100);
        // this.shotAccuracy = (typeof this.shotAccuracy === NaN || this.shotAccuracy === Infinity || this.shotAccuracy === NaN || isNaN(this.shotAccuracy)) ? "0%" : this.shotAccuracy + "%";
        this.shotAccuracy = this.verifyAccuracy(this.shotAccuracy);
        // Chance conversion
        this.chanceConversion = Math.round((this.goals / this.shotsOnTarget) * 100);
        // this.chanceConversion = (typeof this.chanceConversion === NaN || this.chanceConversion === Infinity || this.chanceConversion === NaN || isNaN(this.chanceConversion)) ? "0%" : this.chanceConversion + "%";
        this.chanceConversion = this.verifyAccuracy(this.chanceConversion);
    };

    this.hasBall = false;
    this.passingAccuracy = calc.accuracy();
    this.shootingAccuracy = calc.accuracy();
    this.blockingAccuracy = calc.accuracy();
    this.saveAccuracy = calc.accuracy();
    this.tackleAccuracy = calc.accuracy();
}