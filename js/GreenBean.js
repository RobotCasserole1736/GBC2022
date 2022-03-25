/*
 * GreenBean.js
 */


window.onload=function(){updateData()};

var Score_Stack = new Array();
Score_Stack['autonomous'] = new Array();
Score_Stack['teleop'] = new Array();

var unsubmittedData = new Array();

function undoScore(period){
	Score_Stack[period].pop();
	updateData();
};

function pcScore(period, type, count){
	Score_Stack[period].push([type,count]);
	updateData();
};



function idScoutingStation() {
	matchNum = document.getElementById("matchNumber").value;
	curScoutingStation = document.getElementById("whichRobot").value;
	matchType = document.getElementById("matchType").value;

	if(matchNum !=null && matchNum !=0 && matchType == "Qualification"){

		lookUpTeam(matchNum, curScoutingStation);

	}
}







function dataSanitize(text){
	text=text.replace(",","_");  //Get rid of commas so we don't mess up CSV
	text=text.replace(/(\r\n|\n|\r)/gm,"  ");  // get rid of any newline characters
	text=text.replace(/[^\x00-\x7F]/g, "");  //Only ascii characters
	return text

}


function defaultReset(){
	document.getElementById("teamNumber").value = "";
	document.getElementById("matchNumber").value = parseInt(document.getElementById("matchNumber").value) + 1;
	document.getElementById("comments").value = "";
}

function defaultSaveP1(){
	let output=""
	output += dataSanitize(document.getElementById("scoutName").value) + ",";
	output += dataSanitize(document.getElementById("teamNumber").value) + ",";
	output += document.getElementById("matchNumber").value + ",";
	output += document.getElementById("matchType").value + ",";
	return output
}



function submitReport(){
	saveData();
	resetForm();
	idScoutingStation();
}

function submitPitReport(){
	savePitData();
	resetForm();
}

function clearHistory()
{
	if(document.getElementById("history_password").value == "Beans")
	{
		localStorage.clear();
		document.getElementById("HistoryCSV").value = "";
		$("#HistoryPass").hide(100,null);
	}
	else
	{
		document.getElementById("history_password").value = "Incorrect Password";
	}
}

function serverSubmit(matchData)
{
    var xmlhttp = new XMLHttpRequest();

    var sendData = "matchData=";
    sendData += matchData;

    xmlhttp.onreadystatechange = function()
    {
        if(xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
            {
                if(unsubmittedData.length > 0)
                    serverSubmit(unsubmittedData.pop());
                return;
            }
            else
            {
                alert("Error submitting data - check that server is up!");
                unsubmittedData.push(matchData);
            }
        }
    };

    xmlhttp.open("GET", "./php/logMatches.php?" + sendData, true);
    xmlhttp.send();
}

function serverPitSubmit(matchData)
{
    var xmlhttp = new XMLHttpRequest();

    var sendData = "matchData=";
    sendData += matchData;

    xmlhttp.onreadystatechange = function()
    {
        if(xmlhttp.readyState == 4)
        {
            if(xmlhttp.status == 200)
            {
                return;
            }
            else
            {
                alert("Error submitting data - check that server is up!");
            }
        }
    };

    xmlhttp.open("GET", "./php/logPitData.php?" + sendData, true);
    xmlhttp.send();
}

function lookUpTeam(matchNum, station)
{
    var xmlhttp = new XMLHttpRequest();

    var sendData = "matchNumber="+matchNum+"&station="+station;
    

    xmlhttp.onreadystatechange = function()
    {
        if(xmlhttp.readyState == 4)
        {
			teamNum = 0;
            if(xmlhttp.status == 200)
            {
			   //Set Team Number to Retrieved Value
			   teamNum = xmlhttp.response;
            }
            else
            {
			   //set Team Number To 0
			   teamNum = 0;
			}
			if(teamNum == 0 || isNaN(teamNum)) {
				document.getElementById("teamNumber").value = "";
			}
			else{
				document.getElementById("teamNumber").value = teamNum;
			}
        }
    };

    xmlhttp.open("GET", "./php/teamLookup.php?" + sendData, true);
    xmlhttp.send();
}




//QRcode stuff

//davidshimjs


var modal = document.getElementById("myModal");

// Get the button that opens the modal

var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 380,
	height : 380
});


function makeCode(id) {		
	var elText = document.getElementById(id).innerHTML;
	
	if (!elText) {
		alert("Submit data first!");
		return;
	}
	
	qrcode.makeCode(elText);
	modal.style.display = "block";
}



// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}   
}