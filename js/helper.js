var math = {
    between: function(n, min, max) {
      return ((n >= min) && (n <= max));
    },
    
    random: function(min, max) {
        return ( min + (Math.random() * (max - min))) ;
    },

    randomInt: function(min, max) {
        return Math.round(this.random(min, max));
    },

    randomChoice: function(choices) {
        return choices[this.randomInt(0, choices.length - 1)];
    },

    randomBool: function() {
        return Math.random() > 0.5;
    },

    reverseArray: ()=> {
        let r = [];
        for(let i = 1, l = a.length;i <= l;i++){
            r.push(a[l - i]);
        }
        console.log(r);
        return r;
    }
};