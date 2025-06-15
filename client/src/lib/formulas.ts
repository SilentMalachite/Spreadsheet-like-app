import { Spreadsheet, Cell } from "@shared/schema";
import { getCell, parseCellReference } from "./spreadsheet";

export function evaluateFormula(formula: string, spreadsheet: Spreadsheet): string {
  if (!formula.startsWith('=')) {
    return formula;
  }
  
  try {
    let expression = formula.substring(1); // Remove '=' prefix
    
    // First handle functions before cell references
    expression = handleFunctions(expression, spreadsheet);
    
    // Then handle cell references
    expression = expression.replace(/[A-Z]+\d+/g, (match) => {
      const ref = parseCellReference(match);
      if (ref) {
        const cell = getCell(spreadsheet, ref.row, ref.col);
        const value = cell?.displayValue || cell?.value || "0";
        return isNaN(Number(value)) ? "0" : value;
      }
      return "0";
    });
    
    // Finally evaluate the mathematical expression
    const result = Function('"use strict"; return (' + expression + ')')();
    if (isNaN(result) || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    return result.toString();
  } catch (error) {
    return '#ERROR';
  }
}



function handleFunctions(expr: string, spreadsheet: Spreadsheet): string {
  // SUM function
  expr = expr.replace(/SUM\(([^)]+)\)/g, (match, range) => {
    const sum = calculateSum(range, spreadsheet);
    return sum.toString();
  });
  
  // AVERAGE function
  expr = expr.replace(/AVERAGE\(([^)]+)\)/g, (match, range) => {
    const avg = calculateAverage(range, spreadsheet);
    return avg.toString();
  });
  
  // MAX function
  expr = expr.replace(/MAX\(([^)]+)\)/g, (match, range) => {
    const max = calculateMax(range, spreadsheet);
    return max.toString();
  });
  
  // MIN function
  expr = expr.replace(/MIN\(([^)]+)\)/g, (match, range) => {
    const min = calculateMin(range, spreadsheet);
    return min.toString();
  });
  
  // COUNT function
  expr = expr.replace(/COUNT\(([^)]+)\)/g, (match, range) => {
    const count = calculateCount(range, spreadsheet);
    return count.toString();
  });
  
  return expr;
}

function parseRange(range: string): { start: { row: number; col: number }; end: { row: number; col: number } } | null {
  const rangeParts = range.split(':');
  if (rangeParts.length !== 2) return null;
  
  const start = parseCellReference(rangeParts[0].trim());
  const end = parseCellReference(rangeParts[1].trim());
  
  if (!start || !end) return null;
  
  return { start, end };
}

function getCellsInRange(range: string, spreadsheet: Spreadsheet): Cell[] {
  const parsedRange = parseRange(range);
  if (!parsedRange) return [];
  
  const cells: Cell[] = [];
  const { start, end } = parsedRange;
  
  for (let row = start.row; row <= end.row; row++) {
    for (let col = start.col; col <= end.col; col++) {
      const cell = getCell(spreadsheet, row, col);
      if (cell) {
        cells.push(cell);
      } else {
        // 存在しないセルの場合、空のセルを作成して追加
        cells.push({
          id: `${String.fromCharCode(65 + col)}${row + 1}`,
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
          }
        });
      }
    }
  }
  
  return cells;
}

function calculateSum(range: string, spreadsheet: Spreadsheet): number {
  const cells = getCellsInRange(range, spreadsheet);
  return cells.reduce((sum, cell) => {
    const value = parseFloat(cell.displayValue || cell.value || "0");
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
}

function calculateAverage(range: string, spreadsheet: Spreadsheet): number {
  const cells = getCellsInRange(range, spreadsheet);
  const numericCells = cells.filter(cell => {
    const value = parseFloat(cell.displayValue || cell.value || "0");
    return !isNaN(value);
  });
  
  if (numericCells.length === 0) return 0;
  
  const sum = numericCells.reduce((sum, cell) => {
    const value = parseFloat(cell.displayValue || cell.value || "0");
    return sum + value;
  }, 0);
  
  return sum / numericCells.length;
}

function calculateMax(range: string, spreadsheet: Spreadsheet): number {
  const cells = getCellsInRange(range, spreadsheet);
  const values = cells.map(cell => parseFloat(cell.displayValue || cell.value || "0")).filter(v => !isNaN(v));
  return values.length > 0 ? Math.max(...values) : 0;
}

function calculateMin(range: string, spreadsheet: Spreadsheet): number {
  const cells = getCellsInRange(range, spreadsheet);
  const values = cells.map(cell => parseFloat(cell.displayValue || cell.value || "0")).filter(v => !isNaN(v));
  return values.length > 0 ? Math.min(...values) : 0;
}

function calculateCount(range: string, spreadsheet: Spreadsheet): number {
  const cells = getCellsInRange(range, spreadsheet);
  return cells.filter(cell => {
    const value = cell.displayValue || cell.value || "";
    return value.trim() !== "";
  }).length;
}
