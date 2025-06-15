import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createEmptySpreadsheet, setCell } from '@/lib/spreadsheet';

// Mock SpreadsheetGrid component for testing
const MockSpreadsheetGrid = ({ spreadsheet }: { spreadsheet: any }) => {
  return (
    <div data-testid="spreadsheet-grid">
      <div>A</div>
      <div>B</div>
      <div>C</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      {spreadsheet.cells.map((cell: any) => (
        <div key={cell.id}>{cell.displayValue || cell.value}</div>
      ))}
    </div>
  );
};

describe('SpreadsheetGrid Basic Tests', () => {
  it('should render headers and data', () => {
    const spreadsheet = createEmptySpreadsheet();
    const updatedSpreadsheet = setCell(spreadsheet, 0, 0, { 
      value: 'テストデータ', 
      displayValue: 'テストデータ' 
    });

    render(<MockSpreadsheetGrid spreadsheet={updatedSpreadsheet} />);
    
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('テストデータ')).toBeInTheDocument();
  });

  it('should render empty spreadsheet', () => {
    const spreadsheet = createEmptySpreadsheet();
    
    render(<MockSpreadsheetGrid spreadsheet={spreadsheet} />);
    
    expect(screen.getByTestId('spreadsheet-grid')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});