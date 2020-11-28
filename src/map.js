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
        this.price = 10;
    }

}

export const ResidentialZoneMapObject = class extends MapObject {

    constructor() {
        super('residentialzone', 'residentialzone');
        this.price = 30;
    }

}

export const MarketZoneMapObject = class extends MapObject {

    constructor() {
        super('marketzone', 'marketzone');
        this.price = 30;
    }

}

export const IndustrialZoneMapObject = class extends MapObject {

    constructor() {
        super('industrialzone', 'industrialzone');
        this.price = 30;
    }

}

export const ResidentialBuildingMapObject = class extends MapObject {

    constructor() {
        super('residentialbuilding', 'residentialbuilding');
    }

}

export const MarketBuildingMapObject = class extends MapObject {

    constructor() {
        super('marketbuilding', 'marketbuilding');
    }

}

export const IndustrialBuildingMapObject = class extends MapObject {

    constructor() {
        super('industrialbuilding', 'industrialbuilding');
    }

}

export const WaterMapObject = class extends MapObject {

    constructor() {
        super('water', 'water');
        this.price = 20;
    }

}

export const ElectricityMapObject = class extends MapObject {

    constructor() {
        super('electricity', 'electricity');
        this.price = 20;
    }

}