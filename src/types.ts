export interface StoreData {
    canvas: Canvas
    selectedColorIndex: number,

}

export interface Canvas {
    width: number | null;
    height: number | null;
    colors: Array<String>
}