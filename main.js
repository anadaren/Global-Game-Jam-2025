//https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript

var testCases;

//Object arrays grabbed from the spreadsheets
/*var cases; // object array of all the cases
var containment; // object array of all the containment things
var agents; // object array of all the agents
var emails; //object array of all the emails 
*/

var onScreen = []; // 2d array of the IDs for objects that are on screen [id name, minimized boolean]

//var divIDOnScreen = ["cases","agents","containment","email","terminal","recycle","manual","untitled"]; // list of all the divs that are hard-coded, used in closeWindow()

var divIDOnScreen = ["folder1","browser","notepad","recycle"]; // list of all the divs that are hard-coded, used in closeWindow()

var setup = false; // tracks if the databse windows have been loaded in yet

//Current highest window index
var zind = 5;

//terminal.js variables
/*var g = 0;
var admin = 0;
var salty = "saltyboi";
var adminusername = "";
var passwords = [["abshirea","627c787c7a647f612e73",""],
                ["turneri","7d74666f6d6f627a272523636526672561277474722426236d7422",""]];

if(getCookie("restorefolder") == "true"){
    reFolder();
}*/

//------
// WINDOW / DIV FUNCTIONS
//------
function openWindow(name,display){
    var windowname = name + "-window";
    var minimizename = name + "-minimize";
 
    //display the window object and the taskbar object
    var windowobj = document.getElementById(windowname);
    windowobj.style.display="block";
    
    if(!setup){
        setupFolder1();
        //setupBrowser();
        //setupNotepad();
        //setupRecycling();
    }
        
    //if the window isn't already open, add it to the onScreen array
    if(!isInArray(name)){
    
        //set starting position, same for all windows
        windowobj.style.top = 60 + (onScreen.length*10) + "px";
        windowobj.style.left = 200 + (onScreen.length*10) + "px";
        
        onScreen.push([name, false]);
    
        //add a minimized button in the footer
        //name is the div id, display is what to display if it's different than the ID 
        //(eg. readme vs README.txt)
        addMinimized(name,display);
 
        //make the window draggable
        dragElement(windowobj);
    }
    
    //make the window the only focused window on screen
    focusWindow(name);
    
}

function closeWindow(name){
    var windowname = name + "-window";
    var minimizename = name + "-minimize";

    if(divIDOnScreen.includes(name)){
        //hide the big window and the taskbar object
        document.getElementById(windowname).style.display="none";
    } else {
        document.getElementById(windowname).remove();
    }
    
    //delete minimize tab
    document.getElementById(minimizename).remove();
    
    //remove from onScreen array
    removeFromArray(name);
    
    //re-focus another window if there's another one open
    for(var i = 0; i < onScreen.length; i++){
    
        if(!onScreen[i][1] && onScreen[i][0]!=name){
            
            focusWindow(onScreen[i][0]);
        }
    }
    
}

function minimizeWindow(name){ //when clicking the minimize button on the window
    
    var windowname = name + "-window";
 
     document.getElementById(windowname).style.display="none";
 
     //set minimize to true for the object in the onScreen array
     for(var i = 0; i < onScreen.length; i++){
         if(onScreen[i][0] === name){
             onScreen[i][1] = true;
     
         }
     }
 
     //re-focus on another object if there's another one open
     for(var i = 0; i < onScreen.length; i++){
         if(!onScreen[i][1] && onScreen[i][0]!=name){
             focusWindow(onScreen[i][0]);
             break;
         }
     }
 
}

function unminimizeWindow(name){ 
 //when clicking on the actual minimized tab to re-open
 
     //set minimize to false for object in onScreen array
     for(var i = 0; i < onScreen.length; i++){
     if(onScreen[i][0] === name){
         onScreen[i][1] = false;
         break;
     }
 }
 
 
 //re-open!
 openWindow(name);
 
}

function focusWindow(name){

    //break from the function if the object is minimized or deleted already
    //--VERY IMPORTANT, THIS IS NECESSARY CODE DO NOT DELETE
    if(isMinimized(name) || !isInArray(name)){
        return false;
    }
    

    for(var i = 0; i < onScreen.length; i++){
        
        var element = document.getElementById(onScreen[i][0]+"-window");
        var elementheader = document.getElementById(onScreen[i][0]+"-windowheader");
        
        //if window is NOT minimized (open) and window is NOT trying to focus right now
        if(!onScreen[i][1] && onScreen[i][0]!=name){
            
            //and the element doesn't already have the "inactive" class name
            if(!elementheader.classList.contains("inactive")){
                
                //give it the class name lol
                elementheader.classList.add("inactive"); 
            }

        } else if(onScreen[i][0]===name){
            //if onScreen object is the one focusing right now
             
            if(elementheader.classList.contains("inactive")){ //remove inactive if it is 
                elementheader.classList.remove("inactive");
            }   
            
            //since this one is the focus window, set it to the highest zindex
            element.style.zIndex=++zind;
        } 
    
    }
    
    event.stopPropagation();
}

