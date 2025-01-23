$('#terminal-body').terminal({
    hello: function(what) {
        this.echo('Hello, ' + what +
                  '. Welcome to this terminal.');
    },
    checkdisk: function(){

        
     if(getCookie("adminlogin") == "true"){
        if(getCookie("bluescreen") == "true"){
                this.echo("Previous failure detected. Admin access set to TRUE, printing error:");
                this.echo("-- USER GRANTED ADMIN ACCESS");
                this.echo("-- USER RESTORED FOLDER FROM DELETE DISK");
                this.echo("-- USER OPENED A FILE IN THE FOLDER");
                this.echo("-- FOLDER CORRUPT, UNABLE TO OPEN");
                this.echo("If this problem persists, try cleardisk to reboot to a recent backup of the disk.");
            } else {
            this.echo("No issues reported. All systems functioning within normal parameters.");
            }
            
        } else {
            if(getCookie("bluescreen") == "true"){
            this.echo("Previous failure detected. Admin access required for further system diagnostic.");
            } else {
                this.echo("No issues reported. All systems functioning within normal parameters.");
            }
        }
        
    },
    restorefolder: function(){
        if (getCookie("adminlogin") == "true" && getCookie("restorefolder") != "true"){
            this.echo("[1] folder restored.");
            document.cookie="restorefolder=true;";
            reFolder();
        } else if (getCookie("adminlogin") == "true" && getCookie("restorefolder" == "true")){
            this.echo("No folders to restore.");
        } else {
            this.echo("Admin access required.");
        }
        
    },
    ping: function() {
        this.echo('pong!');
    },
    pong: function(){
        this.echo('ping!');
    },
    cleardisk: function(){
        
        if (getCookie("adminlogin") == "true"){
            this.echo("Clearing disk...");
            clearListCookies();
            this.echo("Restarting...");
            setTimeout(() => {  window.location.reload(); }, 2000);
        } else {
            this.echo("Admin access required.");
        }
        
    },
    hack: function(){
        this.echo('This terminal currently does not have hacking functionality. Please contact your local computer administrator, if you trust them.');
    },
    adminaccess: function(bool){
        bool = "" + bool;
        bool = bool.toLowerCase();
        
        
        if(getCookie("adminlogin") != "true"){ //not logged in
          switch(admin){
              case 0:
                  if(bool == "true"){
                    this.echo("Attempting to set Admin access set to TRUE.");
                    this.echo("Admin username and password required.");
                    this.echo("Enter admin username to continue.");
                    admin++;
                      
                  } else if (bool == "false"){
                       this.echo("Admin access set to FALSE.");
                      admin = 0;
                  
                  } else {
                      this.echo("Set admin access to either TRUE or FALSE.");
                  }
                  break;
              case 1:
                  
                  if(bool == passwords[0][0]){
                      this.echo("Username accepted.");
                      this.echo("Enter password for account : " + passwords[0][0]);
                      userAccount = 0;
                      admin++;
                  } else if(bool == passwords[1][0]){
                      this.echo("Username accepted.");
                      this.echo("Enter password for account : " + passwords[1][0]);
                      userAccount = 1;
                      admin++;
                  } else {
                      
                      this.echo("Unknown username.");
                      this.echo("Admin accounts on this computer : ");
                      for(var i = 0; i < passwords.length; i++){
                          this.echo("-- " + passwords[i][0]);
                      }
                      
                  }
            
                  break;
              case 2:
                  
                  var myDecipher = decipher(salty);

                if(bool == deciphPass(passwords[userAccount][1])){
                    this.echo("Admin access granted.");
                     document.cookie="adminlogin=true;";
                    //admin++;
                } else {
                    this.echo("Incorrect password.");
                 
                    
                    this.echo("Expected : " + myDecipher(passwords[userAccount][1]));
                    console.log("Expected : " + myDecipher(passwords[userAccount][1]));
                
                    this.echo("Got : " + getShiftedCipher(bool));
                    console.log("Got : " + getShiftedCipher(bool));
                    
                    this.echo("Admin access set to FALSE.");
                    admin = 0;
                }
                  break;
                  
              default:
                this.echo("An error has occured.");
                this.echo("Please take a screenshot of what you see and send it to Nina.");
                this.echo("Error code: CONTACT-NINA-002");
          }
            
            
            
        } else if(getCookie("adminlogin") == "true") { //logged in
            
              this.echo("User already logged in with Admin controls.");
            
        } else {
                this.echo("An error has occured.");
                this.echo("Please take a screenshot of what you see and send it to Nina.");
                this.echo("Error code: CONTACT-NINA-001");
        }
        
    },    
    game: function(arg){
        
        if(g == 0){
            if(arg == "start"){ //starting the game
                g = 1;
                this.echo("Game starting...");
                this.echo("You're at a crossroads. Would you like to go left or right?");

            } else {
                this.echo("Try starting the game with:");
                this.echo("game start");
            }      
        }
        
        if(arg != "start" && g!= 0){ // playing the game
           if(g == 1){
            
            if(arg =="left"){
                g++;
                this.echo("You go left and escape.");
                this.echo("To play again, type:");
                this.echo("game restart");
                
            } else if (arg=="right"){
                g++;
            this.echo("You go right and die.");
                this.echo("To play again, type:");
                this.echo("game restart");
                
            } else {
            this.echo("You're at a crossroads. Would you like to go left or right?");
            }
            
           }
        }
        
        if(arg == "restart" || arg == "reset"){
            g = 0;
            this.echo("Resetting...");
            this.echo("Game reset! Please type:");
            this.echo("game start"); 
        }
        
        
    }
    
    
}, {
    greetings: '[ISF - COMP 1] Waiting for command...'
   
});

