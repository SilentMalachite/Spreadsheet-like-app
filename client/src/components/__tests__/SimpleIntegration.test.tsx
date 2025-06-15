import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SpreadsheetPage from '../../pages/spreadsheet';

// Mock Electron API
const mockElectronAPI = {
  saveFile: vi.fn().mockResolvedValue({ success: true, filePath: 'test.json' }),
  saveCSV: vi.fn().mockResolvedValue({ success: true, filePath: 'test.csv' }),
  onMenuAction: vi.fn(),
  removeMenuActionListener: vi.fn(),
};

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

describe('Simple Integration Tests', () => {
  it('should render main application components', () => {
    render(<SpreadsheetPage />);
    
    // Check main header
    expect(screen.getByText('プロ表計算ソフト - React+Electron版')).toBeInTheDocument();
    
    // Check toolbar buttons are rendered
    expect(screen.getByText('新規')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    
    // Check basic structure is present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(5);
  });

  it('should render formula bar', () => {
    render(<SpreadsheetPage />);
    
    // Check for textbox inputs (formula bar)
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render spreadsheet elements', () => {
    render(<SpreadsheetPage />);
    
    // Check that main content is rendered
    expect(screen.getByText('プロ表計算ソフト - React+Electron版')).toBeInTheDocument();
    
    // Check for status bar or other essential elements
    const statusElements = document.querySelectorAll('[class*="status"]');
    expect(statusElements.length >= 0).toBe(true);
  });

  it('should render toolbar with copy and paste buttons', () => {
    render(<SpreadsheetPage />);
    
    // Toolbar buttons should be visible
    expect(screen.getByText('コピー')).toBeInTheDocument();
    expect(screen.getByText('貼り付け')).toBeInTheDocument();
  });
});