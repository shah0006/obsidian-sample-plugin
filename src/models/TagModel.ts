export interface TagNode {
    name: string;
    path: string;
    count: number;
    children: Map<string, TagNode>;
    parent: TagNode | null;
    lastUpdated?: number; // For incremental updates
}

export class TagHierarchyModel {
    private rootTags: Map<string, TagNode> = new Map();
    private tagCache: Map<string, TagNode> = new Map();

    // Core methods
    buildHierarchy(allTags: Record<string, number>): void {
        this.rootTags.clear();
        this.tagCache.clear();

        for (const tagPath in allTags) {
            this.addTagToHierarchy(tagPath, allTags[tagPath] as number);
        }
    }

    getTagByPath(path: string): TagNode | undefined {
        return this.tagCache.get(path);
    }

    getAllTags(): TagNode[] {
        const tags: TagNode[] = [];
        for (const tag of this.tagCache.values()) {
            tags.push(tag);
        }
        return tags;
    }

    getRootTags(): Map<string, TagNode> {
        return this.rootTags;
    }

    // Helper methods
    private createTagNode(name: string, path: string): TagNode {
        return {
            name: name,
            path: path,
            count: 0,
            children: new Map<string, TagNode>(),
            parent: null
        };
    }

    addTagToHierarchy(tagPath: string, count: number): void {
        const tagParts = tagPath.split("/");
        let currentLevel = this.rootTags;
        let currentPath = "";
        let parent: TagNode | null = null;

        for (let i = 0; i < tagParts.length; i++) {
            const part = tagParts[i];
            currentPath = currentPath ? `${currentPath}/${part}` : part;

            let existingTag = currentLevel.get(part);

            if (!existingTag) {
                existingTag = this.createTagNode(part, currentPath);
                currentLevel.set(part, existingTag);
                this.tagCache.set(currentPath, existingTag);
                if (parent) {
                    existingTag.parent = parent;
                }
            }

            existingTag.count += count;
            parent = existingTag;
            currentLevel = existingTag.children;
        }
    }
}
