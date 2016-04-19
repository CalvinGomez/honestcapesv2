(function($) {
    "use strict";
    /* TODO: Start your Javascript code here */
    var socket = io();



    $("#user_input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            if ($('#user_input').val().trim() == "") {
                alert("Please enter a proper sentence.");
            }
            else {
                var r = confirm("Would you like to post this comment?");
                if (r == true) {                    
                    var message={ 'courseID': $('#courseID').val(),
                        'message': $('#user_input').val() };

                    socket.emit('chat message', message);
                    $('#user_input').val('');
                }
            }
            //$("form").submit();
        }
    });



        /*socket.on('newsfeed', function(msg){
            console.log(msg);
        });*/




    socket.on("newsfeed", function(data) {
       // console.log(data);
        console.log("hi");

        var parsedData=JSON.stringify(data);
     // grab and parse data and assign it to the parsedData variable.

     // other possible solution(s) here.
        $('#messages').prepend($('<li>').html(messageTemplate(data)));
        function messageTemplate(parsedData) {
            // generate HTML text based on some data to be prepended into the list



        var string='<li><div class="user"><div class="user-image"><img src="'
            +parsedData.photos[0].value+
            '"alt=""></div><div class="user-info"><span class="username">'
            +parsedData.user+
            '</span><br/><span class="posted">'
            +parsedData.posted+
            '</span></div></div><div class="message-content">'
            +parsedData.message+ '</div></li>';
            return string;

        }
     });

    // You may use this for updating new message
    function messageTemplate(template) {
        var result = '<div class="user">' +
            '<div class="user-image">' +
            '<img src="' + template.user.photo + '" alt="">' +
            '</div>' +
            '<div class="user-info">' +
            '<span class="username">' + template.user.username + '</span><br/>' +
            '<span class="posted">' + template.posted + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="message-content">' +
            template.message +
            '</div>';
        return result;
    }
})($);
