# API リファレンス

プロ表計算ソフトの主要なAPI と関数について説明します。

## 目次

- [スプレッドシート操作](#スプレッドシート操作)
- [数式エンジン](#数式エンジン)
- [ファイル操作](#ファイル操作)
- [セル操作](#セル操作)
- [キーボードイベント](#キーボードイベント)
- [型定義](#型定義)

## スプレッドシート操作

### `useSpreadsheet()`

メインのスプレッドシート状態管理フック。

```typescript
const {
  spreadsheet,
  selectedCell,
  editingCell,
  clipboard,
  history,
  updateCell,
  selectCell,
  startEditing,
  finishEditing,
  // その他のメソッド
} = useSpreadsheet();
```

#### 返り値

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `spreadsheet` | `Spreadsheet` | 現在のスプレッドシートデータ |
| `selectedCell` | `{ row: number; col: number } \| null` | 選択中のセル |
| `editingCell` | `{ row: number; col: number } \| null` | 編集中のセル |
| `clipboard` | `Cell \| null` | クリップボードの内容 |
| `history` | `Spreadsheet[]` | 操作履歴 |

#### メソッド

##### `updateCell(row: number, col: number, value: string, isFormula?: boolean)`

セルの値を更新します。

```typescript
// 通常の値を設定
updateCell(0, 0, "Hello World");

// 数式を設定
updateCell(1, 1, "=SUM(A1:A10)", true);
```

##### `selectCell(row: number, col: number)`

指定のセルを選択します。

```typescript
selectCell(2, 3); // D3セルを選択
```

## 数式エンジン

### `evaluateFormula(formula: string, spreadsheet: Spreadsheet): string`

数式を評価して結果を返します。

```typescript
import { evaluateFormula } from '@/lib/formulas';

const result = evaluateFormula('=SUM(A1:A3)', spreadsheet);
console.log(result); // "15"
```

#### 対応関数

| 関数 | 構文 | 説明 | 例 |
|------|------|------|-----|
| `SUM` | `SUM(範囲)` | 範囲内の数値の合計 | `=SUM(A1:A10)` |
| `AVERAGE` | `AVERAGE(範囲)` | 範囲内の数値の平均 | `=AVERAGE(B1:B5)` |
| `MAX` | `MAX(範囲)` | 範囲内の最大値 | `=MAX(C1:C20)` |
| `MIN` | `MIN(範囲)` | 範囲内の最小値 | `=MIN(D1:D15)` |
| `COUNT` | `COUNT(範囲)` | 範囲内の数値セルの個数 | `=COUNT(E1:E10)` |
| `IF` | `IF(条件, 真の値, 偽の値)` | 条件分岐 | `=IF(A1>10, "大", "小")` |

#### セル参照

- **単一セル**: `A1`, `B2`, `Z26`
- **範囲**: `A1:C3`, `B2:D10`
- **相対参照**: 自動的に計算対象セルに対して相対的に解釈

## ファイル操作

### `exportToJSON(spreadsheet: Spreadsheet): string`

スプレッドシートをJSON形式で出力します。

```typescript
import { exportToJSON } from '@/lib/spreadsheet';

const jsonData = exportToJSON(spreadsheet);
// ファイルに保存またはダウンロード
```

### `importFromJSON(json: string): Spreadsheet`

JSON形式からスプレッドシートを復元します。

```typescript
import { importFromJSON } from '@/lib/spreadsheet';

const spreadsheet = importFromJSON(jsonData);
```

### `exportToCSV(spreadsheet: Spreadsheet): string`

スプレッドシートをCSV形式で出力します。

```typescript
import { exportToCSV } from '@/lib/spreadsheet';

const csvData = exportToCSV(spreadsheet);
```

## セル操作

### `getCell(spreadsheet: Spreadsheet, row: number, col: number): Cell | undefined`

指定位置のセルを取得します。

```typescript
import { getCell } from '@/lib/spreadsheet';

const cell = getCell(spreadsheet, 0, 0); // A1セル
if (cell) {
  console.log(cell.value, cell.displayValue);
}
```

### `setCell(spreadsheet: Spreadsheet, row: number, col: number, updates: Partial<Cell>): Spreadsheet`

セルを更新した新しいスプレッドシートを返します。

```typescript
import { setCell } from '@/lib/spreadsheet';

const newSpreadsheet = setCell(spreadsheet, 0, 0, {
  value: "100",
  style: { fontWeight: 'bold' }
});
```

### `getCellReference(row: number, col: number): string`

行・列番号からExcel形式の参照を生成します。

```typescript
import { getCellReference } from '@/lib/spreadsheet';

const ref = getCellReference(0, 0); // "A1"
const ref2 = getCellReference(2, 25); // "Z3"
```

### `parseCellReference(ref: string): { row: number; col: number } | null`

Excel形式の参照を行・列番号に変換します。

```typescript
import { parseCellReference } from '@/lib/spreadsheet';

const coords = parseCellReference("B5"); // { row: 4, col: 1 }
```

## キーボードイベント

### キーボードショートカット

アプリケーションで使用可能なキーボードショートカット：

| キー | 動作 |
|------|------|
| `↑↓←→` | セル移動 |
| `Enter` | 編集開始（選択セル） |
| `F2` | 編集開始（選択セル） |
| `Escape` | 編集キャンセル |
| `Delete` | セル内容削除 |
| `Backspace` | セル内容削除 |
| `Ctrl+C` | コピー |
| `Ctrl+V` | ペースト |
| `Ctrl+Z` | 元に戻す |
| `Ctrl+Y` | やり直し |
| `文字・数字` | 自動編集開始 |

### カスタムキーハンドラー

独自のキーボードハンドラーを追加する場合：

```typescript
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  // カスタムキー処理
  if (event.key === 'Tab') {
    event.preventDefault();
    // タブ処理の実装
  }
}, []);

useEffect(() => {
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [handleKeyDown]);
```

## 型定義

### `Cell`

```typescript
interface Cell {
  value: string;
  formula?: string;
  displayValue?: string;
  style?: CellStyle;
}
```

### `CellStyle`

```typescript
interface CellStyle {
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  backgroundColor?: string;
  color?: string;
}
```

### `Spreadsheet`

```typescript
interface Spreadsheet {
  cells: Cell[][];
  rows: number;
  cols: number;
  selectedCell?: { row: number; col: number };
  name?: string;
}
```

## エラーハンドリング

### 数式エラー

数式エンジンは以下のエラーを返す場合があります：

- `#ERROR!` - 一般的なエラー
- `#VALUE!` - 不正な値
- `#REF!` - 無効な参照
- `#DIV/0!` - ゼロ除算

### エラーの処理例

```typescript
try {
  const result = evaluateFormula(formula, spreadsheet);
  if (result.startsWith('#')) {
    // エラー処理
    console.error('数式エラー:', result);
  }
} catch (error) {
  console.error('数式評価エラー:', error);
}
```

## パフォーマンス最適化

### 大量データの処理

```typescript
// 大量のセル更新時は一括処理を推奨
const updateMultipleCells = useCallback((updates: Array<{row: number, col: number, value: string}>) => {
  let newSpreadsheet = spreadsheet;
  updates.forEach(({row, col, value}) => {
    newSpreadsheet = setCell(newSpreadsheet, row, col, {value});
  });
  setSpreadsheet(newSpreadsheet);
}, [spreadsheet]);
```

### メモ化の活用

```typescript
const memoizedFormula = useMemo(() => {
  return evaluateFormula(formula, spreadsheet);
}, [formula, spreadsheet]);
```

## デバッグ

### ログ出力

開発時のデバッグに役立つログ関数：

```typescript
// 数式評価のデバッグ
const debugFormula = (formula: string, spreadsheet: Spreadsheet) => {
  console.log('数式:', formula);
  console.log('結果:', evaluateFormula(formula, spreadsheet));
  console.log('スプレッドシート状態:', spreadsheet);
};
```

### テスト用ヘルパー

```typescript
// テスト用のスプレッドシート作成
export const createTestSpreadsheet = (data: string[][]): Spreadsheet => {
  const spreadsheet = createEmptySpreadsheet();
  data.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      setCell(spreadsheet, rowIndex, colIndex, { value });
    });
  });
  return spreadsheet;
};
```