function init_zone(zone_obj, block_size, num_blocks, rounded_rect){
    zone_obj.name = "zone";
    zone_obj.block_size = block_size;
    zone_obj.blocks = [];
    zone_obj.num_blocks = num_blocks;
    zone_obj.rounded_rect = rounded_rect;

    zone_obj.init_blocks = function(){
        for(var x = 0; x < this.num_blocks; x++){
            this.blocks.push([]);
            for(var y = 0; y < this.num_blocks; y++){
                this.blocks[x].push(this.rect(x*this.block_size+1, y*this.block_size+1,
                                    this.block_size, this.block_size, this.rounded_rect));
                this.blocks[x][y].val = 0;
                this.blocks[x][y].attr({"fill": blank_fill, "stroke": stroke});
            }
        }
    }
    zone_obj.color = function(c, pos1, pos2){
        this.blocks[pos1][pos2].attr({fill: c});
    }
}

function update(zone){
    var i;
    for(var x = 0; x < zone.num_blocks; x++){
        for(var y = 0; y < zone.num_blocks; y++){
            i = 0;
            if(zone.blocks[x][y].attr("fill") == blank_fill){
                continue;
            }
            if(x > 0 &&
               zone.blocks[x-1][y].attr("fill") != blank_fill){
                i++;
            }
            if(x < zone.num_blocks-1 && 
               zone.blocks[x+1][y].attr("fill") != blank_fill){
                i++;
            }
            if(y > 0 &&
               zone.blocks[x][y-1].attr("fill") != blank_fill){
                i++;
                }
            if(y < zone.num_blocks-1 && 
               zone.blocks[x][y+1].attr("fill") != blank_fill){
                i++;
            }
            if(x == zone.num_blocks-1 || x == 0){
                i++;
            }
            if(y == zone.num_blocks-1 || y == 0){
                i++;
            }
            if(i > 1){
                zone.blocks[x][y].attr({"fill": inactive_fill});
            }
            else {
                zone.blocks[x][y].attr({"fill": active_fill});
            }
        }
    }
}

function clear_blocks(blank_fill){
    return function(){
        for(var x = 0; x < this.num_blocks; x++){
            for(var y = 0; y < this.num_blocks; y++){
                this.blocks[x][y].attr({"fill": blank_fill});
            }
        }
    }
}

function undo(undos, gz, dz){
    var c = document.getElementById("yourbest").innerHTML;
    if(c > 0){
        document.getElementById("yourbest").innerHTML = parseInt(c, 10)-1;
    }
    if(undos.length == 0){
        return;
    }
    state = undos.pop();
    gz.clear_blocks();
    dz.clear_blocks();
    for(var i = 0; i < state.gz.length; i++){
        gz.blocks[state.gz[i][0]][state.gz[i][1]].attr({"fill": active_fill});
    }
    for(var i = 0; i < state.dz.length; i++){
        dz.blocks[state.dz[i][0]][state.dz[i][1]].attr({"fill": draw_fill});
    }
    update(gz);
}

function toggle(gz, x, y){
    if(x < 0 || x > gz.num_blocks-1 || y < 0 || y > gz.num_blocks-1){
        return;
    }
    if(gz.blocks[x][y].attr("fill") != blank_fill){
        gz.blocks[x][y].attr({"fill": blank_fill});
    }
    else {
        gz.blocks[x][y].attr({"fill": active_fill});
    }
}

