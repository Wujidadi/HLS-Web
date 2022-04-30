let viewPoint = [];

async function getViewPoints() {
    await fetch('../../data/view/taoyuan-travel.json')
    .then(response => response.json())
    .then(data => {
        viewPoint = data;
    });
    return viewPoint;
}

function initCamera()
{
    document.querySelectorAll('div.fullpage-2x2-grid').forEach(function(elm)
    {
        const ordinal = elm.id.replace(/^camera/, '');
        const titleAreaId = `div#${elm.id} div.title-area h3.title`;
        const titleId = `div#${elm.id} h3.title span.viewpoint-title`;
        const linkId = `div#${elm.id} h3.title a`;
        const iframeId = `div#${elm.id} iframe`;
        const localStorageKey = `Camera${ordinal}Index`;

        let cameraIndex = localStorage.getItem(localStorageKey);
        let i = Math.floor(cameraIndex === null ? Number(ordinal) - 1 : Number(cameraIndex));
        if (i < 0) {
            i = 0;
        } else if (i >= viewPoint.length) {
            i = viewPoint.length - 1;
        }
        let point = viewPoint[i];
        let coordinate = point.coordinate.replace(' ', '');

        document.querySelector(titleId).innerText = point.name;
        document.querySelector(linkId).innerText = convertCoordinates(coordinate);
        document.querySelector(linkId).href = `https://www.google.com/maps/place/${coordinate}`;
        document.querySelector(iframeId).src = `https://www.youtube.com/embed/${viewPoint[i].videoId}?autoplay=1&mute=1`;
        document.querySelector(iframeId).title = point.title;
        document.querySelector(titleAreaId).classList.remove('hidden');
    });
}

function initCameraSwitcher()
{
    document.querySelectorAll('select.camera-switcher').forEach(function(elm)
    {
        viewPoint.forEach(function(vp, n) {
            let vo = document.createElement('option');
            vo.value = n;
            vo.text = vp.name;
            elm.add(vo, null);
        });

        const ordinal = elm.id.replace(/^cameraSwitcher/, '');
        const parentId = `camera${ordinal}`;
        const titleId = `div#${parentId} h3.title span.viewpoint-title`;
        const linkId = `div#${parentId} h3.title a`;
        const iframeId = `div#${parentId} iframe`;
        const localStorageKey = `Camera${ordinal}Index`;

        let cameraIndex = localStorage.getItem(localStorageKey);
        let i = Math.floor(cameraIndex === null ? Number(ordinal) - 1 : Number(cameraIndex));
        if (i < 0) {
            i = 0;
        } else if (i >= viewPoint.length) {
            i = viewPoint.length - 1;
        }
        elm.value = i;

        elm.classList.remove('hidden');

        elm.addEventListener('change', function(event)
        {
            let point = viewPoint[elm.value];
            let coordinate = point.coordinate.replace(' ', '');

            localStorage.setItem(localStorageKey, elm.value);

            document.querySelector(titleId).innerText = point.name;
            document.querySelector(linkId).innerText = convertCoordinates(coordinate);
            document.querySelector(linkId).href = `https://www.google.com/maps/place/${coordinate}`;
            console.log(iframeId);
            document.querySelector(iframeId).src = `https://www.youtube.com/embed/${point.videoId}?autoplay=1&mute=1`;
            document.querySelector(iframeId).title = point.title;
        });
    });
}

function convertDecimalToDMS(decimal)
{
    const sign = decimal >= 0 ? 1 : -1;

    const absNumber = Math.abs(decimal);
    let degree = Math.floor(absNumber);

    const rawMinute = (absNumber - degree) * 60;
    let minute = Math.floor(rawMinute);

    let second = Math.round((rawMinute - minute) * 60 * 10) / 10;

    if (second >= 60) {
        second = 0;
        minute += 1;
    }
    if (minute >= 60) {
        minute = 0;
        degree += 1;
    }
    degree *= sign;

    return {
        "degree": degree,
        "minute": minute,
        "second": second
    };
}

function convertCoordinates(coordinatesString)
{
    const [latitude, longitude] = coordinatesString.split(/, */).map(Number);
    const [objLat, objLong] = [latitude, longitude].map(decimal => convertDecimalToDMS(decimal));

    let latMark, longMark;

    if (objLat.degree >= 0) {
        latMark = 'N';
    } else {
        latMark = 'S';
        objLat.degree *= -1;
    }

    if (objLong.degree >= 0) {
        longMark = 'E';
    } else {
        longMark = 'W';
        objLong.degree *= -1;
    }

    let latDegree = String(objLat.degree);
    let latMinute = (objLat.minute < 10 ? '0' : '') + String(objLat.minute);
    let latSecond = (objLat.second < 10 ? '0' : '') + String(objLat.second);

    let longDegree = String(objLong.degree);
    let longMinute = (objLong.minute < 10 ? '0' : '') + String(objLong.minute);
    let longSecond = (objLong.second < 10 ? '0' : '') + String(objLong.second);

    return `${latDegree}°${latMinute}'${latSecond}"${latMark}, ` +
            `${longDegree}°${longMinute}'${longSecond}"${longMark}`;
}

getViewPoints().then(data => {
    initCamera();
    return 'Init Camera Done.';
})
.then(echo => {
    initCameraSwitcher();
    return 'Init Camera Switcher Done.';
})
.then(echo => {
    // console.log(echo);
});
