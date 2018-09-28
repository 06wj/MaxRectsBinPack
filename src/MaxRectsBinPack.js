/**
 * Based on the Public Domain MaxRectanglesBinPack.cpp source by Jukka Jylänki
 * https://github.com/juj/RectangleBinPack/
 *
 * Based on C# port by Sven Magnus
 * http://unifycommunity.com/wiki/index.php?title=MaxRectanglesBinPack
 *
 * Based on ActionScript3 by DUZENGQIANG
 * http://www.duzengqiang.com/blog/post/971.html
 *
 * Ported to javascript by 06wj
 * https://github.com/06wj/MaxRectsBinPack
 */
import Rect from './Rect';

const BestShortSideFit = 0; // /< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
const BestLongSideFit = 1; // /< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
const BestAreaFit = 2; // /< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
const BottomLeftRule = 3; // /< -BL: Does the Tetris placement.
const ContactPointRule = 4; // /< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.

/**
 * MaxRectanglesBinPack
 */
class MaxRectsBinPack {
    /**
     * @constructor
     * @param {Number} width The container width
     * @param {Number} height The container height
     * @param {Boolean} [allowRotate=false] Whether to allow rotate the rects
     */
    constructor(width, height, allowRotate = false) {
        this.binWidth = 0;
        this.binHeight = 0;
        this.allowRotate = false;

        this.usedRectangles = [];
        this.freeRectangles = [];

        this.init(width, height, allowRotate);
    }

    /**
     * 初始化
     * @param {Number} width The container width
     * @param {Number} height The container height
     * @param {Boolean} allowRotate Whether to allow rotate the rects
     */
    init(width, height, allowRotate) {
        this.binWidth = width;
        this.binHeight = height;
        this.allowRotate = allowRotate || false;

        this.usedRectangles.length = 0;
        this.freeRectangles.length = 0;
        this.freeRectangles.push(new Rect(0, 0, width, height));
    }

    /**
     * insert a new rect
     * @param  {Number} width  The width of the rect
     * @param  {Number} height The height of the rect
     * @param  {Number} method The pack rule, allow value is BestShortSideFit, BestLongSideFit, BestAreaFit, BottomLeftRule, ContactPointRule
     * @return {Rect}
     */
    insert(width, height, method) {
        let newNode = new Rect();
        const score1 = {
            value: 0
        };

        const score2 = {
            value: 0
        };
        method = method || 0;
        switch (method) {
            case BestShortSideFit:
                newNode = this._findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                break;
            case BottomLeftRule:
                newNode = this._findPositionForNewNodeBottomLeft(width, height, score1, score2);
                break;
            case ContactPointRule:
                newNode = this._findPositionForNewNodeContactPoint(width, height, score1);
                break;
            case BestLongSideFit:
                newNode = this._findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                break;
            case BestAreaFit:
                newNode = this._findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                break;
            default:
                break;
        }

        if (newNode.height === 0) {
            return newNode;
        }

        this._placeRectangle(newNode);
        return newNode;
    }

    /**
     * Insert a set of rectangles
     * @param  {Rect[]} rectangles The set of rects, allow custum property.
     * @param  {Number} method The pack rule, allow value is BestShortSideFit, BestLongSideFit, BestAreaFit, BottomLeftRule, ContactPointRule
     * @return {Rect[]} The result of bin pack.
     */
    insert2(rectangles, method) {
        const res = [];
        while (rectangles.length > 0) {
            let bestScore1 = Infinity;
            let bestScore2 = Infinity;
            let bestRectangleIndex = -1;
            let bestNode = new Rect();

            for (let i = 0; i < rectangles.length; i++) {
                const score1 = {
                    value: 0
                };
                const score2 = {
                    value: 0
                };
                const newNode = this._scoreRectangle(rectangles[i].width, rectangles[i].height, method, score1, score2);

                if (score1.value < bestScore1 || (score1.value === bestScore1 && score2.value < bestScore2)) {
                    bestScore1 = score1.value;
                    bestScore2 = score2.value;
                    bestNode = newNode;
                    bestRectangleIndex = i;
                }
            }

            if (bestRectangleIndex === -1) {
                return res;
            }

            this._placeRectangle(bestNode);
            const rect = rectangles.splice(bestRectangleIndex, 1)[0];
            rect.x = bestNode.x;
            rect.y = bestNode.y;

            res.push(rect);
        }
        return res;
    }

