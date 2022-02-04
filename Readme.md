# Kaplan AR Books

Instructions about 3D models management.

# Requirements

- **Android**: no problems about Android version; have to check what a "minimum" power might need for good performances. Probably phones of latest 6 years work good. Tested on Huawei P20.
Suggested browser: Chrome

- **iOS**: works great from iPhone 8 and later (tested iPhone 8 and iPhone 11)
Suggested browser: Safari as preferred. Chrome works only on iOS 14 and later.

# How to set up models for the AR

Inside the `models` folder, please insert a new folder named as `model<value>` where "value" is the reference to the marker,
used inside the `ar.html` file.

For example:

```html
<a-marker type="barcode" marker-react value="61" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;"
    smooth="true"
    smoothCount="10"
    smoothTolerance=".01"
    smoothThreshold="5">
    <a-entity model-resizer class="clickable" animation-mixer></a-entity>
</a-marker>
```

For this model, `61` is the value. We have to create inside `models` a folder named `model61`: inside this one, we should insert the 3D model in .glb format with name `scene.glb`.


# How to create a .glb model from a .gltf file

It is possible to do the conversion with modeling software like Rhino, Maya, Blender, but also with a command <a href="https://github.com/CesiumGS/gltf-pipeline">script</a>.

```sh
npm install -g gltf-pipeline
```

```sh
gltf-pipeline -i model.gltf -o model.glb
```

where "model.gltf" is the path of the .gltf file to convert and "model.glb" is the output file name.
