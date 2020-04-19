var handleKeyPress = function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        addItem();
    }
};

var settings = {
    show: 'showAll',
    sort: 'addTime'
};

var data = {
    items: [],
    shoppingList: []
};

data.settings = settings;

var acItem;
var curEditItem = -1;

var compareCat = function(a, b) {
    if (a.category < b.category) {
        return -1;
    }
    if (a.category > b.category) {
        return 1;
    }
    return 0;
}

var compareId = function(a, b) {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

var addItem = function() {
    var e = document.getElementById("item-name");
    var itemName = acItem || e.value.trimLeft();
    e.value = "";
    acItem = "";

    if (itemName != "") {

        let cat = '';

        for (let i = 0; i < data.items.length; i++) {
            if (data.items[i].name == itemName) {
                cat = data.items[i].category;
                break;
            }
        }

        var item = {
            name: itemName,
            checked: 0,
            category: cat,
            quantity: '',
            comments: '',
            id: data.shoppingList.length
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

var renderItemRow = function(list, item, i) {
    let html = '';
    let itemCat = item.category || "Brak przypisanej kategorii";

    if (data.settings.sort == "category") {
        if (!i) {
            html += '<span>' + itemCat + '<span><br/>';
        } else if (data.shoppingList[i - 1].category != item.category) {
            html += '<span>' + itemCat + '<span><br/>';
        }
    }

    html += '<div class="products-list-item" id="item-' + i + '">';
    if (item.checked == 0) {
        html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-square"></i></div>' +
            '<div class="text-item">' +
            item.name + '<span class="text-item-details">&emsp; ' + item.category + ", " + item.quantity + ', ' + item.comments + '</span></div>';
    } else {
        html += '<div class="btn-item btn-check" id="item-check-' + i + '"><i class="fa fa-check-square"></i></div>' +
            '<div class="text-item"><strike>' +
            item.name + '<span class="text-item-details">&emsp; ' + item.category + ", " + item.quantity + ', ' + item.comments + '</span></strike></div>';
    }

    html += '<div class="btn-item btn-edit" id="item-edit-' + i + '"><i class="fa fa-edit"></i></div>';
    html += '</div>';

    //<i class="fas fa-ellipsis-h"></i>
    list.innerHTML += html;
}

var renderList = function() {

    var list = document.getElementById("products-list");
    list.innerHTML = "";

    if (data.settings.sort == "category") {
        data.shoppingList.sort(compareCat);
    } else {
        data.shoppingList.sort(compareId);
    }

    data.shoppingList.forEach(function(item, i) {

        if (data.settings.show == "showAll" || !item.checked) {
            renderItemRow(list, item, i);
        }


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
        $(".ui-dialog-content").show();
        document.getElementById("product-name-title").innerHTML = data.shoppingList[index].name.toUpperCase();
        $('#input-cat').val(data.shoppingList[index].category);
        $('#input-qty').val(data.shoppingList[index].quantity);
        $('#input-comments').val(data.shoppingList[index].comments);
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
        if (!dataLS.settings) {
            dataLS.settings = settings;
        }

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
            $(".ui-dialog-content").hide();
            $('.ui-dialog-titlebar-close').hide();
        });

        $('#btn-del-all').click(function() {
            $("#dialog-delete-all").dialog("open");
            $(".ui-dialog-titlebar").show();
            $('.ui-dialog-titlebar-close').hide();
            $(".ui-dialog-content").hide();
        });

        $("#dialog-delete-all").dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: "80%",
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
            width: "80%",
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
            width: "90%",
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
            item.quantity = $("#input-qty").val();
            item.comments = $("#input-comments").val();
            data.shoppingList[curEditItem] = item;
            for (let i = 0; i < data.items.length; i++) {
                if (data.items[i].name == item.name) {
                    data.items[i].category = item.category;
                    break;
                }
            }
            localStorage.setItem("kb-sl-data", JSON.stringify(data));
            renderList();
        });

        $('.settings-btn-off').click(function() {
            var setMode = this.id.substring(this.id.indexOf('-') + 1, this.id.length);
            var mode = setMode.substring(setMode.indexOf('-') + 1, setMode.length);
            var setting = setMode.substring(0, setMode.indexOf('-'));
            var prevMode = data.settings[setting];

            if (mode != prevMode) {
                $('#set-' + setting + '-' + mode).removeClass('settings-btn-off');
                $('#set-' + setting + '-' + mode).addClass('settings-btn-on');

                $('#set-' + setting + '-' + prevMode).addClass('settings-btn-off');
                $('#set-' + setting + '-' + prevMode).removeClass('settings-btn-on');

                data.settings[setting] = mode;
                localStorage.setItem("kb-sl-data", JSON.stringify(data));
                renderList();
            }

        });

        var settingsShow = data.settings.show;
        $('#set-show-' + settingsShow).removeClass('settings-btn-off');
        $('#set-show-' + settingsShow).addClass('settings-btn-on');
        var settingsSort = data.settings.sort;
        $('#set-sort-' + settingsSort).removeClass('settings-btn-off');
        $('#set-sort-' + settingsSort).addClass('settings-btn-on');

    }, 250);

}();