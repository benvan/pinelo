/*
 * menu.js 
 *
 * The menu, dynamically built.
 *
 */

var Menu = function() {
	
	this.currentIndex = 0;
	
	this.init = function(){
		
		var that = this;
				
		//Put eraser.
		$("#eraser")
		.append($("<input>").attr({type: "radio", id: "@_eraser", name: "brushset"}))
		.append($("<label>").attr("for","@_eraser").html("eraser").addClass("ui-btn-eraser"));
		
		//Put default and rest of the brushes.
		var i = 0;
		$("#brushes")
		.append($("<input>").attr({index: i++, type: "radio", id: "@_def", name: "brushset", checked: "checked"}))
		.append($("<label>").attr("for","@_def").html("default"));

		for (var b in BRUSH_INCLUDES){
			if (BRUSH_INCLUDES.hasOwnProperty(b)){
			    var brush = BRUSH_INCLUDES[b];
				$("#brushes")
				.append($("<input>").attr({index: i++, type: "radio", id: "@_" + brush, name: "brushset"}))
				.append($("<label>").attr("for","@_" + brush).html(brush));
			}
		}
		
		// JQuery UI buttonset.	
		$("#brushes").buttonset();
		$("#eraser").buttonset();
		$("#reset").button();
		$("#export").button();		
		
		// Select brush according to index.
		$("#brushes input").click(function(e){
			var index = $(this).attr("index");
			that.currentIndex = parseFloat(index);
			if (that.currentIndex === 0){
				palette.setDefaultBrush();
			}
			else{
				palette.setBrush(BRUSH_INCLUDES[that.currentIndex - 1]);
			}
		});
		
		// Eraser selection.
		$("#reset").click(function(e){
			ctx.fillStyle = BACKGROUND_COLOR;
    		ctx.fillRect(0, 0, wWidth, wHeight);
		});
		
		$("#export").click(function(e){
			var imageData = ctx.getImageData(0,0, wWidth, wHeight);
			var i_h = imageData.height;
			var i_w = imageData.width;
			for (var x = 0; x < i_h; x++){
				for (var y = 0; y < i_w; y++){
					var index =  (4 * x * i_w) + (y * 4);
					var red   = imageData.data[index];
					var green = imageData.data[index + 1];
					var blue  = imageData.data[index + 2]; 
					//var isRed = red > 220 && red < 250;
					//var isBlue = blue > 198 && blue < 226;
					//var isGreen = green > 221 && green < 249;
					//if (isRed && isGreen && isBlue){
					if(red === BACKGROUND_COLOR_ARRAY[0]
						&& green === BACKGROUND_COLOR_ARRAY[1] 
						&& blue === BACKGROUND_COLOR_ARRAY[2]){
						imageData.data[index + 3] = 0;
					}
					else{
					}
				}
			}
			ctx.putImageData(imageData, 0, 0);
		});
		
		// Eraser selection.
		$("#eraser input").click(function(e){
			palette.setEraser();
		});
		
		// Can also navigate with keyboard A and S.
		$(window).keyup(function(e) {
    		
    		if (e.keyCode === 65){
    			that.currentIndex--;
    			if (that.currentIndex < 0){ that.currentIndex += BRUSH_INCLUDES.length + 1; }
    		}
    		else if (e.keyCode === 83){
    			that.currentIndex = (that.currentIndex + 1) % (BRUSH_INCLUDES.length + 1);
    		}
    		
    		$("#brushes label")
    			.attr("aria-pressed", "false")
    			.removeClass("ui-state-active")
    			.addClass("ui-state-default");

    		if (that.currentIndex === 0){
    			var brush = "def";
    		}
    		else{
    			brush = BRUSH_INCLUDES[that.currentIndex - 1]
    		}
    		$("#brushes label[for~='@_" + brush + "']")
    			.attr("aria-pressed", "true")
    			.removeClass("ui-state-default")
    			.addClass("ui-state-active");
    			
    		$("#brushes input[index=" + that.currentIndex + "]").click();
    	
    	});
		
		return this;
		
	};


}