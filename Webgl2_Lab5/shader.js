var vertexShaderSource = `#version 300 es
in vec3 a_position;
in vec3 vColorAttr;
out vec4 vColor;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

in vec4 vNormalAttr;
uniform vec4 lightPosition;
uniform mat4 normalMatrix;

in vec2 vTexCoord;
out vec2 fTexCoord;

out vec3 L;
out vec3 N;
out vec3 E;

void main(void){

// pos is vertex position in eye coordinates
vec3 pos = (modelViewMatrix * vec4(a_position, 1.0)).xyz;

//Transformed normal position
N = vec3(normalMatrix * vNormalAttr);

vec3 eyeVec = -vec3(pos);
E = eyeVec;

// check for directional light

if(lightPosition.w == 0.0) L = lightPosition.xyz;
else L =  lightPosition.xyz - pos ;

gl_Position = projectionMatrix * modelViewMatrix * vec4(a_position, 1.0);
vColor = vec4(vColorAttr, 1.0);
fTexCoord = vTexCoord;
}`;

var fragmentShaderSource = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 finalColor;

uniform vec4 lightDiffuse;
uniform vec4 materialDiffuse;
uniform vec4 lightAmbient;
uniform vec4 materialAmbient;
uniform vec4 lightSpecular;
uniform vec4 materialSpecular;
uniform float shininess;

in  vec2 fTexCoord;
uniform sampler2D textureMap;

in vec3 L;
in vec3 N;
in vec3 E;
vec3 nL, nN, nE;

void main(void) {

nE = normalize(E);
nN = normalize(N);
nL = normalize(L);

//Lambert's cosine law
float lambertTerm = dot(nN,-nL);

float Kd = max (dot (nN, -nL) , 0.0);
//Ambient Term
vec4 Ia = lightAmbient * materialAmbient;

//Diffuse Term
vec4 Id = vec4(0.0,0.0,0.0,1.0);

//Specular Term
vec4 Is = vec4(0.0,0.0,0.0,1.0);

if(lambertTerm > 0.0) //only if lambertTerm is positive
{
//  materialDiffuse = vColor; //actual table's color
Id = lightDiffuse* vColor * lambertTerm * texture(textureMap, fTexCoord); //add diffuse term

vec3 R = reflect(nL, nN);
float specular = pow(max(dot(R, nE), 0.0), shininess );

Is = lightSpecular * materialSpecular * specular; //add specular term
}

finalColor = Ia + Id + Is;
finalColor.a = 1.0;
}`;
function setupShaders() {
    shaderProg = ShaderUtil.createProgramFromText(gl, vertexShaderSource, fragmentShaderSource, true);
    gl.useProgram(shaderProg);
    shaderProg.aPositionLoc = gl.getAttribLocation(shaderProg, "a_position");
    shaderProg.vColor = gl.getAttribLocation(shaderProg, "vColorAttr");
    shaderProg.modelViewMatrixLoc = gl.getUniformLocation(shaderProg, "modelViewMatrix");
    shaderProg.projectionMatrixLoc = gl.getUniformLocation(shaderProg, "projectionMatrix");
    shaderProg.normalMatrixLoc = gl.getUniformLocation(shaderProg, "normalMatrix");

    shaderProg.vNormal = gl.getAttribLocation(shaderProg, "vNormalAttr");
    shaderProg.lightPosition = gl.getUniformLocation(shaderProg, "lightPosition");
    shaderProg.materialDiffuse = gl.getUniformLocation(shaderProg, "materialDiffuse");
    shaderProg.lightDiffuse = gl.getUniformLocation(shaderProg, "lightDiffuse");
    shaderProg.materialAmbient = gl.getUniformLocation(shaderProg, "materialAmbient");
    shaderProg.lightAmbient = gl.getUniformLocation(shaderProg, "lightAmbient");
    shaderProg.materialSpecular = gl.getUniformLocation(shaderProg, "materialSpecular");
    shaderProg.lightSpecular = gl.getUniformLocation(shaderProg, "lightSpecular");
    shaderProg.shininess = gl.getUniformLocation(shaderProg, "shininess");
	
	shaderProg.vTexCoord = gl.getAttribLocation(shaderProg, "vTexCoord");
    shaderProg.uTexture = gl.getUniformLocation(shaderProg, "textureMap");

    gl.useProgram(null);
}
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