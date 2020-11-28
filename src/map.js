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

export const ResidentialZoneMapObject = class extends MapObject {

    constructor() {
        super('residentialzone', 'residentialzone');
    }

}

export const MarketZoneMapObject = class extends MapObject {

    constructor() {
        super('marketzone', 'marketzone');
    }

}

export const IndustrialZoneMapObject = class extends MapObject {

    constructor() {
        super('industrialzone', 'industrialzone');
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
    }

}

export const ElectricityMapObject = class extends MapObject {

    constructor() {
        super('electricity', 'electricity');
    }

}