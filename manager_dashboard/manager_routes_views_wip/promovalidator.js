function splitText() {
    "use strict";
    var str = document.getElementById("user_input").value;
    var chunks = str.match(/.{1,154}(\s|$)/g);

    chunks.forEach(function (i,x) {
        $("#display").append("<textarea readonly>" + chunks[x] + "</textarea><br/>");
    });
}
