/* eslint-disable indent */
/* eslint-disable linebreak-style */
import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import { Column, TextSprite, TextButton, Row } from 'phaser-ui-tools';

import { GameManager } from "./GameManager";
import { ElectricityMapObject, IndustrialBuildingMapObject, IndustrialZoneMapObject, MarketBuildingMapObject, MarketZoneMapObject, ResidentialBuildingMapObject, ResidentialZoneMapObject, RoadMapObject, WaterMapObject } from "./map";

var textStyle = { 'fill': '#FFF', 'font': '16px Courier New' };

class IsoInteractionExample extends Scene {

    constructor() {
        const sceneConfig = {
            key: 'IsoInteractionExample',
            mapAdd: { isoPlugin: 'iso' }
        };


        super(sceneConfig);

        this._gameManager = new GameManager();
        // console.log(this._gameManager);
        this.alert;
        this.isAlertOn = false;
        this.isOver = false;
    }



    preload() {
        var assetRoot = './../dist/assets/';
        this.load.image('tile', assetRoot + 'tile.png');
        this.load.image('header', assetRoot + 'header.png');
        this.load.image('empty', '../dist/assets/empty.png');
        this.load.image('road', '../dist/assets/road.png');
        this.load.image('water', '../dist/assets/water.png');
        this.load.image('electricity', '../dist/assets/electricity.png');
        this.load.image('residentialzone', '../dist/assets/residentialzone.png');
        this.load.image('residentialbuilding', '../dist/assets/residentialbuilding.png');
        this.load.image('marketzone', '../dist/assets/marketzone.png');
        this.load.image('marketbuilding', '../dist/assets/marketbuilding.png');
        this.load.image('industrialzone', '../dist/assets/industrialzone.png');
        this.load.image('industrialbuilding', '../dist/assets/industrialbuilding.png');
        this.load.image('haswater', '../dist/assets/haswater.png');
        this.load.image('haselectricity', '../dist/assets/haselectricity.png');
        this.load.spritesheet('button', assetRoot + 'button.png', { frameWidth: 228, frameHeight: 48 });
        this.load.spritesheet('field', assetRoot + 'button2.png', { frameWidth: 328, frameHeight: 48 });
        this.load.scenePlugin({
            key: 'IsoPlugin',
            url: IsoPlugin,
            sceneKey: 'iso'
        });
    }

    create() {


        this.isoGroup = this.add.group();

        this.iso.projector.origin.setTo(0.5, 0.5);

        this.createMap();
        this.addUi();

        this.cash = new TextSprite(this, 0, 0, 'field').setText('Cash (' + this._gameManager.gameState.cash + ')', textStyle);
        this.residents = new TextSprite(this, 0, 0, 'field').setText('residents' + this._gameManager.gameState.residents, textStyle);
        this.employed = new TextSprite(this, 0, 0, 'field').setText('employed' + this._gameManager.gameState.employed, textStyle);
        this.availableJobs = new TextSprite(this, 0, 0, 'field').setText('availableJobs' + this._gameManager.gameState.availableJobs, textStyle);



        this.addGameBar(false, false);
        this.setTimers();


        this.scale.on('resize', resize, this);

    }

    setTimers() {

        const onGrow = () => {
            this._gameManager.grow();
            this.createMap();
            // console.clear();
            // console.log(this._gameManager);
        };

        const growTimer = this.time.addEvent({
            delay: 1000,                // ms
            callback: onGrow,
            callbackScope: this,
            loop: true
        });

        const onCosts = () => {
            this._gameManager.profits();
            this._gameManager.costs();
            // console.clear();
            console.log(this._gameManager.gameState);
        };

        const onUiUpdate = () => {

            if (!this.isOver) {
                if (this._gameManager.gameState.cash <= 0) {
                    
                    this.isOver = true;

                    this.alert = '';
                    this.alert = this.add.text(750, 400, 'Game Over', { font: '54px Arial', color: 'red' });


                }
                if (this._gameManager.gameState.expectedProfits <= this._gameManager.costsVal) {
                    this.addGameBar(true, true);
                    return;
                }

                this.addGameBar(false, true);
            }
        };


        const costsTimer = this.time.addEvent({
            delay: 10000,                // ms
            callback: onCosts,
            callbackScope: this,
            loop: true
        });

        const uiTimer = this.time.addEvent({
            delay: 500,                // ms
            callback: onUiUpdate,
            callbackScope: this,
            loop: true
        });

    }

