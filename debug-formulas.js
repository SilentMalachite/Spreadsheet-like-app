// 数式エンジンのデバッグ
const { evaluateFormula } = require('./client/src/lib/formulas.ts');
const { createEmptySpreadsheet, setCell } = require('./client/src/lib/spreadsheet.ts');

console.log('数式エンジンのデバッグを開始...');

let spreadsheet = createEmptySpreadsheet();
spreadsheet = setCell(spreadsheet, 0, 0, { value: '1', displayValue: '1' });
spreadsheet = setCell(spreadsheet, 1, 0, { value: '2', displayValue: '2' });
spreadsheet = setCell(spreadsheet, 2, 0, { value: '3', displayValue: '3' });

console.log('スプレッドシートの状態:', JSON.stringify(spreadsheet.cells, null, 2));

const result = evaluateFormula('=SUM(A1:A3)', spreadsheet);
console.log('SUM(A1:A3)の結果:', result);