var ObjectInfo = {
    cube : {
        vertex : [
            -250, 250, -250,//top
            250, 250, 250,
            -250, 250, 250,
            -250, 250, -250,
            250, 250, -250,
            250, 250, 250,

            -250, -250, -250,//front
            250, 250, -250,
            -250, 250, -250,
            -250, -250, -250,
            250, -250, -250,
            250, 250, -250,

            -250, -250, 250,//left
            -250, 250, -250,
            -250, 250, 250,
            -250, -250, 250,
            -250, -250, -250,
            -250, 250, -250,

            250, -250, -250,//right
            250, 250, 250,
            250, 250, -250,
            250, -250, -250,
            250, -250, 250,
            250, 250, 250,

            250, -250, 250,//back
            -250, 250, 250,
            250, 250, 250,
            250, -250, 250,
            -250, -250, 250,
            -250, 250, 250,

            -250, -250, 250,//bottom
            250, -250, -250,
            -250, -250, -250,
            -250, -250, 250,
            250, -250, 250,
            250, -250, -250
        ],
        color : [0,0,0,1], // R G B A
        position : [0, 0, 0],
        rotation : [0, 0, 0],
        scale : [1, 1, 1],
        parent : null,
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