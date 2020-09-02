class mouse{
    static pos = { x: 0, y: 0 };
    static down = false;
    static start(element=document.documentElement) {
        function mousemove(e) {
            let br = element.getBoundingClientRect();
            mouse.pos.x = e.clientX - br.left;
            mouse.pos.y = e.clientY - br.top;
        }

        function mouseup(e) {
            mouse.down = false;
        }

        function mousedown(e) {
            if(e.button != 0) return;
            mouse.down = true;
            mousemove(e);
        }
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
        document.addEventListener('mousedown', mousedown);
        document.addEventListener('touchstart',mousemove);
        document.addEventListener('touchmove',mousemove);
        document.addEventListener('touchend',mouseup);
        document.addEventListener('dblclick',e=>{
            mouse.down = true;
        });
    }
}
class keys{
    static keys = [];
    static start(){
        function keydown(e){
            keys.keys[e.key.toLowerCase()] = true;
        }
        function keyup(e){
            keys.keys[e.key.toLowerCase()] = false;
        }
        document.addEventListener('keydown',keydown);
        document.addEventListener('keyup',keyup);
    }
    static down(key){
        key = key.toLowerCase();
        if(key in keys.keys){
            return keys.keys[key];
        }
        return false;
    }
}