const {Notification} = require('electron')
const Store = require('electron-store')
const store = new Store();


//const notificationx = new window.Notification('Reminder',{
//  body:"time is up"
//  })


window.setInterval(function(){
  console.log("alarm_sender() calistirildi")
  alarm_sender()
}, 15000);

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
          if (alarm_date.getTime() == date.getTime()){
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


function notification_func(alarm_date, series){
  let notification = new window.Notification(series, {body:'Will be aired '+alarm_date})
  //notification.show()
}
