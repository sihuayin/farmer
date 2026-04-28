import { useEffect, useRef } from 'react'
import { Game } from 'phaser'
import PanoramaScene from '../../phaser/PanoramaScene'

export default function PhaserPanoramaGame({ plots, pens, sections, onCellClick, containerRef }) {
  const gameRef = useRef(null)
  const sceneRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    if (!innerRef.current) return

    const parent = innerRef.current
    const canvasWidth = parent.clientWidth || 800
    const canvasHeight = parent.clientHeight || 500
    // Center the 12×12 grid's bounding box in the canvas
    const cameraOffsetX = Math.round(canvasWidth / 2)
    // grid Y range is originY..originY+GRID_SIZE*TILE_HEIGHT = 80..464 (384px). Center it in canvas.
    const cameraOffsetY = Math.round(canvasHeight / 2 + 192 - 80) // 258 + 192 - 80 = 370

    let game

    try {
      game = new Game({
        type: 1,
        parent,
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#E8E4DC',
        scene: [PanoramaScene],
        scale: { mode: 0, autoCenter: 0 },
        physics: {},
      })
      gameRef.current = game
    } catch (e) {
      console.error('Phaser init failed:', e)
      return
    }

    const checkScene = () => {
      const scene = game.scene.getScene('PanoramaScene')
      if (scene && scene._ready) {
        sceneRef.current = scene
        scene.initWithData(plots, pens, sections)
        scene.createCameraScroll(cameraOffsetX, cameraOffsetY)

        if (containerRef?.current !== scene) {
          containerRef.current = scene
        }
        window.__panoramaScene = scene

        scene.events.on('panorama:cell:click', (payload) => {
          if (onCellClick) onCellClick(payload)
        })

        const canvas = game.canvas
        if (canvas) {
          canvas.style.width = '100%'
          canvas.style.height = '100%'
        }
      } else {
        setTimeout(checkScene, 50)
      }
    }
    checkScene()

    return () => {
      if (containerRef?.current === sceneRef.current) {
        containerRef.current = null
      }
      window.__panoramaScene = null
      try { game.destroy(true) } catch (e) { /* ignore */ }
      gameRef.current = null
      sceneRef.current = null
    }
  }, [])

  // Sync data changes to scene
  useEffect(() => {
    if (sceneRef.current) {
      try { sceneRef.current.updatePlots(plots) } catch (e) { /* ignore */ }
    }
  }, [plots])

  useEffect(() => {
    if (sceneRef.current) {
      try { sceneRef.current.updatePens(pens) } catch (e) { /* ignore */ }
    }
  }, [pens])

  useEffect(() => {
    if (sceneRef.current) {
      try { sceneRef.current.updateSections(sections) } catch (e) { /* ignore */ }
    }
  }, [sections])

  return <div ref={innerRef} style={{ width: '100%', height: '100%', minHeight: 400 }} />
}