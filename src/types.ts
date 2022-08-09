export interface StoreData {
    canvas: Board | null,
    user: User | null,
    sidebar: Sidebar
    lastTimePlaced: number,
    selectedColorIndex: number,
    errors: Array<{
        message: string,
        time: number
    }>,
    selectedPixel: {
        x: number,
        y: number
    } | null,
    cachedPixelOwner: Map<String, any>
}

export interface Board {
    width: number;
    height: number;
    colors: Array<String>;
    cooldown: number;
    initialData: CanvasData;
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