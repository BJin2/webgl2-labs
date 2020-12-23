var gl;

var vertexShader;
var fragmentShader;

var program;

var positionBuffer;
var colorBuffer;

var positionAttributeLocation;
var c_vertex;

var vao;
var c_vao;

var objects = [];


window.addEventListener("load", function(){
    Initialize();
    Render();
});

function Initialize()
{
//Create Objects
    objects.push(new dObject(730,1000,90,90,"triangle"));
    objects.push(new dObject(0,-150,300,250,"zigzag_fill"));
    objects.push(new dObject(0,-150,300,250,"zigzag"));
    objects.push(new dObject(0,60,300,250,"zigzag_fill"));
    objects.push(new dObject(0,60,300,250,"zigzag"));
    objects.push(new dObject(-700,800,110,110,"hexagon"));
    

//GL
    gl = GLInstance("canvas").fSetSize(500, 500).fClear();
//Shader
    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
//Program
    program = createProgram(gl, vertexShader, fragmentShader);
//Attribute
    positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    c_vertex = gl.getAttribLocation(program, "vColorAttr");


/// Need simplifying //////// Buffer and VAO //////////////// 

//Buffer
    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// VAO ( Vertex Array Object )
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0,0);

// Color Buffer
    colorBuffer = gl.createBuffer();
    c_vao = gl.createVertexArray();

    
//////////////////////////////////////////////////////
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    gl.useProgram(program);
};

function Render()
{
    for(var i = 0; i < objects.length; i++)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[i].objectInfo.vertex), gl.STATIC_DRAW);

        gl.bindVertexArray(vao);
        gl.disableVertexAttribArray(c_vertex);

        if(objects[i].objectInfo.color.length > 4)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[i].objectInfo.color), gl.STATIC_DRAW);
            
            gl.enableVertexAttribArray(c_vertex);
            gl.vertexAttribPointer(c_vertex, 4, gl.FLOAT, false, 0, 0);
        }
        else
        {
            gl.vertexAttrib4f(c_vertex, objects[i].objectInfo.color[0],
                                        objects[i].objectInfo.color[1],
                                        objects[i].objectInfo.color[2],
                                        objects[i].objectInfo.color[3]);
        }

        gl.drawArrays(objects[i].objectInfo.draw_mode, 0, (objects[i].objectInfo.vertex.length/3));

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
};