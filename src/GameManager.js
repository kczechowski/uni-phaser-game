import {GameState} from "./GameState";
import {EmptyMapObject, RoadMapObject} from "./map";

export class GameManager {


    constructor() {

        this._gameState = new GameState();
        this._map = this.createEmptyMap(8, 8);

    }

    createAndFillTwoDArray(rows, columns, defaultValue) {
        return Array.from({length: rows}, () => (
            Array.from({length: columns}, () => defaultValue)
        ))
    }

    createEmptyMap(rows, columns) {

        const map = this.createAndFillTwoDArray(rows, columns, new EmptyMapObject());

        return map;
    }

    getMapObjectAt(tileX, tileY) {
        return this.map[tileX][tileY];
    }

    replaceMapObjectAt(tileX, tileY, obj) {
        this.map[tileX][tileY] = obj;
    }

    putRoadAt(tileX, tileY) {
        this.replaceMapObjectAt(tileX, tileY, new RoadMapObject())
    }

    tryToPutObjectAt(tileX, tileY) {
        const toAdd = this._gameState.currentBlock;
        if (!toAdd) throw 'No currentBlock';
        //TODO add constraints on building
        if (this.getMapObjectAt(tileX, tileY).constructor.name === toAdd.constructor.name) throw 'Exists the same';

        if (!this.hasEnoughMoney(toAdd)) throw 'Not enough money';

        this._gameState.cash -= toAdd.price;

        this.replaceMapObjectAt(tileX, tileY, toAdd);
    }

    hasEnoughMoney(mapObject) {
        return this._gameState.cash - mapObject.price >= 0;
    }

    getBlockArea(tileX, tileY, area) {

        let offsetStartX = (tileX - area) < 0 ? 0 : (tileX - area);
        let offsetStartY = (tileY - area) < 0 ? 0 : (tileY - area);

        let offsetStopX = (tileX + area) >= this._map.length ? this._map.length - 1 : (tileX + area);
        let offsetStopY = (tileY + area) >= this._map.length ? this._map.length - 1 : (tileY + area);
    }

    blockHasWater(tileX, tileY) {

    }

    grow() {
        // console.log('grow');
    }

    costs() {
        const blocksWithCosts = [];

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map.length; y++) {

                const mapObject = this.getMapObjectAt(x, y);
                if (mapObject.hasOwnProperty('cost')) blocksWithCosts.push(mapObject);
            }
        }

        let costs = 0;
        blocksWithCosts.forEach(b => {
            this.gameState.cash = Math.floor(this.gameState.cash - b.cost);
            costs += b.cost;
        });

        console.log('costs ' + costs);
    }

    setCurrentBlock(obj) {
        this._gameState.currentBlock = obj;
    }

    get gameState() {
        return this._gameState;
    }

    get map() {
        return this._map;
    }
}