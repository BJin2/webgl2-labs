var gl;
var vertexArray;
var vertexBuffer;
var colorBuffer;
var shaderProg;
var vColor;
var points = [];
var colors = [];
var vertices = [];
var vertexColors = [];
var translations = [];

var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();
var modelViewMatrixStack = [];
var fovy = glMatrix.toRadian(45.0);  // vertical Field-of-view (in Y direction) angle (in radians)
const at = vec3.clone([0.0, 0.0, 0.0]);
const up = vec3.clone([0.0, 1.0, 0.0]);

var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;

var normalsArray = [];
var normalBuffer;
var normalMatrix = mat4.create();
var lightPosition = [-1.0, -4.0, 3.0, 0.0];
var lightAmbient = [0.2, 0.2, 0.2, 1.0];
var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
var lightSpecular = [1.0, 1.0, 1.0, 1.0];

var materialAmbient = [1.0, 0.0, 1.0, 1.0];
var materialDiffuse = [1.0, 0.8, 0.0, 1.0];
var materialSpecular = [1.0, 1.0, 1.0, 1.0];
var materialShininess = 20.0;

var diffuseColor;

// view frustum
var viewFrustum;

//objects to draw
var cube;
var desk;
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
                //Camera.rotation_x += 50 * Time.delta;
            break;
            case Axis.Y:
                //Camera.rotation_y += 50 * Time.delta;
            break;
            case Axis.Z:
                //Camera.rotation_z += 50 * Time.delta;
            break;
        }
    }
    viewFrustum.calcuateF(fovSlider.slider.value);
    viewFrustum.aspect = aspectSlider.slider.value;
    //*/
    Render();
    /*/
    Draw();
    //*/
	requestAnimationFrame(update);
};

function Initialize()
{
    gl = GLInstance("canvas").fSetSize(500, 500).fClear();
    viewFrustum = new ViewFrustum(60, (gl.canvas.clientWidth / gl.canvas.clientHeight), 1, 1000);
    fovSlider.slider.value = 60;
    setupShaders();
    setupLights();
    setupBuffers();
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

function Draw()
{
    gl.fClear();
    gl.useProgram(shaderProg);
    gl.bindVertexArray(vertexArray);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = mat4.create();
    normalMatrix = mat4.create();

    let eye = vec3.clone([radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta)]);
    mat4.lookAt(modelViewMatrix, eye, at, up);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rtheta[xAxis], [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rtheta[yAxis], [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rtheta[zAxis], [0, 0, 1]);
    mat4.perspective(projectionMatrix, fovy, aspect, near, far);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);

    mat4.invert(normalMatrix, modelViewMatrix);

    gl.uniformMatrix4fv(shaderProg.projectionMatrixLoc, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProg.normalMatrixLoc, true, normalMatrix);

    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 1.1, 0.0]);
    mat4.invert(normalMatrix, modelViewMatrix);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);
    gl.uniformMatrix4fv(shaderProg.normalMatrixLoc, true, normalMatrix);
    gl.uniform4fv(shaderProg.lightPosition, lightPosition);
    drawTable();
    popModelViewMatrix();


    //creating shadow
    let shadowMatrix = mat4.create();
    shadowMatrix[15] = 0.0;
    shadowMatrix[7] = -1 / lightPosition[1];


    gl.bindVertexArray(null);
    gl.useProgram(null);
}
function pushModelViewMatrix()
{
    var copyToPush = mat4.clone(modelViewMatrix);
    modelViewMatrixStack.push(copyToPush);
}
function popModelViewMatrix() {
    if (modelViewMatrixStack.length == 0) 
    {
        throw "Error popModelViewMatrix() - Stack was empty ";
    }
    modelViewMatrix = modelViewMatrixStack.pop();
}
function drawTable() 
{
    // Draw table top
    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 1.0, 0.0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [2.0, 0.1, 2.0]);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    popModelViewMatrix();
    // Draw table legs
    for (var i = -1; i <= 1; i += 2) {
        for (var j = -1; j <= 1; j += 2) {
            pushModelViewMatrix();
            mat4.translate(modelViewMatrix, modelViewMatrix, [i * 1.9, -0.1, j * 1.9]);
            mat4.scale(modelViewMatrix, modelViewMatrix, [0.1, 1.0, 0.1]);
            gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);
            mat4.invert(normalMatrix, modelViewMatrix);
            gl.uniformMatrix4fv(shaderProg.normalMatrixLoc, true, normalMatrix);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
            popModelViewMatrix();
        }
    }
}

