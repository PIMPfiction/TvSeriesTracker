var async = require('async')
const {Notification} = require('electron')


const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

(async() => {
  while(true){
    await timeoutPromise(5000)
    var dateNow = new Date();
    const notification = new window.Notification('Reminder',{
      body:"time is up"
    })
    //notification.onclick = () => {
  //         console.log('clicked')
    //   }
  }

})()
