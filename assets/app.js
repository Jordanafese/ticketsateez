function update_seats_num() {
    var seats = document.getElementsByClassName("seat");
    var sc = document.getElementById("s_count");
    var g = 0;

    for (var x = 0; x < seats.length; x++) {
        seat = seats[x];
        if (seat.getAttribute("is") == "selected") {
            g += 1;
        }
    }
    sc.innerText = g;
}

function click_seat(id) {
    var e = document.getElementById(id);
    if (e.getAttribute("is") == "selected") {
        e.setAttribute("is", "")
    } else {
        e.setAttribute("is", "selected")
    }

    update_seats_num()
}

$("#transfer").click(() => {
    $("#overlay").fadeIn()
        .animate({ display: 'inline' }, 800, function () {
            $("#modal1").animate({ height: '450px' }, 300, function () {

            });
        });
});

function clear_modal() {
    $("#modal1").animate({ height: '0px' }, 300, function () {
        $("#overlay").fadeOut()
            .animate({ display: 'None' }, 300, function () {

            });
    });
}



var deadline = new Date(2024,4,30,0,30,0,0).getTime();
  
var x = setInterval(function() {
  
    var now = new Date().getTime();
    var t = deadline - now;
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);
    document.getElementById("day").innerHTML =days ;
    document.getElementById("hour").innerHTML =hours;
    document.getElementById("minute").innerHTML = minutes; 
    document.getElementById("second").innerHTML =seconds; 
    document.getElementById("days").innerHTML =days;
    document.getElementById("hours").innerHTML =hours;
    document.getElementById("minutes").innerHTML = minutes; 
    document.getElementById("seconds").innerHTML =seconds; 
    if (t < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "TIME UP";
        document.getElementById("day").innerHTML ='0';
        document.getElementById("hour").innerHTML ='0';
        document.getElementById("minute").innerHTML ='0' ; 
        document.getElementById("second").innerHTML = '0'; 
    }
}, 1000);