function setupVertices() 
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}
function quad(a, b, c, d) {
    vertices[0] = vec3.clone([-1.0, -1.0, 1.0]);
    vertices[1] = vec3.clone([-1.0, 1.0, 1.0]);
    vertices[2] = vec3.clone([1.0, 1.0, 1.0]);
    vertices[3] = vec3.clone([1.0, -1.0, 1.0]);
    vertices[4] = vec3.clone([-1.0, -1.0, -1.0]);
    vertices[5] = vec3.clone([-1.0, 1.0, -1.0]);
    vertices[6] = vec3.clone([1.0, 1.0, -1.0]);
    vertices[7] = vec3.clone([1.0, -1.0, -1.0]);
    vertexColors[0] = vec3.clone([244, 164, 96]);// sandy brown
    vertexColors[1] = vec3.clone([222, 184, 135]); //buly wood
    vertexColors[2] = vec3.clone([205, 133, 63]);// peru
    vertexColors[3] = vec3.clone([210, 105, 30]);// chocolate
    vertexColors[4] = vec3.clone([139, 69, 19]);// saddle brown
    vertexColors[5] = vec3.clone([160, 82, 45]);// sienna
    vertexColors[6] = vec3.clone([165, 42, 42]); // brown
    vertexColors[7] = vec3.clone([128, 0, 0]);// maroon
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        points.push(...vertices[indices[i]]);
        // different color for all faces
        colors.push(...vertexColors[a]);
    }

    //adding normals for 6 vertices
    let aVector = vec3.create();
    let bVector = vec3.create();
    let normalVector = vec3.create();
    let normalVector4 = vec4.create();

    vec3.subtract(aVector, vertices[b], vertices[a]);
    vec3.subtract(bVector, vertices[c], vertices[b]);
    vec3.cross(normalVector, aVector, bVector);
    vec3.normalize(normalVector, normalVector);
    vec4.set(normalVector4, normalVector[0], normalVector[1], normalVector[2], 0.0);

    normalsArray.push(...normalVector4);
    normalsArray.push(...normalVector4);
    normalsArray.push(...normalVector4);
    normalsArray.push(...normalVector4);
    normalsArray.push(...normalVector4);
    normalsArray.push(...normalVector4);

}
function setupBuffers() {
    gl.useProgram(shaderProg);
    vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    setupVertices();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    vertexBuffer.itemSize = 3;
    vertexBuffer.numberOfItems = points.length / 3;
    gl.enableVertexAttribArray(shaderProg.aPositionLoc);
    gl.vertexAttribPointer(shaderProg.aPositionLoc, 3, gl.FLOAT, false, 0, 0);

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProg.vColor);
    gl.vertexAttribPointer(shaderProg.vColor, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProg.vNormal);
    gl.vertexAttribPointer(shaderProg.vNormal, 4, gl.FLOAT, false, 0, 0);
}

function setupLights() {
    gl.useProgram(shaderProg);
    gl.uniform4fv(shaderProg.lightDiffuse, lightDiffuse);
    gl.uniform4fv(shaderProg.materialDiffuse, materialDiffuse);
    gl.uniform4fv(shaderProg.lightAmbient, lightAmbient);
    gl.uniform4fv(shaderProg.materialAmbient, materialAmbient);
    gl.uniform4fv(shaderProg.lightSpecular, lightSpecular);
    gl.uniform4fv(shaderProg.materialSpecular, materialSpecular);
    gl.uniform4fv(shaderProg.lightPosition, lightPosition);
    gl.uniform1f(shaderProg.shininess, materialShininess);
}