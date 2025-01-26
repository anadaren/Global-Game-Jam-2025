$('#terminal-body').terminal({
    hello: function(what) {
        this.echo('Hello, ' + what +
                  '. Welcome to this terminal.');
    },
    checkdisk: function(){
        this.echo("Admin access required."); 
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
    scramble: function(arg){
        if(arg === "uvsiot_r_an") {
            this.echo('Scrambled text: not_a_virus');
        } else {
            let characters = arg.split('');
            
            for (let i = characters.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [characters[i], characters[randomIndex]] = [characters[randomIndex], characters[i]];
            }

            this.echo("Scrambled text: " + characters.join(''));
        }
    },

    cursoreffects: function(bool){
        if(bool==true || bool==false){
            
        cursoreffects = bool;
        bool = "" + bool;
        bool = bool.toLowerCase();
        this.echo('Cursor effects set to: ' + bool.toUpperCase());
        
    } else {
        this.echo("Unknown arguments. Try TRUE or FALSE.")
    }
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
          }
            
            
            
        } else {
                this.echo("An error has occured.");
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
    greetings: '[ (C) Placeholder OS ] Waiting for command...'
   
});