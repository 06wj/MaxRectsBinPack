const rectsBinPack = require("rects-bin-pack")
const MaxRectsBinPack = rectsBinPack.MaxRectsBinPack;
const pack = new MaxRectsBinPack(512, 256, false);
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
const result = pack.insert2(rectangles, rectsBinPack.BestShortSideFit);
console.log(result);