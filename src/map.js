const MapObject = class {

    constructor(type, image) {

        this.type = type;
        this.image = image;

    }

}

export const EmptyMapObject = class extends MapObject {


    constructor() {
        super('empty', 'empty');
    }

}

export const RoadMapObject = class extends MapObject {


    constructor() {
        super('road', 'road');
    }

}