//This is a VERY INSECURE HASHING SYSTEM.
//DO NOT USE WITH ACTUALLY SENSITIVE MATERIAL.
//https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}

const decipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
}


function BSOD(){
    
    var desktop = document.getElementById("bd");
    
    desktop.innerHTML = `   
<div id="blue-screen">
        <div>*** STOP ****</div>  
        <div>If this is the first time you've seen this Stop error screen, restart your computer.</div>
        <div>If this screen appears again, follows these steps:</div>
        <div>Restart your computer and run command 'checkdisk' in Terminal to check for hard drive corruption.</div>
        <div>Contact your IT Administrator if the error persists.</div>
</div>
    `;
    
    
    document.cookie="bluescreen=true;";


}


function getCookie(cname){
    
     var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
    
    
}


function clearListCookies(){
    var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++){   
            var spcook =  cookies[i].split("=");
            document.cookie = spcook[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 UTC;";                                
        }
}



function getShiftedCipher(cipherText){
    
    returnCiphered = "";
    
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    alphabet = alphabet.toLowerCase();
//    currentLetter = 1;
    var newIndex = 0;
    
    
    for(var i = 0; i < cipherText.length; i++){
        
        newIndex = alphabet.indexOf(""+cipherText[i])+i+1;
        
        while(newIndex >= alphabet.length){
            newIndex -= alphabet.length;
        }
  
        returnCiphered += alphabet[newIndex];
    }   
    
    return returnCiphered;
}

function getUnShiftedCipher(decipherText){
    
        returnDeciphered = "";
    
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    alphabet = alphabet.toLowerCase();
    decipherText = decipherText.toLowerCase();

    var newIndex = 0;
    
    
    for(var i = 0; i < decipherText.length; i++){
        
        newIndex = alphabet.indexOf(""+decipherText[i])-i-1;
        
        while(newIndex < 0){
            newIndex += alphabet.length;
        }
        
        returnDeciphered += alphabet[newIndex];
    }   
    
    return returnDeciphered;    
    
}

function deciphPass(pass){
        var myDecipher = decipher("saltyboi");
    
        return getUnShiftedCipher(myDecipher(pass));
}
