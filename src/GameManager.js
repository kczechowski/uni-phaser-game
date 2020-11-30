import { GameState } from "./GameState";
import {
    EmptyMapObject,
    IndustrialBuildingMapObject,
    MarketBuildingMapObject,
    ResidentialBuildingMapObject,
    RoadMapObject
} from "./map";

export class GameManager {


    constructor() {

        this._gameState = new GameState();
        this._map = this.createEmptyMap(8, 8);

        this.costsVal;

    }

    createAndFillTwoDArray(rows, columns, defaultValue) {
        return Array.from({ length: rows }, () => (
            Array.from({ length: columns }, () => defaultValue)
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

        const blocks = [];

        for (let x = offsetStartX; x <= offsetStopX; x++) {
            for (let y = offsetStartY; y <= offsetStopY; y++) {

                blocks.push(this.getMapObjectAt(x, y));
            }
        }

        return blocks;
    }

    blockHasWater(tileX, tileY) {
        const blocks = this.getBlockArea(tileX, tileY, 3);

        return blocks.filter(b => b.type === 'water').length > 0;
    }


    blockHasElectricity(tileX, tileY) {
        const blocks = this.getBlockArea(tileX, tileY, 3);

        return blocks.filter(b => b.type === 'electricity').length > 0;
    }


    blockHasRoad(tileX, tileY) {
        const blocks = this.getBlockArea(tileX, tileY, 1);

        return blocks.filter(b => b.type === 'road').length > 0;
    }

    jobBuildings() {
        const jobBuildings = [];

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map.length; y++) {

                const mapObject = this.getMapObjectAt(x, y);
                if (mapObject.type === 'industrialbuilding' || mapObject.type === 'marketbuilding') {
                    jobBuildings.push(mapObject);
                }
            }
        }

        return jobBuildings;
    }

    availableJobs() {

        const places = this.jobBuildings().length * 20;

        this.gameState.availableJobs = places - this.gameState.employed;

        return places - this.gameState.employed;
    }

    grow() {
        this.growResidentials();
        this.growMarkets();

        console.log('available jobs', this.availableJobs());
    }

    growResidentials() {

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map.length; y++) {

                const mapObject = this.getMapObjectAt(x, y);

                if (mapObject.type === 'residentialzone' && this.availableJobs() > 0 && this.blockHasWater(x, y) && this.blockHasElectricity(x, y) && this.blockHasRoad(x, y)) {
                    this.replaceMapObjectAt(x, y, new ResidentialBuildingMapObject());
                    this.gameState.residents += 10;
                }
            }
        }

        const unemployed = (this.gameState.residents - this.gameState.employed);

        console.log('unemployed', unemployed);

        if (this.availableJobs() > 0 && this.gameState.residents > 0) {
            this.gameState.employed += unemployed;
            if (this.gameState.employed > this.gameState.residents) this.gameState.employed = this.gameState.residents;
        }
    }

    growMarkets() {

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map.length; y++) {

                const mapObject = this.getMapObjectAt(x, y);

                if ((this.availableJobs() <= 0 || this.availableJobs() < 40) && this.blockHasWater(x, y) && this.blockHasElectricity(x, y) && this.blockHasRoad(x, y)) {
                    if (mapObject.type === 'marketzone')
                        this.replaceMapObjectAt(x, y, new MarketBuildingMapObject());
                    else if (mapObject.type === 'industrialzone')
                        this.replaceMapObjectAt(x, y, new IndustrialBuildingMapObject());
                }
            }
        }
    }

    costs() {
        const costs = this.calculateCosts();
        // let tmp = this.gameState.cash - costs;
        // this.gameState.cash = tmp.toFixed(2);
        console.log('costs: ', costs);

        this.costsVal = costs;

    }

    calculateCosts() {
        const blocksWithCosts = [];

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map.length; y++) {

                const mapObject = this.getMapObjectAt(x, y);
                if (mapObject.hasOwnProperty('cost')) blocksWithCosts.push(mapObject);
            }
        }

        let costs = 0;
        blocksWithCosts.forEach(b => {
            costs += b.cost;
        });

        return costs;
    }

    profits() {
        const profits = this.calculateExpectedProfits();
        const expectedCosts = this.calculateCosts();
        console.log(expectedCosts);
        this.gameState.expectedProfits = profits - expectedCosts;

        this.gameState.cash += this.gameState.expectedProfits;

        console.log('profits: ', profits);
    }

    calculateExpectedProfits() {

        const employed = this.gameState.employed;

        //every employed gives 2 cash
        return employed * 2;
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