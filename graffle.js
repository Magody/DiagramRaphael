function areOpositeBoxPoint(i, j){


    return (i == 3 && j == 6) ||
           (i == 2 && j == 7) ||
           (i == 0 && j == 5) ||
           (i == 1 && j == 4);

}


Raphael.fn.connection = function (obj1, obj2, line, bg) {
    // get a obj fron and obj to and generate a JSON with path between with color
    // background is also a path

    if (obj1.line && obj1.from && obj1.to) {
        // if only sent an object as first parameter
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [
            // up middle point of box 1
            {x: bb1.x + bb1.width / 2, y: bb1.y - 1},
            // down middle point of box 1
            {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
            // left middle point of box 1
            {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
            // right middle point of box 1
            {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},

            // up middle point of box 2
            {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
            // down middle point of box 2
            {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
            // left middle point of box 2
            {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
            // right middle point of box 2
            {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}
        ],
        d = {}, dis = [];


    for (var i = 0; i < 4; i++) {
        // get a point of box 1 and compare with other 4 points of box 2
        for (var j = 4; j < 8; j++) {

            // distance between the point of box 1, to point(s) in box 2
            // this distances consder one point to one point
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);

            
            var is_simil_point = i == j - 4 // refer to same position point in each box?


            // if are not oposite or in case the points are oposite
            // then see if the points can see among their
            var not_oposite_or_box1_right_can_see_box2_left = ((i != 3 && j != 6) || p[i].x < p[j].x);
            var not_oposite_or_box1_left_can_see_box2_right = ((i != 2 && j != 7) || p[i].x > p[j].x);
            var not_oposite_or_box1_up_can_see_box2_down = ((i != 0 && j != 5) || p[i].y > p[j].y);
            var not_oposite_or_box1_down_can_see_box2_up = ((i != 1 && j != 4) || p[i].y < p[j].y);

            var points_can_see_each_other = not_oposite_or_box1_right_can_see_box2_left &&
                                            not_oposite_or_box1_left_can_see_box2_right &&
                                            not_oposite_or_box1_up_can_see_box2_down &&
                                            not_oposite_or_box1_down_can_see_box2_up;


            if (is_simil_point || points_can_see_each_other) {
                var sum_distances_xy = dx + dy
                dis.push(sum_distances_xy);
                d[sum_distances_xy] = [i, j];
            }
        }
    }


    if (dis.length == 0) {
        // if no valid distances, by default the answer is
        // point in the middle of box1 up with point in the middle of box2 up
        var res = [0, 4];
    } else {
        var min_distance = Math.min.apply(Math, dis)
        res = d[min_distance];  // return a pair of [i, j] with the minimun distance
    }

    // get the posicion points in each box
    // with the minimun distance
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;


    // get half distances between points x and y but clamp the minimun to 10
    
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);

    // generate the intermedia steps, rounding to 3 decimals for each
    // this gets a little first line of N units for x and y that conect with the first point
    // and generates a little last line of N units for x and y that connect with the last point
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

    // Generate the path: Move to x1,y1 and draw curve to x2,y2 then x3,y3 then x4,y4
    // rounding the first and last value to 3 decimals
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    
    // if line is defined and its not a color
    if (line && line.line) {
        // it means, the line is not recently created, we update the view
        // update color background path
        line.bg && line.bg.attr({path: path});
        // update the line path
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            // can set stroke color and stroke with if parameter is #color/width
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            // define the line
            line: this.path(path).attr({stroke: color, fill: "none"}),
            // set from and to objectives
            from: obj1,
            to: obj2
        };
    }
};

console.log("af")
var el;
window.onload = function () {

    console.log("TEST")
    var dragger = function () {
        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
        this.animate({"fill-opacity": .2}, 500);
    },
        move = function (dx, dy) {
            // update position of shape
            var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);


            for (var i = connections.length; i--;) {
                // console.log("i", i, connections[i])

                // update position of line connection
                r.connection(connections[i]);
            }
            // r.safari();
        },
        up = function () {
            this.animate({"fill-opacity": 0}, 500);
        },
        r = Raphael("holder", 640, 480),
        connections = [],
        shapes = [  r.ellipse(190, 100, 30, 20),
                    r.rect(290, 80, 60, 40, 10),
                    r.rect(290, 180, 60, 40, 2),
                    r.ellipse(450, 100, 20, 20)
                ];
    for (var i = 0, ii = shapes.length; i < ii; i++) {
        var color = Raphael.getColor();
        shapes[i].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        shapes[i].drag(move, dragger, up);
    }
    connections.push(r.connection(shapes[0], shapes[1], "#fff"));
    connections.push(r.connection(shapes[1], shapes[2], "#fff", "#fff|5"));
    connections.push(r.connection(shapes[1], shapes[3], "#000", "#fff"));
};