function run_pattern(dz, gz, undos){
    var c = document.getElementById("yourbest").innerHTML;
    document.getElementById("yourbest").innerHTML = parseInt(c, 10)+1;
    push_undo(undos, gz, dz);
    var block_command = [];
    for(var x = 0; x < dz.num_blocks; x++){
        for(var y = 0; y < dz.num_blocks; y++){
            if(dz.blocks[x][y].attr("fill") != blank_fill){
                block_command.push([x-1, y-1]);
            }
        }
    }
    var on_blocks = [];
    for(var x = 0; x < gz.num_blocks; x++){
        for(var y = 0; y < gz.num_blocks; y++){
            if(gz.blocks[x][y].attr("fill") != blank_fill
                && gz.blocks[x][y].attr("fill") != inactive_fill){
                on_blocks.push([x, y]);
            }
        }
    }
    for(var i = 0; i < on_blocks.length; i++){
        x = on_blocks[i][0];
        y = on_blocks[i][1];
        for(var j = 0; j < block_command.length; j++){
            toggle(gz, x+block_command[j][0], y+block_command[j][1]);
        }
    }
    for(var x = 0; x < dz.num_blocks; x++){
        for(var y = 0; y < dz.num_blocks; y++){
            dz.blocks[x][y].attr({"fill": blank_fill});
        }
    }
}

function push_undo(undos, gz, dz){
    console.log(JSON.stringify(undos))
    update(gz);

    var gz_snapshot = [];
    var dz_snapshot = [];
    for(var x = 0; x < gz.num_blocks; x++){
        for(var y = 0; y < gz.num_blocks; y++){
            if(gz.blocks[x][y].attr("fill") != blank_fill){
                gz_snapshot.push([x, y]);
            }
        }
    }
    for(var x = 0; x < dz.num_blocks; x++){
        for(var y = 0; y < dz.num_blocks; y++){
            if(dz.blocks[x][y].attr("fill") != blank_fill){
                dz_snapshot.push([x, y]);
            }
        }
    }
    undos.push({gz: gz_snapshot, dz: dz_snapshot});
}

function set_start(gz, pz, lvl, active_fill){
    document.getElementById('yourbest').innerHTML = 0;
    document.getElementById('best_solution').innerHTML = lvl.best_solution;
    gz.clear_blocks();
    pz.clear_blocks();
    for(var i = 0; i < lvl.game_positions.length; i++){
        gz.color(active_fill, lvl.game_positions[i][0], lvl.game_positions[i][1]);
    }
    for(var i = 0; i < lvl.goal_positions.length; i++){
        pz.color(active_fill, lvl.goal_positions[i][0], lvl.goal_positions[i][1]);
    }
    update(gz);
    update(pz);
}

