window.onload=function(){common()};
let BR=document.createElement("br")

let innerHTMLList=[]
let checkBoxList=[]
let multipleChoiceList=[]


let climbText=["None","Low","Mid","High","Traversal"]
let driverRatingText = ["Doesn't Drive","Inefficient Driving", "Acceptable Driving", "Drives Well",];
let defenseRatingText = ["Didn't Defend","Hinders Allies; Inefficient Defense","Does not Hinder Allies; Inefficient Defense","Does not Hinder Allies; Great Defense"]

function common(){
    AutoFormInit()
    TeleFormInit()
    PostMatchFormInit()
    initializeQRTable()
}


function AutoFormInit(){
    addElList("autoScoring_left",PC2Bar("Autonomous","Upper Goal"))
    addElList("autoScoring_left",[BR])
    addElList("autoScoring_left",button("undoScore('autonomous');","Undo Score"))
    addElList("autoScoring_center",PC2Bar("Autonomous","Lower Goal"))
    addElList("autoScoring_right",title("Tarmac"))
    addElList("autoScoring_right",checkBox("Left Tarmac: ","leftTarmac"))
}

function TeleFormInit(){
    addElList("teleopScoring_left",PC2Bar("Teleop","Upper Goal"))
    addElList("teleopScoring_left",[BR])
    addElList("teleopScoring_left",button("undoScore('teleop');","Undo Score"))
    addElList("teleopScoring_center",PC2Bar("Teleop","Lower Goal"))
    addElList("teleopScoring_right",multipleChoice("Climbing:","climbPos",climbText))
    addElList("teleopScoring_right",checkBox("Group Climber: ","groupClimbing"))
}

function PostMatchFormInit(){
    addElList("yearly_Code",multipleChoice("Driver Rating:","driverRatingDisplay",driverRatingText))
    addElList("yearly_Code",multipleChoice("Defense Rating:","defenseReview",defenseRatingText))
    addElList("yearly_Code",checkBox("Can Intake from Terminal: ","terminalLoading"))
    addElList("yearly_Code",checkBox("Can Intake from Ground: ","intakeGround"))
    addElList("yearly_Code",checkBox("Penalty Prone: ","penaltyProne"))
    addElList("yearly_Code",checkBox("Far Shooting: ","farShooting"))
    addElList("yearly_Code",checkBox("Close Shooting: ","closeShooting"))
}

function addElList(id,elList){
    let Container=document.getElementById(id)
    for(let i=0; i<elList.length;i++){
        Container.appendChild(elList[i])
    }
}

function PC2Bar(period,type){
    Title=document.createElement("H3")
    Title.innerHTML=type
    TR=document.createElement("TR")
    for(let i=1; i<3; i++){
        TD=document.createElement("TD")
        TD.innerHTML="<button onclick=\"pcScore('"+period.toLowerCase()+"', '"+type.toLowerCase()+"', "+i+");\">"+i+"</button>"
        TR.appendChild(TD)
    }
    txt=document.createTextNode("Cargo Scored in "+type+": ")
    id=type.split(' ').join('')+"Count"+period+"Display"
    A=createInnerHtmlReader(id,period.toLowerCase(),type.toLowerCase())
    return [Title,TR,txt,A,BR]
}

function checkBox(TitleIn, id){
    Div=document.createElement("div")
    Div.innerHTML=TitleIn+"<input type='checkbox' id='"+id+"' onchange ='updateData();'>"
    checkBoxList.push(id)
    return [Div]
}

function title(text){
    Text=document.createElement("H3")
    Text.innerHTML=text
    return [Text]
}

function button(onClick, text){
    Div=document.createElement("div")
    Div.innerHTML=innerHTML="<button onclick=\""+onClick+"\">"+text+"</button>"
    return [Div]
}


function multipleChoice(TitleIn, id, Choices){
    Title=document.createElement("H3")
    Title.innerHTML=TitleIn
    Form=document.createElement("select")
    Form.id=id
    for(let i=0;i<Choices.length;i++){
        choice=document.createElement("option")
        choice.value=i
        choice.innerHTML=Choices[i]
        Form.appendChild(choice)
    }
    multipleChoiceList.push(id)
    return[Title,Form,BR]

}

