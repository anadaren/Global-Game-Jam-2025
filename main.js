//https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript

var testCases;
var password = "password";

//Object arrays grabbed from the spreadsheets
/*var cases; // object array of all the cases
var containment; // object array of all the containment things
var agents; // object array of all the agents
var emails; //object array of all the emails 
*/

var onScreen = []; // 2d array of the IDs for objects that are on screen [id name, minimized boolean]

var divIDOnScreen = ["files","folder1","file1","subfolder1","subfolder2","untitled1","browser","notepad","recycle","terminal"]; // list of all the divs that are hard-coded, used in closeWindow()
var webPages = ["web_pages/birds.html", "web_pages/computer_info.html", "web_pages/online_shopping_general.html", "web_pages/online_shopping_checkout.html"]
var webPageUrl = ["www.birdsarereal.com", "www.placeholderos.com", "www.vaporwaveshop.net", "www.vaporwaveshop.net/checkout"]

cursoreffects = true;


var setup = false; // tracks if the databse windows have been loaded in yet

//Current highest window index
var zind = 6;

//terminal.js variables
var g = 0;
var admin = 0;
var salty = "saltyboi";
var adminusername = "";
var passwords = [["abshirea","627c787c7a647f612e73",""],
                ["turneri","7d74666f6d6f627a272523636526672561277474722426236d7422",""]];

if(getCookie("restorefolder") == "true"){
    reFolder();
}


// Call the load screen fade out when the page is fully loaded
window.onload = fadeOut("load-screen");

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
        // Setup for everything that reads from a CSV file
        setupFile1();
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

function openBrowser() {
    // Which webpage to load
    document.getElementById("site").value = webPageUrl[1];

    launchWebpage();
        openWindow('browser','Browser');
}

function launchWebpage() {
    whichPage = getIndex(document.getElementById("site").value, webPageUrl);

    if(!whichPage){

            // Load in browser content
    $('#browser-body').load("web_pages/404.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("Error loading content: " + xhr.status + " " + xhr.statusText);
        } else {
            console.log("Content loaded successfully.");
        }
        });

    } else {
    
    // Load in browser content
    $('#browser-body').load(webPages[whichPage], function (response, status, xhr) {
        if (status == "error") {
            console.log("Error loading content: " + xhr.status + " " + xhr.statusText);
        } else {
            console.log("Content loaded successfully.");
        }
        });

    }
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
    minTab.setAttribute("class","minimized-tab");
    minTab.setAttribute("id",name+"-minimize");
    minTab.setAttribute("onclick","unminimizeWindow('" + name + "')");
    minTab.innerHTML = display;
    document.getElementById("footer-container").appendChild(minTab);
    
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

function clickSettings(){
    var element = document.getElementById("settings-menu-content");
    
    if(element.style.display=="block"){
       element.style.display="none"; 
    } else {
        element.style.display="block";
    }

}

function fadeOut(id){
    var fadeTarget = document.getElementById(id);

    // Initialize opacity to 1 if not set
    if (!fadeTarget.style.opacity) {
        fadeTarget.style.opacity = 1;
    }

    var fadeEffect = setInterval(function () {
        // Convert opacity to a number before comparison
        var currentOpacity = parseFloat(fadeTarget.style.opacity);

        if (currentOpacity > 0) {
            fadeTarget.style.opacity = currentOpacity - 0.1;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.style.display = "none"; // Optional: Hide the element after fading out
        }
    }, 200);
        
}
function fadeIn(id) {
    var fadeTarget = document.getElementById(id);

    // Initialize opacity to 0 if not set
    if (!fadeTarget.style.opacity) {
        fadeTarget.style.opacity = 0;
    }
    var fadeEffect = setInterval(function () {
        // Convert opacity to a number before comparison
        var currentOpacity = parseFloat(fadeTarget.style.opacity);

        if (currentOpacity < 1) {
            fadeTarget.style.opacity = currentOpacity + 0.1;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.remove();
        }
    }, 200);
}

$("#site").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#confirmWebPage").click();
    }
});


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
 