    _placeRectangle(node) {
        let numRectanglesToProcess = this.freeRectangles.length;
        for (let i = 0; i < numRectanglesToProcess; i++) {
            if (this._splitFreeNode(this.freeRectangles[i], node)) {
                this.freeRectangles.splice(i, 1);
                i--;
                numRectanglesToProcess--;
            }
        }

        this._pruneFreeList();
        this.usedRectangles.push(node);
    }

    _scoreRectangle(width, height, method, score1, score2) {
        let newNode = new Rect();
        score1.value = Infinity;
        score2.value = Infinity;
        switch (method) {
            case BestShortSideFit:
                newNode = this._findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                break;
            case BottomLeftRule:
                newNode = this._findPositionForNewNodeBottomLeft(width, height, score1, score2);
                break;
            case ContactPointRule:
                newNode = this._findPositionForNewNodeContactPoint(width, height, score1);
                // todo: reverse
                score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                break;
            case BestLongSideFit:
                newNode = this._findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                break;
            case BestAreaFit:
                newNode = this._findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                break;
            default:
                break;
        }

        // Cannot fit the current Rectangle.
        if (newNode.height === 0) {
            score1.value = Infinity;
            score2.value = Infinity;
        }

        return newNode;
    }

    _occupancy() {
        const usedRectangles = this.usedRectangles;
        let usedSurfaceArea = 0;
        for (let i = 0; i < usedRectangles.length; i++) {
            usedSurfaceArea += usedRectangles[i].width * usedRectangles[i].height;
        }

        return usedSurfaceArea / (this.binWidth * this.binHeight);
    }

