import React from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root";

function createView(Entry: React.ComponentType, rootId = "root"): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  createRoot(rootElement).render(<Entry />);
}

createView(Root);
