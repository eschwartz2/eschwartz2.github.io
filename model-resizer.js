AFRAME.registerComponent('model-resizer', {
    dependencies: ['gltf-model'],
    schema: {
        target: { default: '' },
    },
    init: function() {
        this.assetParam = {
            scale: 1.0,
            size: {
                width: 1.0,
                height: 1.0,
                depth: 1.0,
            },
        };

        this.target = this.data.target ? document.querySelector(this.data.target) : document.body;

        // hook used to resize only after model has been loaded
        this.el.addEventListener('model-start-resize', () => {
            this.el.removeEventListener('model-start-resize', arguments.callee);

            try {
                var model = this.el.object3D;
                var box = new THREE.Box3().setFromObject(model);

                this.assetParam.scale = 1;
                this.assetParam.size = {
                    width: box.max.x - box.min.x,
                    height: box.max.y - box.min.y,
                    depth: box.max.z - box.min.z,
                };

                var max = Math.max(box.max.x, box.max.y, box.max.z);

                if (!isNaN(max) && max !== Infinity && max > 0.1) {
                    this.currScale = 2 / max; // 2 is according the experience, need to be confirmed;
                    this.minScale = 0.1 * this.currScale;
                    this.maxScale = 3 * this.currScale;
                    this.scaleStep = this.minScale;
                    this.assetParam.scale = this.currScale;

                    this.el.setAttribute('scale', `${this.currScale} ${this.currScale} ${this.currScale}`);
                    this.el.setAttribute('original-scale', this.currScale);
                }

                this.el.setAttribute('model-loaded', true);

                const loader = document.querySelector('.model-loader-container');
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
