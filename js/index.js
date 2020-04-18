var handleKeyPress = function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        addItem(null);
    }
};

var data = {
    items: [],
    shoppingList: []
};

var acItem;
var curEditItem = -1;


var addItem = function() {
    var e = document.getElementById("item-name");
    var itemName = acItem || e.value.trimLeft();
    e.value = "";
    acItem = "";

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

var deleteAll = function() {
    data.shoppingList = [];
    localStorage.setItem("kb-sl-data", JSON.stringify(data));
    renderList();
};

var deleteChecked = function() {
    data.shoppingList.forEach(function(item, index) {
        if (item.checked) {
            data.shoppingList.splice(index, 1);
            localStorage.setItem("kb-sl-data", JSON.stringify(data));
        }
    });
    renderList();
};

var renderList = function() {

    var list = document.getElementById("products-list");
    list.innerHTML = "";

    data.shoppingList.forEach(function(item, i) {

        var html = '<div class="products-list-item" id="item-' + i + '">';
        var htmlName;
        if (item.checked == 0) {
            htmlName = '<div class="text-item">' + item.name + '</div>';
        } else {
            htmlName = '<div class="text-item"><strike>  ' + item.name + '  </strike></div>';
        }

        html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-check-square"></i></div>';
        html += htmlName;
        html += '<div class="text-item-details">...</div>';
        html += '<div class="btn-item btn-edit" id="item-edit-' + i + '"><i class="fa fa-edit"></i></div>';
        html += '</div>';

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
        curEditItem = index;
        $("#dialog-detail-form").dialog("open");
        $(".ui-dialog-titlebar").hide();
        document.getElementById("product-name-title").innerHTML = data.shoppingList[index].name.toUpperCase();
        $('.det-input').val('');
    });

    $(".btn-check").click(function() {
        var id = this.id;
        var index = id.substring(11, id.length);
        data.shoppingList[index].checked = !data.shoppingList[index].checked;
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
                    //console.log(ui.item.label);
                    setTimeout(function() {
                        var e = document.getElementById("item-name");
                        e.value = "";
                        acItem = ui.item.label;
                        addItem();
                    }, 100);
                }
            });
        }
        renderList();

        $('#btn-del-checked').click(function() {
            $("#dialog-delete-checked").dialog("open");
            $(".ui-dialog-titlebar").show();
            $('.ui-dialog-titlebar-close').hide();
        });

        $('#btn-del-all').click(function() {
            $("#dialog-delete-all").dialog("open");
            $(".ui-dialog-titlebar").show();
            $('.ui-dialog-titlebar-close').hide();
        });

        $("#dialog-delete-all").dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: "60%",
            modal: true,
            buttons: {
                "Usuń": function() {
                    deleteAll();
                    $(this).dialog("close");
                },
                "Anuluj": function() {
                    $(this).dialog("close");
                }
            }
        });

        $("#dialog-delete-checked").dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: "60%",
            modal: true,
            buttons: {
                "Usuń": function() {
                    deleteChecked();
                    $(this).dialog("close");
                },
                "Anuluj": function() {
                    $(this).dialog("close");
                }
            }
        });

        $("#dialog-detail-form").dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: "60%",
            modal: true,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                    renderList();
                },
            }
        });

        $(".form-wrapper").focusout(function() {
            item = data.shoppingList[curEditItem];
            item.category = $("#input-cat").val();
            item.qauntity = $("#input-qty").val();
            item.comments = $("#input-comments").val();
            data.shoppingList[curEditItem] = item;
            localStorage.setItem("kb-sl-data", JSON.stringify(data));
            renderList();
        });

    }, 250);

}();