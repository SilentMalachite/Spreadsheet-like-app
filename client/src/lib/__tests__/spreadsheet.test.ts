import { describe, it, expect } from 'vitest';
import { 
  getCellId, 
  getCellReference, 
  parseCellReference, 
  createEmptySpreadsheet, 
  getCell, 
  setCell,
  exportToJSON,
  importFromJSON,
  exportToCSV
} from '../spreadsheet';

describe('Spreadsheet Functions', () => {
  describe('Cell Reference Functions', () => {
    it('should generate correct cell ID', () => {
      expect(getCellId(0, 0)).toBe('A1');
      expect(getCellId(1, 1)).toBe('B2');
      expect(getCellId(0, 25)).toBe('Z1');
    });

    it('should generate correct cell reference', () => {
      expect(getCellReference(0, 0)).toBe('A1');
      expect(getCellReference(1, 1)).toBe('B2');
      expect(getCellReference(9, 9)).toBe('J10');
    });

    it('should parse cell reference correctly', () => {
      expect(parseCellReference('A1')).toEqual({ row: 0, col: 0 });
      expect(parseCellReference('B2')).toEqual({ row: 1, col: 1 });
      expect(parseCellReference('Z10')).toEqual({ row: 9, col: 25 });
      expect(parseCellReference('invalid')).toBeNull();
    });
  });

  describe('Spreadsheet Operations', () => {
    it('should create empty spreadsheet', () => {
      const spreadsheet = createEmptySpreadsheet();
      
      expect(spreadsheet.id).toBeTruthy();
      expect(spreadsheet.name).toBe('新しいスプレッドシート');
      expect(spreadsheet.cells).toEqual([]);
      expect(spreadsheet.rowCount).toBe(20);
      expect(spreadsheet.colCount).toBe(10);
      expect(spreadsheet.selectedCell).toEqual({ row: 0, col: 0 });
    });

    it('should get cell from spreadsheet', () => {
      const spreadsheet = createEmptySpreadsheet();
      const cell = getCell(spreadsheet, 0, 0);
      expect(cell).toBeUndefined();
    });

    it('should set cell in spreadsheet', () => {
      const spreadsheet = createEmptySpreadsheet();
      const updatedSpreadsheet = setCell(spreadsheet, 0, 0, { value: 'test' });
      
      const cell = getCell(updatedSpreadsheet, 0, 0);
      expect(cell).toBeTruthy();
      expect(cell?.value).toBe('test');
      expect(cell?.row).toBe(0);
      expect(cell?.col).toBe(0);
    });
  });

  describe('File Operations', () => {
    it('should export to JSON', () => {
      const spreadsheet = createEmptySpreadsheet();
      const json = exportToJSON(spreadsheet);
      
      expect(() => JSON.parse(json)).not.toThrow();
      const parsed = JSON.parse(json);
      expect(parsed.name).toBe('新しいスプレッドシート');
    });

    it('should import from JSON', () => {
      const spreadsheet = createEmptySpreadsheet();
      const json = exportToJSON(spreadsheet);
      const imported = importFromJSON(json);
      
      expect(imported.name).toBe(spreadsheet.name);
      expect(imported.rowCount).toBe(spreadsheet.rowCount);
      expect(imported.colCount).toBe(spreadsheet.colCount);
    });

    it('should export to CSV', () => {
      const spreadsheet = createEmptySpreadsheet();
      const updatedSpreadsheet = setCell(spreadsheet, 0, 0, { value: 'A1', displayValue: 'A1' });
      const finalSpreadsheet = setCell(updatedSpreadsheet, 0, 1, { value: 'B1', displayValue: 'B1' });
      
      const csv = exportToCSV(finalSpreadsheet);
      expect(csv).toContain('A1,B1');
    });
  });
});