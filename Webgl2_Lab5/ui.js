function Slider(ID, outputID, startValue)
{
	var self = this;
	this.slider = document.getElementById(ID);
	this.output = document.getElementById(outputID);
	this.slider.value = startValue;
	this.output.innerHTML = "value : "+this.slider.value;

	this.slider.oninput = function(){self.output.innerHTML = "value : "+this.value}
	return this;
}