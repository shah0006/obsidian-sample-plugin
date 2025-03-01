import { ItemView, WorkspaceLeaf } from "obsidian";
import { TagHierarchyModel, TagNode } from "../models/TagModel";
import TagHierarchyPlugin from "../main";

const TAG_HIERARCHY_VIEW_TYPE = 'tag-hierarchy-view';

export class TagHierarchyView extends ItemView {
    plugin: TagHierarchyPlugin;
    private model: TagHierarchyModel;

    constructor(leaf: WorkspaceLeaf, plugin: TagHierarchyPlugin) {
        super(leaf);
        this.plugin = plugin;
        this.model = new TagHierarchyModel();
    }

    getViewType(): string {
        return TAG_HIERARCHY_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Tag Hierarchy';
    }

    getIcon(): string {
        return 'hashtag';
    }

    async onOpen(): Promise<void> {
        this.renderView();
    }

    async onClose(): Promise<void> {
        // Nothing to clean up.
    }

    renderView(): void {
        const container = this.containerEl.children[1];
        container.empty();

        container.createEl('h3', { text: 'Tag Hierarchy' });

        const treeContainer = container.createEl('div', { cls: 'tag-hierarchy-tree' });
        this.renderTagTree(treeContainer, this.model.getRootTags(), 0);
    }

    private renderTagTree(container: HTMLElement, tagMap: Map<string, TagNode>, level: number): void {
        if (tagMap.size === 0) {
            return;
        }

        const ul = container.createEl('ul', {
            cls: `tag-hierarchy-level-${level} ${this.plugin.settings.expandedByDefault ? 'expanded' : ''}`
        });

        const sortedTagMap = new Map([...tagMap.entries()].sort());

        for (const tag of sortedTagMap.values()) {
            const li = ul.createEl('li');
            const tagDiv = li.createEl('div', { cls: 'tag-hierarchy-item' });

            if (tag.children.size > 0) {
                const toggleBtn = tagDiv.createEl('span', {
                    cls: `tag-hierarchy-toggle ${this.plugin.settings.expandedByDefault ? 'expanded' : ''}`,
                    text: this.plugin.settings.expandedByDefault ? '▼' : '►'
                });

                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isExpanded = toggleBtn.classList.contains('expanded');

                    if (isExpanded) {
                        toggleBtn.classList.remove('expanded');
                        toggleBtn.textContent = '►';
                        li.querySelector('ul')?.classList.remove('expanded');
                    } else {
                        toggleBtn.classList.add('expanded');
                        toggleBtn.textContent = '▼';
                        li.querySelector('ul')?.classList.add('expanded');
                    }
                });
            }

            tagDiv.createEl('span', {
                cls: 'tag-hierarchy-name',
                text: tag.name
            });

            tagDiv.addEventListener('click', () => {
                this.app.workspace.openLinkText(`#${tag.path}`, '', true);
            });

            if (this.plugin.settings.showTagCount) {
                tagDiv.createEl('span', {
                    cls: 'tag-hierarchy-count',
                    text: `(${tag.count})`
                });
            }

            this.renderTagTree(li, tag.children, level + 1);
        }
    }

    setModel(model: TagHierarchyModel): void {
        this.model = model;
    }
}
