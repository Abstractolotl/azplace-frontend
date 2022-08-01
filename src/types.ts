import { reactive } from "vue";

export interface StoreData {
    canvas: Board | null,
    canvasInfo: CanvasInfo,
    selectedColorIndex: number,
    sidebar: Sidebar
    user: User | null,
    selecting: Boolean
    randomNumber: String
}

export interface Board {
    width: number;
    height: number;
    colors: Array<String>;
    initialData: Uint8Array;
}


export interface CanvasInfo {
    id: number,
    width: number,
    height: number,
    colors: Array<String>
}

export interface Canvas {
    colors: Array<Uint8Array>
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