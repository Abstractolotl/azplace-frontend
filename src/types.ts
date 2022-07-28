export interface StoreData {
    canvas: Canvas
    selectedColorIndex: number,

}

export interface Canvas {
    width: number;
    height: number;
    colors: Array<String>
}