    _findPositionForNewNodeBottomLeft(width, height, bestY, bestX) {
        const freeRectangles = this.freeRectangles;
        const bestNode = new Rect();
        // memset(bestNode, 0, sizeof(Rectangle));

        bestY.value = Infinity;
        let rect;
        let topSideY;
        for (let i = 0; i < freeRectangles.length; i++) {
            rect = freeRectangles[i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                topSideY = rect.y + height;
                if (topSideY < bestY.value || (topSideY === bestY.value && rect.x < bestX.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                topSideY = rect.y + width;
                if (topSideY < bestY.value || (topSideY === bestY.value && rect.x < bestX.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
        }
        return bestNode;
    }

    _findPositionForNewNodeBestShortSideFit(width, height, bestShortSideFit, bestLongSideFit) {
        const freeRectangles = this.freeRectangles;
        const bestNode = new Rect();

        bestShortSideFit.value = Infinity;

        let rect;
        let leftoverHoriz;
        let leftoverVert;
        let shortSideFit;
        let longSideFit;

        for (let i = 0; i < freeRectangles.length; i++) {
            rect = freeRectangles[i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);

                if (shortSideFit < bestShortSideFit.value || (shortSideFit === bestShortSideFit.value && longSideFit < bestLongSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
            let flippedLeftoverHoriz;
            let flippedLeftoverVert;
            let flippedShortSideFit;
            let flippedLongSideFit;
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                flippedLeftoverHoriz = Math.abs(rect.width - height);
                flippedLeftoverVert = Math.abs(rect.height - width);
                flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);

                if (flippedShortSideFit < bestShortSideFit.value || (flippedShortSideFit === bestShortSideFit.value && flippedLongSideFit < bestLongSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = flippedShortSideFit;
                    bestLongSideFit.value = flippedLongSideFit;
                }
            }
        }

        return bestNode;
    }

    _findPositionForNewNodeBestLongSideFit(width, height, bestShortSideFit, bestLongSideFit) {
        const freeRectangles = this.freeRectangles;
        const bestNode = new Rect();
        bestLongSideFit.value = Infinity;
        let rect;

        let leftoverHoriz;
        let leftoverVert;
        let shortSideFit;
        let longSideFit;
        for (let i = 0; i < freeRectangles.length; i++) {
            rect = freeRectangles[i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);

                if (longSideFit < bestLongSideFit.value || (longSideFit === bestLongSideFit.value && shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }

            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);

                if (longSideFit < bestLongSideFit.value || (longSideFit === bestLongSideFit.value && shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
        }
        return bestNode;
    }

    _findPositionForNewNodeBestAreaFit(width, height, bestAreaFit, bestShortSideFit) {
        const freeRectangles = this.freeRectangles;
        const bestNode = new Rect();

        bestAreaFit.value = Infinity;

        let rect;

        let leftoverHoriz;
        let leftoverVert;
        let shortSideFit;
        let areaFit;

        for (let i = 0; i < freeRectangles.length; i++) {
            rect = freeRectangles[i];
            areaFit = rect.width * rect.height - width * height;

            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                if (areaFit < bestAreaFit.value || (areaFit === bestAreaFit.value && shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit = areaFit;
                }
            }

            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                if (areaFit < bestAreaFit.value || (areaFit === bestAreaFit.value && shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }
        }
        return bestNode;
    }

    // / Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
    _commonIntervalLength(i1start, i1end, i2start, i2end) {
        if (i1end < i2start || i2end < i1start) {
            return 0;
        }
        return Math.min(i1end, i2end) - Math.max(i1start, i2start);
    }

    _contactPointScoreNode(x, y, width, height) {
        const usedRectangles = this.usedRectangles;
        let score = 0;

        if (x === 0 || x + width === this.binWidth) score += height;
        if (y === 0 || y + height === this.binHeight) score += width;
        let rect;
        for (let i = 0; i < usedRectangles.length; i++) {
            rect = usedRectangles[i];
            if (rect.x === x + width || rect.x + rect.width === x) score += this._commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
            if (rect.y === y + height || rect.y + rect.height === y) score += this._commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
        }
        return score;
    }

    _findPositionForNewNodeContactPoint(width, height, bestContactScore) {
        const freeRectangles = this.freeRectangles;
        const bestNode = new Rect();

        bestContactScore.value = -1;

        let rect;
        let score;
        for (let i = 0; i < freeRectangles.length; i++) {
            rect = freeRectangles[i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                score = this._contactPointScoreNode(rect.x, rect.y, width, height);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestContactScore = score;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                score = this._contactPointScoreNode(rect.x, rect.y, height, width);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestContactScore.value = score;
                }
            }
        }
        return bestNode;
    }

    _splitFreeNode(freeNode, usedNode) {
        const freeRectangles = this.freeRectangles;
        // Test with SAT if the Rectangles even intersect.
        if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x
            || usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y) return false;
        let newNode;
        if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x) {
            // New node at the top side of the used node.
            if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
                newNode = freeNode.clone();
                newNode.height = usedNode.y - newNode.y;
                freeRectangles.push(newNode);
            }

            // New node at the bottom side of the used node.
            if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                newNode = freeNode.clone();
                newNode.y = usedNode.y + usedNode.height;
                newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                freeRectangles.push(newNode);
            }
        }

        if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                newNode = freeNode.clone();
                newNode.width = usedNode.x - newNode.x;
                freeRectangles.push(newNode);
            }

            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                newNode = freeNode.clone();
                newNode.x = usedNode.x + usedNode.width;
                newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                freeRectangles.push(newNode);
            }
        }

        return true;
    }

    _pruneFreeList() {
        const freeRectangles = this.freeRectangles;
        for (let i = 0; i < freeRectangles.length; i++) {
            for (let j = i + 1; j < freeRectangles.length; j++) {
                if (Rect.isContainedIn(freeRectangles[i], freeRectangles[j])) {
                    freeRectangles.splice(i, 1);
                    break;
                }
                if (Rect.isContainedIn(freeRectangles[j], freeRectangles[i])) {
                    freeRectangles.splice(j, 1);
                }
            }
        }
    }
}

export {
    MaxRectsBinPack,
    BestShortSideFit,
    BestLongSideFit,
    BestAreaFit,
    BottomLeftRule,
    ContactPointRule,
    Rect,
};
