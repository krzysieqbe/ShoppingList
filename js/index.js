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

        if (item.checked == 0) {
            html += '<div class="btn btn-check" id="item-check-' + i + '"><i class="fa fa-square"></i></div>';
            html += '<div>' + item.name + '</div>';
            html += '<div>...</div>';
            html += '<div class="btn btn-del" id="item-del-' + i + '"><i class="fa fa-trash"></i></div>';
            html += '</div>';
        } else {
            html += '<div class="btn btn-check" id="item-check-' + i + '"><i class="fa fa-check-square"></i></div>';
            html += '<div><strike>  ' + item.name + '  </strike></div>';
            html += '<div>...</div>';
            html += '<div class="btn btn-del" id="item-del-' + i + '"><i class="fa fa-trash"></i></div>';
            html += '</div>';
        }


        list.innerHTML += html;
    })

    $(".btn-del").click(function() {
        var id = this.id;
        var index = id.substring(9, id.length);

        items.splice(index, 1);
        renderList();
    });

    $(".btn-check").click(function() {
        var id = this.id;
        var index = id.substring(11, id.length);
        items[index].checked = !items[index].checked;
        renderList();
    });

};

document.onload = function() {
    setTimeout(function() {
        e = document.getElementById("item-name");
        e.value = "";
    }, 250);

}();