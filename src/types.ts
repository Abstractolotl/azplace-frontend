export interface StoreData {
    canvas: Canvas
    selectedColorIndex: number,
    user: User | null
}

export interface Canvas {
    width: number;
    height: number;
    colors: Array<String>
}

export interface User {
    name: String,
    avatarURL: String,
}