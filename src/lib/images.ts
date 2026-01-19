export type EventImages = {
    thumbnail: string;
    gallery: string[];
};

export type EventImagesMap = Record<string, EventImages>;

const IMAGE_BASE_PATH = "/event_images";
const BOARD_BASE_PATH = "/board";


const PLACEHOLDER = {
    thumbnail: "https://placehold.co/480x320/1a1a2e/ffffff?text=SASE+RHIT",
    gallery: "https://placehold.co/1600x1000/1a1a2e/ffffff?text=SASE+RHIT",
};

export const HERO_IMAGES = {
    cover: "/images/Speed_Lake_1.JPG",
    coverAlt: `${IMAGE_BASE_PATH}/Graduation Class of 2024.jpg`,
};

export const SECTION_IMAGES = {
    members: `${IMAGE_BASE_PATH}/Graduation Class of 2024.jpg`,
};

export const BOARD_IMAGES: Record<string, string> = {
    externalVP: `${BOARD_BASE_PATH}/Jonathan_Lin_2025.jpg`,
    eventCoordinator: `${BOARD_BASE_PATH}/Sandya_Suresh_2025.jpg`,
    webDeveloper: `${BOARD_BASE_PATH}/Chris_Lardner_2025.jpg`,
};

export const EVENT_IMAGES: EventImagesMap = {
    "bikes-for-tykes": {
        thumbnail: `${IMAGE_BASE_PATH}/Bikes for Tykes W_24.png`,
        gallery: [
            `${IMAGE_BASE_PATH}/Bikes for Tykes W_24.png`,
        ],
    },

    "company-talks": {
        thumbnail: `${IMAGE_BASE_PATH}/Ingredion ADAPT Panel.PNG`,
        gallery: [
            `${IMAGE_BASE_PATH}/Ingredion ADAPT Panel.PNG`,
            `${IMAGE_BASE_PATH}/Diversity Connect F_24.jpg`,
        ],
    },

    "cherry-blossom": {
        thumbnail: `${IMAGE_BASE_PATH}/Lantern Festival Lake F_25.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/Lantern Festival Lake F_25.jpg`,
            `${IMAGE_BASE_PATH}/Lantern Festival Construction F_25.jpg`,
        ],
    },

    "lunar-new-year": {
        thumbnail: `${IMAGE_BASE_PATH}/LNY24.png`,
        gallery: [
            `${IMAGE_BASE_PATH}/LNY24.png`,
            `${IMAGE_BASE_PATH}/Lunar New Year W_25.png`,
            `${IMAGE_BASE_PATH}/SASE LNY S_24.jpg`,
            `${IMAGE_BASE_PATH}/Dance Team LNY W_25.png`,
            `${IMAGE_BASE_PATH}/LNY_23.png`,

        ],
    },

    "boba-night": {
        thumbnail: `${IMAGE_BASE_PATH}/Boba Night F_25.JPG`,
        gallery: [

            `${IMAGE_BASE_PATH}/Boba Night F_25.JPG`,
            `${IMAGE_BASE_PATH}/Boba Night Socializing F_25.JPG`,
            `${IMAGE_BASE_PATH}/NM Boba Night F_25.jpg`,
            `${IMAGE_BASE_PATH}/BobaF25.JPG`,
            `${IMAGE_BASE_PATH}/BobaF25-1.JPG`,
            `${IMAGE_BASE_PATH}/BobaF25-2.JPG`,

        ],
    },

    "onigiri-action": {
        thumbnail: `${IMAGE_BASE_PATH}/Onigiri Action F_24.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/Onigiri Action F_24.jpg`,
            `${IMAGE_BASE_PATH}/Onigiri Action F_25.JPG`,
            `${IMAGE_BASE_PATH}/Onigiri Action F_25(1).JPG`,
            `${IMAGE_BASE_PATH}/Onigiri Action Two Girls Posing F_25.JPG`,
            `${IMAGE_BASE_PATH}/Single Onigiri F_25.JPG`,
        ],
    },

    "tastes-around-the-world": {
        thumbnail: `${IMAGE_BASE_PATH}/TATW W_25.png`,
        gallery: [
            `${IMAGE_BASE_PATH}/TATW W_25.png`,
            `${IMAGE_BASE_PATH}/TATW_W24.png`,
        ],
    },

    "spring-carnival": {
        thumbnail: `${IMAGE_BASE_PATH}/Culture_Fest_S24.png`,
        gallery: [
            `${IMAGE_BASE_PATH}/Culture_Fest_S24.png`,
            `${IMAGE_BASE_PATH}/Kite_S24.png`,
            `${IMAGE_BASE_PATH}/Spring_Carnival_S24.png`,
        ],
    },

    "trunk-or-treat": {
        thumbnail: `${IMAGE_BASE_PATH}/Trunk or Treat F_23.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/Trunk or Treat F_23.jpg`,
        ],
    },

    "national-and-regional-conferences": {
        thumbnail: `${IMAGE_BASE_PATH}/Sister Chapter Challenge with ASU.JPG`,
        gallery: [
            `${IMAGE_BASE_PATH}/Sister Chapter Challenge with ASU.JPG`,
            `${IMAGE_BASE_PATH}/Nationals Pic with Another Chapter.png`,
            `${IMAGE_BASE_PATH}/NC Atlanta Everyone F_23.jpg`,
            `${IMAGE_BASE_PATH}/MWRC S_24.PNG`,
            `${IMAGE_BASE_PATH}/MWRC Purdue S_25.jpeg`,
            `${IMAGE_BASE_PATH}/MWRC Lion Dance S_25.png`,
            `${IMAGE_BASE_PATH}/Chinatown Adventures with Other Chapters F_24.JPG`,
        ],
    },

    "skating": {
        thumbnail: `${IMAGE_BASE_PATH}/skateworld.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/skateworld.jpg`,
        ],
    },

    "trees": {
        thumbnail: `${IMAGE_BASE_PATH}/TREESinc.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/TREESinc.jpg`,
        ],
    },

    "fall-day-of-service": {
        thumbnail: `${IMAGE_BASE_PATH}/Fall Day of Service F_25.jpeg`,
        gallery: [
            `${IMAGE_BASE_PATH}/Fall Day of Service F_25.jpeg`,
        ],
    },

    "spring-day-of-service": {
        thumbnail: `${IMAGE_BASE_PATH}/Spring Day of Service S_25.png`,
        gallery: [
            `${IMAGE_BASE_PATH}/Spring Day of Service S_25.png`,
            `${IMAGE_BASE_PATH}/Spring Day of Service Flower Planting S_24.png`,
        ],
    },

    "night-market": {
        thumbnail: `${IMAGE_BASE_PATH}/NM Mingling F_25.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/NM Mingling F_25.jpg`,
            `${IMAGE_BASE_PATH}/Night Market Tent F_25.jpg`,
            `${IMAGE_BASE_PATH}/NM Boba Night F_25.jpg`,
            `${IMAGE_BASE_PATH}/NM ISA Tent F_25.jpg`,
        ],
    },

    "aizu-bowling": {
        thumbnail: `${IMAGE_BASE_PATH}/Alumni Dinner at Kasthamandap.jpg`,
        gallery: [
            `${IMAGE_BASE_PATH}/Alumni Dinner at Kasthamandap.jpg`,
        ],
    },
};

