# rects-bin-pack [![npm][npm-image]][npm-url] [![runkit][runkit-image]][runkit-url]
MaxRects Algorithm JavaScript implementation

### demo
* [demo](https://06wj.github.io/MaxRectsBinPack/demo/test.html)

### usage
* init bin pack
    ```
    /**
    * MaxRectanglesBinPack
    * @param {Number} width The container width
    * @param {Number} height The container height
    * @param {Boolean} [allowRotate=false] Whether to allow rotate the rects
    */
    const pack = new MaxRectsBinPack.MaxRectsBinPack(512, 256, false);
    ```
* add rectangles
    ```
    const rectangles = [{
        width: 20,
        height: 100,
        id: '1'
    }, {
        width: 200,
        height: 70,
        id: '2'
    }, {
        width: 30,
        height: 70,
        id: '3'
    }];
    /**
     * Insert a set of rectangles
     * @param  {Rect[]} rectangles The set of rects, allow custum property
     * @param  {Number} method The pack rule, allow value is BestShortSideFit, BestLongSideFit, BestAreaFit, BottomLeftRule, ContactPointRule
     * @return {Rect[]} The result of bin pack.
     */
    const result = pack.insert2(rectangles, MaxRectsBinPack.BestShortSideFit)
    ```

### Dev
* run `npm install` to install dependencies
* run `npm run dev` to watch and develop
* run `npm run build` to build

### License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-image]: https://img.shields.io/npm/v/rects-bin-pack.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rects-bin-pack
[runkit-image]: https://badge.runkitcdn.com/rects-bin-pack.svg
[runkit-url]: https://npm.runkit.com/rects-bin-pack