function addMinimized(name,display=""){ //adds a minimized tab in the taskbar
    
    //if there's nothing to display, make the display the same as the ID but with a capital first letter
    if(display===""){
        display = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    //add a new btutton
    let minTab = document.createElement("button");
    minTab.setAttribute("id",name+"-minimize");
    minTab.setAttribute("onclick","unminimizeWindow('" + name + "')");
    minTab.innerHTML = display;
    //document.getElementById("footer").appendChild(minTab);
    
}

function finishWindow(pageHTML,id,display=""){

    let windowobj = document.createElement("div");
windowobj.innerHTML = pageHTML;
windowobj.setAttribute("class","window");
windowobj.setAttribute("id",id+"-window");
windowobj.style.width="450px";
//    windowobj.style.zIndex = 11;
windowobj.setAttribute("onclick","focusWindow(\'" + id + "\')");
document.getElementById("desktop").appendChild(windowobj);



    //set starting position, same for all windows
windowobj.style.top = "60px";
windowobj.style.left = "25%";
    
onScreen.push([id, false]);

//add a minimized button in the footer
//name is the div id, display is what to display if it's different than the ID 
//(eg. readme vs README.txt)
addMinimized(id,display);

//Defunct, used to hard-code the minimize tabs like a loser but now they GENERATE THEMSELVES
//document.getElementById(minimizename).style.display="inline-block";

//make the window draggable
dragElement(windowobj);

//make the window the only focused window on screen
focusWindow(id);
}

function clickStart(){
    var element = document.getElementById("start-menu-content");
    
    if(element.style.display=="block"){
       element.style.display="none"; 
    } else {
        element.style.display="block";
    }

}

function clickBody(){
    var element = document.getElementById("start-menu-content");

if(element.style.display=="block"){
   element.style.display="none"; 
}
}


//-----
// CHECK FUNCTIONS
//------
function isInArray(name){
    
    for(var i = 0; i < onScreen.length; i++){
         if(onScreen[i][0] === name){
             return true;
         }
     }  
     
 }
 
 function removeFromArray(name){
        for(var i = 0; i < onScreen.length; i++){
         if(onScreen[i][0] === name){
             onScreen.splice(i, 1);
         }
     }
 }
 
 function isMinimized(name){
     for(var i = 0; i < onScreen.length; i++){
         if(onScreen[i][0]===name){
             return onScreen[i][1];
         }
     }
 }

//------
// CSV to JSON
//------
$(document).ready(function() {
    const sheetUrl = "sheet1.csv";

    $.ajax({
        type: "GET",
        url: sheetUrl,
        dataType: "text",
        success: function(data) {
            testCases=csvToJson(data);
            parseText(testCases); // Process text if needed
            console.log("Data loaded successfully:", testCases);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error:", textStatus, errorThrown);
          }
     });

});

const csvToJson = (str, headerList, quotechar = '"', delimiter = ',') => {
    
//var csv is the CSV file with headers
  const cutlast = (_, i, a) => i < a.length - 1;
  // const regex = /(?:[\t ]?)+("+)?(.*?)\1(?:[\t ]?)+(?:,|$)/gm; // no variable chars
  const regex = new RegExp(`(?:[\\t ]?)+(${quotechar}+)?(.*?)\\1(?:[\\t ]?)+(?:${delimiter}|$)`, 'gm');
  const lines = str.split('\n');
  const headers = headerList || lines.splice(0, 1)[0].match(regex).filter(cutlast);

        //remove ending , at the end of all the headers >:[
    for(var i = 0; i < headers.length; i++){
        if(headers[i][headers[i].length-1]==','){
            headers[i]=headers[i].slice(0, -1);
        }
    }
    
    
  const list = [];

  for (const line of lines) {
    const val = {};
    for (const [i, m] of [...line.matchAll(regex)].filter(cutlast).entries()) {
      // Attempt to convert to Number if possible, also use null if blank
        val[headers[i]] = (m[2].length > 0) ? Number(m[2]) || m[2] : null;
    }
    
    list.push(val);
  }

  return list;
}


function parseText(array) {
    
    for(var i = 0; i < array.length; i++){

        var keys = Object.keys(array[i]);

            for (var x = 0; x < keys.length; x++) {
   
                if(keys[x] != null  && keys[x] != "" && array[i][keys[x]] != "" && array[i][keys[x]] != null ){
    
                    for(var y = 0; y < array[i][keys[x]].length-2; y++){
                        if(array[i][keys[x]].charAt(y) == "&" && array[i][keys[x]].charAt(y+1) == "&"){
                                
                            array[i][keys[x]] = setCharAt(array[i][keys[x]],y, "<br>");
                            array[i][keys[x]] = setCharAt(array[i][keys[x]],y+4,"");
                            
                        }
                    }
        
                }
            }
    }
          
}

//------
//SETUP FOR ALL THE DATABASES
//------

function setupFolder1() {
    if (!testCases) {
        console.error("Error: testCases is undefined. Data not yet loaded.");
        return;
    }
    
    var addHTML = "<table><tr><th>Name</th><th>Test1a</th><th>Test1b</th></tr>";
    for(var i = 0; i < testCases.length; i++){
       addHTML += '<tr><td onclick=openCases(\'' + testCases[i].ID + '\')>' + testCases[i].Name + '</td>' +
                  '<td>' + testCases[i].Test1a + '</td>' +
                  '<td>' + testCases[i].Test1b + '</td></tr>'; 
    }
      addHTML += "</table>";
    var elements = document.getElementsByClassName("folder1-database")
    elements[0].innerHTML = addHTML;
    setup=true;
}


//------
// TIME & DATE
//------

//https://stackoverflow.com/questions/61280319/is-there-an-easier-way-to-display-live-time-and-date-in-html-using-bootstrap
var clockElement = document.getElementById('clock');

    function clock() {
        clockElement.textContent = new Date().toLocaleTimeString();
    }

    setInterval(clock, 1000);


//------
// DRAGGABLE
//------

//https://www.w3schools.com/howto/howto_js_draggable.asp

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
        
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return [_y, _x];
}
