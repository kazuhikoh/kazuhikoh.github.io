document.querySelectorAll('img.pict').forEach(e => {
  let filename = e.getAttribute('alt');
  let src = e.getAttribute('src').replace(/\/small$/, '');
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([xhr.response], {
        type: 'image/jpeg'
      }));
      a.download = filename;
      a.click();
    }
  };
  xhr.open('GET', src);
  xhr.responseType = 'blob';
  xhr.send();
});
