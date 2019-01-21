; 'use strict';

$(() => {
    const defaultColor = '#fffdff';
    const $colorField = $('#color');
    const $userNameField = $('#userName');

    $colorField.on('change', () => {
        $.cookie('color', $colorField.val(), { expires: 7 });
        $('body').css('background-color', $colorField.val());
    });

    $userNameField.on('change', () => {
        $.cookie('name', $userNameField.val(), { expires: 7 });
    });

    if(!($.cookie('color'))) {
        $('body').css('background-color', defaultColor);
        $colorField.val(defaultColor);

        $('#modalDialog').modal({show: true});
    }
    else {
        let color = $.cookie('color');
        let name = $.cookie('name');

        if(name)
            $('#modal_header').text(`Welcome, ${name}!`);

        $colorField.val(color);
        $userNameField.val(name);

        $('body').css('background-color', color);

        $('#modalDialog').modal('show');
    }
});

