AFRAME.registerComponent('model-resizer', {
    dependencies: ['gltf-model'],
    schema: {
        target: { default: '' },
    },
    init: function() {
        this.scale = 1.0;

        this.target = this.data.target ? document.querySelector(this.data.target) : document.body;

        // hook used to resize only after model has been loaded
        this.el.addEventListener('model-start-resize', () => {
            this.el.removeEventListener('model-start-resize', arguments.callee);

            try {
                var model = this.el.object3D;
                this.scale = 1.0;
                const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());

                // radius and theta values are based on current camera parameters.
                // If you change the camera parameters, you need to change these values
                const radius = 3;
                const theta = 45 / 2 / 180 * Math.PI;

                const aspect = Math.min(this.target.offsetWidth - 20, this.target.offsetHeight - 20) / this.target.offsetHeight;
                this.currScale = aspect * radius * Math.sin(theta) / sphere.radius;

                this.minScale = 0.1 * this.currScale;
                this.maxScale = 3 * this.currScale;
                this.scaleStep = this.minScale;
                this.scale = this.currScale;

                this.el.setAttribute('scale', `${this.currScale} ${this.currScale} ${this.currScale}`);
                this.el.setAttribute('original-scale', this.currScale);
                this.el.setAttribute('model-loaded', true);

                const isolatedButton = document.querySelector('[data-action="activate-isolated"');
                if (isolatedButton) {
                    isolatedButton.classList.remove('hidden');
                }

                const loader = document.querySelector('.instructions');
                if (loader) {
                    // hide model loading loader
                    loader.style.display = 'none';
                }

                this.el.dispatchEvent(new CustomEvent('model-resized'));
            } catch (error) {
                console.log(error, 'cannot get the size of the model, just let it be');
            }
        });
    },
});
