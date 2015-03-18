# MaxRectsBinPack
maxRects算法js实现

# demo
* [demo](http://06wj.github.io/MaxRectsBinPack/demo/test.html)

# usage
* MaxRectsBinPack(textureWidth, textureHeight, allowRotate)

    ```
    /**
    * MaxRectanglesBinPack
    * @param {Number} width 容器宽度
    * @param {Number} height 容器高度
    * @param {Boolean} allowRotate 是否允许旋转
    */
    ```
* insert(width, height, method)

    ```
    /**
     * insert a new rect
     * @param  {Number} width  矩形宽
     * @param  {Number} height 矩形高
     * @param  {Number} method 分配方法 0~4
     * @return {Rect} 插入后矩形信息
     */
    ```
* insert2(rectangles, method)

    ```
     /**
     * 插入一组矩形
     * @param  {Array} rectangles 矩形数组
     * @param  {Number} method 分配方法 0~4
     * @return {Array} 成功插入的数组
     */
```


