// script.js by Adam Watkin 2017
// This is very much a learning exercise.
// 

// global variables
var secondsRemaining = 0;
var secondsRemainingOriginal;

// must be declared first before
var intervalHandle;

var running = false

var firstWarningTime;
var secondWarningTime;

var firstWarningCalled = false;
var showFristWarningFor = 30;

var secondWarningCalled = false;
var showSecondWarningFor = 30;

var doDelayCall = false;

var doDelay = false;
var doFirstAudio = false;
var doSecondAudio= false;

var audio = new Audio('whisky_ding_short.wav');
var hasRun = false

var timesUpCalled = false; 

// this is resetting the style?
function resetPage() {
    document.getElementById("inputArea").style.display = "block";
    // so somehow secondsRemaning was always -1 how? who knows?! 
    secondsRemaining++;
    // yup it's pretty much impossible to get secondsRemaning to stay at 0?
    // alert(secondsRemaining + " from reset with love" + (secondsRemaining - 1));
}

function tick() {
    if (running === true) {

    // grab the h1
    var timeDisplay = document.getElementById("time");

    if (doDelay === true && doDelayCall === true) {
        secondsRemaining = secondsRemaining + 3;
        updateCounter;
        doDelayCall = false;
    }

    // turn seconds into mm:ss
    var min = Math.floor(secondsRemaining / 60);
    var sec = secondsRemaining - (min * 60);

    
    // add a leading zero (as a string value) if seconds less than 10
    if (sec < 10) {
        sec = "0" + sec;
    }
    // concatenate with colon
    var message = min + ":" + sec;
    // now change the display
    timeDisplay.innerHTML = message;

    // SHOW FIRST WARNING
    if (secondsRemaining === firstWarningTime) {

        if (firstWarningTime / 60 == 1) {
            // if the warning minute should not have an s on the end
            document.getElementById("warningArea").innerHTML = "First warning: \n" + min + " minute remaining.";
            
        }
        else {
            document.getElementById("warningArea").innerHTML = "First warning: \n" + min + " minutes remaining.";
        }
        
        firstWarningCalled = true;
        if (doFirstAudio === true) {
            playAudioWarning();
        }
    }

    if (firstWarningCalled && showFristWarningFor === 0) {
        // blanks out the warning area
        // document.getElementById("warningArea").innerHTML = "<br>";
        document.getElementById("warningArea").innerHTML = " ";
        // you have to be careful with this, it won't show the second warning once it's called
        // document.getElementById("warningArea").style.visibility = "hidden";
    }

    if (firstWarningCalled) {
        showFristWarningFor =  showFristWarningFor - 1
    }

    // SHOW SECOND WARNING
    if (secondsRemaining === secondWarningTime) {
        if (secondWarningTime / 60 == 1) {
            // if the warning minute should not have an s on the end
            document.getElementById("warningArea").innerHTML = "Second warning: \n" + min + " minute remaining.";
            
        }
        else {
            document.getElementById("warningArea").innerHTML = "Second warning: \n" + min + " minutes remaining.";
        }
        secondWarningCalled = true;
        if (doSecondAudio === true) {
            playAudioWarning();
        }
    }


    // this was missing for some reason?
    if (secondWarningCalled && showSecondWarningFor === 0) {
        // blanks out the warning area
        // document.getElementById("warningArea").innerHTML = "<br>";
        document.getElementById("warningArea").innerHTML = " ";
        // you have to be careful with this, it won't show the second warning once it's called
        // document.getElementById("warningArea").style.visibility = "hidden";
    }

    // if i manage to set a CSS element for warnings this won't be needed
    // if (secondWarningCalled && showSecondWarningFor === 0) {
    //     // blanks out the warning area
    //     // document.getElementById("warningArea").innerHTML = "<br>";
    // }
    // second warning guard
    if (secondWarningCalled) {
        // alert('second warning called');
        
        showSecondWarningFor =  showSecondWarningFor - 1
    }
    
    // stop if down to zero
    if (secondsRemaining <= 0) {
        document.getElementById("warningArea").innerHTML = "Time's up.";
        timesUpCalled = true;

        clearInterval(intervalHandle);
        secondsRemaining = 0;
        hasRun = false;
        changeHeading();

        var blah = document.getElementById("startButton");
        blah.value = "Start";

        // reset warnings
        resetWarnings();

        // reset time delay
        if (doDelay === true) {
            doDelayCall = true;
        }

        // added to try to get the input fields to work
        // when the countdown is at 00:00
        running = false;
        disableFields();
        // doesn't reach anything after this?
        
        // so this had already been done above?
        // yet somehow it's -1? ah it's set to -1 below, but the page reset should counteract that?
        secondsRemaining = 0;
        resetPage();

    }
    // subtract from seconds remaining
    secondsRemaining--;
    }
}

