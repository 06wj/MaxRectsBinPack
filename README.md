# rects-bin-pack [![npm][npm-image]][npm-url]
MaxRects Algorithm JavaScript implementation

### demo
* [demo](https://06wj.github.io/MaxRectsBinPack/demo/test.html)

### usage
* init pack
    ```
    /**
    * MaxRectanglesBinPack
    * @param {Number} width container width
    * @param {Number} height container height
    * @param {Boolean} allowRotate whether allowRotate
    */
    const pack = new MaxRectsBinPack.MaxRectsBinPack(512, 512, false);
    ```
* add rects
    ```
    const rects = [{width:1, height:2}, {width:2, height:3}, {width:10, height:2}];
    /**
     * Insert a set of rectangles
     * @param  {Rect[]} rects a set of rects
     * @param  {Number} method the pack rule, allow value is BestShortSideFit, BestLongSideFit, BestAreaFit, BottomLeftRule, ContactPointRule
     * @return {Rect[]} The result of bin pack.
     */
    const result = pack.insert2(rects, MaxRectsBinPack.BestShortSideFit)
    ```

### Dev
* run `npm install` to install dependencies
* run `npm run dev` to watch and develop
* run `npm run build` to build

### License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-image]: https://img.shields.io/npm/v/rects-bin-pack.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rects-bin-pack