var ObjectInfo = {
    cube : {
        vertex : [
            -1, 1, -1,//top
            1, 1, 1,
            -1, 1, 1,
            -1, 1, -1,
            1, 1, -1,
            1, 1, 1,

            -1, -1, -1,//front
            1, 1, -1,
            -1, 1, -1,
            -1, -1, -1,
            1, -1, -1,
            1, 1, -1,

            -1, -1, 1,//left
            -1, 1, -1,
            -1, 1, 1,
            -1, -1, 1,
            -1, -1, -1,
            -1, 1, -1,

            1, -1, -1,//right
            1, 1, 1,
            1, 1, -1,
            1, -1, -1,
            1, -1, 1,
            1, 1, 1,

            1, -1, 1,//back
            -1, 1, 1,
            1, 1, 1,
            1, -1, 1,
            -1, -1, 1,
            -1, 1, 1,

            -1, -1, 1,//bottom
            1, -1, -1,
            -1, -1, -1,
            -1, -1, 1,
            1, -1, 1,
            1, -1, -1,
        ],
        color : [
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,

            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,

            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,

            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,

            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,

            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
        ], // R G B A
        position : [0, 0, 0],
        rotation : [0, 0, 0],
        scale : [1, 1, 1],
        draw_mode : DrawMode.TRIANGLES
    }
};

function ObjectDataInstance(objectType)
{
    this.vertex = ObjectInfo[objectType].vertex.slice();
    this.color = ObjectInfo[objectType].color.slice();
    this.position = ObjectInfo[objectType].position.slice();
    this.rotation = ObjectInfo[objectType].rotation.slice();
    this.scale = ObjectInfo[objectType].scale.slice();
    this.draw_mode = ObjectInfo[objectType].draw_mode;

    return this;
};

function dObject(type)
{
    this.objectInfo = new ObjectDataInstance(type);
    console.log(this.objectInfo);
};

function ViewFrustum(fovy, aspect, near, far)
{
    var self = this;
    var fieldOfViewRadian = (Math.PI * fovy * 0.5)/180;

    this.fieldOfView = fieldOfViewRadian;
    this.f = 1.0 / Math.tan(fieldOfViewRadian);
    //this.f = Math.tan(Math.PI*0.5 - 0.5*fieldOfViewRadian);
    this.aspect = aspect
    this.near = near;
    this.far = far;
    this. rangeInverse = 1.0 / (near - far);

    this.calcuateF = function(fov)
    {
        var fieldOfViewRadian = (Math.PI * fov * 0.5)/180;
        self.f = Math.tan(Math.PI*0.5 - 0.5*fieldOfViewRadian);
        self.fieldOfView = fieldOfViewRadian;
    }

    return this;
}

/* different color on each side(cube)
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,

            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,

            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,

            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,

            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,

            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1,
            0, 1, 1, 1
//*/