function resetWarnings() {
    firstWarningCalled = false;
    showFristWarningFor = 30;

    secondWarningCalled = false;
    showSecondWarningFor = 30;
}


// sets up and starts the countdown
function startCountdown() {
    // get contents of the "minutes" text box
    if (hasRun === false) {
        var minutes = document.getElementById("presTimeInput").value;
        // did this to hide the first warning
        // document.getElementById("warningArea").innerHTML = "<br>";

        // GUARD TO ENSURE PROPER INPUT
        if (checkInput(minutes) === false) {
        // if (isNaN(minutes) || minutes==="" || hasWhiteSpace(minutes)) {
        //     var blah = document.getElementById("startButton");
        //     blah.value = "Start";
        //     hasRun = false;
        //     enableFields();
        //     return;
        }

        // FIRST TIME RUNNING, ENTERED ONCE
        else {
            document.getElementById("warningArea").innerHTML = 
                " ";

            // disables form fields when the countdown starts
            disableFields();

            // needed this otherwise running was false which meant that the countdown
            // wouldn't start
            // document.getElementById("warningArea").innerHTML = "<br>";
            changeHeading();
            hasRun = true;
            secondsRemaining =  minutes * 60;
            secondsRemainingOriginal = secondsRemaining;

            getWarnings();


            // needed because changeHeading doesn't do it for some reason
            running = true;
            // document.getElementById("warningArea").innerHTML = "<br>";
            intervalHandle = setInterval(tick, 1000);
        }
    }

    // SECOND TIME RUNNING, ENTERED MULTIPLE TIMES
    // in other words, hasRun is true
    else {
        var minutes = document.getElementById("presTimeInput").value;
        // yup enters this part without rechecking because hasRun is true
        if (checkInput(minutes) === false) {
            // alert(checkInput())
            // enableFields();
            // 
            // it's start when it gets here
            changeButton();

            document.getElementById("warningArea").innerHTML = 
                "Presentation time is not valid!";
            // blah.value = "Start";
            alert('You must enter a valid time to begin.');
        }
        else {
            // check the value first
            // disables form fields when the countdown starts
            disableFields();

            // gets here when hasRun is true
            // checks if the presentation time value has changed
            var minutes = document.getElementById("presTimeInput").value;

            getWarnings();

            var currentSecondsRemaing =  minutes * 60;
            if (secondsRemainingOriginal != currentSecondsRemaing) {
                setSecondsRemaining();
            }

            // document.getElementById("warningArea").innerHTML = "<br>";
            // gets the current warnings
            getWarnings();
            intervalHandle = setInterval(tick, 1000);
        }
        
    }

}



function updateCounter() {
    // prevent updating time if it's blank
    // this doesn't seem to do anything?
    // var minutes = document.getElementById("presTimeInput").value;
    // gets the variable for the for displaying the time
    var timeDisplay = document.getElementById("time");

    // turn seconds into mm:ss
    // gets secondsRemaning from the global variable
    var min = Math.floor(secondsRemaining / 60);
    var sec = secondsRemaining - (min * 60);

    if (doDelay === true && doDelayCall === true) {
        sec = sec + 3;
    }

    // add a leading zero (as a string value) if seconds less than 10
    if (sec < 10) {
        sec = "0" + sec;
    }

    // concatenate with colon
    var message = min + ":" + sec;
    // now change the display
    timeDisplay.innerHTML = message;
}

