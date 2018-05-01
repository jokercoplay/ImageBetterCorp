# ImageBetterCorp   
An image clip modal based on React

## Install
Using npm:

  ``` npm install image-better-corp ```

## Use
```
  import ImageBetterCorp from 'image-better-corp'

  <ImageBetterCorp
    imageUrl={imageUrl}
    onClose={this.onCloseCropModal}
    onSave={this.onSaveImage}
  />

  onSaveImage = (imageUrl) => {
    console.info(`${imageUrl} is the target image url`)
  }
```

## Notice
- Please use latest version！
- Will return origin url when image width or height less than 500px
- Only cancel button will trigger onClose callback
- Only has chinese I18n

## Example
![long](/images/width.png)
![height](/images/height.png)