    createMap() {
        this.isoGroup.clear(true, true);
        // this.iconLayer.clear(true, true);

        const tileSize = 42;

        let xOffset = 0;
        let yOffset = 0;

        for (let x = 0; x < this._gameManager.map.length; x++) {
            for (let y = 0; y < this._gameManager.map.length; y++) {

                const mapObject = this._gameManager.getMapObjectAt(x, y);

                const tile = this.add.isoSprite(xOffset, yOffset, 0, mapObject.image, this.isoGroup);

                let waterTile;
                let electricityTile;

                if (this._gameManager.blockHasWater(x, y)) {
                    waterTile = this.add.isoSprite(xOffset - 10, yOffset + 10, 0, 'haswater', this.isoGroup);
                }

                if (this._gameManager.blockHasElectricity(x, y)) {
                    electricityTile = this.add.isoSprite(xOffset + 10, yOffset + 10, 0, 'haselectricity', this.isoGroup);
                }

                tile.setInteractive();

                tile.on('pointerup', (e) => {
                    console.log(tile);
                    console.log(e);

                    console.log('clicked at tile:', x, y, this._gameManager.getMapObjectAt(x, y));

                    try {
                        this._gameManager.tryToPutObjectAt(x, y);
                        console.log('put object at tile:', x, y, this._gameManager.getMapObjectAt(x, y));
                        this.createMap();
                        if (this.isAlertOn) this.alert.text = '';
                        //console.log(this.alert);
                    } catch (e) {
                        console.error(e);
                        //this.alert = new TextSprite(this, 900, 350, 'field').setText('e', textStyle);
                        if (!this.isOver) {
                            if (this.isAlertOn) {
                                this.alert.text = '';
                            }
                            this.alert = this.add.text(750, 400, e, { font: '54px Arial' });
                            this.isAlertOn = true;
                        }
                    }

                });

                tile.on('pointerover', (e) => {
                    // this.setTint(0x86bfda);
                    tile.isoZ += 5;
                    if (waterTile) waterTile.isoZ += 5;
                    if (electricityTile) electricityTile.isoZ += 5;
                });

                tile.on('pointerout', (e) => {
                    tile.isoZ -= 5;
                    if (waterTile) waterTile.isoZ -= 5;
                    if (electricityTile) electricityTile.isoZ -= 5;
                });

                yOffset += tileSize;
            }

            xOffset += tileSize;
            yOffset = 0;
        }
    }

    addUi() {

        this.header = new TextSprite(this, 0, 9, 'header').setText('SimCityPAW', textStyle).setOrigin(0.0, 0.1);

        var road = new TextButton(this, 0, 0, 'button', () => { selectZoneHandler('Road', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Road', textStyle)
            .eventTextYAdjustment(3);
        var residentialZone = new TextButton(this, 0, 0, 'button', () => { selectZoneHandler('Residential Zone', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Residential Zone', textStyle)
            .eventTextYAdjustment(3);
        var marketZone = new TextButton(this, 0, 0, 'button', () => { selectZoneHandler('Market Zone', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Market Zone', textStyle)
            .eventTextYAdjustment(3);
        var industrialZone = new TextButton(this, 0, 0, 'button', () => { selectZoneHandler('Industrial Zone', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Industrial Zone', textStyle)
            .eventTextYAdjustment(3);
        var water = new TextButton(this, 0, 0, 'button', () => { selectZoneHandler('Water', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Water', textStyle)
            .eventTextYAdjustment(3);
        var electricity = new TextButton(this, 0, 0, 'button', () => { selectZoneHandler('Electricity', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Electricity', textStyle)
            .eventTextYAdjustment(3);
        var column = new Column(this, 190, 100);
        column.addNode(road, 0, 5);
        column.addNode(residentialZone, 0, 5);
        column.addNode(marketZone, 0, 5);
        column.addNode(industrialZone, 0, 5);
        column.addNode(water, 0, 5);
        column.addNode(electricity, 0, 5);
    }

    addGameBar(isDeficit, isUpdated) {

        let sign;
        let cash = this._gameManager.gameState.cash;
        isDeficit ? sign = '-' : sign = '+';

        if (cash < 0) {
            cash = cash * -1;
        }


        if (isUpdated) {

            this.cash.text.setText('Cash (' + sign + cash + ')', textStyle);
            this.residents.text.setText('residents:' + this._gameManager.gameState.residents, textStyle);
            this.employed.text.setText('employed:' + this._gameManager.gameState.employed, textStyle);
            this.availableJobs.text.setText('availableJobs:' + this._gameManager.gameState.availableJobs, textStyle);

        }


        var row = new Row(this, 800, 30);

        row.addNode(this.cash, 55, 0);
        row.addNode(this.residents, 55, 0);
        row.addNode(this.employed, 55, 0);
        row.addNode(this.availableJobs, 55, 0);

    }

}

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: 1800,
        height: 1100
    },
    pixelArt: true,
    scene: IsoInteractionExample
};

function resize(gameSize) {
    var width = gameSize.width;
    var height = gameSize.height;

    this.cameras.resize(width, height);
}

const selectZoneHandler = (type, header, _gameManager) => {
    header.setText('Choosed ' + type).setOrigin(0.0, 0.1);

    switch (type) {
        case 'Road':
            _gameManager.setCurrentBlock(new RoadMapObject());
            break;

        case 'Residential Zone':
            _gameManager.setCurrentBlock(new ResidentialZoneMapObject());
            break;

        case 'Market Zone':
            _gameManager.setCurrentBlock(new MarketZoneMapObject());
            break;

        case 'Industrial Zone':
            _gameManager.setCurrentBlock(new IndustrialZoneMapObject());
            break;

        case 'Water':
            _gameManager.setCurrentBlock(new WaterMapObject());
            break;

        case 'Electricity':
            _gameManager.setCurrentBlock(new ElectricityMapObject());
            break;
    }
};

const game = new Game(config);
