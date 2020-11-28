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
        this.replaceMapObjectAt(tileX, tileY, toAdd);
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