// gl instance
var gl;

// shaders
var vertexShader;
var fragmentShader;

// shader program
var program;

// buffers
var positionBuffer;
var colorBuffer;

// attributes
var positionAttributeLocation;
var c_vertex;

// uniforms
var uMatrixLocation;
var uFudgeFactorLocation;

// fudgefactor for perspective view
var f;

// vertex array object
var vao; // for actual vertex
var c_vao;// for colors on each vertex

//objects to draw
var objects = [];

var cube;
var desk_top;
var desk_leg_01;
var desk_leg_02;
var desk_leg_03;
var desk_leg_04;
var plane;


window.addEventListener("keydown", function (e) 
{

    switch (e.keyCode) 
	{
        case 37://left
        case 65:
			desk_top.objectInfo.position[0] -= 0.5 * Time.delta;
            break;
        case 38://up
        case 87:
			desk_top.objectInfo.position[1] += 0.5 * Time.delta;
			break;
        case 39://right
        case 68:
			desk_top.objectInfo.position[0] += 0.5 * Time.delta;
            break;
        case 40://down
        case 83:
			desk_top.objectInfo.position[1] -= 0.5 * Time.delta;
            break;
		case 69:
			desk_top.objectInfo.rotation[1] -= 50 * Time.delta;
            break;
		case 81:
			desk_top.objectInfo.rotation[1] += 50 * Time.delta;
            break;	
        default:
            break;
    }
	console.log(desk_top.objectInfo.position);
});

window.addEventListener("load", function(){
    Initialize();
    gl.enable(gl.CULL_FACE); //backface culling
    gl.enable(gl.DEPTH_TEST);
    //Render();
	update();
});

function update()
{
	Time.Tick();
	Render(Time.delta);
	requestAnimationFrame(update);
};

function SetObjects()
{
    //Create Objects 
    cube = new dObject("cube");
    desk_top = new dObject("cube");
    desk_leg_01 = new dObject("cube");
    desk_leg_02 = new dObject("cube");
    desk_leg_03 = new dObject("cube");
    desk_leg_04 = new dObject("cube");
    plane = new dObject("cube");


// Set Object Transform
    desk_top.objectInfo.position = [0, 0.0, 0];
    desk_top.objectInfo.rotation = [-15, -40, 0];
    desk_top.objectInfo.scale = [0.21, 0.015, 0.21];
    desk_top.objectInfo.color = [0.7, 0.52, 0, 1];

    desk_leg_01.objectInfo.parent = desk_top;
    desk_leg_01.objectInfo.position = [-0.2, -0.114, -0.2];
    desk_leg_01.objectInfo.scale = [0.01, 0.1, 0.01];
    desk_leg_01.objectInfo.color = [0.7, 0.52, 0, 1];
    
    desk_leg_02.objectInfo.parent = desk_top;
    desk_leg_02.objectInfo.position = [-0.2, -0.114, 0.2];
    desk_leg_02.objectInfo.scale = [0.01, 0.1, 0.01];
    desk_leg_02.objectInfo.color = [0.7, 0.52, 0, 1];

    desk_leg_03.objectInfo.parent = desk_top;
    desk_leg_03.objectInfo.position = [0.2, -0.114, 0.2];
    desk_leg_03.objectInfo.scale = [0.01, 0.1, 0.01];
    desk_leg_03.objectInfo.color = [0.7, 0.52, 0, 1];
    
    desk_leg_04.objectInfo.parent = desk_top;
    desk_leg_04.objectInfo.position = [0.2, -0.114, -0.2];
    desk_leg_04.objectInfo.scale = [0.01, 0.1, 0.01];
    desk_leg_04.objectInfo.color = [0.7, 0.52, 0, 1];

    cube.objectInfo.parent = desk_top;
    cube.objectInfo.position = [0, 0.065, 0.0];
    cube.objectInfo.scale = [0.05, 0.05, 0.05];
    cube.objectInfo.color = [0, 0, 1, 1];

    plane.objectInfo.parent = desk_top;
    plane.objectInfo.position = [0,-0.216,0];
    plane.objectInfo.rotation = [0, 0, 0];
    plane.objectInfo.scale = [0.5, 0.001, 0.5];
    plane.objectInfo.color = [1.0, 0.0, 0.0, 1.0];

    f = 0.7;

    objects.push(plane);
    objects.push(desk_leg_01);
    objects.push(desk_leg_02);
    objects.push(desk_leg_03);
    objects.push(desk_leg_04);
    objects.push(desk_top);
    objects.push(cube);
}

function Initialize()
{
    SetObjects();
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
    //Uniform
        uMatrixLocation = gl.getUniformLocation(program, "u_matrix");
        uFudgeFactorLocation = gl.getUniformLocation(program, "u_fudgeFactor");


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
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
};

function Render(delta)
{
	gl.fClear();
    for(var i = 0; i < objects.length; i++)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[i].objectInfo.vertex), gl.STATIC_DRAW);

        gl.bindVertexArray(vao);
        gl.disableVertexAttribArray(c_vertex);

        if(objects[i].objectInfo.color.length > 4) // colors on each vertex
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objects[i].objectInfo.color), gl.STATIC_DRAW);
            
            gl.enableVertexAttribArray(c_vertex);
            gl.vertexAttribPointer(c_vertex, 4, gl.FLOAT, false, 0, 0);
        }
        else // one color
        {
            gl.vertexAttrib4f(c_vertex, objects[i].objectInfo.color[0],
                                        objects[i].objectInfo.color[1],
                                        objects[i].objectInfo.color[2],
                                        objects[i].objectInfo.color[3]);
        }

        // Matrix for transform
        //scale -> rotate -> translate -> rotate based on its parent(if it has)
        var mat = matrix4X4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 500);
        //Scale
        mat = matrix4X4.scale(mat,  objects[i].objectInfo.scale[0], 
            objects[i].objectInfo.scale[1], 
            objects[i].objectInfo.scale[2]);
        //Rotate
        mat = matrix4X4.rotate(mat, Axis.Y, 
            objects[i].objectInfo.rotation[1]);
        mat = matrix4X4.rotate(mat, Axis.X, 
            objects[i].objectInfo.rotation[0]);
        mat = matrix4X4.rotate(mat, Axis.Z, 
            objects[i].objectInfo.rotation[2]);
        //Translate
        mat = matrix4X4.translate(mat,  objects[i].objectInfo.position[0], 
                                        objects[i].objectInfo.position[1], 
										objects[i].objectInfo.position[2]);

        if(objects[i].objectInfo.parent != null)// Rotate and move along the parent object
        {
            mat = matrix4X4.rotate(mat, Axis.Y, 
                objects[i].objectInfo.parent.objectInfo.rotation[1]);
            mat = matrix4X4.rotate(mat, Axis.X, 
                objects[i].objectInfo.parent.objectInfo.rotation[0]);
            mat = matrix4X4.rotate(mat, Axis.Z, 
                objects[i].objectInfo.parent.objectInfo.rotation[2]);
				
			mat = matrix4X4.translate(mat, objects[i].objectInfo.parent.objectInfo.position[0], 
			objects[i].objectInfo.parent.objectInfo.position[1],
			objects[i].objectInfo.parent.objectInfo.position[2]);
        }

        //set uniforms
        gl.uniformMatrix4fv(uMatrixLocation, false, mat);
        gl.uniform1f(uFudgeFactorLocation, f);

        //Draw object
        gl.drawArrays(objects[i].objectInfo.draw_mode, 0, (objects[i].objectInfo.vertex.length/3));

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
	//cube.objectInfo.rotation[1] += 0.8;
};