function create_game(size, lvl, levels){
    margin = size/40;
    button_width = size/12;
    button_height = size/20;
    document.getElementById('game_zone').style['margin-right']=margin;
    document.getElementById('draw_zone').style['margin-top']=margin;
    document.getElementById('draw_zone').style['margin-bottom']=margin;
    document.getElementById('puzzle_zone').style['margin-top']=margin;
    buttons = document.getElementsByClassName('button');
    for(var i = 0; i < length; i++){
        buttons[i].style.width=button_width;
        buttons[i].style.height=button_height;
    }
    document.getElementById('buttons').style.width=button_width*3;
    document.getElementById('buttons').style.height=button_height;
    document.getElementById('buttons').style.margin=margin;
    document.getElementById('buttons').style['margin-left']=0;
    document.getElementById('buttons').style['margin-bottom']=0;
    gz_size = size-50;
    dz_size = (size/3)-button_width;
    pz_size = dz_size;
    db_width = dz_size/3;
    db_height = 30;
    ub_width = dz_size/3;
    ub_height = 30;
    rb_width = dz_size/3;
    rb_height = 30;
    button_round = 7;
    zone_round = 5;
    gz_num = 5;
    dz_num = 3;
    pz_num = gz_num;
    active_fill = '#9af';
    inactive_fill = '#106464';
    draw_fill = '#226464';
    blank_fill = '#fff';
    stroke = '#000';
    var undos = [];

    // var zone = new Raphael(document.getElementById('zone'), width, height);
    var gz = new Raphael(document.getElementById('game_zone'), gz_size+2, gz_size+2);
    var dz = new Raphael(document.getElementById('draw_zone'), dz_size+2, dz_size+2);
    var pz = new Raphael(document.getElementById('puzzle_zone'), pz_size+2, pz_size+2);
    var db = new Raphael(document.getElementById('draw_button'), db_width, db_height);
    var ub = new Raphael(document.getElementById('undo_button'), ub_width, ub_height);
    var rb = new Raphael(document.getElementById('reset_button'), rb_width, ub_height);

    init_zone(gz, gz_size/gz_num, gz_num, zone_round);
    init_zone(dz, dz_size/dz_num, dz_num, zone_round);
    init_zone(pz, pz_size/pz_num, pz_num, zone_round);

    dz.mouse_closure = function(x, y){
        return function(){
            if(this.attr("fill") == blank_fill){
                this.attr({"fill": draw_fill});
            }
            else { 
                this.attr({"fill": "#fff"});
            }
        }
    };
    dz.init_drawing = function(){
        for(var x = 0; x < this.num_blocks; x++){
            for(var y = 0; y < this.num_blocks; y++){
                this.blocks[x][y].mousedown(dz.mouse_closure(x, y));
            }
        }
    };

    gz.clear_blocks = clear_blocks(blank_fill);
    dz.clear_blocks = clear_blocks(blank_fill);
    pz.clear_blocks = clear_blocks(blank_fill);

    gz.init_blocks();
    dz.init_blocks();
    pz.init_blocks();
    dz.init_drawing();
    db.button = db.rect(0, 0, db_width, db_height, button_round).attr({"fill": "#777"});
    db.txt = db.text(db_width/2, db_height/2, "Run").attr({
        "font-size": "12px",
        "font-weight": "bold",
    });
    db.button.mousedown(
        function(){
            run_pattern(dz, gz, undos);
            update(gz);
        }
    );
    db.txt.mousedown(
        function(){
            run_pattern(dz, gz, undos);
            update(gz);
        }
    );
    ub.button = ub.rect(0, 0, ub_width, ub_height, button_round).attr({"fill": "088"});
    ub.txt = ub.text(ub_width/2, ub_height/2, "Undo").attr({
        "font-size": "12px",
        "font-weight": "bold",
    });
    ub.button.mousedown(
        function(){
            undo(undos, gz, dz);
        }
    );
    ub.txt.mousedown(
        function(){
            undo(undos, gz, dz);
        }
    );
    rb.button = rb.rect(0, 0, rb_width, rb_height, button_round).attr({"fill": "922"});
    rb.txt = rb.text(rb_width/2, rb_height/2, "Reset").attr({
        "font-size": "12px",
        "font-weight": "bold",
    });
    rb.button.mousedown(
        function(){
            undos = [{gz: lvl.game_positions, dz: []}];
            document.getElementById("yourbest").innerHTML = 0;
            undo(undos, gz, dz);
        }
    );
    rb.txt.mousedown(
        function(){
            undos = [{gz: lvl.game_positions, dz: []}];
            document.getElementById("yourbest").innerHTML = 0;
            undo(undos, gz, dz);
        }
    );
    set_start(gz, pz, lvl, active_fill);

    var l = document.getElementById("level_selector");
    for(var i = 1; i <= levels.length; i++){
        option = "<option>Level " + i + "</option>";
        l.innerHTML += option;
    }

    document.getElementById("level_selector").onchange = function() {
        undos = [];
        lvl = levels[this.selectedIndex];
        dz.clear_blocks();
        set_start(gz, pz, lvl, active_fill, blank_fill);
    }
}

