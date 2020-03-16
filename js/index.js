var handleKeyPress = function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        addItem();
    }
};


function addItem() {
    e = document.getElementById("item-name");
    var item = e.value;
    e.value = "";
    var html = '<div class="products-list-item">';
    html += '<div>v</div>';
    html += '<div>' + item + '</div>';
    html += '<div>...</div>';
    html += '<div><i class="fa fa-trash"></i></div>';

    list = document.getElementById("products-list");
    list.innerHTML += html;
};

document.onload = function() {
    setTimeout(function() {
        e = document.getElementById("item-name");
        e.value = "";
    }, 250);
}();