function setSecondsRemaining() {
    var minutes = document.getElementById("presTimeInput").value;
    secondsRemaining =  minutes * 60;
    secondsRemainingOriginal = secondsRemaining;
    // it's reporting that doDelay is false when it should be true
    // ok there's some bs with firefox maybe?
    // this is sometimes false?
    // added code below to solve that, why it's doing it? eh it's just
    // not being reset, there's no reason it would be really

    if (document.getElementById('cbox1').checked) {
        doDelay = true;
        doDelayCall = true;
    }

    updateCounter();

}


function getWarnings() {
    firstWarningTime = document.getElementById("firstWarning").value;
    firstWarningTime = firstWarningTime * 60;

    secondWarningTime = document.getElementById("secondWarning").value;
    secondWarningTime = secondWarningTime * 60;

    resetWarnings();
}

function validWarning(input_value) {
    if (input_value > 0) {
        return true;
    }
    else {
        return false;
    }
}

// checks for whitespace
function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}

// checks for valid input
// ok now it returns false
// the simpler the function the better
// 
// this is now a helper function
function checkInput(input_value) {
    // so it's getting here when attempting to run for a second time
    if (input_value > 0 && (isNaN(input_value) === false) ) {
        document.getElementById("warningArea").innerHTML = " ";

        // why doesn't this work?
        $("#presTimeInput").css("border-color", "#4CAF50");

        checkFirstWarn();
        checkWarn();
        return true;
    }
    else {
        hasRun = false;
        var blah = document.getElementById("startButton");
        blah.value = "Start";
        document.getElementById("warningArea").innerHTML = "Please enter a valid time.";
        $("#presTimeInput").css("border-color", "red");
        return false;
    }
}

// this is the one called by the onEvent for the input box
function checkInputTime() {
    input_value = document.getElementById("presTimeInput").value;

    if (input_value > 0 && (isNaN(input_value) === false) ) {
        document.getElementById("warningArea").innerHTML = " ";

        $("#presTimeInput").css("border-color", "#4CAF50");

        checkFirstWarn();
        checkWarn();
    
        showTime();
        return true;
    }
    else {
        hasRun = false;
        var blah = document.getElementById("startButton");
        blah.value = "Start";
        document.getElementById("warningArea").innerHTML = "Please enter a valid time.";

        $("#presTimeInput").css("border-color", "red");

        return false;
    }
}



function why() {
    if (checkInput == true) {
    $("#presTimeInput").css("border-color", "#4CAF50");
    }

    else {
        $("#presTimeInput").css("border-color", "red");
    }
}


// acts as a lock, doesn't work well under some conditions
// it makes the time increment at different rates if the buttons
// are rapidly changed
function changeHeading() {
    if (running === true) {
        running = false
    }
    else {
        running = true
    }
}

function setGreeting() {
    document.getElementById("warningArea").innerHTML = "Warnings will be displayed here.";
}

function changeButton() {
    // gets the startButton as a variable
    var blah = document.getElementById("startButton");
    // checks the value of the startButton
    
    // Removes the Times up warning.
    if (timesUpCalled === true) {
        timesUpCalled = false;
        setGreeting();
    }


    if (blah.value=="Start") {
        blah.value = "Pause";

        // running will be false and this is changed
        // using the changeHeading method to true
        // so this is a problem if reset has been called on an invalid input
        // it starts the counter without checking?
        changeHeading();

        // countdown started
        startCountdown();
        // maybe this is a problem?
        // disableFields();

    }
    else if (blah.value=="Pause") {
        hasRun = true;

        // re-enable the fields disabled by the startCountdown method.
        enableFields();

        // so you need this part otherwise
        // it just keeps each instance of countdown
        // active and doesn't stop them
        clearInterval(intervalHandle);
        blah.value = "Start";
        changeHeading();

        // disableFields();
    } 
}

function enableFields() {
    document.getElementById("presTimeInput").disabled = false;
    document.getElementById("firstWarning").disabled = false;
    document.getElementById("secondWarning").disabled = false;
    document.getElementById("cbox1").disabled = false;
}

