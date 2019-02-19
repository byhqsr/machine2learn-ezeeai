$(document).ready(function () {
    if (!jQuery.isEmptyObject(appConfig.handle_key.checkpoints))
        create_checkpoint_table(appConfig.handle_key.checkpoints, appConfig.handle_key.metric)

});

function create_checkpoint_table(checkpoints, metric) {
    let table_checkpoints = $('#table_checkpoints').DataTable({
        data: get_rows(checkpoints),
        columns: [{title: 'Checkpoint'}, {title: metric}, {title: 'Loss'}, {
            title: '',
            width: "5%",
            'sClass': 'trash-icon'
        }],
        searching: true,
        'select': false,
        "lengthChange": false,
        "drawCallback": function () {
            if ($(this).DataTable().rows()[0].length <= 10) {
                let id = '#' + $(this).attr('id');
                $(id + '_paginate').remove();
                $(id + '_info').remove();
            }
        }
    });
    $('#checkpoint_search').keyup(function () {
        table_checkpoints.search($(this).val()).draw();
    });
}

function get_rows(checkpoints) {
    let rows = [];
    $.each(checkpoints, function (key, value) {
        let val = 0;
        if ('accuracy' in value)
            val = value['accuracy'];
        else if ('r_squared' in value)
            val = value['r_squared'];
        rows.push([key, val, value['loss'], '<a data-id=' + key + ' onclick="ConfirmDelete(this, false)" >' +
        '<span class="fi flaticon-trash"></span></a>']);
    });
    return rows;
}

function update_checkpoint_table(checkpoints) {
    $('#table_checkpoints').DataTable().clear().rows.add(get_rows(checkpoints)).draw();
}


function ConfirmDelete(elem, all) {
    let message = "Are you sure you want to delete the selected checkpoint?";
    if (all === true) {
        message = "Are you sure you want to delete all saved checkpoints?";
    }
    if (confirm(message)) {
        $.ajax({
            url: "/delete",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            accepts: {
                json: 'application/json',
            },
            data: JSON.stringify({'deleteID': $(elem).attr('data-id')}),
            success: function (data) {
                update_checkpoint_table(data.checkpoints)
            }
        })
    }
}