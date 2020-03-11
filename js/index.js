var handleKeyPress = function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        console.log('dupa');
    }
};

handleKeyPress({
    keyCode: 13
});