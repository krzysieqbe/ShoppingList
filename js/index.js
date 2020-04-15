var handleKeyPress = function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        addItem();
    }
};

var data = {
    items: [],
    shoppingList: []
};

function addItem() {
    var e = document.getElementById("item-name");
    var itemName = e.value.trimLeft();
    e.value = "";

    if (itemName != "") {

        var item = {
            name: itemName,
            checked: 0,
            category: '',
            qauntity: ''
        }

        var itemExsist = 0;

        for (let i = 0; i < data.items.length; i++) {
            if (itemName == data.items[i].name) {
                itemExsist = 1;
                break;
            }
        }

        if (!itemExsist) {
            data.items.push(item);
        }

        data.shoppingList.push(item);
        localStorage.setItem("kb-sl-data", JSON.stringify(data));
        renderList();
    }
};

var renderList = function() {

    var list = document.getElementById("products-list");
    list.innerHTML = "";

    data.shoppingList.forEach(function(item, i) {

        var html = '<div class="products-list-item" id="item-' + i + '">';

        if (item.checked == 0) {
            html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-square"></i></div>';
            html += '<div class="text-item">' + item.name + '</div>';
            html += '<div class="text-item">...</div>';
            html += '<div class="btn-item btn-edit" id="item-edit-' + i + '"><i class="fa fa-edit"></i></div>';
            html += '</div>';
        } else {
            html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-check-square"></i></div>';
            html += '<div class="text-item"><strike>  ' + item.name + '  </strike></div>';
            html += '<div class="text-item">...</div>';
            html += '<div class="btn-item btn-edit" id="item-edit-' + i + '"><i class="fa fa-edit"></i></div>';
            html += '</div>';
        }

        //<i class="fas fa-ellipsis-h"></i>
        list.innerHTML += html;
    });

    $(".btn-del").click(function() {
        var id = this.id;
        var index = id.substring(9, id.length);

        data.shoppingList.splice(index, 1);
        localStorage.setItem("kb-sl-data", JSON.stringify(data));
        renderList();
    });

    $(".btn-edit").click(function() {
        var id = this.id;
        var index = id.substring(10, id.length);
        console.log(index);
        renderList();
    });

    $(".btn-check").click(function() {
        var id = this.id;
        var index = id.substring(11, id.length);
        data.shoppingList[index].checked = !data.shoppingList[index].checked;
        localStorage.setItem("kb-sl-data", JSON.stringify(data));
        renderList();
    });

    $('#btn-del-checked').click(function() {
        data.shoppingList.forEach(function(item, index) {
            if (item.checked) {
                data.shoppingList.splice(index, 1);
                localStorage.setItem("kb-sl-data", JSON.stringify(data));
            }
        });
        renderList();
    });

    $('#btn-del-all').click(function() {
        data.shoppingList = [];
        localStorage.setItem("kb-sl-data", JSON.stringify(data));
        renderList();
    });

};

document.onload = function() {
    setTimeout(function() {
        e = document.getElementById("item-name");
        e.value = "";
        var itemNames = [];
        dataLS = JSON.parse(localStorage.getItem("kb-sl-data"));
        if (dataLS.shoppingList) {
            data = dataLS;
            data.items.forEach(function(item) {
                itemNames.push(item.name);
            });
            $("#item-name").autocomplete({
                source: itemNames,
                select: function(event, ui) {
                    console.log(ui.item.label);
                    setTimeout(addItem(), 500);
                }
            });
        }
        renderList();
    }, 250);

}();