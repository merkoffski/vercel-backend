figma.showUI(__html__, { width: 320, height: 420 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "apply-data") {
    const selected = figma.currentPage.selection;
    const records = msg.records;

    if (!selected.length) {
      figma.notify("Please select a frame to update.");
      return;
    }

    for (const node of selected) {
      const record = records.find(r => r.fields["id"] === node.name);
      if (!record) continue;

      const children = node.findAll(n => n.type === "TEXT");
      for (const textNode of children) {
        const fieldName = textNode.name;
        const value = record.fields[fieldName];

        if (value && typeof value === "string") {
          await figma.loadFontAsync(textNode.fontName);
          textNode.characters = value;
        }
      }
    }

    figma.notify("✅ Records applied!");
  }
};