function getIndex(item, array){
    for(var i = 0; i < array.length; i++){
        if(array[i] == item){
            return i;
        }
    }

    return false;
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

 function checkForWinState() {
    /* Check that all the files are name correctly */

    if(document.getElementById('recycle-body').contains(document.getElementById('not_a_virus.txt'))) {
        document.getElementById("reset").disabled = false;
        document.getElementById("reset").style.color = "black";
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

function setupFile1() {
    if (!testCases) {
        console.error("Error: testCases is undefined. Data not yet loaded.");
        return;
    }
    
    var addHTML = "<table><tr><th>User</th><th>Time</th><th>Search</th></tr>";
    for(var i = 0; i < testCases.length; i++){
       addHTML += '<tr><td>' + testCases[i].User + '</td>' +
                  '<td>' + testCases[i].Time + '</td>' +
                  '<td>' + testCases[i].Search + '</td></tr>'; 
    }
      addHTML += "</table>";
    var elements = document.getElementsByClassName("file1-database")
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

//------
// PUZZLE FUNCTIONS
//------

$(document).ready(function () {
    $(".icon-name").dblclick(function (){
        renameFile($(this));
    });
  });

  function renameFile(fileToRename) {
    const oldText = fileToRename.text();
      const newText = prompt("Rename:", oldText);
      
      if (newText !== null && newText !== "") {
        fileToRename.text(newText);
        checkName(fileToRename.attr("id"), newText);
      } else {
        newText = fileToRename.text(oldText);
      }
  }

  function checkName(name, newName) {

    const namePuzzles = new Map([
        ["file1-text", "file1-c"],
        ["file2-text", "file2-c"],
        ["file3-text", "file3-c"]
    ]);

    const solvedName = namePuzzles.get(name);

    if(newName == solvedName) {
        alert("New name is a match.");
        // Make something else happen here
    }
  }

  function winState() {
    const enterPassword = prompt("Enter password to reset:");

    if(enterPassword === password) {
        // Closes all windows
        for (var i = onScreen.length - 1; i >= 0; i--) {
            closeWindow(onScreen[i][0]);
            document.getElementById("settings-menu").style.display.none;
        }
        rebootScreenFade();
        
    } else {
        alert("Password incorrect.")
    }
  }

  const delay = ms => new Promise(res => setTimeout(res, ms));
  const rebootScreenFade = async () => {
    document.getElementById("reboot-screen").style.display = "block";
    fadeIn("reboot-screen");
  
    await delay(3000);
    // Win popup
    document.getElementById("win-window").style.display="block";
    fadeOut("reboot-screen");
  };


//------
// RIGHT CLICK MENU FUNCTIONS
//------

let currentRightClickedElement = null; // To store the currently right-clicked element

// Trigger action when the contexmenu is about to be shown
$(document).bind("contextmenu", function (event) {

    if (($(event.target).closest(".icon-group").length > 0) && ($(event.target).closest(".icon-group") !== "recycle")) {    // FIXME
        // Avoid the real one
        event.preventDefault();
        

        currentRightClickedElement = $(event.target).closest(".icon-group"); // Store the clicked element

        $(".custom-menu").finish().toggle(100).css({
            top: event.pageY + "px",
            left: event.pageX + "px",
        });
    } else {
        // Hide context menu if right-clicked outside "icon-group"
        $(".custom-menu").hide(100);
        currentRightClickedElement = null;
    }
});

// If the document is clicked somewhere else
$(document).bind("mousedown", function (e) {
    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {
        // Hide it
        $(".custom-menu").hide(100);
    }
});

// If the menu element is clicked
$(".custom-menu li").click(function () {
    switch ($(this).attr("data-action")) {
        case "open": openWindow(currentRightClickedElement.getAttribute("onclick")); break;
        case "rename": const fileNameElement = currentRightClickedElement.find(".icon-name"); // Ensure correct target
                        renameFile(fileNameElement);
                        break;
        case "delete": deleteFile(); break; // Call the updated deleteFile
    }

    // Hide it AFTER the action was triggered
    $(".custom-menu").hide(100);
});

function deleteFile() {
    if (currentRightClickedElement) {
        $("#recycle-body").append(currentRightClickedElement);
        currentRightClickedElement = null;
    }
    checkForWinState();
}


/* 

BUBBLES!!

 * Bubble Cursor.js
 * - 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- https://codepen.io/tholman/full/qbxxxq/
 * 
 */

(function bubblesCursor() {
  
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cursor = {x: width/2, y: width/2};
    var particles = [];
    
    function init() {
      bindEvents();
      loop();
    }
    
    // Bind events that are needed
    function bindEvents() {
      document.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onWindowResize);
    }
    
    function onWindowResize(e) {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    function onTouchMove(e) {
if(cursoreffects){ 


      if( e.touches.length > 0 ) {
        for( var i = 0; i < e.touches.length; i++ ) {
          addParticle(e.touches[i].clientX, e.touches[i].clientY);
        }
      }
    }
    }
    
    function onMouseMove(e) {   
         
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      if(cursoreffects){ 
      addParticle( cursor.x, cursor.y);
      }
    }
    
    function addParticle(x, y) {
      var particle = new Particle();
      particle.init(x, y);
      particles.push(particle);
    }
    
    function updateParticles() {
      
      // Update
      for( var i = 0; i < particles.length; i++ ) {
        particles[i].update();
      }
      
      // Remove dead particles
      for( var i = particles.length - 1; i >= 0; i-- ) {
        if( particles[i].lifeSpan < 0 ) {
          particles[i].die();
          particles.splice(i, 1);
        }
      }
      
    }
    
    function loop() {
      requestAnimationFrame(loop);
      updateParticles();
    }
    
    /**
     * Particles
     */
    
    function Particle() {
  
      this.lifeSpan = 250; //ms
      this.initialStyles ={
        "position": "absolute",
        "display": "block",
        "pointerEvents": "none",
        "z-index": "10000000",
        "width": "5px",
        "height": "5px",
        "will-change": "transform",
        "background": "#e6f1f7",
        "opacity" : "50%",
        "box-shadow": "-1px 0px #6badd3, 0px -1px #6badd3, 1px 0px #3a92c5, 0px 1px #3a92c5",
         "border-radius": "3px",
        "overflow": "hidden"
      };
  
      // Init, and set properties
      this.init = function(x, y) {
  
        this.velocity = {
          x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
          y: (-.4 + (Math.random() * -1))
        };
        
        this.position = {x: x - 10, y: y - 10};
  
        this.element = document.createElement('span');
        applyProperties(this.element, this.initialStyles);
        this.update();
        
        document.body.appendChild(this.element);
      };
      
      this.update = function() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Update velocities
        this.velocity.x += (Math.random() < 0.5 ? -1 : 1) * 2 / 75;
        this.velocity.y -= Math.random() / 600;
        this.lifeSpan--;
        
        this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + ( 0.2 + (250 - this.lifeSpan) / 250) + ")";
      }
      
      this.die = function() {
        this.element.parentNode.removeChild(this.element);
      }
    }
    
    /**
     * Utils
     */
    
    // Applies css `properties` to an element.
    function applyProperties( target, properties ) {
      for( var key in properties ) {
        target.style[ key ] = properties[ key ];
      }
    }
    
    init();
  })();