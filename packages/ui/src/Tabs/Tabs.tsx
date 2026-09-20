import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./Tabs.module.scss";

export type Tab = {
  content: ReactNode;
  disabled?: boolean;
  id: string;
  label: ReactNode;
};

export type TabsProps = {
  "aria-label"?: string;
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  tabs: Tab[];
};

export function Tabs({ "aria-label": ariaLabel = "Tabs", activeId, defaultActiveId, onChange, tabs }: TabsProps) {
  const firstEnabledTab = tabs.find((tab) => !tab.disabled);
  const [internalActiveId, setInternalActiveId] = useState(() => defaultActiveId ?? firstEnabledTab?.id);
  const selectedTab = tabs.find((tab) => tab.id === (activeId ?? internalActiveId) && !tab.disabled) ?? firstEnabledTab;
  const baseId = useId();
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  if (!selectedTab) return null;

  function activate(id: string) {
    if (activeId === undefined) setInternalActiveId(id);
    onChange?.(id);
  }

  function moveFocus(currentId: string, key: KeyboardEvent<HTMLButtonElement>["key"]) {
    const enabledTabs = tabs.filter((tab) => !tab.disabled);
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === currentId);
    let nextIndex = currentIndex;
    if (key === "ArrowRight") nextIndex = (currentIndex + 1) % enabledTabs.length;
    if (key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    if (key === "Home") nextIndex = 0;
    if (key === "End") nextIndex = enabledTabs.length - 1;
    const nextTab = enabledTabs[nextIndex];
    activate(nextTab.id);
    tabRefs.current.get(nextTab.id)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, tabId: string) {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      moveFocus(tabId, event.key);
    }
  }

  const selectedTabId = `${baseId}-${selectedTab.id}-tab`;
  const selectedPanelId = `${baseId}-${selectedTab.id}-panel`;

  return (
    <div className={styles.tabs}>
      <div aria-label={ariaLabel} className={styles.tabList} role="tablist">
        {tabs.map((tab) => {
          const isSelected = tab.id === selectedTab.id;
          const tabId = `${baseId}-${tab.id}-tab`;
          const panelId = `${baseId}-${tab.id}-panel`;
          return (
            <button
              aria-controls={panelId}
              aria-selected={isSelected}
              className={[styles.tab, isSelected && styles.selected].filter(Boolean).join(" ")}
              disabled={tab.disabled}
              id={tabId}
              key={tab.id}
              onClick={() => activate(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, tab.id)}
              ref={(node) => {
                if (node) tabRefs.current.set(tab.id, node);
                else tabRefs.current.delete(tab.id);
              }}
              role="tab"
              tabIndex={isSelected ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div aria-labelledby={selectedTabId} className={styles.panel} id={selectedPanelId} role="tabpanel" tabIndex={0}>
        {selectedTab.content}
      </div>
    </div>
  );
}
