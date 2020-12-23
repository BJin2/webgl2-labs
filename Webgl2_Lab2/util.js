var DrawMode = {
    LINES : 1,
    LINE_LOOP : 2,
    LINE_STRIP : 3,
    TRIANGLES : 4,
    TRIANGLE_STRIP : 5,
    TRIANGLE_FAN : 6
};

var Axis = {
    X : 0,
    Y : 1,
    Z : 2
};

var matrix4X4 = {
    projection : function(width, height, depth)//change into clip space
    {
        return [
            2/ width, 0, 0, 0,
            0, -2/height, 0, 0,
            0, 0, 2/depth, 0, 
            -0, 0, 0, 1
        ];
    },
    multiply : function(a, b)//matrix multiplication
    {
        var a00 = a[0*4 + 0];
        var a01 = a[0*4 + 1];
        var a02 = a[0*4 + 2];
        var a03 = a[0*4 + 3];
        var a10 = a[1*4 + 0];
        var a11 = a[1*4 + 1];
        var a12 = a[1*4 + 2];
        var a13 = a[1*4 + 3];
        var a20 = a[2*4 + 0];
        var a21 = a[2*4 + 1];
        var a22 = a[2*4 + 2];
        var a23 = a[2*4 + 3];
        var a30 = a[3*4 + 0];
        var a31 = a[3*4 + 1];
        var a32 = a[3*4 + 2];
        var a33 = a[3*4 + 3];

        var b00 = b[0*4 + 0];
        var b01 = b[0*4 + 1];
        var b02 = b[0*4 + 2];
        var b03 = b[0*4 + 3];
        var b10 = b[1*4 + 0];
        var b11 = b[1*4 + 1];
        var b12 = b[1*4 + 2];
        var b13 = b[1*4 + 3];
        var b20 = b[2*4 + 0];
        var b21 = b[2*4 + 1];
        var b22 = b[2*4 + 2];
        var b23 = b[2*4 + 3];
        var b30 = b[3*4 + 0];
        var b31 = b[3*4 + 1];
        var b32 = b[3*4 + 2];
        var b33 = b[3*4 + 3];

        return [
            (a00*b00)+(a01*b10)+(a02*b20)+(a03*b30),//00
            (a00*b01)+(a01*b11)+(a02*b21)+(a03*b31),//01
            (a00*b02)+(a01*b12)+(a02*b22)+(a03*b32),//02
            (a00*b03)+(a01*b13)+(a02*b23)+(a03*b33),//03

            (a10*b00)+(a11*b10)+(a12*b20)+(a13*b30),//10
            (a10*b01)+(a11*b11)+(a12*b21)+(a13*b31),//11
            (a10*b02)+(a11*b12)+(a12*b22)+(a13*b32),//12
            (a10*b03)+(a11*b13)+(a12*b23)+(a13*b33),//13

            (a20*b00)+(a21*b10)+(a22*b20)+(a23*b30),//20
            (a20*b01)+(a21*b11)+(a22*b21)+(a23*b31),//21
            (a20*b02)+(a21*b12)+(a22*b22)+(a23*b32),//22
            (a20*b03)+(a21*b13)+(a22*b23)+(a23*b33),//23

            (a30*b00)+(a31*b10)+(a32*b20)+(a33*b30),//30
            (a30*b01)+(a31*b11)+(a32*b21)+(a33*b31),//31
            (a30*b02)+(a31*b12)+(a32*b22)+(a33*b32),//32
            (a30*b03)+(a31*b13)+(a32*b23)+(a33*b33)//33
        ];
    },
    translation : function(x, y, z)// return translation matrix
    {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];
    },
    xRotation : function(xAngle)// return rotation matrix based on x axis
    {
        var radian = (Math.PI*xAngle)/180;
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    },
    yRotation : function(yAngle)// return rotation matrix based on y axis
    {
        var radian = (Math.PI*yAngle)/180;
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    },
    zRotation : function(zAngle)// return rotation matrix based on z axis
    {
        var radian = (Math.PI*zAngle)/180;
        var s = Math.sin(radian);
        var c = Math.cos(radian);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },
    scaling : function(x, y, z)// return scaling matrix     ** x y z are not exact size. They are relative size
    {
        return [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ];
    },

    // calculate transform
    translate : function(m, x, y, z)
    {
        return matrix4X4.multiply(m, matrix4X4.translation(x, y, z));
    },
    rotate : function(m, axis, angle)
    {
        var rotated;
        switch(axis)
        {
            case Axis.X:
            {
                rotated = matrix4X4.multiply(m, this.xRotation(angle));
                break;
            }
            case Axis.Y:
            {
                rotated = matrix4X4.multiply(m, this.yRotation(angle));
                break;
            }
            case Axis.Z:
            {
                rotated = matrix4X4.multiply(m, this.zRotation(angle));
                break;
            }
        }
        return rotated;
    },
    scale : function(m, x, y, z)
    {
        return matrix4X4.multiply(m, this.scaling(x, y, z));
    }
};