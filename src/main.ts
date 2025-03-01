import { Notice, Plugin } from 'obsidian';
import { TagHierarchyView } from './views/TagHierarchyView';
import { TagHierarchySettingTab, TagHierarchySettings, DEFAULT_SETTINGS } from './settings/SettingsTab';
import { TagService } from './services/TagService';
import { FileService } from './services/FileService';
import { TagHierarchyModel } from './models/TagModel';

const TAG_HIERARCHY_VIEW_TYPE = 'tag-hierarchy-view';

export default class TagHierarchyPlugin extends Plugin {
    settings: TagHierarchySettings;
    view: TagHierarchyView;
    tagService: TagService;
    fileService: FileService;
    model: TagHierarchyModel;


    async onload() {
        console.log('loading plugin');
        await this.loadSettings();
        this.model = new TagHierarchyModel();
        this.tagService = new TagService(this.app);
        this.fileService = new FileService(this.app, this.settings);

        this.registerView(
            TAG_HIERARCHY_VIEW_TYPE,
            (leaf) => (this.view = new TagHierarchyView(leaf, this))
        );

        this.addRibbonIcon('hashtag', 'Tag Hierarchy', async () => {
            await this.activateView();
        });


        this.addCommand({
            id: 'open-tag-hierarchy-view',
            name: 'Open Tag Hierarchy View',
            callback: async () => {
                await this.activateView();
            }
        });


        this.addCommand({
            id: 'refresh-tag-hierarchy',
            name: 'Refresh Tag Hierarchy',
            callback: async () => {
                if (this.view) {
                    await this.tagService.refreshTagData(true);
                    this.view.setModel(this.model);
                    this.view.renderView();
                    new Notice('Tag hierarchy refreshed');
                }
            }
        });

        this.addCommand({
            id: 'generate-tag-hierarchy-markdown',
            name: 'Generate Tag Hierarchy Markdown File',
            callback: async () => {
                try {
                    await this.tagService.refreshTagData(true);
                    this.fileService.setModel(this.model);
                    await this.fileService.generateMarkdownFile();
                    new Notice(`Tag hierarchy markdown file generated at ${this.settings.markdownFilePath}`);
                } catch (error) {
                    console.error("Error generating markdown file:", error);
                    new Notice("Error generating tag hierarchy markdown file");
                }
            }
        });


        this.addSettingTab(new TagHierarchySettingTab(this.app, this));


        if (this.settings.displayInRightSidebar) {
            this.app.workspace.onLayoutReady(this.activateView.bind(this));
        }


        if (this.settings.updateOnStartup && this.settings.generateMarkdownFile) {
            this.app.workspace.onLayoutReady(async () => {
                try {
                    await this.tagService.refreshTagData(true);
                    this.fileService.setModel(this.model);
                    await this.fileService.generateMarkdownFile();
                    console.log(`Tag hierarchy markdown file generated at ${this.settings.markdownFilePath} on startup`);
                } catch (error) {
                    console.error("Error generating markdown file on startup:", error);
                }
            });
        }
    }


    async onunload() {
        this.app.workspace.detachLeavesOfType(TAG_HIERARCHY_VIEW_TYPE);
    }



    async activateView() {
        const existing = this.app.workspace.getLeavesOfType(TAG_HIERARCHY_VIEW_TYPE);
        if (existing.length) {
            this.app.workspace.revealLeaf(existing[0]);
            return;
        }

        const leaf = this.app.workspace.getRightLeaf(false);
        if (leaf) {
            await leaf.setViewState({
                type: TAG_HIERARCHY_VIEW_TYPE,
                active: true,
            });
            this.app.workspace.revealLeaf(leaf);
        }
    }



    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);

        if (this.view) {
            this.view.setModel(this.model);
            this.view.renderView();
        }
    }
}
