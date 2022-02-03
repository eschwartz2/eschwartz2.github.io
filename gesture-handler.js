AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: true },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 10 },
  },

  init: function() {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.currentMarker = null;
    this.scaleFactor = 1;
    this.scene = this.el;

    this.scene.addEventListener("markerFound", (e) => {
        const marker = e.target;

        if (this.currentMarker && this.currentMarker.getAttribute('value') === marker.getAttribute('value')) {
            // same marker, already loaded, do nothing
            return;
        }

        this.currentMarker = marker;
        this.currentModel = this.currentMarker.children[0];

        // different marker than current, model not loaded
        if (!this.currentModel.getAttribute('model-loaded')) {
            const loader = document.querySelector('.model-loader-container');
            if (loader) {
                // show model loading loader
                loader.style.display = 'block';
            }

            const loadedListener = () => {
                this.currentModel.dispatchEvent(new CustomEvent('model-start-resize'));
            };

            const resizedListener = () => {
                // set scale according to original-scale to properly resize current model
                this.initialScale = this.currentModel.getAttribute('original-scale') || 1;
            };

            this.currentModel.addEventListener('model-loaded', loadedListener);
            this.currentModel.addEventListener('model-resized', resizedListener);
        } else {
            // model loaded, use his original scale to start
            this.initialScale = this.currentModel.getAttribute('original-scale') || 1;
        }
    });
  },

  update: function() {
    if (this.data.enabled) {
      this.scene.addEventListener("onefingermove", this.handleRotation);
      this.scene.addEventListener("twofingermove", this.handleScale);
    } else {
      this.scene.removeEventListener("onefingermove", this.handleRotation);
      this.scene.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function() {
    this.scene.removeEventListener("onefingermove", this.handleRotation);
    this.scene.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function(event) {
    if (this.currentMarker && this.currentModel) {
      this.currentModel.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.currentModel.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;
    }
  },

  handleScale: function(event) {
    if (this.currentMarker && this.currentModel) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.currentModel.object3D.scale.x = this.scaleFactor * this.initialScale;
      this.currentModel.object3D.scale.y = this.scaleFactor * this.initialScale;
      this.currentModel.object3D.scale.z = this.scaleFactor * this.initialScale;
    }
  },
});
