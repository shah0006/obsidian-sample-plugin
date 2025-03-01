import { App, TFile } from "obsidian";
import { TagHierarchyModel, TagNode } from "../models/TagModel";
import { handleError } from "../utils/ErrorHandler";

export class TagService {
    private app: App;
    private model: TagHierarchyModel;
    private lastRefreshTime = 0;

    constructor(app: App) {
        this.app = app;
        this.model = new TagHierarchyModel();
    }

    async refreshTagData(forceFullRefresh = false): Promise<void> {
        try {
            const currentTime = Date.now();

            const allTags = this.app.metadataCache.getTags();

            if (forceFullRefresh) {
                this.model.buildHierarchy(allTags);
                this.lastRefreshTime = currentTime;
                return;
            }

            if (this.lastRefreshTime === 0) {
                this.model.buildHierarchy(allTags);
            } else {
                const modifiedFiles = this.getModifiedFilesSince(this.lastRefreshTime);

                if (modifiedFiles.length > 20) {
                    this.model.buildHierarchy(allTags);
                } else {
                    this.updateTagsForFiles(modifiedFiles, allTags);
                }
            }

            this.lastRefreshTime = currentTime;
        } catch (error) {
            handleError(error, "Error refreshing tag data.");
        }
    }

    private getModifiedFilesSince(timestamp: number): TFile[] {
        return this.app.vault.getMarkdownFiles().filter(file => file.stat.mtime > timestamp);
    }

    private updateTagsForFiles(files: TFile[], allTags: Record<string, number>): void {
        const updatedTags: Record<string, number> = {};

        for (const file of files) {
            const fileCache = this.app.metadataCache.getFileCache(file);
            if (fileCache && fileCache.tags) {
                for (const tag of fileCache.tags) {
                    const tagPath = tag.tag.substring(1);
                    updatedTags[tagPath] = (updatedTags[tagPath] || 0) + 1;
                }
            }
        }

        for (const tagPath in updatedTags) {
            this.model.addTagToHierarchy(tagPath, updatedTags[tagPath]);
        }
    }

    getTags(): Map<string, TagNode> {
        return this.model.getRootTags();
    }
}
