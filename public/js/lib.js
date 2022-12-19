const renderMarker = (datum, scene) => {
    const marker = document.createElement('a-marker');
    marker.setAttribute('type', 'barcode');
    marker.setAttribute('marker-react', true);
    marker.setAttribute('value', datum.id);
    marker.setAttribute('raycaster', 'objects: .clickable');
    marker.setAttribute('cursor', 'fuse: false; rayOrigin: mouse;');
    marker.setAttribute('emitevents', true);
    marker.setAttribute('smooth', true);
    marker.setAttribute('smoothCount', 10);
    marker.setAttribute('smoothTolerance', 0.01);
    marker.setAttribute('smoothThreshold', 5);
    marker.setAttribute('filename', datum.filename);

    const entity = document.createElement('a-entity');
    entity.setAttribute('model-resizer', true);
    entity.setAttribute('animation-mixer', {timeScale: 1});

    entity.classList.add('clickable');

    marker.appendChild(entity);

    if (datum.title) {
        const title = document.createElement('div');
        title.classList.add('model-title');
        title.innerText = datum.title;
        marker.appendChild(title);
    }

    if (datum.description) {
        const desc = document.createElement('div');
        desc.classList.add('model-description');
        desc.innerText = datum.description;
        marker.appendChild(desc);
    }

    scene.prepend(marker);
};

const init = () => {
    if (!window.data || !window.data.length) {
        console.error('No data found');
        return;
    }

    const scene = document.querySelector('a-scene');
    window.data.forEach((element) => renderMarker(element, scene));
};


window.onload = () => {
    fetch('./list.json')
        .then(response => response.json())
        .then((data) => {
            window.data = data;
            init();
        });
};

window.IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !('MSStream' in window);

window.IS_ANDROID = /(android)/i.test(window.navigator.userAgent);

window.cameraiOSInstructions = `
    You need to allow camera access to use Augmented Reality.
    Please, click on "RESTART" and try again.
`;

window.cameraAndroidInstructions = `
    You need to allow camera access to use Augmented Reality. Please, follow these steps:
    reset your settings for this website using the button on the left corner of
    your Browser address bar,
    then click on "Permissions" and "Reset permissions".
    Then, click on "RESTART" to try again.
`;
