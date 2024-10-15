document.querySelector('#saveTimes').addEventListener('click', function () {
  const morningAlarmTime = document.querySelector('#morningAlarmTime').value; // 'HH:mm'
  const eveningAlarmTime = document.querySelector('#eveningAlarmTime').value; // 'HH:mm'
  if (morningAlarmTime && eveningAlarmTime) {
    chrome.storage.sync.set({ morningAlarmTime, eveningAlarmTime }, () => {
      chrome.runtime.sendMessage({
        action: 'setAlarms',
        morningAlarmTime: morningAlarmTime,
        eveningAlarmTime: eveningAlarmTime,
      });
    });
  }
  alert(`오전 알림: ${morningAlarmTime}\n오후 알림: ${eveningAlarmTime}`);
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    ['morningAlarmTime', 'eveningAlarmTime'],
    (result) => {
      console.log('DOMContentLoaded result:', result); // result: { morningAlarmTime: 'HH:mm', eveningAlarmTime: 'HH:mm' }
      if (result.morningAlarmTime)
        document.querySelector('#morningAlarmTime').value =
          result.morningAlarmTime;
      if (result.eveningAlarmTime)
        document.querySelector('#eveningAlarmTime').value =
          result.eveningAlarmTime;
    }
  );
});