function resetEverything() {
    // modified 18/02/2017 to prevent running if the countdown has not previously
    // executed as doing so leads to the time value being displayed as NaN:NaN
        enableFields();
        var minutes = document.getElementById("presTimeInput").value;
        if (checkInput(minutes)) {

            if (doDelay === true) {
                doDelayCall = true;
            }

            secondsRemaining = secondsRemainingOriginal;

            resetWarnings();

            updateCounter();

            document.getElementById("warningArea").innerHTML = "Warnings will be displayed here.";
            // running = false;
            // this is sometimes inconsistent with the timer pausing only
            // sometimes
            // 
            // this was causing the input fields to be disables
            // when i needed them enabled
            // changeButton();

            if (running === true) {
                var blah = document.getElementById("startButton");
                running = false;
                clearInterval(intervalHandle);
                blah.value = "Start";
            }

            hasRun = false;
            }
}


function setFirstAudio() {
    if (document.getElementById('cbox2').checked) {
        doFirstAudio = true;
    }
    else {
        doFirstAudio = false;
    }
}

function setSecondAudio() {
    // check the box
    if (document.getElementById('cbox3').checked) {
        doSecondAudio = true;
    }
    // un-check the box
    else {
        doSecondAudio = false;
    }
}

function playAudioWarning() {
    audio.play();
}

// this whole method of switching based on state seems like a bad one
// it becomes inconsistent too easily with unexpected actions
function disableFields() {
    // silent fail strikes again...
    if (running === true) {
        // document.getElementById("presTimeInput").readOnly = true;
        document.getElementById("presTimeInput").disabled = true;
        document.getElementById("firstWarning").disabled = true;
        document.getElementById("secondWarning").disabled = true;
        document.getElementById("cbox1").disabled = true;

    }
    else {
        document.getElementById("presTimeInput").disabled = false;
        document.getElementById("firstWarning").disabled = false;
        document.getElementById("secondWarning").disabled = false;
        document.getElementById("cbox1").disabled = false;
    }
}


function checkFirstWarn() {
    // so for whatever reason it wasn't returning 10 as a number and it led to it
    // evaluating 10 as less than 2, explicitly casting to a number solves it?
    var presTime = new Number(document.getElementById("presTimeInput").value);
    var firstWarn = document.getElementById("firstWarning").value;
    var secWarn = document.getElementById("secondWarning").value;


    if (firstWarn == secWarn) {
        document.getElementById("warningArea").innerHTML = "Both warnings are the same!";
        $("#firstWarning").css("border-color", "red");
        // $("#secondWarning").css("border-color", "red");
    }

    else {
        if (firstWarn > 0 && presTime > firstWarn && firstWarn != presTime) {
            // alert(secWarn < presTime);
            document.getElementById("warningArea").innerHTML = "Warning set.";
            // $("#warningArea").css("visibility", "hidden");
            // $("#warningArea").animate({ opacity: 0 }).fadeOut('slow');
            // $("*").delay(500).hide();
            // $('warningArea').css({opacity: 1.0, visibility: "visible"}).animate({opacity: 0}, 200);
            // $('warningArea').fadeTo( 1000, 0 );
            // $('#warningArea').fadeTo(200, 0);
            // 
            
            $("#firstWarning").css("border-color", "#4CAF50");

            // not sure about this...
            $("#firstWarning").css("border-color", "#4CAF50");
            
            $(function() {

                $('#warningArea').fadeOut(1500, function() {
                    $(this).text(' ').fadeIn(500);
                });

            });

        }
        else {
            // alert("presentation time is:" + document.getElementById("presTimeInput").value + "second warning is" + document.getElementById("secondWarning").value)
            document.getElementById("warningArea").innerHTML = "Invalid warnings!";

            // $( "#warningArea" ).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            // $("#warningArea").css("visibility", "hidden").fade(1000);
            // $("#warningArea").animate({ opacity: 0 })
            // 
            $("#firstWarning").css("border-color", "red");
            }
        }
}



