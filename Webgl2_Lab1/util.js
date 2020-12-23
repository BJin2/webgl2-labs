function Scale(arr, width, height)//change pixel to clipspace
{
    for(var i = 0; i < arr.length; i+=3)
    {
        arr[i] /= 250*(500/width);
        arr[i+1] /= 250*(500/height);
    }
}

function Translate(arr, x, y)//pixel & center pivot
{
    for(var i = 0; i < arr.length; i+=3)
    {
        arr[i]   += x;
        arr[i+1] += y;
    }
}