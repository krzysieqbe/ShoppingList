var handleKeyPress = function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        addItem();
    }
};

var items = [];

function addItem() {
    e = document.getElementById("item-name");
    var itemName = e.value.trimLeft();
    e.value = "";

    if (itemName != "") {

        var item = {
            name: itemName,
            checked: 0,
            comments: ""
        }

        items.push(item);

        renderList();
    }
};

var renderList = function() {
    var list = document.getElementById("products-list");
    list.innerHTML = "";

    items.forEach(function(item, i) {

        var html = '<div class="products-list-item" id="item-' + i + '">';

        html += '<div>v</div>';
        html += '<div>' + item.name + '</div>';
        html += '<div>...</div>';
        html += '<div class="btn" id="item-del-' + i + '"><i class="fa fa-trash"></i></div>';
        html += '</div>';


        list.innerHTML += html;

        var delBtn = document.getElementById("item-del-" + i);

        delBtn.onclick = function() {
            var id = this.id;
            console.log(id);
            console.log(id.substring(9, id.length));
        }

    })
};

document.onload = function() {
    setTimeout(function() {
        e = document.getElementById("item-name");
        e.value = "";
    }, 250);

}();