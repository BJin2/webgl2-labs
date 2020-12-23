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

// vertex array object
var vao; // for actual vertex
var c_vao;// for colors on each vertex

// view frustum
var viewFrustum;

//objects to draw
var objects = [];

var cube;
var desk_top;
var desk_leg_01;
var desk_leg_02;
var desk_leg_03;
var desk_leg_04;
var plane;

// sliders
var fovSlider = new Slider("FOV", "fov", 60);
var aspectSlider = new Slider("Aspect", "aspect", 1);

// buttons
var button_Rot_X = document.getElementById("Rotate_X");
var button_Rot_Y = document.getElementById("Rotate_Y");
var button_Rot_Z = document.getElementById("Rotate_Z");
var button_Toggle_Rotation = document.getElementById("ToggleRotation");

// variables for rotating
var rotateAxis = Axis.X;
var toggleRotation = 0;

button_Rot_X.addEventListener("click", function(){rotateAxis = Axis.X;});
button_Rot_Y.addEventListener("click", function(){rotateAxis = Axis.Y;});
button_Rot_Z.addEventListener("click", function(){rotateAxis = Axis.Z;});
button_Toggle_Rotation.addEventListener("click", function(){toggleRotation = ++toggleRotation%2});
window.addEventListener("load", function(){
    Initialize();
    //gl.enable(gl.CULL_FACE); //backface culling
    gl.enable(gl.DEPTH_TEST);
	update();
});

function update()
{
    Time.Tick();
    if(toggleRotation === 0)
    {
        switch(rotateAxis)
        {
            case Axis.X:
                Camera.rotation_x += 50 * Time.delta;
            break;
            case Axis.Y:
                Camera.rotation_y += 50 * Time.delta;
            break;
            case Axis.Z:
                Camera.rotation_z += 50 * Time.delta;
            break;
        }
    }
    viewFrustum.calcuateF(fovSlider.slider.value);
    viewFrustum.aspect = aspectSlider.slider.value;
	Render();
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
    desk_top.objectInfo.rotation = [-0, -0, 0];
    desk_top.objectInfo.scale = [1.3, 0.15, 1.3];
    desk_top.objectInfo.color = [0.7, 0.52, 0, 1];

    desk_leg_01.objectInfo.position = [-1.2, -0.7, -1.2];
    desk_leg_01.objectInfo.rotation = [0, 0, 0];
    desk_leg_01.objectInfo.scale = [0.1, 0.6, 0.1];
    desk_leg_01.objectInfo.color = [0.7, 0.52, 0, 1];
    
    desk_leg_02.objectInfo.position = [1.2, -0.7, -1.2];
    desk_leg_02.objectInfo.rotation = [0, 0, 0];
    desk_leg_02.objectInfo.scale = [0.1, 0.6, 0.1];
    desk_leg_02.objectInfo.color = [0.7, 0.52, 0, 1];

    desk_leg_03.objectInfo.position = [-1.2, -0.7, 1.2];
    desk_leg_03.objectInfo.rotation = [0, 0, 0];
    desk_leg_03.objectInfo.scale = [0.1, 0.6, 0.1];
    desk_leg_03.objectInfo.color = [0.7, 0.52, 0, 1];
    
    desk_leg_04.objectInfo.position = [1.2, -0.7, 1.2];
    desk_leg_04.objectInfo.rotation = [0, 0, 0];
    desk_leg_04.objectInfo.scale = [0.1, 0.6, 0.1];
    desk_leg_04.objectInfo.color = [0.7, 0.52, 0, 1];

    cube.objectInfo.position = [0, 0.45, 0.0];
    cube.objectInfo.rotation = [0, 0, 0];
    cube.objectInfo.scale = [0.3, 0.3, 0.3];
    cube.objectInfo.color = [0, 0, 1, 1];

    plane.objectInfo.position = [0,-1.3,0];
    plane.objectInfo.rotation = [-0, -0, 0];
    plane.objectInfo.scale = [2, 0.0001, 2];
    plane.objectInfo.color = [1.0, 0.0, 0.0, 1.0];

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
    //cube = new dObject("cube");
    //cube.objectInfo.position = [0, 0, -1500];
   // objects.push(cube);
    //GL
        gl = GLInstance("canvas").fSetSize(500, 500).fClear();

        viewFrustum = new ViewFrustum(60, (gl.canvas.clientWidth / gl.canvas.clientHeight), 1, 1000);
        fovSlider.slider.value = 60;
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

function Render()
{
    gl.fClear();
    // Matrix for transform
    var projection = matrix4X4.perspective(viewFrustum);

    var cameraMatrix = matrix4X4.xRotation(Camera.rotation_x);
    cameraMatrix = matrix4X4.rotate(cameraMatrix, Axis.Y, Camera.rotation_y);
    cameraMatrix = matrix4X4.rotate(cameraMatrix, Axis.Z, Camera.rotation_z);
    cameraMatrix = matrix4X4.translate(cameraMatrix, 0, 0, 10);

    var viewMatrix = matrix4X4.inverse(cameraMatrix);
    var viewProjectionMatrix = matrix4X4.multiply(projection, viewMatrix);

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

        // Scale -> rotate -> translate
        //Translation
        var matrix = matrix4X4.translate(viewProjectionMatrix,  objects[i].objectInfo.position[0], 
                                        objects[i].objectInfo.position[1], 
                                        objects[i].objectInfo.position[2]);
        //Rotate
        matrix = matrix4X4.rotate(matrix, Axis.X, 
            objects[i].objectInfo.rotation[0]);
            matrix = matrix4X4.rotate(matrix, Axis.Y, 
            objects[i].objectInfo.rotation[1]);
            matrix = matrix4X4.rotate(matrix, Axis.Z, 
            objects[i].objectInfo.rotation[2]);
        //Scale
        matrix = matrix4X4.scale(matrix,  objects[i].objectInfo.scale[0], 
                                    objects[i].objectInfo.scale[1], 
                                    objects[i].objectInfo.scale[2]);

        //set uniforms
        gl.uniformMatrix4fv(uMatrixLocation, false, matrix);

        //Draw object
        gl.drawArrays(objects[i].objectInfo.draw_mode, 0, (objects[i].objectInfo.vertex.length/3));
        gl.disableVertexAttribArray(c_vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
    }
};