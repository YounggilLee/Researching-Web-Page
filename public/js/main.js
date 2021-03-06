
var mousePos;
var xPosion = [];
var yPosion = [];
var timer = 0;
var checkInputTimer = 0;
var secInrease;
var checkWordTime;
var submitContents;
var reciveCode;

document.onmousemove = handleMouseMove;

// setInterval repeats every X ms
setInterval(getMousePosition, 500);

$(document).ready(function () {

    
    autoExpendTextArea();

    preventScroll();

    $('#textArea').on('keyup', function () {

        // [Console] Checking key event
        console.log('key event is started!!!!!')
        timer = 0;
        clearInterval(secInrease);
        setTimer();
        checkTimer();
    });


    // Generate code to share data  
    $('#share').submit(function (e) {

        clearInterval(secInrease);
        clearInterval(checkWordTime);
        e.preventDefault();
        var contentData = $('#textArea').val();

        $.ajax({
            type: 'POST',
            data: {
                'words': contentData,
                'endTime': checkInputTimer
            },
            url: '/httpPage',
            success: function (dbData) {

                getCode(dbData);
            },
            error: function (error) {
                console.log(error);
            }

        });

        getCurretData();
    });

    // Get data from database in server
    $('input[name="load"]').click(function () {

        $.ajax({
            type: 'GET',
            url: '/httpPage/' + $('input[name="code-in"]').val(),
            success: function (dbData) {
                if (dbData == null || dbData == "")
                    alert("There is no a such code");
                var textContent = JSON.parse(dbData);
                $('#textArea').val(textContent.content);
            },
            error: function (error) {
                console.log(error);
            }

        });
    });    

});/**
 * End Ready function
 */


// Expend textArea automatically
function autoExpendTextArea() {
    $('#textArea').on('keyup', function () {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });
}

// Check position of mouse
function handleMouseMove(event) {
    var  pageX, pageY;

    event = event || window.event; // IE-ism

    mousePos = {
        x: event.pageX,
        y: event.pageY
    };
        
}

// Store mouse position to array list
function getMousePosition() {
    var pos = mousePos;
    if (!pos) {
        // We haven't seen any movement yet
    }
    else {
        xPosion.push(pos.x);
        yPosion.push(pos.y);       

        // [Console] Checking mouse event      
       // console.log("X= " + xPosion + "||" + "Y= " + yPosion);
    }
}

// Preveting  scroll event 
function preventScroll() {

    $('#table-scroll').on('mousewheel DOMMouseScroll', function (e) {

        var scrollEvent = e.originalEvent;
        var delta = scrollEvent.wheelDelta || scrollEvent.detail;

        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    });

}


// Set(Check) timer and send user data to server
function setTimer() {

    secInrease = setInterval(function () {
        timer += 1;

        // [Cosole] is for timer to check key event
        console.log(timer);

        if (timer >= 60) {
            clearInterval(secInrease);
            clearInterval(checkWordTime);

            var contentData = $('#textArea').val();

            $.ajax({
                type: 'POST',
                data: {
                    'words': contentData,
                    'endTime': checkInputTimer
                },

                url: '/httpPage',
                success: function (dbData) {
                    console.log(dbData);
                    getCode(dbData);
                },
                error: function (error) {
                    console.log(error);
                }

            });

            getCurretData();
        }

    }, 1000);

}

// Check time
function checkTimer() {

    checkWordTime = setInterval(function () {
        checkInputTimer += 1;
    }, 1000);
}

// Get the share code from received data
function getCode(data) {
    checkTimer = 0;
    clearInterval(checkWordTime);

    var jsonData = JSON.parse(data);
    $('input[name="code-out"]').val(jsonData._id);

}

// Get currentData from server
function getCurretData() {

    $.ajax({
        type: 'GET',
        url: '/httpPage',
        success: function (dbData) {
            makeList(dbData);
        },
        error: function (error) {
            console.log(error);
        }

    });
}
    // Put data to the table in page
    function makeList(dbData) {

        $("tbody").empty();
        $(dbData).each(function () {
            $("tbody").append("<tr>");

            $("tbody").append(
                "<td>" +
                this.time +
                "</td>" +
                "<td>" +
                this.wordNumber +
                "</td>" +
                "<td>" +
                this.wordPerMin +
                "</td>" +
                "<td>" +
                this.wordCompare +
                "</td>"
            );

            $("tbody").append("</tr>");
        });

    }

 