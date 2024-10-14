document.querySelector('#saveTime').addEventListener('click', function () {
  const morningTime = document.querySelector('#morningAlarmTime').value;
  const eveningTime = document.querySelector('#eveningAlarmTime').value;

  if (morningTime && eveningTime) {
    chrome.storage.sync.set(
      { morningTime: morningTime, eveningTime: eveningTime },
      () => {
        console.log('Alarm times:', morningTime, eveningTime);
        chrome.runtime.sendMessage({
          action: 'setAlarms',
          morningTime: morningTime,
          eveningTime: eveningTime,
        });
        // chrome.storage.local.get(console.log);
        // setAlarm(morningAlarmTime, eveningAlarmTime);
      }
    );
  }

  alert(`알림 시간이 저장되었습니다! ${morningTime}, ${eveningTime}`);
  // chrome.storage.local.get(console.log);
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['morningTime', 'eveningTime'], (result) => {
    if (result.morningTime) {
      document.querySelector('#morningAlarmTime').value = result.morningTime;
    }
    if (result.eveningTime) {
      document.querySelector('#eveningAlarmTime').value = result.eveningTime;
    }
  });
});
