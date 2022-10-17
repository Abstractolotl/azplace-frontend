export interface StoreData {
    board: Board | null,
    user: User | null,
    sidebar: Sidebar
    lastTimePlaced: number,
    selectedColorIndex: number,
    errors: Array<{
        message: string,
        time: number
    }>,
    selectedPixel: SelectionInfo | null,
    cachedPixelOwner: Map<String, any>
}

export interface SelectionInfo {
    transform: {
        x: number,
        y: number,
        pixelSize: number
    },
    coords: {
        x: number,
        y: number
    }
}

export interface Board {
    width: number;
    height: number;
    colors: Array<String>;
    cooldown: number;
    initialData: CanvasData;
    started: boolean,
    ended: boolean
    startDate: number,
    endDate: number
}

export interface CanvasData {
    pixels: Uint8Array;
}

export interface User {
    name: string,
    avatarURL: string,
    anonymous: boolean
}

export interface Sidebar {
    expanded: Boolean,
    panel: string,
    width: Number
}