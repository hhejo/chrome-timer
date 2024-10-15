document.querySelector('#saveTime').addEventListener('click', function () {
  const morningTime = document.querySelector('#morningAlarmTime').value; // 'HH:mm'
  const eveningTime = document.querySelector('#eveningAlarmTime').value; // 'HH:mm'
  if (morningTime && eveningTime) {
    chrome.storage.sync.set(
      { morningTime: morningTime, eveningTime: eveningTime },
      () => {
        console.log('then! morningTime, eveningTime');
        chrome.runtime.sendMessage({
          action: 'setAlarms',
          morningTime: morningTime,
          eveningTime: eveningTime,
        });
      }
    );
  }
  alert(`오전 알림 시간: ${morningTime}, 오후 알림 시간: ${eveningTime}`);
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['morningTime', 'eveningTime'], (result) => {
    if (result.morningTime)
      document.querySelector('#morningAlarmTime').value = result.morningTime;
    if (result.eveningTime)
      document.querySelector('#eveningAlarmTime').value = result.eveningTime;
  });
});

// document.querySelector('#saveTime').addEventListener('click', function () {
//   const morningTime = document.querySelector('#morningAlarmTime').value; // 'HH:MM'
//   const eveningTime = document.querySelector('#eveningAlarmTime').value; // 'HH:MM'
//   if (morningTime && eveningTime) {
//     chrome.storage.sync.set(
//       { morningTime: morningTime, eveningTime: eveningTime },
//       () => {
//         console.log('morningTime, eveningTime:', morningTime, eveningTime);
//         chrome.runtime.sendMessage({
//           action: 'setAlarms',
//           morningTime: morningTime,
//           eveningTime: eveningTime,
//         });
//       }
//     );
//   }
//   alert(`오전 알림 시간: ${morningTime}, 오후 알림 시간: ${eveningTime}`);
// });
