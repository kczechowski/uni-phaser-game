import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import {GameManager} from "./GameManager";

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
        this.load.image('tile', '../dist/assets/tile.png');
        this.load.image('empty', '../dist/assets/empty.png');
        this.load.image('road', '../dist/assets/road.png');
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
    }

    createMap() {

        this.isoGroup.clear(true, true);

        const tileSize = 38;

        let xOffset = 0;
        let yOffset = 0;

        for(let x = 0; x < this._gameManager.map.length; x++) {
            for(let y = 0; y < this._gameManager.map.length; y++) {

                const mapObject = this._gameManager.getMapObjectAt(x, y);
                // console.log(mapObject);

                const tile = this.add.isoSprite(xOffset, yOffset, 0, mapObject.image, this.isoGroup);
                tile.setInteractive();

                tile.on('pointerup', (e) => {
                    console.log(tile);
                    console.log(e);

                    console.log('clicked at tile:', x, y, this._gameManager.getMapObjectAt(x, y));

                    this._gameManager.putRoadAt(x, y);

                    console.log('put road at tile:', x, y, this._gameManager.getMapObjectAt(x, y));
                    this.createMap();
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

}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: IsoInteractionExample
};

new Game(config);
