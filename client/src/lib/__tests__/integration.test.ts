import { describe, it, expect } from 'vitest';
import { evaluateFormula } from '../formulas';
import { createEmptySpreadsheet, setCell, exportToJSON, importFromJSON, exportToCSV } from '../spreadsheet';

describe('Integration Tests', () => {
  describe('Formula and Spreadsheet Integration', () => {
    it('should handle complex formula calculations with cell references', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Set up test data
      spreadsheet = setCell(spreadsheet, 0, 0, { value: '10', displayValue: '10' });
      spreadsheet = setCell(spreadsheet, 0, 1, { value: '20', displayValue: '20' });
      spreadsheet = setCell(spreadsheet, 0, 2, { value: '30', displayValue: '30' });
      
      // Test SUM formula
      const sumResult = evaluateFormula('=SUM(A1:C1)', spreadsheet);
      expect(sumResult).toBe('60');
      
      // Test formula with cell references
      const complexResult = evaluateFormula('=A1+B1*C1', spreadsheet);
      expect(complexResult).toBe('610'); // 10 + 20*30 = 610
    });

    it('should handle nested formulas and dependencies', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Set up base values
      spreadsheet = setCell(spreadsheet, 0, 0, { value: '5', displayValue: '5' });
      spreadsheet = setCell(spreadsheet, 0, 1, { value: '3', displayValue: '3' });
      
      // Set formula that depends on other cells
      spreadsheet = setCell(spreadsheet, 1, 0, { 
        formula: '=A1*B1', 
        value: '=A1*B1',
        displayValue: evaluateFormula('=A1*B1', spreadsheet)
      });
      
      // Test that the formula was calculated correctly
      const cell = spreadsheet.cells.find(c => c.row === 1 && c.col === 0);
      expect(cell?.displayValue).toBe('15');
    });

    it('should handle formula errors gracefully', () => {
      const spreadsheet = createEmptySpreadsheet();
      
      // Test division by zero
      const divZeroResult = evaluateFormula('=1/0', spreadsheet);
      expect(divZeroResult).toBe('#ERROR');
      
      // Test invalid cell reference
      const invalidRefResult = evaluateFormula('=ZZ999', spreadsheet);
      expect(invalidRefResult).toBe('0');
      
      // Test invalid formula syntax
      const invalidSyntaxResult = evaluateFormula('=SUM(A1:)', spreadsheet);
      expect(invalidSyntaxResult).toBe('0');
    });
  });

  describe('File Operations Integration', () => {
    it('should export and import spreadsheet data correctly', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Add test data
      spreadsheet = setCell(spreadsheet, 0, 0, { 
        value: 'Test', 
        displayValue: 'Test',
        style: { backgroundColor: '#ff0000', color: '#ffffff', fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none' }
      });
      spreadsheet = setCell(spreadsheet, 0, 1, { 
        formula: '=1+1', 
        value: '=1+1',
        displayValue: '2'
      });
      
      // Export to JSON
      const json = exportToJSON(spreadsheet);
      expect(json).toBeDefined();
      
      // Import from JSON
      const importedSpreadsheet = importFromJSON(json);
      expect(importedSpreadsheet.cells).toHaveLength(2);
      
      const testCell = importedSpreadsheet.cells.find(c => c.row === 0 && c.col === 0);
      expect(testCell?.value).toBe('Test');
      expect(testCell?.style.backgroundColor).toBe('#ff0000');
      
      const formulaCell = importedSpreadsheet.cells.find(c => c.row === 0 && c.col === 1);
      expect(formulaCell?.formula).toBe('=1+1');
      expect(formulaCell?.displayValue).toBe('2');
    });

    it('should export to CSV correctly', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Create a small grid of data
      spreadsheet = setCell(spreadsheet, 0, 0, { value: 'Name', displayValue: 'Name' });
      spreadsheet = setCell(spreadsheet, 0, 1, { value: 'Age', displayValue: 'Age' });
      spreadsheet = setCell(spreadsheet, 1, 0, { value: 'John', displayValue: 'John' });
      spreadsheet = setCell(spreadsheet, 1, 1, { value: '30', displayValue: '30' });
      spreadsheet = setCell(spreadsheet, 2, 0, { value: 'Jane', displayValue: 'Jane' });
      spreadsheet = setCell(spreadsheet, 2, 1, { value: '25', displayValue: '25' });
      
      const csv = exportToCSV(spreadsheet);
      const lines = csv.split('\n').filter(line => line.trim() !== '');
      
      expect(lines[0]).toContain('Name');
      expect(lines[0]).toContain('Age');
      expect(lines[1]).toContain('John');
      expect(lines[1]).toContain('30');
      expect(lines[2]).toContain('Jane');
      expect(lines[2]).toContain('25');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle large spreadsheets efficiently', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Add many cells
      for (let i = 0; i < 100; i++) {
        spreadsheet = setCell(spreadsheet, i, 0, { value: i.toString(), displayValue: i.toString() });
      }
      
      expect(spreadsheet.cells).toHaveLength(100);
      
      // Test SUM over large range
      const sumResult = evaluateFormula('=SUM(A1:A100)', spreadsheet);
      expect(sumResult).toBe('4950'); // Sum of 0 to 99
    });

    it('should handle empty cells in formulas', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Set only some cells in a range
      spreadsheet = setCell(spreadsheet, 0, 0, { value: '10', displayValue: '10' });
      spreadsheet = setCell(spreadsheet, 2, 0, { value: '20', displayValue: '20' });
      // Row 1 is empty
      
      const sumResult = evaluateFormula('=SUM(A1:A3)', spreadsheet);
      expect(sumResult).toBe('30'); // Should ignore empty cells
      
      const avgResult = evaluateFormula('=AVERAGE(A1:A3)', spreadsheet);
      expect(avgResult).toBe('10'); // Average of non-empty cells (30/3 including zeros)
    });

    it('should handle circular references safely', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Create potential circular reference
      spreadsheet = setCell(spreadsheet, 0, 0, { 
        formula: '=B1+1', 
        value: '=B1+1',
        displayValue: evaluateFormula('=B1+1', spreadsheet)
      });
      
      // This should not cause infinite loop
      const result = evaluateFormula('=A1+1', spreadsheet);
      expect(result).toBeDefined();
    });

    it('should handle special characters in cell values', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Test with special characters
      const specialText = 'Hello, "World"! & <Test>';
      spreadsheet = setCell(spreadsheet, 0, 0, { value: specialText, displayValue: specialText });
      
      const csv = exportToCSV(spreadsheet);
      expect(csv).toContain('"Hello, ""World""! & <Test>"');
      
      const json = exportToJSON(spreadsheet);
      const imported = importFromJSON(json);
      const cell = imported.cells.find(c => c.row === 0 && c.col === 0);
      expect(cell?.value).toBe(specialText);
    });

    it('should validate formula syntax', () => {
      const spreadsheet = createEmptySpreadsheet();
      
      // Test various invalid formulas
      const invalidFormulas = [
        '=SUM(',
        '=SUM())',
        '=INVALID_FUNCTION(A1)',
        '=1++2',
        '=A1:',
        '=:A1'
      ];
      
      invalidFormulas.forEach(formula => {
        const result = evaluateFormula(formula, spreadsheet);
        expect(result).toBe('#ERROR');
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle formula recalculation efficiently', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Create dependent formulas
      spreadsheet = setCell(spreadsheet, 0, 0, { value: '1', displayValue: '1' });
      
      for (let i = 1; i < 10; i++) {
        const formula = `=A${i}+1`;
        spreadsheet = setCell(spreadsheet, i, 0, { 
          formula,
          value: formula,
          displayValue: evaluateFormula(formula, spreadsheet)
        });
      }
      
      // Check that all formulas were calculated correctly
      const lastCell = spreadsheet.cells.find(c => c.row === 9 && c.col === 0);
      expect(lastCell?.displayValue).toBe('10');
    });

    it('should handle large range operations efficiently', () => {
      let spreadsheet = createEmptySpreadsheet();
      
      // Create a large range of data
      for (let i = 0; i < 1000; i++) {
        spreadsheet = setCell(spreadsheet, i, 0, { value: '1', displayValue: '1' });
      }
      
      // Test large range SUM
      const start = Date.now();
      const sumResult = evaluateFormula('=SUM(A1:A1000)', spreadsheet);
      const duration = Date.now() - start;
      
      expect(sumResult).toBe('1000');
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});