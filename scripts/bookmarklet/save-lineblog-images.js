function createDialog() {
  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'piyo-dialog')
  
  dialog.innerHTML = `
  <div id="piyo-dialog-container" class="text-align-center">
    <h1>Photos</h1>

    <div id="piyo-grid-container" class="grid-container mt-1 mb-1">
      <div id="piyo-grid" class="grid"></div>
    </div>

    <progress id="piyo-progress" value="0" max="0"></progress>
    <div>
      <span id="piyo-progress-value"></span> /
      <span id="piyo-progress-max"></span>
    </div>
    <footer>
      <button id="piyo-btn-download">Download</button>
    </footer>
  </div>
  
  <style>
  .mt-1 {
    margin-top: 10px;
  }
  .mb-1 {
    margin-bottom: 10px;
  }
  .text-align-center {
    text-align: center;
  }

  h1 {
    font-size: 1.5em;
    font-weight: bold;
  }

  .grid-container {
    width: 80vw;
    height: 60vh;
    padding: 0 10px 0 10px;
    overflow-y: scroll;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 100px;
    gap: 10px;
  }
  .grid-item {
    width: auto;
    height: auto;
    border: 1px solid lightgray;
    background-color: white;
  }
  .grid-item > img {
    object-fit: contain;
    width: 100%;
    height: 80%;
  }
  .grid-item-footer {
    display: flex;
    justify-content: space-between;
    padding: 0 5px 0 5px;
  }
  .grid-item span {
    border-radius: 1rem;
    font-size: 0.8em;
    font-weight: bold;
    padding: 0.1rem 0.2rem;
    text-align: center;
    white-space: nowrap;
  }
  .grid-item span.ok {
    background-color: green;
    color: white;
  }
  .grid-item span.ng {
    background-color: red;
    color: white;
  }

  progress {
    width: 50%;
    -webkit-appearance: none;
  }
  ::-webkit-progress-bar {
    background-color: lightgray;
  }
  ::-webkit-progress-value {
    background-color: #f8b400;
  }

  button {
    background-color: transparent;
    border: none;
    border-radius: 50px;
    background-color: #00c878;
    color: white;
    cursor: pointer;
    outline: none;
    padding: 8px 18px;
    appearance: none;
  }

  footer {
    padding: 10px 10px 0px 10px;
  }
  </style>
  `
  
  document.body.appendChild(dialog)
  dialog.addEventListener('click', (e) => {
      if (e.target.closest('#piyo-dialog-container') === null) {
          dialog.close()
      }
  })  
  dialog.addEventListener('close', () => {
    dialog.remove()
  })

  return dialog
}

function addGridItem(index, e) {
    const grid = document.getElementById("piyo-grid")

    const item = document.createElement('div')
    item.setAttribute('id', `piyo-grid-item-${index}`)
    item.classList.add('grid-item')
        
    const ePreview = document.createElement('img')
    ePreview.src = e.getAttribute('src')

    const eFooter = document.createElement('div')
    eFooter.classList.add('grid-item-footer')
    
    const eLink = document.createElement('a')
    eLink.innerHTML = 'Link'
    eLink.href = e.getAttribute('src').replace(/\/small$/, '')
    
    const eResult = document.createElement('span')
    eResult.setAttribute('id', `piyo-grid-item-result-${index}`)

    eFooter.appendChild(eLink)
    eFooter.appendChild(eResult)

    item.appendChild(ePreview)
    item.appendChild(eFooter)
    
    grid.appendChild(item)
}

function scrollGridTo(index, size) {
    const container = document.querySelector('#piyo-grid-container')
    const rowIndex = Math.floor(index / 4)
    const rowSize = Math.ceil(size / 4)
    container.scrollTop = (container.scrollHeight / rowSize) * rowIndex
}

function showResult(index, ok) {
    const eResult = document.querySelector(`#piyo-grid-item-result-${index}`)
    if (ok) {
        eResult.innerHTML = 'OK'
        eResult.classList.add('ok')
    }
    else {
        eResult.innerHTML = 'NG'
        eResult.classList.add('ng')
    }
}

function download(images, progressCallback) {
  (async () => {
    let count = 0
    const sleep = (second) => new Promise(resolve => setTimeout(resolve, second * 1000))

    for (let i = 0; i < images.length; i++) {
        await new Promise((resolve, reject) => {
            const e = images[i]
            
            const filename = e.getAttribute('alt');      
            const src = e.getAttribute('src').replace(/\/small$/, '');
    
            const xhr = new XMLHttpRequest()
            xhr.onload = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {  
                  const a = document.createElement('a');  
                  a.href = URL.createObjectURL(new Blob([xhr.response], {
                    type: 'image/jpeg'
                  }))
                  a.download = filename;
                  a.click()
        
                  scrollGridTo(i, images.length)
                  showResult(i, true)
                  progressCallback(++count)

                  resolve({
                      index: i,
                      response: xhr.response, 
                      filename
                  })
                }          
            }
            xhr.onerror = (e) => {
              scrollGridTo(i, images.length)
              showResult(i, false)
              progressCallback(++count)

              reject(i)  
            }  
            xhr.open('GET', src);
            xhr.responseType = 'blob';
            xhr.send();            
        }) 
        await sleep(0.5)
    }  
  })()
}

const images = document.querySelectorAll('img.pict')

let dialogOld = document.querySelector('#piyo-dialog')
if (dialogOld != null) {
    dialogOld.remove()
}

const dialog = createDialog()

images.forEach((e,i) => {
    addGridItem(i, e)
})

const progress = document.querySelector("#piyo-progress")
const progressValue = document.querySelector("#piyo-progress-value")
const progressMax = document.querySelector("#piyo-progress-max")
progress.min = 0
progress.max = images.length
progressValue.innerHTML = 0
progressMax.innerHTML = images.length

const btnDownload = document.querySelector('#piyo-btn-download')
btnDownload.onclick = function() {
    download(images, p => {
        progress.value = p
        progressValue.innerHTML = `${p}`
    })
}

dialog.showModal()