levels = [
    // Level 1
    {
        "game_positions": [
                [2, 2]
            ],
        "goal_positions": [
                [1, 1],     [3, 1],
                      [2, 2],
                [1, 3],     [3, 3]
            ],
        "best_solution": 1
    },
    // Level 2
    {
        "game_positions": [
                [0, 0],                 [4, 0],
                [0, 1],                 [4, 1],
                [0, 2], [1, 2], [3, 2], [4, 2],
                [0, 3],                 [4, 3],
                [0, 4],                 [4, 4]
            ],
        "goal_positions": [
                [0, 0], [1, 0], [3, 0], [4, 0],
                        [1, 1], [3, 1],
                [0, 2], [1, 2], [3, 2], [4, 2],
                        [1, 3], [3, 3],
                [0, 4], [1, 4], [3, 4], [4, 4]
            ],
        "best_solution": 2
    },
    // Level 3
    {
        "game_positions": [
                [1, 1],
                    [2, 2],
                        [3, 3]
            ],
        "goal_positions": [
                        [1, 3],
                    [2, 2],
                [3, 1]
            ],
        "best_solution": 3
    },
    // Level 4
    {
        "game_positions": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
                [1, 1],         [3, 1],
                        [2, 2]
        ],
        "goal_positions": [
                            [2, 2],
                      [1, 3],     [3, 3],
            [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]
        ],
        "best_solution": 8
    },
    // Level 5
    {
        "game_positions": [
            [0,2],[0,4],[1,1],[2,0],[2,2],[2,4],[3,3],[4,0],[4,2]
        ],
        "goal_positions": [
            [0,0],[0,2],[1,3],[2,0],[2,2],[2,4],[3,1],[4,2],[4,4]
        ],
        "best_solution": 4
    },
    // Level 6
    {
        "game_positions": [
            [0,1],[0,3],[1,2],[2,2],[3,2],[4,1],[4,3]
        ],
        "goal_positions": [
            [1,1],[1,3],[3,1],[3,3]
        ],
        "best_solution": 2
    },
    // Level 7
    {
        "game_positions": [
            [0, 0],                 [4, 0],
            [0, 1],                 [4, 1],
            [0, 2], [1, 2], [3, 2], [4, 2],
            [0, 3],                 [4, 3],
            [0, 4],                 [4, 4]
        ],
        "goal_positions": [
            [0,0],[0,1],[0,3],[0,4],[1,0],[1,3],[3,0],[3,3],[4,0],[4,1],[4,3],[4,4]
        ],
        "best_solution": 2
    },
    // Level 8
    {
        "game_positions": [
            [2, 2]
        ],
        "goal_positions": [
            [0,0],[0,1],[0,3],[0,4],[1,0],[1,1],[1,3],[1,4],[3,0],[3,1],[3,3],[3,4],[4,0],[4,1],[4,3],[4,4]
        ],
        "best_solution": 2
    },
    // Level 9
    {
        "game_positions": [
            [2, 2]
        ],
        "goal_positions": [
            [0,0],[0,1],[0,3],[0,4],[1,0],[1,1],[1,3],[1,4],[2,2],[3,0],[3,1],[3,3],[3,4],[4,0],[4,1],[4,3],[4,4]
        ],
        "best_solution": 3
    },
    // Level 10
    {
        "game_positions": [
            
              [1, 1],               [4, 1],
                      [2, 2],
                             [3, 3],
                                    [4, 4],
        ],
        "goal_positions": [
                      [2, 0],
              
        [0, 2],                     [4, 2],
                                    
                      [2, 4],
        ],
        "best_solution": 5
    },
    // Level 11
    {
        "game_positions": [
            
              [1, 1],               [4, 1],
                      [2, 2],
                             [3, 3],
                                    [4, 4],
        ],
        "goal_positions": [
                      [2, 0],
               [1, 1],       [3, 1],
        [0, 2],       [2, 2],       [4, 2],
               [1, 3],       [3, 3],
        [0, 4],                     [4, 4],
        ],
        "best_solution": 4
    },
]

window.onload = function(){
    if(window.innerHeight < window.innerWidth){
        size = window.innerHeight;
        if(size < 475){
            size = 500;
        }
    }
    else {
        size = 500;
    }

    create_game(size, levels[0], levels);
}
