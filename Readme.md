# Kaplan AR Books

Instructions about 3D models management.

# Requirements

- **Android**: no problems about Android version; have to check what a "minimum" power might need for good performances. Probably phones of latest 6 years work good. Tested on Huawei P20.
Suggested browser: Chrome

- **iOS**: works great from iPhone 8 and later (tested iPhone 8 and iPhone 11)
Suggested browser: Safari as preferred. Chrome works only on iOS 14 and later.

# How to set up models for the AR

Inside the `models` folder, please insert a new folder named as `model<value>` where "value" is the reference to the marker number.

The app will render only the markers specified on `list.json` file.

For each model, you have to specify the following information:

- id (number): the marker number
- filename (string): the name of the 3D model file
- title (string): the title of the resource (optional)
- description (string): the description of the resource (optional)

`filename` has to match exactly with the name of the 3D model file inside the `model<value>` folder. You have to use the .glb format for the 3D models.

Example:

Say you have a model named `model.glb` inside the `model1` folder. You have to add the following information inside the `list.json` file:

```json
{
  "id": 1,
  "filename": "model.glb",
  "title": "My model title",
  "description": "My model description"
}
```

Title and description will be displayed on the app when the user will scan that marker, and later clicks on the "info" button.
They will be displayed **only if at least one of the two is specified**.

**IMPORTANT**: the `list.json` file has to be a valid JSON file. Please check the syntax before saving the file.
For example:
- no comma at the end of the last element of the array
- on ID, if using a number, no quotes are needed, but if using an alphanumeric or string, quotes are needed

In general, it is better to avoid whitespace on file names (when specifing "filename" on `list.json` file and on the actual file).

# How to create a .glb model from a .gltf file

It is possible to do the conversion with modeling software like Rhino, Maya, Blender, but also with a <a href="https://github.com/CesiumGS/gltf-pipeline">script command</a>.

```sh
npm install -g gltf-pipeline
```

```sh
gltf-pipeline -i model.gltf -o model.glb
```

where "model.gltf" is the path of the .gltf file to convert and "model.glb" is the output file name.

# Technical details about Markers

Markers used on this project are 2D Barcode Matrix marker with following parameteres:
- Border size 0.15 % of marker width
- Dimensions: 4x4
- Error checking and correction type: BCH 13_9_3

For a max number of 512 available markers (value range: 0 - 511).
