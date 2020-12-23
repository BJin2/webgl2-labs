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

const at = vec3.clone([0.0, 0.0, 0.0]);
const up = vec3.clone([0.0, 1.0, 0.0]);

var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;

var normalsArray = [];
var normalBuffer;
var normalMatrix = mat4.create();
var lightPosition = [0.0, -5, 2.0, 0.0];
var lightAmbient = [0.2, 0.2, 0.2, 1.0];
var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
var lightSpecular = [1.0, 1.0, 1.0, 1.0];

var bgColor = [1.0, 1.0, 1.0, 1.0];

var materialAmbient = [0.2, 0.2, 0.2, 1.0];
var materialDiffuse = [1.0, 0.8, 0.0, 1.0];
var materialSpecular = [1.0, 1.0, 1.0, 1.0];
var materialShininess = 20.0;

// view frustum
var viewFrustum;

//objects to draw
var cubeColor = [];
var deskColor = [];
var planeColor = [];

// sliders
var fovSlider = new Slider("FOV", "fov", 60);
var aspectSlider = new Slider("Aspect", "aspect", 1);

var lightXSlider = new Slider("Light_X", "light_x", 0.0);
var lightYSlider = new Slider("Light_Y", "light_y", -5.0);
var lightZSlider = new Slider("Light_Z", "light_z", 3.0);

var lightDiffuseSlider = new Slider("Light_Diffuse", "light_diffuse", 1.0);
var lightAmbientSlider = new Slider("Light_Ambient", "light_ambient", 0.2);
var lightSpecularSlider = new Slider("LIght_Specular", "light_specular", 1.0);

var backgroundPicker = document.getElementById("BackgroundColor");
backgroundPicker.onchange = function()
{
    var temp_rgb = hexToRgb(backgroundPicker.value);
    console.log(temp_rgb);
    bgColor[0] = temp_rgb.r/255;
    bgColor[1] = temp_rgb.g/255;
    bgColor[2] = temp_rgb.b/255;
}

var materialAmbientSlider = new Slider("Material_Ambient", "material_ambient", 0.2);
var materialSpecularSlider = new Slider("Material_Specular", "material_specular", 1.0);
var shininessSlider = new Slider("Shininess", "shininess", 20);

var deskColorPicker = document.getElementById("Desk_Diffuse");
deskColorPicker.onchange = updateDeskColor;
var cubeColorPicker = document.getElementById("Cube_Diffuse");
cubeColorPicker.onchange = updateCubeColor;
var planeColorPicker = document.getElementById("Floor_Diffuse");
planeColorPicker.onchange = updatePlaneColor;


// buttons
var button_Rot_X = document.getElementById("Rotate_X");
var button_Rot_Y = document.getElementById("Rotate_Y");
var button_Rot_Z = document.getElementById("Rotate_Z");
var button_Toggle_Rotation = document.getElementById("ToggleRotation");

// variables for rotating
var rotateAxis = Axis.X;
var toggleRotation = 1;

var textureBuffer;
var texCoordsArray = [];
var texCoord = [];

var cubeTex;
var deskTex;
var floorTex;

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
                Camera.rotation_x += 1 * Time.delta;
            break;
            case Axis.Y:
                Camera.rotation_y += 1 * Time.delta;
            break;
            case Axis.Z:
                Camera.rotation_z += 1 * Time.delta;
            break;
        }
    }
    viewFrustum.calcuateF(fovSlider.slider.value);
    viewFrustum.aspect = aspectSlider.slider.value;
    updateLights();
    updateMaterial();
    setupLights();

    Draw();
	requestAnimationFrame(update);
};

function Initialize()
{
    gl = GLInstance("canvas").fSetSize(500, 500).fClear();
    viewFrustum = new ViewFrustum(60, (gl.canvas.clientWidth / gl.canvas.clientHeight), 1, 1000);
    fovSlider.slider.value = 60;
    setupShaders();
    setupLights();
	setupTextures();
    setupBuffers();
};

function setupTextures() 
{
    var image1 = document.getElementById("cubeImage");
    cubeTex = configureTexture(image1);
	
	var image2 = document.getElementById("deskImage");
    deskTex = configureTexture(image2);
	
	var image3 = document.getElementById("flooImage");
    floorTex = configureTexture(image3);
}

function configureTexture(image) 
{
	var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.uniform1i(shaderProg.uTexture, 0);
	return texture;
}

