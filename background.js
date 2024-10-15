chrome.runtime.onInstalled.addListener(() => console.log('onInstalled'));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('onMessage:', message); // message: { action: 'setAlarms', morningTime: 'HH:mm', eveningTime: 'HH:mm' }
  const { action, morningAlarmTime, eveningAlarmTime } = message;
  if (action === 'setAlarms') {
    // const morningTime = message.morningTime;
    // const eveningTime = message.eveningTime;
    setAlarm(morningAlarmTime, 'morningAlarmTime');
    setAlarm(eveningAlarmTime, 'eveningAlarmTime');
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('alarm:', alarm); // alarm: { name: 'morningAlarmTime', scheduledTime: 1728951240001.784 }
  chrome.storage.sync.get(alarm.name, (result) => {
    console.log('result:', result); // result: { morningAlarmTime: 'HH:mm' }
    const alarmTime = result[alarm.name];
    if (alarm.name === 'morningAlarmTime')
      showNotification('입실 체크', `${alarmTime}의 알람이 활성화 되었습니다`);
    else if (alarm.name === 'eveningAlarmTime')
      showNotification('퇴실 체크', `${alarmTime}의 알람이 활성화 되었습니다`);
  });
});

function setAlarm(timeString, alarmName) {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  const alarmTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0
  );
  if (alarmTime < now) alarmTime.setDate(alarmTime.getDate() + 1);
  const timeUntilAlarm = alarmTime.getTime() - now.getTime();
  chrome.alarms.clear(alarmName, () => {
    chrome.alarms.create(alarmName, { delayInMinutes: timeUntilAlarm / 60000 });
    console.log(`${alarmName} 설정:`, alarmTime.toLocaleTimeString());
  });
}

function showNotification(title, message) {
  chrome.notifications.create(
    {
      type: 'basic',
      iconUrl: title === '입실 체크' ? 'icon1.png' : 'icon2.png',
      title: title,
      message: message,
      priority: 2,
    },
    (notificationId) => {
      console.log('Notification shown:', notificationId);
    }
  );
}
