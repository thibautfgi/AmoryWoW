import {LocalizedString} from "../interface/item-search.interface";

export const getBorderColor = (qualityType: string): string => {
    switch (qualityType) {
        case 'LEGENDARY':
            return 'orange';
        case 'EPIC':
            return 'purple';
        case 'RARE':
            return 'blue';
        case 'UNCOMMON':
            return 'green';
        case 'COMMON':
            return 'gray';
        default:
            return 'white';
    }
};

export const getItemClass = (itemClassId: number): string => {
    switch (itemClassId) {
        case 0:
            return 'Consommable';
        case 1:
            return 'Conteneur';
        case 2:
            return 'Arme';
        case 3:
            return 'Gemme';
        case 4:
            return 'Armure';
        case 5:
            return 'Composant';
        case 6:
            return 'Projectile';
        case 7:
            return 'Artisanat';
        case 9:
            return 'Recette';
        case 11:
            return 'Carquois';
        case 12:
            return 'Quête';
        case 13:
            return 'Clé';
        case 15:
            return 'Divers';
        case 16:
            return 'Glyphe';
        case 18:
            return 'Jeton WoW';
        default:
            return 'Inconnu';
    }
};


export function getFrenchTranslation(name: LocalizedString | string | undefined): string {
    if (!name) return "nom inconnu";
    if (typeof name === 'string') return name; // Return the string directly if it's already a French name
    return name.fr_FR || name['fr_FR'] || Object.values(name)[0] || "nom inconnu"; // Fallback for LocalizedString object
}