function createInnerHtmlReader(id,period,type){
    a=document.createElement("a")
    a.innerHTML=0
    a.id=id
    innerHTMLList.push([id,period,type])
    return a
}

function updateData(){
    var scoreList={}
    for(let i=0; i<innerHTMLList.length;i++){
        scoreList[innerHTMLList[i][0]]=0
        for(let j = 0; j< Score_Stack[innerHTMLList[i][1]].length; j++){
            if(Score_Stack[innerHTMLList[i][1]][j][0] == innerHTMLList[i][2]){
                scoreList[innerHTMLList[i][0]] += parseInt(Score_Stack[innerHTMLList[i][1]][j][1],10);
            }
        }
        document.getElementById(innerHTMLList[i][0]).innerHTML = scoreList[innerHTMLList[i][0]];
    }
}

function resetForm(){
    for(let i=0; i<innerHTMLList.length;i++){
        Score_Stack[innerHTMLList[i][1]]=new Array();
    }
    for(let i=0; i<checkBoxList.length;i++){
        document.getElementById(checkBoxList[i]).checked=false
    }
    for(let i=0; i<multipleChoiceList.length;i++){
        document.getElementById(multipleChoiceList[i]).value=0
    }
    defaultReset()
    updateData()
}

function saveData()
{
	var matchData = defaultSaveP1();

    // Buttons
    for(let i=0; i<innerHTMLList.length;i++){
        matchData+= document.getElementById(innerHTMLList[i][0]).innerHTML+","
    }
    // Check Boxes
    for(let i=0; i<checkBoxList.length;i++){
        matchData+=document.getElementById(checkBoxList[i]).checked+","
    }
    // Multiple Choice Boxes
    for(let i=0; i<multipleChoiceList.length;i++){
        matchData+=document.getElementById(multipleChoiceList[i]).value+","
    }
	
    matchData +="\n";  // add a single newline at the end of the data
    addQRRow(matchData)
	var existingData = localStorage.getItem("MatchData");
	if(existingData == null)
		localStorage.setItem("MatchData", matchData);
	else
		localStorage.setItem("MatchData", existingData + matchData);
	document.getElementById("HistoryCSV").value = localStorage.getItem("MatchData");
	serverSubmit(matchData);
}


//makeCode();
function addQRRow(text){
    QRTable=document.getElementById("QRListTable")
    id=QRTable.children.length
    TR=document.createElement("TR");
    TR.setAttribute("class","Map");
    TR.id=id+"QRrow"
    TH1=document.createElement("TD");
    TH1.innerHTML="<button class='Map' onclick='makeCode(\""+id+"QRrowTxt"+"\")'> "+text.split(",")[2]+" </button>"
    TH1.setAttribute("class","Map");
    TH2=document.createElement("TD");
    TH2.setAttribute("class","Map");
    TH2.style.maxWidth="600px";
    TH2.innerHTML=text
    TH2.id=id+"QRrowTxt"
    TH3=document.createElement("TD");
    TH3.innerHTML="<button class='Map' onclick='deleteQRRow(\""+id+"\")'> X </button>"
    TR.appendChild(TH1)
    TR.appendChild(TH2)
    TR.appendChild(TH3)
    QRTable.append(TR)
}

function deleteQRRow(id){
    document.getElementById(id+"QRrow").remove()
}

function initializeQRTable(){
    table=document.createElement("table")
    table.style.tableLayout="fixed";
    table.id="QRListTable";
    table.setAttribute("class","Map");
    TR=document.createElement("TR");
    TR.setAttribute("class","Map");
    table.width=800
    TH1=document.createElement("TH");
    TH1.innerHTML="QRBtn"
    TH1.setAttribute("class","Map");
    TH2=document.createElement("TH");
    TH2.innerHTML="Text"
    TH2.setAttribute("class","Map");
    TH3=document.createElement("TH");
    TH3.innerHTML=" X "
    TH3.setAttribute("class","Map");
    TR.appendChild(TH1)
    TR.appendChild(TH2)
    TR.appendChild(TH3)
    table.appendChild(TR)
    table.border = "solid";
    table.borderCollapse = "collapse";
    document.getElementById("HistoryArea").append(table)

    pastData=localStorage.getItem("MatchData").split(/\r?\n/);
    for(let i=0; i<pastData.length-1;i++){
        addQRRow(pastData[i])
    }
}