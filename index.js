AFRAME.registerComponent('marker-react', {
    init: function() {

        this.el.addEventListener('markerFound', () => {
            if (!window.firstFound) {
                window.firstFound = true;
                document.querySelector('.target-container')?.remove();

                // on Android, we need to fire it when marker is found
                handleReactiveRenderingBug();
            }

            const model = this.el.children[0];

            if (!model.getAttribute('model-loaded')) {
                const loader = document.querySelector('.model-loader-container');
                if (loader) {
                    loader.style.display = 'block';
                }

                const modelCode = this.el.getAttribute('value');
                model.setAttribute('gltf-model', `./models/model${modelCode}/scene.glb`);
            }
        });

        this.el.addEventListener('markerLost', () => {
            const loader = document.querySelector('.model-loader-container');
            if (loader) {
                loader.style.display = 'none';
            }
        });
    }
});

window.addEventListener('arjs-video-loaded', () => {
    // on iOS, we need to fire it as soon as the camera has loaded
    handleReactiveRenderingBug();
})

const handleReactiveRenderingBug = () => {
    // a quanto pare, se non si interagisce ad un certo punto con il canvas (questo "quando"
    // cambia a seconda della piattaforma, vedi commenti) il rendering è laggoso.
    // non si ha questo problema quando si ha un solo modello 3D.
    // non cambia nulla usando o meno gli a-assets, quindi li usiamo per
    // non avere poi un altro lag quando bisogna effettivamente renderizzarli.

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
            touches: [{pageX: window.innerWidth / 2, pageY: window.innerHeight / 2}],
            view: window,
            cancelable: true,
            bubbles: true,
        });
    }

    canvas.dispatchEvent(touchEvent);
};
