# Kaplan AR Books

Instructions about 3D models management.

# Requirements

- **Android**: no problems about Android version; have to check what a "minimum" power might need for good performances. Probably phones of latest 6 years work good. Tested on Huawei P20.
Suggested browser: Chrome

- **iOS**: works great from iPhone 8 and later (tested iPhone 8 and iPhone 11)
Suggested browser: Safari as preferred. Chrome works only on iOS 14 and later.

# How to set up models for the AR

Inside the `models` folder, please insert a new folder named as `model<value>` where "value" is the reference to the marker as it is
used on the `ar.html` file.

For example:

```html
<a-marker 
    value="61"
    type="barcode" 
    marker-react 
    raycaster="objects: .clickable" 
    emitevents="true" 
    cursor="fuse: false; rayOrigin: mouse;"
    smooth="true"
    smoothCount="10"
    smoothTolerance=".01"
    smoothThreshold="5">
    <a-entity model-resizer class="clickable" animation-mixer></a-entity>
    
    <div class="model-title">
        Title for the #61 model.
    </div>

    <div class="model-description">
        Long text description for the #61 model.
    </div>
</a-marker>

<a-marker 
    value="62"
    type="barcode" 
    marker-react 
    raycaster="objects: .clickable" 
    emitevents="true" 
    cursor="fuse: false; rayOrigin: mouse;"
    smooth="true"
    smoothCount="10"
    smoothTolerance=".01"
    smoothThreshold="5">
    <a-entity model-resizer class="clickable" animation-mixer></a-entity>
    
    <div class="model-title">
        Title for the #62 model.
    </div>

    <div class="model-description">
        Long text description for the #62 model.
    </div>
</a-marker>

etc. etc.
```

For example: for the first model, `61` is the value. We have to create a `model61` folder inside the `models` folder. On `model61` we should insert the 3D model in .glb format with name `scene.glb`.

## How to add the info text for the models

Inside the `<a-marker>` HTML tag, it is possible to add two HTML `div` elements, one to show the resource title and the other for the resource description. If at least one of the two is available, the "information" button is shown and the user can click on it to activate the resource information page.

See on the examples above on how to add those information for a model just modifying the `ar.html` file.

# How to create a .glb model from a .gltf file

It is possible to do the conversion with modeling software like Rhino, Maya, Blender, but also with a <a href="https://github.com/CesiumGS/gltf-pipeline">script command</a>.

```sh
npm install -g gltf-pipeline
```

```sh
gltf-pipeline -i model.gltf -o model.glb
```

where "model.gltf" is the path of the .gltf file to convert and "model.glb" is the output file name.
