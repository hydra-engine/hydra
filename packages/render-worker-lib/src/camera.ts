export class Camera {
  #x = 0
  #y = 0
  #scale = 1

  get x() { return this.#x }
  get y() { return this.#y }
  get scale() { return this.#scale }

  setPosition(x: number, y: number) {
    this.#x = x
    this.#y = y
  }

  setScale(scale: number) {
    this.#scale = scale
  }
}
