var vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec4 vColorAttr;
out vec4 vColor;

// matrix for changing transform
uniform mat4 u_matrix;

// variable for  perpective
uniform float u_fudgeFactor;

void main()
{
    // get temporary position
    vec4 position = u_matrix * a_position;

    // x and y will be divided by z*variable
    // it has to be 1 when u_fudgeFactor is 0. This is why there is +1   Example ->  x/1+(z*0), y/1+(z*0)
    float zToDivideBy = 1.0 + position.z * u_fudgeFactor;

    // x and y divided by calculated variable
    gl_Position = vec4(position.xy / zToDivideBy, position.zw);

    vColor = vColorAttr;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 outColor;

void main()
{
    outColor = vColor;
}`;

function createShader(gl, type, source)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success)
    {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader)
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success)
    {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}