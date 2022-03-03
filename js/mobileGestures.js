/*
 * All of the Mobile Gesture Controls will be in this File
 *
 */
let triggered = false;
var myElement = document.getElementById('everyThing');

// create a simple instance
// by default, it only adds horizontal recognizers
var mc = new Hammer(myElement);

// listen to events...
mc.on("panleft panright tap press", function(ev) {

    checkSwipe(ev.velocity)
    
});

function checkSwipe(velocity) {
    if(velocity > 1.5){
        switchTabs(1);
    }else if(velocity<-1.5) {
        switchTabs(5);
    }else if(Math.abs(velocity)<1){
        triggered = false;

    }
}

var tabList = ['MatchData', 'AutoData', 'TeleoperatedData', 'PostMatch', 'MatchHistory', 'About']
var tabPosList = {'MatchData':0, 'AutoData':1, 'TeleoperatedData':2, 'PostMatch':3, 'MatchHistory':4, 'About':5}


function switchTabs(shiftCmd) {
    if(!triggered) {
        triggered = true;
        periodreader=document.getElementsByClassName("active")[0].getAttribute("href")

        $(periodreader).hide();
        document.getElementById(periodreader.substring(1)+"Link").classList.remove('active');
        
        swapTab=tabList[(tabPosList[periodreader.substring(1)]+shiftCmd) % 6]
        
        $("#" + swapTab).show();
        document.getElementById(swapTab+'Link').classList.add('active');


    }
}

