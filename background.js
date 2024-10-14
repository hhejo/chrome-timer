chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setAlarms') {
    const morningTime = message.morningTime;
    const eveningTime = message.eveningTime;
    console.log('Setting morning, evening:', morningTime, eveningTime);
    setAlarm(morningTime, 'morningAlarm');
    setAlarm(eveningTime, 'eveningAlarm');
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'morningAlarm') {
    showNotification('입실 체크', `09:05!! 입실 체크하세요!!`);
  } else if (alarm.name === 'eveningAlarm') {
    showNotification('퇴실 체크', `17:50!! 퇴실 체크하세요!!`);
    // resetAlarms(); // 다음 날 알람을 다시 설정
    // chrome.storage.sync.get(['eveningAlarm'], (result) => {
    //   if (result.eveningAlarm) {
    //     setAlarm(result.eveningAlarm);
    //   }
    // });
  }
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
  if (alarmTime < now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }
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
      iconUrl: 'icon.png',
      title: title,
      message: message,
      priority: 2,
    },
    (notificationId) => {
      console.log('Notification shown:', notificationId);
    }
  );
}

// 확장 프로그램이 설치될 때 알람을 설정
chrome.runtime.onInstalled.addListener(() => {
  console.log('Hello');
});
