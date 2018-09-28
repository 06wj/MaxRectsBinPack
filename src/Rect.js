/**
 * Rect
 */
class Rect {
    /**
     * @constructor
     * @param {Number} [x=0]      矩形坐标x
     * @param {Number} [y=0]      矩形坐标y
     * @param {Number} [width=0]  矩形宽
     * @param {Number} [height=0] 矩形高
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * clone 复制
     * @return {Rect}
     */
    clone() {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    /**
     * isContainedIn
     * @param  {Rect}  rect
     * @return {Boolean}
     */
    isContainedIn(rect) {
        return this.x >= rect.x && this.y >= rect.y
            && this.x + this.width <= rect.x + rect.width
            && this.y + this.height <= rect.y + rect.height;
    }

    /**
     * isContainedIn
     * @param  {Rect}  rectA
     * @param  {Rect}  rectB
     * @return {Boolean}
     */
    static isContainedIn(rectA, rectB) {
        return rectA.isContainedIn(rectB);
    }
}

export default Rect;
