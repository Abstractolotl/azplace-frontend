import { reactive } from "vue";

export interface StoreData {
    canvas: Board | null,
    lastTimePlaced: number,
    selectedColorIndex: number,
    selectedPixel: {
        x: number,
        y: number
    } | null,
    sidebar: Sidebar
    user: User | null,
    randomNumber: String
}

export interface Board {
    width: number;
    height: number;
    colors: Array<String>;
    initialData: CanvasData;
    cooldown: number;
}

export interface CanvasData {
    pixels: Uint8Array;
}

export interface User {
    name: String,
    avatarURL: String,
}

export interface Sidebar {
    expanded: Boolean,
    panel: String,
    width: Number
}