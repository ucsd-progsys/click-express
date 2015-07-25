var tips = [ "Man does not live on bread alone"
           , "Judge not lest ye be judged"
           , "She came in through the bathroom window"
           , "She works just 3 days a week"
           ];

export function randomTip(){
  var n = Math.floor(Math.random() * tips.length);
  return tips[n];
}
