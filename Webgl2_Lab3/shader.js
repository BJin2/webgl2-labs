var vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec4 vColorAttr;
out vec4 vColor;

// matrix for changing transform
uniform mat4 u_matrix;

void main()
{
    gl_Position = u_matrix * a_position;
    //gl_Position.z = -gl_Position.z;
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