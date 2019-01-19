const {Notification} = require('electron')
const Store = require('electron-store')
const store = new Store();
const path = require('path')


//const notificationx = new window.Notification('Reminder',{
//  body:"time is up"
//  })


window.setInterval(function(){
  alarm_sender()
}, 15*000);

window.setInterval(function(){
  for (let serie in store.get('favorites')){
    favorite_loop(serie)
  }
}, 3600*1000);


function favorite_loop(serie){
  var request = axios.get("https://www.digiturk.com.tr/yayin-akisi/api/program/ara/?value="+encodeURI(serie), config)
  .then(function (response, array)
  {
    var image = $(response.data).find(".channel-image").attr("src");
    $(response.data).find(".time").each(function(index){
      var date = $(this).attr("datetime");
      date = date.slice(0, -3);
      add_alarm(date, serie);
    });

  });
}

function add_alarm(date, name){
  // HACK: add notification to series
  date = date.replace(' ', '.').replace(':', '.').split('.');
  date = new Date(date[2], parseInt(date[1])-1, date[0], date[3], date[4])
  //date = null   // HACK: delete this
  //date = new Date() // HACK: delete this
  if (store.get('reminders.'+name)){ //diziye bir hatirlatici daha ekle
    var alarms = store.get('reminders.'+name);
    if (alarms){
      if (alarms.length >= 1){
        for ( let alarm in alarms){
          var alarm_date = new Date(alarms[alarm]);
          alarm_date.setMinutes(alarm_date.getMinutes() +5);
          if (alarm_date.getTime() == date.getTime()){
            console.log("aynisi var zaten")
            return;
          }
        };
      };
    }
    alarms.push(date);
    date.setMinutes(date.getMinutes() - 5) // 5 dakika onceye alarm koy
    store.set('reminders.'+name, alarms)
  } else {
    date.setMinutes(date.getMinutes() - 5) // 5 dakika onceye alarm koy
    store.set('reminders.'+name, [date])
  }
}

function alarm_sender(){ //compare dates of alarms in loop then sends notifications
  // HACK: check alarms
  var database = store.get('reminders');
  if (database){
    var now = new Date();
    for ( series in store.get('reminders')){
      var alarms = store.get('reminders.'+series)
      for (let alarm of alarms){
        var alarm_date = new Date(alarm)
        if(alarm_date.getHours() == now.getHours() && alarm_date.getMonth() == now.getMonth() && alarm_date.getDate() == now.getDate()){
          if(alarm_date.getMinutes() == now.getMinutes()){
            //delete alarm
            var index = alarms.indexOf(alarm)
            delete alarms[index]
            alarms = alarms.filter(String)
            store.set('reminders.'+series, alarms)
            //EXECUTE ALARM
            notification_func(alarm_date, series)
            console.log("notification_func() calistirildi")

          }
        }
        else if(alarm_date.getTime() < now.getTime()){
          var index = alarms.indexOf(alarm)
          delete alarms[index]
          alarms = alarms.filter(String)
          store.set('reminders.'+series, alarms)
        }
      }
    }
  }

}
var notify_logo = path.join(__dirname, '../logo')

if (process.platform == 'darwin'){
    function notification_func(alarm_date, series){
      let notification = new window.Notification(series, {
        body:'Will be aired '+alarm_date,
        icon: path.join(notify_logo, 'image.png')
      })
    //notification.show()
    }
}
else if (process.platform == 'win32'){
  const notifier = require('node-notifier')
  function notification_func(alarm_date,series){
    notifier.notify({
      title: series,
      message: "Will be aired in 5 minutes.",
      icon: path.join(notify_logo, 'image.png'),
    })

  }
}