function Draw()
{
    //gl.fClear();
    gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1.0);
    gl.useProgram(shaderProg);
    gl.bindVertexArray(vertexArray);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelViewMatrix = mat4.create();
    normalMatrix = mat4.create();

    let eye = vec3.clone([0, 5, 12]);
    mat4.lookAt(modelViewMatrix, eye, at, up);
    mat4.rotate(modelViewMatrix, modelViewMatrix, Camera.rotation_x, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, Camera.rotation_y, [0, 1, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, Camera.rotation_z, [0, 0, 1]);
    mat4.perspective(projectionMatrix, viewFrustum.fieldOfView, viewFrustum.aspect, viewFrustum.near, viewFrustum.far);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);

    mat4.invert(normalMatrix, modelViewMatrix);

    gl.uniformMatrix4fv(shaderProg.projectionMatrixLoc, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderProg.normalMatrixLoc, true, normalMatrix);

    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.8, 0.0]);
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
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    

    // Draw cube
	gl.bindTexture( gl.TEXTURE_2D, cubeTex );
	gl.uniform1i(shaderProg.uTexture, 0);
	
    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 1.6, 0.0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.5, 0.5, 0.5]);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cubeColor), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    popModelViewMatrix();

    // Draw floor
	gl.bindTexture( gl.TEXTURE_2D, deskTex );
	gl.uniform1i(shaderProg.uTexture, 0);
	
    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, -1.1, 0.0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [3.0, 0.01, 3.0]);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(planeColor), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    popModelViewMatrix();

    // Draw table top
	gl.bindTexture( gl.TEXTURE_2D, floorTex );
	gl.uniform1i(shaderProg.uTexture, 0);
	
    pushModelViewMatrix();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 1.0, 0.0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [2.0, 0.1, 2.0]);
    gl.uniformMatrix4fv(shaderProg.modelViewMatrixLoc, false, modelViewMatrix);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(deskColor), gl.STATIC_DRAW);
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
function quad(a, b, c, d) 
{
    vertices[0] = vec3.clone([-1.0, -1.0, 1.0]);
    vertices[1] = vec3.clone([-1.0, 1.0, 1.0]);
    vertices[2] = vec3.clone([1.0, 1.0, 1.0]);
    vertices[3] = vec3.clone([1.0, -1.0, 1.0]);
    vertices[4] = vec3.clone([-1.0, -1.0, -1.0]);
    vertices[5] = vec3.clone([-1.0, 1.0, -1.0]);
    vertices[6] = vec3.clone([1.0, 1.0, -1.0]);
    vertices[7] = vec3.clone([1.0, -1.0, -1.0]);
	
    vertexColors[0] = vec3.clone([255, 0, 0]);// 
    vertexColors[1] = vec3.clone([0, 0, 255]); //blue
    vertexColors[2] = vec3.clone([178, 132, 0]);// desk color (brown)
    vertexColors[3] = vec3.clone([255, 0, 0]);// red
    vertexColors[4] = vec3.clone([255, 0, 0]);// red
    vertexColors[5] = vec3.clone([255, 0, 0]);// red
    vertexColors[6] = vec3.clone([255, 0, 0]); // red
    vertexColors[7] = vec3.clone([255, 0, 0]);// red
	
	texCoord[0] = vec2.clone([0,0]);
	texCoord[1] = vec2.clone([0,1]);
    texCoord[2] = vec2.clone([1,1]);
    texCoord[3] = vec2.clone([0,0]);
    texCoord[4] = vec2.clone([1,1]);
    texCoord[5] = vec2.clone([1,0]);
	
    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) 
    {
        points.push(...vertices[indices[i]]);
        // different color for all faces
        colors.push(...vertexColors[a]);
		texCoordsArray.push(...texCoord[i]);
		
        planeColor.push(...vertexColors[0]);
        cubeColor.push(...vertexColors[1]);
        deskColor.push(...vertexColors[2]);
        
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
function setupBuffers() 
{
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

	textureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsArray), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProg.vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProg.vTexCoord);
	
    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProg.vNormal);
    gl.vertexAttribPointer(shaderProg.vNormal, 4, gl.FLOAT, false, 0, 0);
}

function setupLights() 
{
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

function updateLights()
{
    lightPosition[0] = lightXSlider.slider.value;
    lightPosition[1] = lightYSlider.slider.value;
    lightPosition[2] = lightZSlider.slider.value;

    lightDiffuse[0] = lightDiffuseSlider.slider.value;
    lightDiffuse[1] = lightDiffuseSlider.slider.value;
    lightDiffuse[2] = lightDiffuseSlider.slider.value;

    lightAmbient[0] = lightAmbientSlider.slider.value;
    lightAmbient[1] = lightAmbientSlider.slider.value;
    lightAmbient[2] = lightAmbientSlider.slider.value;

    lightSpecular[0] = lightSpecularSlider.slider.value;
    lightSpecular[1] = lightSpecularSlider.slider.value;
    lightSpecular[2] = lightSpecularSlider.slider.value;
}
function updateMaterial()
{
    materialAmbient[0] = materialAmbientSlider.slider.value;
    materialAmbient[1] = materialAmbientSlider.slider.value;
    materialAmbient[2] = materialAmbientSlider.slider.value;

    materialSpecular[0] = materialSpecularSlider.slider.value;
    materialSpecular[1] = materialSpecularSlider.slider.value;
    materialSpecular[2] = materialSpecularSlider.slider.value;

    materialShininess = shininessSlider.slider.value;
}
function updateDeskColor()
{
    deskColor=[];
    var tempColor =  hexToRgb(deskColorPicker.value);
    tempvColor = vec3.clone([tempColor.r, tempColor.g, tempColor.b]);
    for (var i = 0; i < 36; ++i) 
    {
        deskColor.push(...tempvColor);
    }
};
function updateCubeColor()
{
    cubeColor = [];
    var tempColor =  hexToRgb(cubeColorPicker.value);
    tempvColor = vec3.clone([tempColor.r, tempColor.g, tempColor.b]);
    for (var i = 0; i < 36; ++i) 
    {
        cubeColor.push(...tempvColor);
    }
};
function updatePlaneColor()
{
    planeColor = [];
    var tempColor =  hexToRgb(planeColorPicker.value);
    tempvColor = vec3.clone([tempColor.r, tempColor.g, tempColor.b]);
    for (var i = 0; i < 36; ++i) 
    {
        planeColor.push(...tempvColor);
    }
};