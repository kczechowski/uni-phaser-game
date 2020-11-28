/* eslint-disable indent */
/* eslint-disable linebreak-style */
import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import { Column, TextSprite, TextButton } from 'phaser-ui-tools';

import { GameManager } from "./GameManager";
import { ElectricityMapObject, IndustrialBuildingMapObject, MarketBuildingMapObject, ResidentialBuildingMapObject, RoadMapObject, WaterMapObject } from "./map";


class IsoInteractionExample extends Scene {

    constructor() {
        const sceneConfig = {
            key: 'IsoInteractionExample',
            mapAdd: { isoPlugin: 'iso' }
        };


        super(sceneConfig);

        this._gameManager = new GameManager();
        console.log(this._gameManager);
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
        this.load.spritesheet('button', assetRoot + 'button.png', { frameWidth: 128, frameHeight: 48 });
        this.load.scenePlugin({
            key: 'IsoPlugin',
            url: IsoPlugin,
            sceneKey: 'iso'
        });
    }

    create() {

        // console.log(this);
        this.isoGroup = this.add.group();

        this.iso.projector.origin.setTo(0.5, 0.5);

        this.createMap();
        this.addUi();


        this.scale.on('resize', resize, this);

    }

    createMap() {
        this.isoGroup.clear(true, true);

        const tileSize = 42;

        let xOffset = 0;
        let yOffset = 0;

        for (let x = 0; x < this._gameManager.map.length; x++) {
            for (let y = 0; y < this._gameManager.map.length; y++) {

                const mapObject = this._gameManager.getMapObjectAt(x, y);
                // console.log(mapObject);

                const tile = this.add.isoSprite(xOffset, yOffset, 0, mapObject.image, this.isoGroup);
                tile.setInteractive();

                tile.on('pointerup', (e) => {
                    console.log(tile);
                    console.log(e);

                    console.log('clicked at tile:', x, y, this._gameManager.getMapObjectAt(x, y));

                    try {
                        this._gameManager.setCurrentBlock(new RoadMapObject());
                        this._gameManager.tryToPutObjectAt(x, y);
                        console.log('put object at tile:', x, y, this._gameManager.getMapObjectAt(x, y));
                        this.createMap();
                    } catch (e) {
                        // replace with toast
                        console.error(e);
                    }

                });

                tile.on('pointerover', (e) => {
                    // this.setTint(0x86bfda);
                    tile.isoZ += 5;
                });

                tile.on('pointerout', (e) => {
                    // this.clearTint();
                    tile.isoZ -= 5;
                });

                yOffset += tileSize;
            }

            xOffset += tileSize;
            yOffset = 0;
        }
    }

    addUi() {
        var textStyle = { 'fill': '#FFF', 'font': '16px Courier New' };
        this.header = new TextSprite(this, 0, 0, 'header').setText('SimCityPAW', textStyle).setOrigin(0.0, 0.0);

        var road = new TextButton(this, 0, 0, 'button', () => { selectBuildingHandler('Road', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Road', textStyle)
            .eventTextYAdjustment(3);
        var buliding1 = new TextButton(this, 0, 0, 'button', () => { selectBuildingHandler('Residential Zone', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Residential Zone', textStyle)
            .eventTextYAdjustment(3);
        var building2 = new TextButton(this, 0, 0, 'button', () => { selectBuildingHandler('Market Zone', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Market Zone', textStyle)
            .eventTextYAdjustment(3);
        var building3 = new TextButton(this, 0, 0, 'button', () => { selectBuildingHandler('Industrial Zone', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Industrial Zone', textStyle)
            .eventTextYAdjustment(3);
        var building4 = new TextButton(this, 0, 0, 'button', () => { selectBuildingHandler('Water', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Water', textStyle)
            .eventTextYAdjustment(3);
        var building5 = new TextButton(this, 0, 0, 'button', () => { selectBuildingHandler('Electricity', this.header, this._gameManager); }, this, 1, 0, 2, 1)
            .setText('Electricity', textStyle)
            .eventTextYAdjustment(3);
        var column = new Column(this, 190, 100);
        column.addNode(road, 0, 5);
        column.addNode(buliding1, 0, 5);
        column.addNode(building2, 0, 5);
        column.addNode(building3, 0, 5);
        column.addNode(building4, 0, 5);
        column.addNode(building5, 0, 5);
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

const selectBuildingHandler = (type, header, _gameManager) => {
    header.setText('Choosed ' + type).setOrigin(0.0, 0.0);

    switch (type) {
        case 'Road':
            _gameManager.setCurrentBlock(new RoadMapObject());
            break;

        case 'Residential Zone':
            _gameManager.setCurrentBlock(new ResidentialBuildingMapObject());
            break;

        case 'Market Zone':
            _gameManager.setCurrentBlock(new MarketBuildingMapObject());
            break;

        case 'Industrial Zone':
            _gameManager.setCurrentBlock(new IndustrialBuildingMapObject());
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
