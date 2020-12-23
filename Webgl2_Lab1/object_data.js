var DrawMode = {
    LINES : 1,
    LINE_LOOP : 2,
    LINE_STRIP : 3,
    TRIANGLES : 4,
    TRIANGLE_STRIP : 5,
    TRIANGLE_FAN : 6
};

var ObjectInfo = {
    zigzag_fill : {
        vertex : [
            -250, 100, 0.0,
            250, 100, 0.0,
            -200, 0.0, 0.0,
            200, 0.0, 0.0
        ],
        color : [1.0, 1.0, 0.0, 1.0],    // Yellow
        draw_mode : DrawMode.TRIANGLE_STRIP
    },
    zigzag : {
        vertex : [
            -250, 100, 0.0,
            -200, 0.0, 0.0,
            -150, 100, 0.0,
            -100, 0.0, 0.0,
            -50, 100, 0.0,
            0.0, 0.0, 0.0,
            50, 100, 0.0,
            100, 0.0, 0.0,
            150, 100, 0.0,
            200, 0.0, 0.0,
            250, 100, 0.0],
        color : [0.0, 0.0, 0.0, 1.0],    // Black
        draw_mode : DrawMode.LINE_STRIP
    },
    triangle : {
        vertex : [
            0.0, 250, 0.0,
            -250, -250, 0.0,
            250, -250, 0.0],
        color : [
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0],
        draw_mode : DrawMode.TRIANGLE_STRIP
    },
    hexagon : {
        vertex : [
            -125, 250, 0.0,
            125, 250, 0.0,
            250, 0.0, 0.0,
            125, -250, 0.0,
            -125, -250, 0.0,
            -250, 0.0, 0.0],
        color : [0.0, 0.0, 0.0, 1.0],    // Black
        draw_mode : DrawMode.LINE_LOOP
    },
    testLine : {
        vertex : [
            -1.0, 0.3, 0.0,
            1.0, 0.3, 0.0],
        color : [1.0, 1.0, 0.0, 1.0],    // Black
        draw_mode : DrawMode.LINE_STRIP
    }
};

function ObjectDataInstance(objectType)
{
    this.vertex = ObjectInfo[objectType].vertex.slice();
    this.color = ObjectInfo[objectType].color.slice();
    this.draw_mode = ObjectInfo[objectType].draw_mode;

    return this;
};

function dObject(pos_x, pos_y, width, height, type)
{
    this.objectInfo = new ObjectDataInstance(type);
    console.log(this.objectInfo)
    Translate(this.objectInfo.vertex, pos_x, pos_y);
    Scale(this.objectInfo.vertex, width, height);
};