function checkWarn() {
    // so for whatever reason it wasn't returning 10 as a number and it led to it
    // evaluating 10 as less than 2, explicitly casting to a number solves it?
    var presTime = new Number(document.getElementById("presTimeInput").value);
    var firstWarn = document.getElementById("firstWarning").value;
    var secWarn = document.getElementById("secondWarning").value;


    if ((firstWarn > 0) && firstWarn == secWarn) {
        document.getElementById("warningArea").innerHTML = "Both warnings are the same!";
        // $("#firstWarning").css("border-color", "red");
        $("#secondWarning").css("border-color", "red");
    }
    else {
            if (secWarn > 0 && presTime > secWarn && secWarn != presTime) {
                // alert(secWarn < presTime);
                document.getElementById("warningArea").innerHTML = "Warning set.";
    
                // $("#presTimeInput").css("border-color", "purple");
    
                $("#secondWarning").css("border-color", "#4CAF50");
                
                // not sure about this...
                $("#firstWarning").css("border-color", "#4CAF50");

                $(function() {
    
                    $('#warningArea').fadeOut(1500, function() {
                        $(this).text(' ').fadeIn(500);
                    });
    
                });

                
            }
    
    
            else {
                // alert("presentation time is:" + document.getElementById("presTimeInput").value + "second warning is" + document.getElementById("secondWarning").value)
                document.getElementById("warningArea").innerHTML = "Invalid warnings!";
    
                $("#secondWarning").css("border-color", "red");
    
                // $( "#warningArea" ).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            }
        }
}


function setDelay() {
    if (document.getElementById('cbox1').checked) {
        // alert('do delay called')
        doDelay = true;
        doDelayCall = true;

        showTime();
        // showDelay();
        // secondsRemaining = secondsRemaining + 3
        // timeDisplay = document.getElementById("time");
        // timeDisplay.innerHTML = "0:03";
    }
    else {
        doDelay = false;
        showTime();
    }
}


// just updates the counter so the user can see that the time is right
function showTime() {
    // it does get here the second time
    // alert('gets here second time?')
    inputTime = document.getElementById("presTimeInput").value;

    // it gets the value the second time
    // alert(inputTime);
    

    // alert(secondsRemaining);

    if (isNaN(inputTime)) {

        // somehow it enters this area and doesn't do the alert but does update the text
        alert('is not a number');
        document.getElementById("warningArea").innerHTML = "Please enter a valid presentation time.";
    }
    
    // there are two possibilities either the box has been ticked or it hasn't
    else {
            if (secondsRemaining > 0 && hasRun === true) {

                if ((inputTime * 60) === secondsRemainingOriginal) {
                    // alert("fire");
                    // alert(secondsRemainingOriginal);
                    // var inputSeconds = secondsRemaining * 60
                    var min = Math.floor(secondsRemaining / 60);
                    var sec = secondsRemaining - (min * 60);

                    // it's messing up on a value of 3?
                    // alert(min + ' ' + sec);
                    if (doDelay === true && doDelayCall === true) {
                            // alert('why?');
                            sec = sec + 3;

                    }

                    // add a leading zero (as a string value) if seconds less than 10
                    if (sec < 10) {
                        sec = "0" + sec;
                    }
                    

                    // concatenate with colon
                    var message = min + ":" + sec;
                    // now change the display
                    timeDisplay = document.getElementById("time");
                    timeDisplay.innerHTML = message;
                }

                else {

                    var inputSeconds = inputTime * 60

                    // add a leading zero (as a string value) if seconds less than 10
                    if (sec < 10) {
                        sec = "0" + sec;
                    }

                    // concatenate with colon
                    var message = min + ":" + sec;
                    // now change the display
                    timeDisplay = document.getElementById("time");
                    timeDisplay.innerHTML = message;


                    var min = Math.floor(inputSeconds / 60);
                    var sec = inputSeconds - (min * 60);

                    if (doDelay === true && doDelayCall === true) {
                            sec = sec + 3;

                    }
                    // add a leading zero (as a string value) if seconds less than 10
                    if (sec < 10) {
                        sec = "0" + sec;
                    }
                    // concatenate with colon
                    var message = min + ":" + sec;
                    // now change the display
                    timeDisplay = document.getElementById("time");
                    timeDisplay.innerHTML = message;


                }
            }

            // if it hasn't run already
            // somehow secondsRemaning is -1 even after being reset a billion times
            if (secondsRemaining == 0 && hasRun == false) {

                // doesn't get here twice
                // nor to the one below so secondsRemaning can't be 0?
                // SECONDSREMAINING IS -1
                // alert('get here?');

                // so if secondsRemaining is greater than 0 you DON'T want to update all the time
                // you just want to add 3 seconds, but only add it once...
                // alert(secondsRemaining);
                // document.getElementById("warningArea").innerHTML = "Enter warnings.";
                var inputSeconds = inputTime * 60
                var timeDisplay = document.getElementById("time");

                // turn seconds into mm:ss
                // gets secondsRemaning from the global variable
                var min = Math.floor(inputSeconds / 60);
                var sec = inputSeconds - (min * 60);

                if (doDelay === true && doDelayCall === true) {
                        sec = sec + 3;

                }

                // add a leading zero (as a string value) if seconds less than 10
                if (sec < 10) {
                    sec = "0" + sec;
                }
                // concatenate with colon
                var message = min + ":" + sec;
                // now change the display
                timeDisplay = document.getElementById("time");
                timeDisplay.innerHTML = message;
            }

            if (secondsRemaining === 0 && hasRun == true) {
                // alert('get here at all?');

                // so if secondsRemaining is greater than 0 you DON'T want to update all the time
                // you just want to add 3 seconds, but only add it once...
                // alert(secondsRemaining);
                // document.getElementById("warningArea").innerHTML = "Enter warnings.";
                var inputSeconds = inputTime * 60
                var timeDisplay = document.getElementById("time");

                // turn seconds into mm:ss
                // gets secondsRemaning from the global variable
                var min = Math.floor(inputSeconds / 60);
                var sec = inputSeconds - (min * 60);

                if (doDelay === true && doDelayCall === true) {
                        sec = sec + 3;

                }

                // add a leading zero (as a string value) if seconds less than 10
                if (sec < 10) {
                    sec = "0" + sec;
                }
                // concatenate with colon
                var message = min + ":" + sec;
                // now change the display
                timeDisplay = document.getElementById("time");
                timeDisplay.innerHTML = message;
            }


            // alert(secondsRemaining);
            if (secondsRemaining > 0 && hasRun === false) {

                // alert('here');
                // so if secondsRemaining is greater than 0 you DON'T want to update all the time
                // you just want to add 3 seconds, but only add it once...
                // alert(secondsRemaining);
                // document.getElementById("warningArea").innerHTML = "Enter warnings.";
                var inputSeconds = inputTime * 60
                var timeDisplay = document.getElementById("time");

                // turn seconds into mm:ss
                // gets secondsRemaning from the global variable
                var min = Math.floor(inputSeconds / 60);
                var sec = inputSeconds - (min * 60);

                if (doDelay === true && doDelayCall === true) {
                        sec = sec + 3;
                    }

                // add a leading zero (as a string value) if seconds less than 10
                if (sec < 10) {
                    sec = "0" + sec;
                }

                // concatenate with colon
                var message = min + ":" + sec;
                // now change the display
                timeDisplay = document.getElementById("time");
                timeDisplay.innerHTML = message;
                
            }
    }

}



// as soon as the page is loaded...
window.onload =  function () {
    // trying a method on an input field
    
    firstWarn = document.getElementById("firstWarning");
    firstWarn.oninput = function () {
        checkFirstWarn();
    }

    secWarn = document.getElementById("secondWarning");
    secWarn.oninput = function () {
        checkWarn();
    }

    input_time = document.getElementById("presTimeInput");
    input_time.oninput = function () {
        // alert(input_time.value);
        

        // it doesn't do this at all
        checkInputTime();

        showTime();
    }

    // trying to create another button
    var resetButton = document.createElement('input');
    resetButton.setAttribute("type", "button");
    resetButton.setAttribute("class", "button");
    resetButton.setAttribute("value", "Reset");
    resetButton.onclick = function () {
        resetEverything();
    }

    // create a button
    var startButton = document.createElement("input");
    startButton.setAttribute("id", "startButton");
    startButton.setAttribute("class", "button");
    startButton.setAttribute("type", "button");
    startButton.setAttribute("value", "Start");
    startButton.onclick = function () {
        changeButton();
        // startCountdown();
    };


    document.getElementById("buttons").appendChild(startButton);
    document.getElementById("buttons").appendChild(resetButton);
    document.getElementById("buttons").appendChild(playAudio);
    document.getElementById("warningArea").innerHTML = "Warnings will be displayed here.";



};

