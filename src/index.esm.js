import AppController from "./components/app"

export default AppController

export function donEnc() {
  window.donEncLayer = window.donEncLayer || []
  window.donEncLayer.push(arguments)
}
