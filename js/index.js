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
        localStorage.setItem("kb-sl-data", JSON.stringify(items));
        renderList();
    }
};

var renderList = function() {
    var list = document.getElementById("products-list");
    list.innerHTML = "";

    items.forEach(function(item, i) {

        var html = '<div class="products-list-item" id="item-' + i + '">';

        if (item.checked == 0) {
            html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-square"></i></div>';
            html += '<div class="text-item">' + item.name + '</div>';
            html += '<div class="text-item">...</div>';
            html += '<div class="btn-item btn-del" id="item-del-' + i + '"><i class="fa fa-trash"></i></div>';
            html += '</div>';
        } else {
            html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-check-square"></i></div>';
            html += '<div class="text-item"><strike>  ' + item.name + '  </strike></div>';
            html += '<div class="text-item">...</div>';
            html += '<div class="btn-item btn-del" id="item-del-' + i + '"><i class="fa fa-trash"></i></div>';
            html += '</div>';
        }


        list.innerHTML += html;
    });

    $(".btn-del").click(function() {
        var id = this.id;
        var index = id.substring(9, id.length);

        items.splice(index, 1);
        localStorage.setItem("kb-sl-data", JSON.stringify(items));
        renderList();
    });

    $(".btn-check").click(function() {
        var id = this.id;
        var index = id.substring(11, id.length);
        items[index].checked = !items[index].checked;
        localStorage.setItem("kb-sl-data", JSON.stringify(items));
        renderList();
    });

};

document.onload = function() {
    setTimeout(function() {
        e = document.getElementById("item-name");
        e.value = "";

        items = JSON.parse(localStorage.getItem("kb-sl-data")) || items;
        renderList();



    }, 250);

}();