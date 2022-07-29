import { reactive } from "vue";

export interface StoreData {
    canvas: Board | null,
    selectedColorIndex: number,
    sidebar: Sidebar
    user: User | null,
    selecting: Boolean
}

export interface Board {
    width: number;
    height: number;
    colors: Array<String>;
    initialData: Uint8Array;
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