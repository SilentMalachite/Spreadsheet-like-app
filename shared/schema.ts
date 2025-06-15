import { z } from "zod";

export const cellSchema = z.object({
  id: z.string(),
  row: z.number(),
  col: z.number(),
  value: z.string().default(""),
  formula: z.string().default(""),
  displayValue: z.string().default(""),
  style: z.object({
    backgroundColor: z.string().default("#ffffff"),
    color: z.string().default("#000000"),
    fontWeight: z.string().default("normal"),
    fontStyle: z.string().default("normal"),
    textDecoration: z.string().default("none"),
  }).default({}),
});

export const spreadsheetSchema = z.object({
  id: z.string(),
  name: z.string().default("新しいスプレッドシート"),
  cells: z.array(cellSchema).default([]),
  rowCount: z.number().default(20),
  colCount: z.number().default(10),
  selectedCell: z.object({
    row: z.number(),
    col: z.number(),
  }).nullable().default(null),
});

export type Cell = z.infer<typeof cellSchema>;
export type Spreadsheet = z.infer<typeof spreadsheetSchema>;
export type CellStyle = Cell['style'];
