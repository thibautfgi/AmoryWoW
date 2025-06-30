
interface LocalizedString {
    fr_FR: string;
    [key: string]: string;
}

interface ItemQuality {
    name: LocalizedString;
    type: string;
}

interface InventoryType {
    name: LocalizedString;
type: string;
}

interface ItemClass {
    name: LocalizedString;
    id: number;
}

interface ItemSubClass {
    name: LocalizedString;
    id: number;
}



interface ItemSearchResult {
    data: {
        id: number;
        name: LocalizedString;
        quality: ItemQuality;
        required_level: number;
        purchase_price: number;
        sell_price: number;
        inventory_type: InventoryType;
        item_class: ItemClass;
        item_subclass: ItemSubClass;
    };
}

export type { LocalizedString, ItemQuality, ItemSearchResult };