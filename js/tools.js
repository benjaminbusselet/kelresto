function ajax(url, success) {
    let req = new XMLHttpRequest()
    req.open('GET', url)
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200)
                success(req.responseText);
            else
                console.error(req.status + " " + req.statusText + " " + url);
        }
    };
    req.send(null)
};