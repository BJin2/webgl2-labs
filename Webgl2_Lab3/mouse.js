var mouseObject = function(can)
{
	this.canvas = can;
	this.x;
	this.y;
	this.prv_x;
	this.prv_y;
	this.delta_x = 0;
	this.delta_y = 0;
	this.mouseDown = false;
	var self = this;
	
	this.position = function(event)
	{
		var rect = self.canvas.getBoundingClientRect();
		self.prv_x = self.x;
		self.prv_y = self.y;
		self.x = event.clientX - rect.left;
		self.y = event.clientY - rect.top;
		self.delta_x = (self.x - self.prv_x);
		self.delta_y = (self.y - self.prv_y);
		
		//console.log(self.delta_x);
	};
	this.down = function(event)
	{
		//left moust button click
		if(event.which == 1)
		{
			self.mouseDown = true;
		}
	};
	this.up = function(event)
	{
		if(event.which == 1)
		{
			self.mouseDown = false;
		}
	};
};



