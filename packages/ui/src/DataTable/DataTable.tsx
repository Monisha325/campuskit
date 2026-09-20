import { useMemo, useState, type ReactNode } from "react";
import styles from "./DataTable.module.scss";

export type SortDirection = "ascending" | "descending";

export type DataTableColumn<Row> = {
  cell: (row: Row) => ReactNode;
  header: string;
  id: string;
  sortValue?: (row: Row) => number | string;
};

export type DataTableSort = { columnId: string; direction: SortDirection };

export type DataTableProps<Row> = {
  caption: string;
  columns: DataTableColumn<Row>[];
  emptyMessage?: string;
  getRowId: (row: Row) => string;
  getRowLabel?: (row: Row) => string;
  initialSort?: DataTableSort;
  rows: Row[];
};

export function DataTable<Row>({
  caption,
  columns,
  emptyMessage = "No results found.",
  getRowId,
  getRowLabel = getRowId,
  initialSort,
  rows
}: DataTableProps<Row>) {
  const [sort, setSort] = useState<DataTableSort | undefined>(initialSort);
  const sortedRows = useMemo(() => {
    const sortColumn = columns.find((column) => column.id === sort?.columnId);
    if (!sort || !sortColumn?.sortValue) return rows;
    return [...rows].sort((left, right) => {
      const leftValue = sortColumn.sortValue!(left);
      const rightValue = sortColumn.sortValue!(right);
      const result = typeof leftValue === "number" && typeof rightValue === "number"
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue));
      return sort.direction === "ascending" ? result : -result;
    });
  }, [columns, rows, sort]);

  function toggleSort(column: DataTableColumn<Row>) {
    if (!column.sortValue) return;
    setSort((current) => ({
      columnId: column.id,
      direction: current?.columnId === column.id && current.direction === "ascending" ? "descending" : "ascending"
    }));
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const direction = sort?.columnId === column.id ? sort.direction : "none";
              return (
                <th aria-sort={column.sortValue ? direction : undefined} key={column.id} scope="col">
                  {column.sortValue ? (
                    <button aria-label={`Sort by ${column.header}`} className={styles.sortButton} onClick={() => toggleSort(column)} type="button">
                      {column.header}<span aria-hidden="true">{direction === "ascending" ? " ↑" : direction === "descending" ? " ↓" : " ↕"}</span>
                    </button>
                  ) : column.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr><td className={styles.empty} colSpan={columns.length}>{emptyMessage}</td></tr>
          ) : sortedRows.map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((column) => <td key={column.id}>{column.cell(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.cards}>
        {sortedRows.length === 0 ? (
          <p className={styles.empty} role="status">{emptyMessage}</p>
        ) : sortedRows.map((row) => (
          <article aria-label={getRowLabel(row)} className={styles.card} key={getRowId(row)}>
            <dl className={styles.definitionList}>
              {columns.map((column) => (
                <div className={styles.cardRow} key={column.id}>
                  <dt>{column.header}</dt>
                  <dd>{column.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
