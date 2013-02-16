$(document).ready(function(){
    var a = impress();
    a.init();
    
    $(".lined").linedtextarea();
    
    if(window.location.hash == '' || window.location.hash == '#/step-1')
    {
        setTimeout(a.next, 500);
        
        setTimeout(function(){
            a.next();
        }, 2500);
    }
});