export function getEventImages(eventId: string): EventImages {
    const images = EVENT_IMAGES[eventId];

    if (!images) {
        return {
            thumbnail: PLACEHOLDER.thumbnail,
            gallery: [PLACEHOLDER.gallery],
        };
    }

    const thumbnail = images.thumbnail && images.thumbnail.trim() !== ""
        ? images.thumbnail
        : PLACEHOLDER.thumbnail;

    const validGallery = images.gallery?.filter((img) => img && img.trim() !== "") ?? [];
    const gallery = validGallery.length > 0 ? validGallery : [PLACEHOLDER.gallery];

    return {thumbnail, gallery};
}

export function getEventThumbnail(eventId: string): string {
    const thumb = EVENT_IMAGES[eventId]?.thumbnail;
    if (thumb && thumb.trim() !== "") {
        return thumb;
    }
    return PLACEHOLDER.thumbnail;
}

export function getEventGallery(eventId: string): string[] {
    const gallery = EVENT_IMAGES[eventId]?.gallery;
    const validGallery = gallery?.filter((img) => img && img.trim() !== "") ?? [];

    if (validGallery.length > 0) {
        return validGallery;
    }
    return [PLACEHOLDER.gallery];
}

export function eventHasImages(eventId: string): boolean {
    const images = EVENT_IMAGES[eventId];
    if (!images) return false;

    const hasThumb = images.thumbnail && images.thumbnail.trim() !== "";
    const hasGallery = images.gallery?.some((img) => img && img.trim() !== "");

    return hasThumb || hasGallery;
}

export const placeholder = {
    thumb: (w = 480, h = 320) =>
        `https://placehold.co/${w}x${h}/1a1a2e/ffffff?text=SASE+RHIT`,
    rail: (w = 1200, h = 800) =>
        `https://placehold.co/${w}x${h}/1a1a2e/ffffff?text=SASE+RHIT`,
};