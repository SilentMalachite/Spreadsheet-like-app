import { describe, it, expect } from 'vitest';
import { evaluateFormula } from '../formulas';
import { createEmptySpreadsheet, setCell } from '../spreadsheet';

describe('Formula Evaluation', () => {
  it('should return original value for non-formula strings', () => {
    const spreadsheet = createEmptySpreadsheet();
    expect(evaluateFormula('Hello', spreadsheet)).toBe('Hello');
    expect(evaluateFormula('123', spreadsheet)).toBe('123');
  });

  it('should evaluate simple arithmetic formulas', () => {
    const spreadsheet = createEmptySpreadsheet();
    expect(evaluateFormula('=1+2', spreadsheet)).toBe('3');
    expect(evaluateFormula('=10-5', spreadsheet)).toBe('5');
    expect(evaluateFormula('=3*4', spreadsheet)).toBe('12');
    expect(evaluateFormula('=10/2', spreadsheet)).toBe('5');
  });

  it('should evaluate cell references', () => {
    let spreadsheet = createEmptySpreadsheet();
    spreadsheet = setCell(spreadsheet, 0, 0, { value: '10', displayValue: '10' });
    spreadsheet = setCell(spreadsheet, 0, 1, { value: '20', displayValue: '20' });
    
    expect(evaluateFormula('=A1+B1', spreadsheet)).toBe('30');
    expect(evaluateFormula('=A1*2', spreadsheet)).toBe('20');
  });

  it('should evaluate SUM function', () => {
    let spreadsheet = createEmptySpreadsheet();
    spreadsheet = setCell(spreadsheet, 0, 0, { value: '1', displayValue: '1' });
    spreadsheet = setCell(spreadsheet, 1, 0, { value: '2', displayValue: '2' });
    spreadsheet = setCell(spreadsheet, 2, 0, { value: '3', displayValue: '3' });
    
    expect(evaluateFormula('=SUM(A1:A3)', spreadsheet)).toBe('6');
  });

  it('should evaluate AVERAGE function', () => {
    let spreadsheet = createEmptySpreadsheet();
    spreadsheet = setCell(spreadsheet, 0, 0, { value: '2', displayValue: '2' });
    spreadsheet = setCell(spreadsheet, 1, 0, { value: '4', displayValue: '4' });
    spreadsheet = setCell(spreadsheet, 2, 0, { value: '6', displayValue: '6' });
    
    expect(evaluateFormula('=AVERAGE(A1:A3)', spreadsheet)).toBe('4');
  });

  it('should evaluate MAX function', () => {
    let spreadsheet = createEmptySpreadsheet();
    spreadsheet = setCell(spreadsheet, 0, 0, { value: '5', displayValue: '5' });
    spreadsheet = setCell(spreadsheet, 1, 0, { value: '2', displayValue: '2' });
    spreadsheet = setCell(spreadsheet, 2, 0, { value: '8', displayValue: '8' });
    
    expect(evaluateFormula('=MAX(A1:A3)', spreadsheet)).toBe('8');
  });

  it('should evaluate MIN function', () => {
    let spreadsheet = createEmptySpreadsheet();
    spreadsheet = setCell(spreadsheet, 0, 0, { value: '5', displayValue: '5' });
    spreadsheet = setCell(spreadsheet, 1, 0, { value: '2', displayValue: '2' });
    spreadsheet = setCell(spreadsheet, 2, 0, { value: '8', displayValue: '8' });
    
    expect(evaluateFormula('=MIN(A1:A3)', spreadsheet)).toBe('2');
  });

  it('should evaluate COUNT function', () => {
    let spreadsheet = createEmptySpreadsheet();
    spreadsheet = setCell(spreadsheet, 0, 0, { value: '1', displayValue: '1' });
    spreadsheet = setCell(spreadsheet, 1, 0, { value: 'text', displayValue: 'text' });
    spreadsheet = setCell(spreadsheet, 2, 0, { value: '3', displayValue: '3' });
    
    expect(evaluateFormula('=COUNT(A1:A3)', spreadsheet)).toBe('3');
  });

  it('should return error for invalid formulas', () => {
    const spreadsheet = createEmptySpreadsheet();
    expect(evaluateFormula('=INVALID()', spreadsheet)).toBe('#ERROR');
    expect(evaluateFormula('=1/0', spreadsheet)).toBe('#ERROR');
  });
});