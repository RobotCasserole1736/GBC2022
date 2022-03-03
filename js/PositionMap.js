
let Container
let Map
let MapContext
let myMapImage
let myMapTable
let myCHImage
let widthMap = 800
let heightMap = 400
let widthCH=30
let heightCH=30
let HardLimit=3
let CHlist={}
initialization()
function initialization(){
    myMapImage = new Image(widthMap, heightMap);
    myMapImage.src = 'images//field_bg.png';
    myCHImage = new Image(widthCH, heightCH);
    myCHImage.src = 'images//crosshair.png';

    Container = document.getElementById("PositionMap")
    canvas = document.createElement('canvas');
    canvas.width = widthMap
    canvas.height = heightMap
    canvas.id="PositionMapCanvas"
    Container.append(canvas)
    initializeTable()
    myMapTable=document.getElementById("MapPositionTable")
    myMapImage.onload = function() {
        Map=document.getElementById("PositionMapCanvas")
        MapContext = Map.getContext('2d');
        MapContext.font = "30px Arial";
        drawMap()
        Map.addEventListener("mousedown", function(e){getMousePosition(e);}); 
    }
    
}
function initializeTable(){
    table=document.createElement("table")
    table.id="MapPositionTable"
    table.setAttribute("class","Map");
    TR=document.createElement("TR");
    TR.setAttribute("class","Map");
    table.width=widthMap
    TH1=document.createElement("TH");
    TH1.innerHTML="ID"
    TH1.setAttribute("class","Map");
    TH2=document.createElement("TH");
    TH2.innerHTML="Approximate %"
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
    Container.append(table)
}

function createRow(id){
    TR=document.createElement("TR");
    TR.setAttribute("class","Map");
    TR.id=id+"row"
    TH1=document.createElement("TD");
    TH1.innerHTML=id
    TH1.setAttribute("class","Map");
    TH2=document.createElement("TD");
    TH2.innerHTML="<input type='range' class='bar' id='"+id+"input"+"'  min='1' max='100' value='50' width="+widthMap/3+"></input>"
    TH3=document.createElement("TD");
    TH3.innerHTML="<button class='Map' onclick='deleteRow("+id+")'> X </button>"
    TR.appendChild(TH1)
    TR.appendChild(TH2)
    TR.appendChild(TH3)
    myMapTable.append(TR)
}
function deleteRow(id){
    row=document.getElementById(id+"row")
    row.remove()
    delete CHlist[id];
    reload()
}

function drawMap(){
    MapContext.clearRect(0, 0, Map.width, Map.height);
    MapContext.drawImage(myMapImage,0,0,widthMap,heightMap)
}


function getMousePosition(event) { 
    let rect = Map.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 
    let i=0;
    checkVal=true
    while(checkVal && i < HardLimit){
        i++
        if(CHlist[i]== undefined){
            checkVal=false
        }
        
    }
    if(!checkVal){
        CHlist[i]=[x | 0,y | 0]
        createRow(i)
        reload()
    }else{
        alert("If you need more than "+HardLimit+" spots you should be selecting \"Shoots from Everywhere\"")
    }
} 

function reload(){
    drawMap()
    for(let i in CHlist){
        MapContext.drawImage(myCHImage,CHlist[i][0]-widthCH/2,CHlist[i][1]-heightCH/2,widthCH,heightCH)
        MapContext.fillText(i.toString(), CHlist[i][0]+widthCH/2, CHlist[i][1]);
    }
}

function positionOutput(){
    let outputList = []
    for(let i in CHlist){
        outputList.push([parseInt(document.getElementById(i+"input").value,10),CHlist[i]])
    }
    return outputList
}