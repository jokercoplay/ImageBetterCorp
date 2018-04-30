# ImageBetterCorp   

An image clip modal based on React

## Install

Using npm:

``` npm install image-better-corp ```

## Example
```
  <ImageBetterCorp
    imageUrl={imageUrl}
    onClose={this.onCloseCropModal}
    onSave={this.onSaveImage}
  />

  onSaveImage = (imageUrl) => {
    console.info(`${imageUrl} is the target image url`)
  }
```
![long](/images/long.png)
![height](/images/height.png)
