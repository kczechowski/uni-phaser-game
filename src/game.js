/* eslint-disable linebreak-style */
import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import { Column, TextSprite, TextButton } from 'phaser-ui-tools';
import { GameManager } from './GameManager';



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

    const tileSize = 38;

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

  addUi() {
    var textStyle = { 'fill': '#FFF', 'font': '16px Courier New' };
    this.header = new TextSprite(this, 0, 0, 'header').setText('SimCityPAW', textStyle).setOrigin(0.0, 0.0);

    var road = new TextButton(this, 0, 0, 'button', null, this, 1, 0, 2, 1)
      .setText('Road', textStyle)
      .eventTextYAdjustment(3);
    var buliding1 = new TextButton(this, 0, 0, 'button', null, this, 1, 0, 2, 1)
      .setText('bd', textStyle)
      .eventTextYAdjustment(3);
    var building2 = new TextButton(this, 0, 0, 'button', null, this, 1, 0, 2, 1)
      .setText('bd1', textStyle)
      .eventTextYAdjustment(3);
    var building3 = new TextButton(this, 0, 0, 'button', null, this, 1, 0, 2, 1)
      .setText('bd2', textStyle)
      .eventTextYAdjustment(3);
    var building4 = new TextButton(this, 0, 0, 'button', null, this, 1, 0, 2, 1)
      .setText('bd3', textStyle)
      .eventTextYAdjustment(3);

    var column = new Column(this, 190, 100);
    column.addNode(road, 0, 5);
    column.addNode(buliding1, 0, 5);
    column.addNode(building2, 0, 5);
    column.addNode(building3, 0, 5);
    column.addNode(building4, 0, 5);
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



const game = new Game(config);
