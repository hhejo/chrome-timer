chrome.runtime.onInstalled.addListener(() => console.log('onInstalled'));

chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup - re-registering alarms');
  // 서비스 워커가 재시작하면 알람을 재등록
  chrome.storage.sync.get(
    ['morningAlarmTime', 'eveningAlarmTime'],
    (result) => {
      if (result.morningAlarmTime)
        setAlarm(result.morningAlarmTime, 'morningAlarmTime');
      if (result.eveningAlarmTime)
        setAlarm(result.eveningAlarmTime, 'eveningAlarmTime');
    }
  );
});

chrome.runtime.onMessage.addListener((message) => {
  console.log('onMessage message:', message); // message: { action: 'setAlarms', morningTime: 'HH:mm', eveningTime: 'HH:mm' }
  const { action, morningAlarmTime, eveningAlarmTime } = message;
  if (action === 'setAlarms') {
    setAlarm(morningAlarmTime, 'morningAlarmTime');
    setAlarm(eveningAlarmTime, 'eveningAlarmTime');
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('alarm:', alarm); // alarm: { name: 'morningAlarmTime', scheduledTime: 1728951240001.784 }
  const { name: alarmName } = alarm;
  chrome.storage.sync.get(alarmName, (result) => {
    console.log('result:', result); // result: { morningAlarmTime: 'HH:mm' }
    const alarmTime = result[alarmName];
    if (alarmName === 'morningAlarmTime')
      showNotification('입실 체크', `${alarmTime}입니다. 입실 체크하세요!!`);
    else if (alarmName === 'eveningAlarmTime')
      showNotification('퇴실 체크', `${alarmTime}입니다. 퇴실 체크하세요!!`);
  });
});

function setAlarm(alarmTimeString, alarmName) {
  const now = new Date();
  const [hours, minutes] = alarmTimeString.split(':').map(Number);
  const [year, mnth, date] = [now.getFullYear(), now.getMonth(), now.getDate()];
  const alarmTime = new Date(year, mnth, date, hours, minutes, 0, 0);
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
      iconUrl:
        title === '입실 체크' ? './assets/icon1.png' : './assets/icon2.png',
      title: title,
      message: message,
      priority: 2,
    },
    (notificationId) => {
      console.log('Notification shown:', notificationId);
    }
  );
}

// 10분마다 설정된 알람이 있는지 확인하고 없으면 재등록
setInterval(() => {
  console.log('Checking alarms periodically...');
  chrome.storage.sync.get(
    ['morningAlarmTime', 'eveningAlarmTime'],
    (result) => {
      if (result.morningAlarmTime) {
        setAlarm(result.morningAlarmTime, 'morningAlarmTime');
      }
      if (result.eveningAlarmTime) {
        setAlarm(result.eveningAlarmTime, 'eveningAlarmTime');
      }
    }
  );
}, 600000); // 10분 = 600,000 밀리초
