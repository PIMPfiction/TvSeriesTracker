const axios = require('axios');
require('easy-autocomplete');


function card_object(name, date, image){
  var split = date.split(".");
  split[1] = month[parseInt(split[1])];
  var date = split.join(".").slice(0, -3);
  name = name.replace("+", " ");
  return "<div class='col-sm-4 col-xs-4 col-lg-4'><div class='card mt-3'><div class='col-auto'><img src='"+image+"' class='card-img-top' alt='Card Image cap'></div><div class='col'><div class='card-block px-2 '><h5 class='card-title'>"+name+"</h5><p class='card-text'>"+date+"</p></div></div></div></div>"
};

const config = { //axios configuration
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
month = ['', 'January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function doNotify() {
    $("#card-container").html('');
    $(".progress").removeClass("invisible");
    $(".progress-bar").css('width', '50%');
    var tv_series = $("#text").val().toLocaleUpperCase('tr-TR').replace(" ", "+");

    var request = axios.get("https://www.digiturk.com.tr/yayin-akisi/api/program/ara/?value="+encodeURI(tv_series), config)
    .then(function (response, array)
    {
      var image = $(response.data).find(".channel-image").attr("src");
      $(response.data).find(".time").each(function(index){
        $("#card-container").append(card_object(tv_series, $(this).attr("datetime"), image));
      });
      $(".progress-bar").css('width', '100%');

    });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("text").addEventListener("keyup", function(event){
    if (event.keyCode === 13){
      doNotify();
    }
  });
});

var options = {
    url: function(phrase) {
        if (phrase !== "") {
            phrase = decodeURIComponent(phrase);
            return "http://www.digiturk.com.tr/yayin-akisi/api/info/hizliara?value=" + phrase;
        }
    },
    getValue: function(element){
      return element;
    },
    listLocation: "result",
    theme:"plate",
    list:{
      showAnimation:{
        type: "slide",
        time:400,
        callback: function() {}
      },
      hideAnimation:{
        type:"fade",
        time:400,
        callback: function() {}
      }
    },
};

$("#text").easyAutocomplete(options);





// HACK: IPC SECTION


// Some data that will be sent to the main process
let Data = {
    message: "Hi",
    someData: "Let's go"
};

const { ipcRenderer} = require('electron');
// HACK: ipcRenderer.send('request-mainprocess-action', Data)

ipcRenderer.on('mainprocess-response', (event, arg) => {
    window.alert(arg); // prints "Hello World!"
});
