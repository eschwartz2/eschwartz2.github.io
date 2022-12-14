const getDialog = () => {
    return document.querySelector('#dialog');
};

const closeDialog = () => {
    const dialog = getDialog();
    if (dialog) {
        dialog.classList.add('hidden');
    }
};

const openInfoDialog = () => {
    const dialog = getDialog();
    if (!dialog) {
        return;
    }

    dialog.classList.remove('hidden');

    dialog.querySelector('.title').innerText = '';
    dialog.querySelector('.description').innerText = '';

    if (window.activeTitle) {
        dialog.querySelector('.title').innerText = window.activeTitle;
    }

    if (window.activeDescription) {
        dialog.querySelector('.description').innerText = window.activeDescription;
    }

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'info-open',
            marker: window.currentModel.code,
        });
    } else {
        console.debug('dataLayer not found');
    }
};

const openHelpDialog = () => {
    const dialog = getDialog();
    if (!dialog) {
        return;
    }

    dialog.classList.remove('hidden');
    dialog.querySelector('.title').innerText = 'Support';
    dialog.querySelector('.description').innerText = 'Here we can add text or links to give user assistance about this app.';

    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'help-open',
        });
    } else {
        console.debug('dataLayer not found');
    }
};

window.handleReactiveRenderingBug = () => {
    // appearently, if the user does not interact with the canvas, rendering is kinda lagging.
    // this problem does not appear with just one 3D model loaded on the app.
    // this is occuring either using a-assets or not, so we use them to avoid another
    // lag when we actually need to visualize them.

    const canvas = document.querySelector('canvas.a-canvas');
    let touchEvent;

    if (Touch && TouchEvent) {
        // latest Android and iOS devices
        const touch = new Touch({
            identifier: '123',
            target: canvas,
        });

        touchEvent = new TouchEvent('touchstart', {
            touches: [touch],
            view: window,
            cancelable: true,
            bubbles: true,
        });
    } else {
        touchEvent = new TouchEvent('touchstart', {
            touches: [{ pageX: window.innerWidth / 2, pageY: window.innerHeight / 2 }],
            view: window,
            cancelable: true,
            bubbles: true,
        });
    }

    canvas.dispatchEvent(touchEvent);
};


window.addEventListener('load', () => {
    // add buttons listeners

    document.querySelector('button[data-action="activate-info"]')?.addEventListener('click', openInfoDialog);
    document.querySelector('button[data-action="activate-help"]')?.addEventListener('click', openHelpDialog);
    document.querySelector('button[data-action="close-dialog"]')?.addEventListener('click', closeDialog);
});

AFRAME.registerComponent('marker-react', {
    init: function() {
        this.el.addEventListener('markerFound', () => {
            if (window.isolated) {
                return;
            }

            if (!window.firstFound) {
                window.firstFound = true;
                document.querySelector('.target-container')?.remove();

                // on Android, we need to fire it when marker is found
                window.handleReactiveRenderingBug();
            }

            const model = this.el.children[0];
            const isolatedButton = document.querySelector('[data-action="activate-isolated"');

            const modelCode = this.el.getAttribute('value');
            const filename = this.el.getAttribute('filename');
            window.currentModel = {
                src: `./models/model${modelCode}/${filename}`,
                scale: this.el.getAttribute('scale'),
                code: modelCode,
            };

            if (window.dataLayer) {
                window.dataLayer.push({
                    event: 'marker-scan',
                    marker: window.currentModel.code,
                });
            } else {
                console.debug('dataLayer not found');
            }

            const buttonsDiv = document.querySelector('.buttons');

            if (buttonsDiv?.classList.contains('hidden')) {
                buttonsDiv?.classList.remove('hidden');
            }

            // show info button if description OR title are available
            const modelTitle = this.el.querySelector('.model-title');
            const modelDescription = this.el.querySelector('.model-description');

            if (modelTitle || modelDescription) {
                document.querySelector('[data-action="activate-info"')?.classList.remove('hidden');
                window.activeTitle = modelTitle?.innerText;
                window.activeDescription = modelDescription?.innerText;
            }

            if (!model.getAttribute('model-loaded')) {
                const loader = document.querySelector('.instructions');
                if (loader) {
                    loader.style.display = 'flex';
                }

                model.setAttribute('gltf-model', window.currentModel.src);
            } else {
                model.setAttribute('gltf-model', window.currentModel.src);

                if (!isolatedButton) {
                    return;
                }

                buttonsDiv?.classList.remove('hidden');
                isolatedButton.classList.remove('hidden');
            }

            const arjsVideo = document.querySelector('#arjs-video');

            isolatedButton.addEventListener('click', () => {
                const removeIsolatedButton = document.querySelector('[data-action="deactivate-isolated"');
                const arEntities = [...document.querySelectorAll('a-marker[marker-react] a-entity')];
                const scene = document.querySelector('a-scene');

                arjsVideo.style.display = 'none';

                isolatedButton.classList.add('hidden');
                removeIsolatedButton.classList.remove('hidden');

                removeIsolatedButton.addEventListener('click', () => {
                    window.closeIsolated()
                });

                arEntities.forEach((e) => e.setAttribute('visible', false));

                const oldCamera = document.querySelector('#cam');
                oldCamera.setAttribute('camera', 'active: false');

                const newCamera = document.querySelector('#isolated-cam');
                newCamera.setAttribute('camera', 'active: true');

                // manually disable look-controls because setAttribute() does not work properly
                newCamera.components['look-controls'].data.enabled = false;

                const isolated = document.querySelector('#isolated-mode');
                isolated.setAttribute('gltf-model', window.currentModel.src);
                isolated.setAttribute('scale', window.currentModel.scale);
                isolated.setAttribute('visible', true);

                if (window.dataLayer) {
                    window.dataLayer.push({
                        event: 'freeze-mode-start',
                        marker: window.currentModel.code,
                    });
                } else {
                    console.debug('dataLayer not found');
                }

                window.handleReactiveRenderingBug();

                scene.dispatchEvent(new CustomEvent('isolated-start', {
                    detail: {
                        model: isolated,
                    },
                }));
            });
        });

        this.el.addEventListener('markerLost', (ev) => {
            const loader = document.querySelector('.instructions');
            if (loader) {
                loader.style.display = 'none';
            }

            const isolatedButton = document.querySelector('[data-action="activate-isolated"');
            if (!isolatedButton) {
                return;
            }

            if (isolatedButton.classList.contains('hidden')) {
                // we have isolated mode opened, do not hide buttons
                return;
            }

            const lostMarkerCode = ev.target.getAttribute('value');

            if (window.currentModel?.code === lostMarkerCode) {
                // hide buttons only if marker lost is not in favor of another marker
                document.querySelector('.buttons')?.classList.add('hidden');
            }
        });
    }
});

window.addEventListener('arjs-video-loaded', () => {
    // on iOS, we need to fire it as soon as the camera has loaded
    window.handleReactiveRenderingBug();

    document.querySelector('.permissions-dialog-wrapper')?.remove();
    const target = document.querySelector('.target-container');
    if (target) {
        target.style.display = 'flex';
    }

    // window.eraseCookie('camera-denied');
})

window.addEventListener('camera-error', () => {
    const div = document.querySelector('.camera-instructions');
    if (!div) {
        return;
    }

    div.style.display = 'flex';
    div.querySelector('.text').innerText = window.IS_IOS ?
        window.cameraiOSInstructions : window.cameraAndroidInstructions;
})
