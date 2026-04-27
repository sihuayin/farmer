import Cell from './Cell'

export default function FarmGrid({ cells, onCellClick, isEditor, selectedCellId }) {
  return (
    <div
      className="grid gap-1"
      style={{
        gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
      }}
    >
      {cells.map((cell) => (
        <Cell
          key={cell.id}
          cell={cell}
          onClick={() => onCellClick && onCellClick(cell)}
          isEditor={isEditor}
          isSelected={selectedCellId === cell.id}
        />
      ))}
    </div>
  )
}
