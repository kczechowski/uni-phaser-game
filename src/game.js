/* eslint-disable linebreak-style */
import Phaser, { Game, Scene } from 'phaser';
import IsoPlugin from 'phaser3-plugin-isometric';
import { Column, TextSprite, TextButton } from 'phaser-ui-tools';



    



class IsoInteractionExample extends Scene {

  constructor() {
    const sceneConfig = {
      key: 'IsoInteractionExample',
      mapAdd: { isoPlugin: 'iso' }
    };

    

    super(sceneConfig);
  }
  preload() {
    var assetRoot = './../dist/assets/';
    this.load.image('tile', assetRoot + 'tile.png');
    this.load.image('header', assetRoot + 'header.png');
    this.load.spritesheet('button', assetRoot + 'button.png', { frameWidth: 128, frameHeight: 48 });
    this.load.scenePlugin({
      key: 'IsoPlugin',
      url: IsoPlugin,
      sceneKey: 'iso'
    });
  }

  create() {

    console.log(this);
    this.isoGroup = this.add.group();

    this.iso.projector.origin.setTo(0.5, 0.3);

    // Add some tiles to our scene
    this.spawnTiles();
    this.addUi();

    
  }

  spawnTiles() {
    var tile;

    for (var xx = 0; xx < 256; xx += 38) {
      for (var yy = 0; yy < 256; yy += 38) {
        tile = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        tile.setInteractive();

        tile.on('pointerover', function () {
          this.setTint(0x86bfda);
          this.isoZ += 5;
        });

        tile.on('pointerout', function () {
          this.clearTint();
          this.isoZ -= 5;
        });
      }
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
      
    var column = new Column(this, 190 ,100);
    column.addNode(road, 0, 5);
    column.addNode(buliding1, 0, 5);
    column.addNode(building2, 0, 5);
    column.addNode(building3, 0, 5);
    column.addNode(building4, 0, 5);
  }
      
}

let config = {
  type: Phaser.AUTO,
  width: 1800,
  height: 1100,
  pixelArt: true,
  scene: IsoInteractionExample
};

const game = new Game(config);
