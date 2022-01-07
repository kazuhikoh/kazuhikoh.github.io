function createDialog() {
  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'piyo-dialog')
  
  dialog.innerHTML = `
  <div class="text-align-center">
    <h1>まとめて入力</h1>
    <div class="mt-1">
      <input id="piyo-input-start" type="text" placeholder="開始" value="10:00"/>
      <input id="piyo-input-end"   type="text" placeholder="終了" value="19:00"/>
      <input id="piyo-input-rest"  type="text" placeholder="休憩" value="01:00"/>
    </div>
    <table align="center" class="table mt-1">
      <thead>
        <tr>
          <th>月</th>
          <th>火</th>
          <th>水</th>
          <th>木</th>
          <th>金</th>
          <th>土</th>
          <th>日</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input id="piyo-input-dow0" type="checkbox" checked/></td>
          <td><input id="piyo-input-dow1" type="checkbox" checked/></td>
          <td><input id="piyo-input-dow2" type="checkbox" checked/></td>
          <td><input id="piyo-input-dow3" type="checkbox" checked/></td>
          <td><input id="piyo-input-dow4" type="checkbox" checked/></td>
          <td><input id="piyo-input-dow5" type="checkbox"/></td>
          <td><input id="piyo-input-dow6" type="checkbox"/></td>
        </tr>
      </tbody>
    </table>
    <div class="text-align-center mt-1">
      <button id="piyo-btn-apply" class="btn">Apply</button>
    </div>
  </div>
  
  <style>
  .mt-1 {
    margin-top: 10px;
  }
  .text-align-center {
    text-align: center;
  }
  .btn {
    padding: 2px 30px;
  }
  .table {
    border-collapse: separate;
    border-spacing: 2px;
  }
  </style>
  `
  
  document.body.appendChild(dialog)
  dialog.addEventListener('close', function() {
    dialog.remove()
  })

  return dialog
}

(function(){
  if (!document.location.href.startsWith('https://platform.levtech.jp/p/workreport/input/')) {
    alert('This page is not supported!')
    return
  }

  let dialog = document.querySelector('#piyo-dialog')
  if (dialog == null) {
    dialog = createDialog()
  }

  const inputStart = dialog.querySelector('#piyo-input-start')
  const inputEnd   = dialog.querySelector('#piyo-input-end')
  const inputRest  = dialog.querySelector('#piyo-input-rest')
  const inputDows = [
    dialog.querySelector('#piyo-input-dow0'),
    dialog.querySelector('#piyo-input-dow1'),
    dialog.querySelector('#piyo-input-dow2'),
    dialog.querySelector('#piyo-input-dow3'),
    dialog.querySelector('#piyo-input-dow4'),
    dialog.querySelector('#piyo-input-dow5'),
    dialog.querySelector('#piyo-input-dow6')
  ]
  const btnApply = dialog.querySelector('#piyo-btn-apply')
  
  btnApply.onclick = function() {
    const dowText = [ '（月）', '（火）', '（水）', '（木）', '（金）', '（土）', '（日）', ]
  
    document.querySelectorAll('.tabContainer > table > tbody > tr').forEach(e => {
      for (let i = 0; i < 7; i++) {
        if (e.childNodes[1].innerText.includes(dowText[i])) {
          if (inputDows[i].checked) {
            e.childNodes[3].querySelector('td > div > input').value = inputStart.value
            e.childNodes[5].querySelector('td > div > input').value = inputEnd.value
            e.childNodes[7].querySelector('td > div > input').value = inputRest.value
          } else {
            e.childNodes[3].querySelector('td > div > input').value = ''
            e.childNodes[5].querySelector('td > div > input').value = ''
            e.childNodes[7].querySelector('td > div > input').value = ''
          }
          break
        }
      }
    })
  }
  
  dialog.showModal()
})()
