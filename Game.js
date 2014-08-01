function GameEngine() {
	var Game = this;
	
	// config is overridden via parameter on run()
	Game.config = {
		maxTimeDiff: 0.5, // Max time between draw phases (in seconds)
		maxSkippedFrames: 5, // Max number of frames to skip before draw
		desiredFps: 30 	
	};
	
    Game.runFlag = false;
	
    /**
     * Load the game interface Resources
     */
    Game.load = function() {
		console.log("Loading Resources for initial screens");
	}
 
    /**
     * Initialize the game interface
     */
    Game.startup = function() {
    	console.log('Initializing interface');
    }
    
    /**
     * Clean up game resources
     */
    Game.shutdown = function() {
    	console.log('Shutting down interface');
    }
    
    /**
     * Update All actors
     */
    Game.update = function(time) {
		//console.log('Moving actors');
    }
    
    /**
     * Draw All layers to canvas
     */
    Game.draw = function() {
		//console.log('Drawing actors');
    }
    
    /**
     * Stop game loop
     */
    Game.stop = function() {
    	//console.log('Stopping game');
        Game.runFlag = false;
    }
    
    /**
     * Resume game loop
     */
    Game.resume = function() {
    	//console.log('resuming game');
        Game.runFlag = true;
        Game.nextFrame();
    }
     
    /**
     * Update and draw another Frame. If behind the desired FPS,
	 * try to catch up before drawing.
     */
    Game.nextFrame = function() {
    	//console.log('starting game loop');
    	while(Game.runFlag) {
    		var d1 = new Date();
            var currTime = d1.getTime();
            
            if((currTime - Game.nextTime) > Game.config.maxTimeDiff)
            	Game.nextTime = currTime;
				
            if(currTime >= Game.nextTime)
            {
                Game.nextTime += Game.delta;
                Game.update(currTime);
				
                if((currTime < Game.nextTime) || (Game.skippedFrames > Game.config.maxSkippedFrames))
                {
                	Game.frameCount ++;
                    Game.draw();
                    Game.skippedFrames = 1;
                }
                else
                {
                	//console.log("Game is running behind: skipping draw phase");
                    Game.skippedFrames++;
                }
            }
            else
            {
                var sleepTime = Math.ceil( (Game.nextTime - currTime)); 
                console.log("Game is running on schedule: sleeping until next frame ("+sleepTime+" ms)"); 				
                if(sleepTime > 0) window.setTimeout(Game.nextFrame,sleepTime);
					break;
            }
    	}
    }
    
    /**
     * Fire up the game engine and set config JSON
     */
    Game.run = function(ops)
    {
		for (var a in ops) { console.log(a); Game.config[a] = ops[a]; }
			
        Game.runFlag = true;
        
        Game.startup();

        var d = new Date();
        Game.nextTime = d.getTime();
		
		Game.skippedFrames = 1;
		Game.delta = 1000.0/Game.config.desiredFps;
		Game.startTime = Game.nextTime;
        
        Game.nextFrame();
    }
	
	// Start the resource requests ASAP!
	Game.load();
}
