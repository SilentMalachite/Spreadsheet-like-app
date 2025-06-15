import { Cell, Spreadsheet } from "@shared/schema";

export const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export function getCellId(row: number, col: number): string {
  return `${COLUMNS[col]}${row + 1}`;
}

export function getCellReference(row: number, col: number): string {
  return `${COLUMNS[col]}${row + 1}`;
}

export function parseCellReference(ref: string): { row: number; col: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const colStr = match[1];
  const rowStr = match[2];
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 65 + 1);
  }
  col -= 1; // Convert to 0-based index
  
  const row = parseInt(rowStr) - 1; // Convert to 0-based index
  
  return { row, col };
}

export function createEmptySpreadsheet(): Spreadsheet {
  return {
    id: crypto.randomUUID(),
    name: "新しいスプレッドシート",
    cells: [],
    rowCount: 20,
    colCount: 10,
    selectedCell: { row: 0, col: 0 },
  };
}

export function getCell(spreadsheet: Spreadsheet, row: number, col: number): Cell | undefined {
  return spreadsheet.cells.find(cell => cell.row === row && cell.col === col);
}

export function setCell(spreadsheet: Spreadsheet, row: number, col: number, updates: Partial<Cell>): Spreadsheet {
  const cells = [...spreadsheet.cells];
  const existingIndex = cells.findIndex(cell => cell.row === row && cell.col === col);
  
  if (existingIndex >= 0) {
    cells[existingIndex] = { ...cells[existingIndex], ...updates };
  } else {
    const newCell: Cell = {
      id: getCellId(row, col),
      row,
      col,
      value: "",
      formula: "",
      displayValue: "",
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: "none",
      },
      ...updates,
    };
    cells.push(newCell);
  }
  
  return { ...spreadsheet, cells };
}

export function exportToJSON(spreadsheet: Spreadsheet): string {
  return JSON.stringify(spreadsheet, null, 2);
}

export function importFromJSON(json: string): Spreadsheet {
  try {
    const data = JSON.parse(json);
    return {
      ...createEmptySpreadsheet(),
      ...data,
    };
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
}

export function exportToCSV(spreadsheet: Spreadsheet): string {
  const maxRow = Math.max(...spreadsheet.cells.map(cell => cell.row), spreadsheet.rowCount - 1);
  const maxCol = Math.max(...spreadsheet.cells.map(cell => cell.col), spreadsheet.colCount - 1);
  
  const rows: string[] = [];
  
  for (let row = 0; row <= maxRow; row++) {
    const rowData: string[] = [];
    for (let col = 0; col <= maxCol; col++) {
      const cell = getCell(spreadsheet, row, col);
      const value = cell?.displayValue || cell?.value || "";
      // Escape commas and quotes in CSV
      const escapedValue = value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
      rowData.push(escapedValue);
    }
    rows.push(rowData.join(','));
  }
  
  return rows.join('\n');
}
